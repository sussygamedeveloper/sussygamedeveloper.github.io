// CFontBank object
// ----------------------------------------------------------
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

function CFontBank(a) {
    this.app = a;
    this.file = null;
    this.fonts = null;
    this.offsetsToFonts = null;
    this.nFonts = 0;
    this.handleToIndex = null;
    this.maxHandlesReel = 0;
    this.maxHandlesTotal = 0;
    this.useCount = null;
    this.nullFont = new CFont();
    this.nullFont.createDefaultFont();
}

CFontBank.prototype = {
    preLoad: function (file) {
        var number = file.readAInt();
        var n;

        this.maxHandlesReel = 0;
        var debut = file.getFilePointer();
        var temp = new CFont();
        for (n = 0; n < number; n++) {
            temp.readHandle(file);
            this.maxHandlesReel = Math.max(this.maxHandlesReel, temp.handle + 1);
        }
        file.seek(debut);
        this.offsetsToFonts = new Array(this.maxHandlesReel);
        for (n = 0; n < number; n++) {
            debut = file.getFilePointer();
            temp.readHandle(file);
            this.offsetsToFonts[temp.handle] = debut;
        }
        this.useCount = new Array(this.maxHandlesReel);
        var n;
        for (n = 0; n < this.maxHandlesReel; n++) {
            this.useCount[n] = 0;
        }
        this.handleToIndex = null;
        this.maxHandlesTotal = this.maxHandlesReel;
        this.nFonts = 0;
        this.fonts = null;
    },

    loadFrame: function (file) {
        //this gets called from CRunFrame.loadFullFrame() so this will get called at teh start of EVERY frame
        var n;
        this.nFonts = 0;
        for (n = 0; n < this.maxHandlesReel; n++) {
            if (this.useCount[n] != 0) {
                this.nFonts++;
            }
        }

        var newFonts = new Array(this.nFonts);
        var count = 0;
        var h;
        for (h = 0; h < this.maxHandlesReel; h++) {
            if (this.useCount[h] != 0) {
                if (this.fonts != null && this.handleToIndex[h] != -1 && this.fonts[this.handleToIndex[h]] != null) {
                    newFonts[count] = this.fonts[this.handleToIndex[h]];
                    newFonts[count].useCount = this.useCount[h];
                }
                else {
                    newFonts[count] = new CFont();
                    file.seek(this.offsetsToFonts[h]);
                    newFonts[count].load(file);
                    newFonts[count].useCount = this.useCount[h];
                }
                count++;
            }
        }
        this.fonts = newFonts;

        this.handleToIndex = new Array(this.maxHandlesReel);
        for (n = 0; n < this.maxHandlesReel; n++) {
            this.handleToIndex[n] = -1;
        }
        for (n = 0; n < this.nFonts; n++) {
            this.handleToIndex[this.fonts[n].handle] = n;
        }
        this.maxHandlesTotal = this.maxHandlesReel;
    },

    getFontFromHandle: function (handle) {
        if (handle == -1) {
            return this.nullFont;
        }
        if (handle >= 0 && handle < this.maxHandlesTotal) {
            if (this.handleToIndex[handle] != -1) {
                return this.fonts[this.handleToIndex[handle]];
            }
        }
        return null;
    },

    getFontFromIndex: function (index) {
        if (index >= 0 && index < this.nFonts) {
            return this.fonts[index];
        }
        return null;
    },

    getFontInfoFromHandle: function (handle) {
        var font = this.getFontFromHandle(handle);
        return font.getFontInfo();
    },

    resetToLoad: function () {
        if ((this.app.dwOption & CRunApp.AH2OPT_LOADDATAATSTART) == 0 && (this.app.dwOptions & CRunApp.AH2OPT_KEEPRESOURCESBETWEENFRAMES) == 0) {
            var n;
            for (n = 0; n < this.maxHandlesReel; n++) {
                this.useCount[n] = 0;
            }
        }
    },

    setAllToLoad: function () {
        var n;
        for (n = 0; n < this.maxHandlesReel; n++) {
            if (this.offsetsToFonts[n]) {
                this.useCount[n] = 1;
            }
        }
    },

    setToLoad: function (handle) {
        if (handle == -1) {
            if (this.nullFont == null) {
                this.nullFont = new CFont();
                this.nullFont.createDefaultFont();
            }
            return;
        }
        this.useCount[handle]++;
    },

    enumerate: function (num) {
        this.setToLoad(num);
        return -1;
    },

    addFont: function (info) {
        var h;

        // Cherche une fonte identique
        var n;
        for (n = 0; n < this.nFonts; n++) {
            if (this.fonts[n] == null) {
                continue;
            }
            if (this.fonts[n].lfHeight != info.lfHeight) {
                continue;
            }
            if (this.fonts[n].lfWeight != info.lfWeight) {
                continue;
            }
            if (this.fonts[n].lfItalic != info.lfItalic) {
                continue;
            }
            if (this.fonts[n].lfFaceName != info.lfFaceName) {
                continue;
            }
            break;
        }
        if (n < this.nFonts) {
            return this.fonts[n].handle;
        }

        var hFound = -1;
        for (h = this.maxHandlesReel; h < this.maxHandlesTotal; h++) {
            if (this.handleToIndex[h] == -1) {
                this.hFound = h;
                break;
            }
        }

        if (hFound == -1) {
            var newHToI = new Array(this.maxHandlesTotal + 10);
            for (h = 0; h < this.maxHandlesTotal; h++) {
                newHToI[h] = this.handleToIndex[h];
            }
            for (; h < this.maxHandlesTotal + 10; h++) {
                newHToI[h] = -1;
            }
            hFound = this.maxHandlesTotal;
            this.maxHandlesTotal += 10;
            this.handleToIndex = newHToI;
        }

        var f;
        var fFound = -1;
        for (f = 0; f < this.nFonts; f++) {
            if (this.fonts[f] == null) {
                fFound = f;
                break;
            }
        }

        if (fFound == -1) {
            fFound = this.nFonts;
            this.fonts.push(null);
        }

        this.handleToIndex[hFound] = fFound;
        this.fonts[fFound] = new CFont();
        this.fonts[fFound].handle = hFound;
        this.fonts[fFound].lfHeight = info.lfHeight;
        this.fonts[fFound].lfWeight = info.lfWeight;
        this.fonts[fFound].lfItalic = info.lfItalic;
        this.fonts[fFound].lfFaceName = info.lfFaceName;

        return hFound;
    }
}
