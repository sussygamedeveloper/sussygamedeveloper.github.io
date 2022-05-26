// CFontInfo object
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

function CFontInfo() {
    this.lfHeight = 12;
    this.lfWeight = 400;
    this.lfItalic = 0;
    this.lfFaceName = "Arial";
    this.isGraphic = false;
}

CFontInfo.prototype = {
    copy: function (f) {
        this.lfHeight = f.lfHeight;
        this.lfWeight = f.lfWeight;
        this.lfItalic = f.lfItalic;
        this.lfFaceName = f.lfFaceName;
    },

    getCSS: function () {
        var result;
        if (this.lfItalic) {
            result = "italic ";
        } else {
            result = "normal "
        }

        var weight = Math.floor(this.lfWeight / 100) * 100;
        weight = Math.max(weight, 100);
        weight = Math.min(weight, 900);
        result += weight + " ";

        var height = this.lfHeight;
        result += height + "px ";
        result += this.lfFaceName;

        return result;
    },

    getHeight: function () {
        return this.lfHeight + Math.ceil(this.lfHeight / 8);
    },

    init: function () {
        this.lfFaceName = "Arial";
        this.lfHeight = 13;
        this.lfWeight = 400;
        this.lfItalic = 0;
    },

    readLogFont: function (file) {
        this.lfHeight = file.readAInt();
        if (this.lfHeight < 0) {
            this.lfHeight = -this.lfHeight;
        }
        file.skipBytes(12);
        this.lfWeight = file.readAInt();
        this.lfItalic = file.readAByte();
        this.lfUnderline = file.readAByte();
        this.lfStrikeOut = file.readAByte();
        file.skipBytes(5);
        this.lfFaceName = file.readAString(32);
    },

    readLogFont16: function (file) {
        this.lfHeight = file.readShort();
        if (this.lfHeight < 0) {
            this.lfHeight = -this.lfHeight;
        }
        file.skipBytes(6);
        this.lfWeight = file.readAShort();
        this.lfItalic = file.readAByte();
        this.lfUnderline = file.readAByte();
        this.lfStrikeOut = file.readAByte();
        file.skipBytes(5);
        var oldUnicode = file.unicode;
        file.unicode = false;
        this.lfFaceName = file.readAString(32);
        file.unicode = oldUnicode;
    }
}
