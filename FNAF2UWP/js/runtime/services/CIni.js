// CIni object
// -----------------------------------------------------------------
/* Copyright (c) 1996-2016 Clickteam
 *
 * This source code is part of the HTML5 or Windows10 exporter for Clickteam Multimedia Fusion 2.
 * 
 * Permission is hereby granted to any person obtaining a legal copy 
 * of Clickteam Multimedia Fusion 2 to use or modify this source code for 
 * debugging, optimizing, or customizing applications created with 
 * Clickteam Multimedia Fusion 2. 
 * Any other use of this source code is prohibited.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

CIni.separator = "{@24}";
CIni.INIFLAG_UTF8 = 0x0001;
CIni.INIFLAG_UTF16 = 0x0002;

function CIni(a, flags) {
    this.app = a;
    this.flags = flags;
    this.strings = new CArrayList();
    this.currentFileName = null;
    this.modified = false;
}

CIni.prototype = {
    saveIni: function () {
        if (this.modified && this.strings != null && this.currentFileName != null) {
            var value = "";
            var n;
            for (n = 0; n < this.strings.size(); n++) {
                value += this.strings.get(n) + CIni.separator;
            }
            this.app.saveFile(this.currentFileName, value);
        }
        this.modified = false;
    },

    loadIni: function (fileName) {
        var reload = true;
        if (this.currentFileName != null) {
            if (CServices.compareStringsIgnoreCase(fileName, this.currentFileName)) {
                reload = false;
            }
        }

        if (reload) {
            this.saveIni();

            this.currentFileName = fileName;
            this.strings = new CArrayList();

            var cFile = this.app.openFile(this.currentFileName, false);
            if (cFile != null) {
                if (typeof this.flags != 'undefined') {
                    if (this.flags & CIni.INIFLAG_UTF8) {
                        this.unicode = false;
                    }
                    if (this.flags & CIni.INIFLAG_UTF16) {
                        this.unicode = true;
                    }
                }

                while (cFile.isEOF() == false) {
                    var currentLine = cFile.readAStringEOL();
                    if (currentLine.substring(0, 1) == "<") {       // what is this for?
                        this.strings.clear();
                        this.modified = true;
                        break;
                    }
                    if (currentLine == null) {
                        break;
                    }
                    this.strings.add(currentLine);
                }

                // If the file was already saved in local storage, the separator is not EOL anymore
                if (this.strings.size() == 1) {
                    var s = this.strings.get(0);
                    var end = s.indexOf(CIni.separator, 0);
                    if (end >= 0) {
                        var begin = 0;
                        while (end >= 0) {
                            this.strings.add(s.substring(begin, end));
                            begin = end + CIni.separator.length;
                            end = s.indexOf(CIni.separator, begin);
                        }
                        this.strings.removeIndex(0);
                    }
                }
            }
        }
    },

    findSection: function (sectionName) {
        var l;
        var s, s2;
        for (l = 0; l < this.strings.size(); l++) {
            s = this.strings.get(l);
            if (s.charAt(0) == "[") {
                var last = s.lastIndexOf("]");
                if (last >= 1) {
                    s2 = s.substring(1, last);
                    if (CServices.compareStringsIgnoreCase(sectionName, s2)) {
                        return l;
                    }
                }
            }
        }
        return -1;
    },

    findKey: function (l, keyName) {
        var s, s2;
        var last;
        for (; l < this.strings.size(); l++) {
            s = this.strings.get(l);
            if (s.charAt(0) == "[") {
                return -1;
            }
            last = s.indexOf('=');
            if (last >= 0) {
                var start = 0;
                while (start < last && s.charCodeAt(start) == 32) {
                    start++;
                }
                while (last > start && s.charCodeAt(last - 1) == 32) {
                    last--;
                }
                if (last > start) {
                    s2 = s.substring(0, last);
                    if (CServices.compareStringsIgnoreCase(s2, keyName)) {
                        return l;
                    }
                }
            }
        }
        return -1;
    },

    getPrivateProfileString: function (sectionName, keyName, defaultString, fileName) {
        this.loadIni(fileName);

        var l = this.findSection(sectionName);
        if (l >= 0) {
            l = this.findKey(l + 1, keyName);
            if (l >= 0) {
                var s = this.strings.get(l);
                var last = s.indexOf("=");
                return s.substring(last + 1);
            }
        }
        return defaultString;
    },

    writePrivateProfileString: function (sectionName, keyName, name, fileName) {
        this.loadIni(fileName);

        var s;
        var section = this.findSection(sectionName);
        if (section < 0) {
            s = "[" + sectionName + "]";
            this.strings.add(s);
            s = keyName + "=" + name;
            this.strings.add(s);
            this.modified = true;
            //            this.saveIni();
            return;
        }

        var key = this.findKey(section + 1, keyName);
        if (key >= 0) {
            s = keyName + "=" + name;
            this.strings.set(key, s);
            this.modified = true;
            //            this.saveIni();
            return;
        }

        for (key = section + 1; key < this.strings.size(); key++) {
            s = this.strings.get(key);
            if (s.charAt(0) == '[') {
                s = keyName + "=" + name;
                this.strings.insert(key, s);
                this.modified = true;
                //                this.saveIni();
                return;
            }
        }
        s = keyName + "=" + name;
        this.strings.add(s);
        this.modified = true;
        //        this.saveIni();
    },

    deleteItem: function (group, item, iniName) {
        this.loadIni(iniName);

        var s = this.findSection(group);
        if (s >= 0) {
            var k = this.findKey(s + 1, item);
            if (k >= 0) {
                this.strings.removeIndex(k);
            }
            this.modified = true;
            this.saveIni();     // why?
        }
    },

    deleteGroup: function (group, iniName) {
        this.loadIni(iniName);

        var s = this.findSection(group);
        if (s >= 0) {
            this.strings.removeIndex(s);
            while (true) {
                s++;
                if (s >= this.strings.size()) {
                    break;
                }
                if (this.strings.get(s).charAt(0) == '[') {
                    break;
                }
                this.strings.removeIndex(s);
            }
            this.modified = true;
            this.saveIni();     // why?
        }
    }
}
