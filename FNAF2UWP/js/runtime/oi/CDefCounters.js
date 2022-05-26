// CDefCounters object
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

CDefCounters.CTA_HIDDEN = 0;
CDefCounters.CTA_DIGITS = 1;
CDefCounters.CTA_VBAR = 2;
CDefCounters.CTA_HBAR = 3;
CDefCounters.CTA_ANIM = 4;
CDefCounters.CTA_TEXT = 5;
CDefCounters.BARFLAG_INVERSE = 0x0100;

function CDefCounters() {
    this.odCx = 0;
    this.odCy = 0;
    this.odPlayer = 0;
    this.odDisplayType = 0;
    this.odDisplayFlags = 0;
    this.odFont = 0;
    this.ocBorderSize = 0;
    this.ocBorderColor = 0;
    this.ocShape = 0;
    this.ocFillType = 0;
    this.ocLineFlags = 0;
    this.ocColor1 = 0;
    this.ocColor2 = 0;
    this.ocGradientFlags = 0;
    this.nFrames = 0;
    this.frames = null;
}

CDefCounters.prototype = {
    load: function (file) {
        file.skipBytes(4);
        this.odCx = file.readAInt();
        this.odCy = file.readAInt();
        this.odPlayer = file.readAShort();
        this.odDisplayType = file.readAShort();
        this.odDisplayFlags = file.readAShort();
        this.odFont = file.readAShort();

        switch (this.odDisplayType) {
            case 0:
                break;
            case 1:
            case 4:
                this.nFrames = file.readAShort();
                this.frames = new Array(this.nFrames);
                var n;
                for (n = 0; n < this.nFrames; n++) {
                    this.frames[n] = file.readAShort();
                }
                break;
            case 2:
            case 3:
            case 5:
                this.ocBorderSize = file.readAShort();
                this.ocBorderColor = file.readAColor();
                this.ocShape = file.readAShort();
                this.ocFillType = file.readAShort();
                if (this.ocShape == 1) {
                    this.ocLineFlags = file.readAShort();
                } else {
                    switch (this.ocFillType) {
                        case 1:
                            this.ocColor1 = file.readAColor();
                            break;
                        case 2:
                            this.ocColor1 = file.readAColor();
                            this.ocColor2 = file.readAColor();
                            this.ocGradientFlags = file.readAInt();
                            break;
                        case 3:
                            break;
                    }
                }
                break;
        }
    },

    enumElements: function (enumImages, enumFonts) {
        var num;
        switch (this.odDisplayType) {
            case 1:
            case 4:
                var n;
                for (n = 0; n < this.nFrames; n++) {
                    if (enumImages != null) {
                        num = enumImages.enumerate(this.frames[n]);
                        /*                        if (num!=-1)
                         {
                         this.frames[n]=num;
                         }
                         */
                    }
                }
                break;
            case 5:
                if (enumFonts != null) {
                    num = enumFonts.enumerate(this.odFont);
                    /*                    if (num!=-1)
                     {
                     this.odFont=num;
                     }
                     */
                }
                break;
        }
    }
}
