// COCQBackdrop object
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

COCQBackdrop.LINEF_INVX = 0x0001;
COCQBackdrop.LINEF_INVY = 0x0002;

function COCQBackdrop() {
    this.ocBorderSize = 0;
    this.ocBorderColor = 0;
    this.ocShape = 0;
    this.ocFillType = 0;
    this.ocLineFlags = 0;
    this.ocColor1 = 0;
    this.ocColor2 = 0;
    this.ocGradientFlags = 0;
    this.ocImage = 0;
}

COCQBackdrop.prototype = {
    load: function (file, type) {
        file.skipBytes(4);
        this.ocObstacleType = file.readAShort();
        this.ocColMode = file.readAShort();
        this.ocCx = file.readAInt();
        this.ocCy = file.readAInt();
        this.ocBorderSize = file.readAShort();
        this.ocBorderColor = file.readAColor();
        this.ocShape = file.readAShort();

        this.ocFillType = file.readAShort();
        if (this.ocShape == 1) {
            this.ocLineFlags = file.readAShort();
        }
        else {
            switch (this.ocFillType) {
                case 1:
                    this.ocColor1 = this.ocColor2 = file.readAColor();
                    break;
                case 2:
                    this.ocColor1 = file.readAColor();
                    this.ocColor2 = file.readAColor();
                    this.ocGradientFlags = file.readAInt();
                    break;
                case 3:
                    this.ocImage = file.readAShort();
                    break;
            }
        }
    },

    enumElements: function (enumImages, enumFonts) {
        if (this.ocFillType == 3) {
            if (enumImages != null) {
                var num = enumImages.enumerate(this.ocImage);
                if (num != -1) {
                    ocImage = num;
                }
            }
        }
    }
}
