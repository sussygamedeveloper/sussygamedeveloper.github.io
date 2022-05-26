// CDefText object
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

CDefText.TSF_LEFT = 0x0000;
CDefText.TSF_HCENTER = 0x0001;
CDefText.TSF_RIGHT = 0x0002;
CDefText.TSF_VCENTER = 0x0004;
CDefText.TSF_HALIGN = 0x000F;
CDefText.TSF_CORRECT = 0x0100;
CDefText.TSF_RELIEF = 0x0200;

function CDefText() {
    this.tsFont = 0;
    this.tsFlags = 0;
    this.tsColor = 0;
    this.tsText = null;
}

CDefText.prototype = {
    load: function (file) {
        this.tsFont = file.readShort();
        this.tsFlags = file.readAShort();
        this.tsColor = file.readAColor();
        this.tsText = file.readAString();
    },

    enumElements: function (enumImages, enumFonts) {
        if (enumFonts != null) {
            var num = enumFonts.enumerate(this.tsFont);
            /*            if (num!=-1)
             {
             this.tsFont=num;
             }
             */
        }
    }
}
