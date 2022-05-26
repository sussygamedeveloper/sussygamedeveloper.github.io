// CFile object
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

// For IE9
var bUseAjax = false;
var bUseBlob = false;
var bUseBinaryString = false;

var req = window['XMLHttpRequest'] ? new XMLHttpRequest() : null;

if (!req || !req.overrideMimeType) {
    bUseAjax = true;
    var script = document.createElement('script');
    script.type = "text/vbscript";
    script.innerHTML = 'Function BinFileReaderImpl_IE_VBAjaxLoader(fileName)\n\
                Dim xhr\n\
                Set xhr = CreateObject("Microsoft.XMLHTTP")\n\
                xhr.Open "GET", fileName, False\n\
                xhr.setRequestHeader "Accept-Charset", "x-user-defined"\n\
                xhr.send\n\
                Dim byteArray()\n\
                if xhr.Status = 200 Then\n\
                    Dim byteString\n\
                    Dim i\n\
                    byteString=xhr.responseBody\n\
                    ReDim byteArray(LenB(byteString))\n\
                    For i = 1 To LenB(byteString)\n\
                        byteArray(i-1) = AscB(MidB(byteString, i, 1))\n\
                    Next\n\
                End If\n\
                BinFileReaderImpl_IE_VBAjaxLoader=byteArray\n\
            End Function';

    document.head.appendChild(script);
} else {
    try {
        bUseBlob = typeof new XMLHttpRequest()["responseType"] === 'string';
        if (navigator.userAgent.toLowerCase().indexOf('safari') >= 0) {
            bUseBlob = false;
        }
    }
    catch (e) {
    }
}

if (bUseBlob) {
    var reader = new FileReader();
    try {
        if (reader["readAsBinaryString"]) {
            bUseBinaryString = true;
        }
    }
    catch (e) {
    }
    reader = null;
}
req = null;

function CFile() {
    this.bytes = "";
    this.pointer = 0;
    this.offset = 0;
    this.end = 0;
    this.unicode = false;
    this.callback = null;
}

