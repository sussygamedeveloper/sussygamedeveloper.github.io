// CAnimDir object
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

function CAnimDir() {
    this.adMinSpeed = 0;
    this.adMaxSpeed = 0;
    this.adRepeat = 0;
    this.adRepeatFrame = 0;
    this.adNumberOfFrame = 0;
    this.adFrames = null;
}

CAnimDir.prototype = {
    load: function (file) {
        this.adMinSpeed = file.readAByte();
        this.adMaxSpeed = file.readAByte();
        this.adRepeat = file.readAShort();
        this.adRepeatFrame = file.readAShort();
        this.adNumberOfFrame = file.readAShort();

        this.adFrames = new Array(this.adNumberOfFrame);
        var n;
        for (n = 0; n < this.adNumberOfFrame; n++) {
            this.adFrames[n] = file.readAShort();
        }
    },

    enumElements: function (enumImages) {
        var n;
        for (n = 0; n < this.adNumberOfFrame; n++) {
            if (enumImages != null) {
                var num = enumImages.enumerate(this.adFrames[n]);
                if (num != -1) {
                    this.adFrames[n] = num;
                }
            }
        }
    }
}
