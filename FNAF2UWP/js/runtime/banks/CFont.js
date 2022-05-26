// CFont object
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

function CFont() {
    this.useCount = 0;
    this.handle = 0;
    this.lfHeight = 0;
    this.lfWeight = 0;
    this.lfItalic = 0;
    this.lfFaceName = null;
    this.font = null;
    this.isGraphic = false;
}

CFont.prototype = {
    readHandle: function (file) {
        this.handle = file.readAInt();
        if (file.unicode == false) {
            file.skipBytes(0x48);
        }
        else {
            file.skipBytes(0x68);
        }
    },

    load: function (file) {
        this.handle = file.readAInt();
        var debut = file.getFilePointer();
        file.skipBytes(12);

        this.lfHeight = file.readAInt();
        if (this.lfHeight < 0) {
            this.lfHeight = -this.lfHeight;
        }
        file.readAInt();
        file.readAInt();
        file.readAInt();
        this.lfWeight = file.readAInt();
        this.lfItalic = file.readAByte();
        file.readAByte();
        file.readAByte();
        file.readAByte();
        file.readAByte();
        file.readAByte();
        file.readAByte();
        file.readAByte();
        this.lfFaceName = file.readAString();

        if (file.unicode == false) {
            file.seek(debut + 0x48);
        }
        else {
            file.seek(debut + 0x68);
        }
    },

    getFontInfo: function () {
        var info = new CFontInfo();
        info.lfHeight = this.lfHeight;
        info.lfWeight = this.lfWeight;
        info.lfItalic = this.lfItalic;
        info.lfFaceName = this.lfFaceName;
        return info;
    },

    createDefaultFont: function () {
        this.lfFaceName = "Arial";
        this.lfHeight = 13;
        this.lfWeight = 400;
        this.lfItalic = 0;
    },

    getHeight: function () {
        return this.lfHeight + Math.ceil(this.lfHeight/8);
    },

    getCSS: function () {
        //build css font string
        if (this.font == null) {
            if (this.lfItalic) {
                this.font = "italic ";
            } else {
                this.font = "normal "
            }

            var weight = Math.floor(this.lfWeight / 100) * 100;
            weight = Math.max(weight, 100);
            weight = Math.min(weight, 900);
            this.font += weight + " ";

            var height = this.lfHeight; // CServices.heightNormalToLF(this.lfHeight);
            this.font += height + "px ";
            this.font += this.lfFaceName;
        }
        return this.font;
    }
}