CFile.prototype = {
    //internal
    _readUnsignedByte: function () {
        return this.bytes.charCodeAt(this.pointer++) & 0xFF;
    },

    //api
    getChecksum: function () {
        var n;
        var count = 0;
        for (n = 0; n < this.end; n++) {
            count += (this.bytes.charCodeAt(n) & 0xFF) ^ 0xAA;
        }
        return count;
    },

    openFileAsync: function (fileName, callback, size) {
        this.callback = callback;

        if (!bUseAjax) {
            var that = this;
            var request = new XMLHttpRequest();
            request.open('GET', fileName, true);

            if (bUseBlob) {
                request.responseType = "blob";
                request.addEventListener('load', function () {
                    if (request.readyState == 4 && request.status == 200) {
                        var reader = new FileReader();
                        reader.addEventListener('loadend', function () {
                            if (bUseBinaryString) {
                                that.bytes += reader.result;
                            } else {
                                var array = new Uint8Array(reader.result);
                                var n;
                                for (n = 0; n < array.length; n++) {
                                    that.bytes += String.fromCharCode(array[n]);
                                }
                            }
                            that.end = that.bytes.length;

                            if (callback != null) {
                                callback(true, that);
                            }
                        });

                        //start file read
                        if (bUseBinaryString) {
                            reader.readAsBinaryString(request.response);
                        } else {
                            reader.readAsArrayBuffer(request.response);
                        }
                    }
                });

                request.addEventListener("error", function (event) {
                    if (callback != null) {
                        callback(false, that);
                    }
                });

                request.send(null);
            } else {
                request.overrideMimeType('text/plain; charset=x-user-defined');

                request.addEventListener("load", function (event) {
                    if (request.readyState == 4 && request.status == 200) {
                        that.bytes += request.responseText;
                        that.end = that.bytes.length;

                        if (callback != null) {
                            callback(true, that);
                        }
                    } else {
                        if (callback != null) {
                            callback(false, that);
                        }
                    }
                });

                request.addEventListener("error", function (event) {
                    if (callback != null) {
                        callback(false, that);
                    }
                });

                request.send(null);
            }
        } else {
            try {
                var array = BinFileReaderImpl_IE_VBAjaxLoader(fileName).toArray()
                var n;
                var length = array.length;

                if (length > size) {
                    length = size;
                }

                for (n = 0; n < length; n++) {
                    this.bytes += String.fromCharCode(array[n]);
                }

                this.end = this.bytes.length;

                if (callback != null) {
                    callback(true, that);
                }
            }
            catch (error) {
            }
        }
    },

    getBytes: function () {
        return this.bytes;
    },

    setBinary: function (binary) {
        this.bytes = binary;
        this.end = binary.length;
    },

    setText: function(string, unicode) {
        var n, c, len = string.length;
        this.bytes = "";
        this.pointer = 0;
        this.offset = 0;
        this.end = 0;
        this.callback = null;
        this.unicode = unicode;
        for (n = 0; n < len; n++) {
            c = string.charCodeAt(n);
            this.bytes += String.fromCharCode(c & 0xFF);
            this.end++;
            if (this.unicode) {
                this.bytes += String.fromCharCode((c >> 8) & 0xFF);
                this.end++;
            }
        }
    },

    createFromFile: function (offset, length) {
        var file = new CFile();
        file.bytes = this.bytes;
        file.offset = offset;
        file.pointer = offset;
        file.end = this.end;
        if ( length )
            file.end = offset + length;
        file.unicode = this.unicode;
        return file;
    },

    readDataURI: function (mime) {
        //convert the embeded file to a data URI
        this.setUnicode(false);

        //read remaining bytes into buffer
        var length = this.getLength();
        var buffer = new Uint8Array(length);
        for (var index = 0; index < length; index++) {
            buffer[index] = this.readAByte();
        }

        //convert to base64
        var encoded = btoa(String.fromCharCode.apply(null, buffer))

        //finish teh return
        return "data:" + mime + ";base64," + encoded;
    },

    getLength: function () {
        return this.end - this.offset;
    },

    setUnicode: function (unicode) {
        this.unicode = unicode;
    },

    detectUnicode: function () {
        var b1 = this._readUnsignedByte();
        var b2 = this._readUnsignedByte();
        var b3 = this._readUnsignedByte();
        if (b1 == 0xFF && b2 == 0xFE) {
            this.unicode = true;               // UTF16
            this.pointer--;
        }
        else if (b1 == 0xEF && b2 == 0xBB && b3 == 0xBF) {
            //decode utf-8 encoded string
            var string = decodeURIComponent(escape(this.bytes.substring(this.pointer, this.end)));

            // setText to transform unicode string into CFile unicode format
            this.setText(string, true);
        }
        else {
            this.unicode = false;              // ASCII
            this.pointer -= 3;
        }
    },

    skipBytes: function (skip) {
        this.pointer += skip;
    },

    adjustTo8: function () {
        if ((this.pointer & 0x07) != 0) {
            this.pointer += 8 - (this.pointer & 0x07);
        }
    },

    isEOF: function () {
        return this.pointer >= this.end;
    },

    readInString: function (len) {
        var n, s = "";
        for (n = 0; n < len; n++) {
            s += String.fromCharCode(this._readUnsignedByte());
        }
        return s;
    },

    readAByte: function () {
        return this._readUnsignedByte();
    },

    readAShort: function () {
        var b1, b2;
        b1 = this._readUnsignedByte();
        b2 = this._readUnsignedByte();
        return b2 * 256 + b1;
    },

    readShort: function () {
        var b1, b2;
        b1 = this._readUnsignedByte();
        b2 = this._readUnsignedByte();
        var value = b2 * 256 + b1;
        if (value < 32768) {
            return value;
        } else {
            return value - 65536;
        }
    },

    readAChar: function () {
        if (!this.unicode) {
            return this._readUnsignedByte();
        } else {
            var b1, b2;
            b1 = this._readUnsignedByte();
            b2 = this._readUnsignedByte();
            return (b2 * 256 + b1);
        }
    },

    readACharArray: function (size) {
        var c = new Array();
        var n;
        for (n = 0; n < size; n++) {
            c[n] = this.readAChar();
        }
        return c;
    },

    readAInt: function () {
        var b1, b2, b3, b4;
        b1 = this._readUnsignedByte();
        b2 = this._readUnsignedByte();
        b3 = this._readUnsignedByte();
        b4 = this._readUnsignedByte();
        var value = b4 * 0x01000000 + b3 * 0x00010000 + b2 * 0x00000100 + b1;
        if (value <= 0x7FFFFFFF) {
            return value;
        } else {
            return value - 0x100000000;
        }

    },

    readAColor: function () {
        var b1, b2, b3;
        var c;

        b1 = this._readUnsignedByte();
        b2 = this._readUnsignedByte();
        b3 = this._readUnsignedByte();
        this._readUnsignedByte();

        c = b1 * 0x00010000 + b2 * 0x00000100 + b3;
        return c;
    },

    readAFloat: function () {
        var b1, b2, b3, b4;

        b1 = this._readUnsignedByte();
        b2 = this._readUnsignedByte();
        b3 = this._readUnsignedByte();
        b4 = this._readUnsignedByte();
        var total = b4 * 0x01000000 + b3 * 0x00010000 + b2 * 0x00000100 + b1;
        if (total > 0x80000000) {
            total -= 0xFFFFFFFF;
        }
        return total / 65536.0;
    },

    readADouble: function () {
        var b1, b2, b3, b4, b5, b6, b7, b8;

        b1 = this._readUnsignedByte();
        b2 = this._readUnsignedByte();
        b3 = this._readUnsignedByte();
        b4 = this._readUnsignedByte();
        b5 = this._readUnsignedByte();
        b6 = this._readUnsignedByte();
        b7 = this._readUnsignedByte();
        b8 = this._readUnsignedByte();

        var total = b8 * 0x0100000000000000 + b7 * 0x0001000000000000 + b6 * 0x0000010000000000 + b5 * 0x0000000100000000 + b4 * 0x01000000 + b3 * 0x00010000 + b2 * 0x00000100 + b1;
        if (total > 0x8000000000000000) {
            total -= 0xFFFFFFFFFFFFFFFF;
        }
        return total / 0x100000000;
    },

    readAString: function (length, allowNull) {
        var string = "";

        //null length = until the end
        var len = length;
        var maxlen = this.end - this.pointer;
        if (this.unicode)
            maxlen /= 2;
        if (len == null) {
            len = maxlen;
        }

        //cap length
        len = Math.min(len, maxlen);
        if (len <= 0)
            return string;

        //read zero-terminated string, or full length if allowNull is true
        var c;
        var begin = this.pointer;
        for (var i = 0; i < len; ++i) {
            c = this.readAChar();
            if (c == 0 && !allowNull) {
                break;
            }
            string += String.fromCharCode(c);
        }

        // Skip end of string buffer if a fixed length was specified
        if (length != null) {
            if (this.unicode) {
                this.pointer = Math.min(this.end, begin + len * 2);
            } else {
                this.pointer = Math.min(this.end, begin + len);
            }
        }
        return string;
    },

    readAStringEOL: function () {
        var debut = this.pointer;
        var b;
        var ret = "";
        var end;
        var delta;
        var bb;

        if (this.unicode == false) {
            if (this.isEOF()) {
                return;
            }

            b = this._readUnsignedByte();
            while (b != 10 && b != 13 && !this.isEOF()) {
                b = this._readUnsignedByte();
            }

            end = this.pointer;
            this.pointer = debut;
            delta = 1;
            if (b != 10 && b != 13) {
                delta = 0;
            }

            if (end > debut + delta) {
                ret = this.readAString(end - debut - delta);
            }
            if (b == 10 || b == 13) {
                this._readUnsignedByte();
                bb = this.readAByte();
                if (b == 10 && bb != 13) {
                    this.pointer--;
                }
                if (b == 13 && bb != 10) {
                    this.pointer--;
                }
            }
            return ret;
        }
        else {
            if (this.isEOF()) {
                return;
            }

            b = this.readAChar();
            while (b != 10 && b != 13 && !this.isEOF()) {
                b = this.readAChar();
            }

            end = this.pointer;
            this.pointer = debut;
            delta = 2;
            if (b != 10 && b != 13) {
                delta = 0;
            }
            if (end > debut + delta) {
                ret = this.readAString((end - debut - delta) / 2);
            }

            if (b == 10 || b == 13) {
                this.pointer += 2;
                bb = this.readAChar();
                if (b == 10 && bb != 13) {
                    this.pointer -= 2;
                }
                if (b == 13 && bb != 10) {
                    this.pointer -= 2;
                }
            }
            return ret;
        }
    },

    skipAString: function () {
        var b;
        if (this.unicode == false) {
            do {
                b = this._readUnsignedByte();
            } while (b != 0 && !this.EOF());
        }
        else {
            do {
                b = this.readAChar();
            } while (b != 0 && !this.EOF());
        }
    },

    getFilePointer: function () {
        return this.pointer;
    },

    seek: function (pos) {
        if (pos >= this.end) {
            pos = this.end;
        }
        this.pointer = pos;
    },

    skipBack: function (n) {
        var pos = this.pointer;
        pos -= n;
        if (pos < 0) {
            pos = 0;
        }
        this.pointer = pos;
    },

    readBytesAsArray: function (a) {
        var n;
        var size = a.length;
        for (n = 0; n < size; n++) {
            a[n] = this._readUnsignedByte();
        }
    },

    readBytesAsString: function (length) {
        var buffer = "";

        if (length == null) {
            length = this.end - this.pointer;
        }

        for (var index = 0; index < length; index++) {
            buffer += String.fromCharCode(this._readUnsignedByte());
        }

        return buffer;
    },

    readBuffer: function (size) {
        var buffer = new Array();
        var i;

        for (i = 0; i < size; i++) {
            buffer[i] = this._readUnsignedByte();
        }

        return buffer;
    },

    readLogFont: function () {
        var lf = new CFontInfo();
        lf.readLogFont(this);
        return lf;
    },

    readLogFont16: function () {
        var lf = new CFontInfo();
        lf.readLogFont16(this);
        return lf;
    }
}
