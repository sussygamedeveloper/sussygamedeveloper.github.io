// CTransBand object
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

function CTransBand() {
    //call chain
    CTrans.call(this);

    //call self
    this.bandsTotal = 0;
    this.direction = 0;
    this.wBandE = 0;
    this.rw = 0;
}

CTransBand.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.bandsTotal = file.readAShort();
        this.direction = file.readAShort();
    },

    onStart: function (flag) {
        var n;

        // Security...
        if (this.bandsTotal == 0) {
            this.bandsTotal = 1;
        }

        switch (this.direction) {
            case CTrans.LEFT_RIGHT:
            case CTrans.RIGHT_LEFT:
                this.wBandE = (this.oldBufferWidth + this.bandsTotal - 1) / this.bandsTotal;
                if (this.wBandE == 0) {
                    this.wBandE = 1;
                    this.bandsTotal = this.oldBufferWidth;
                }
                break;
            default:
                this.wBandE = (this.oldBufferHeight + this.bandsTotal - 1) / this.bandsTotal;
                if (this.wBandE == 0) {
                    this.wBandE = 1;
                    this.bandsTotal = this.oldBufferHeight;
                }
                break;
        }
        this.rw = 0;

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var n;

        if (this.bandsTotal <= 0 || this.wBandE <= 0 || this.duration == 0) {
            this.blit(this.newBuffer);
        } else {
            var rw = this.wBandE * this.getDeltaTime() / this.duration;
            if (rw > this.rw) {
                var x = 0, y = 0, w = 0, h = 0;
                for (n = 0; n < this.bandsTotal; n++) {
                    switch (this.direction) {
                        case CTrans.LEFT_RIGHT:
                            x = this.rw + n * this.wBandE;
                            y = 0;
                            w = rw - this.rw;
                            h = this.oldBufferHeight;
                            break;
                        case CTrans.RIGHT_LEFT:
                            x = this.oldBufferWidth - (this.rw + n * this.wBandE) - (rw - this.rw);
                            y = 0;
                            w = rw - this.rw;
                            h = this.oldBufferHeight;
                            break;
                        case CTrans.TOP_BOTTOM:
                            x = 0;
                            y = this.rw + n * this.wBandE;
                            w = this.oldBufferWidth;
                            h = rw - this.rw;
                            break;
                        case CTrans.BOTTOM_TOP:
                            x = 0;
                            y = this.oldBufferHeight - (this.rw + n * this.wBandE) - (rw - this.rw);
                            w = this.oldBufferWidth;
                            h = rw - this.rw;
                            break;
                    }

                    //draw with added width and height to account for rendering issues
                    this.blit(this.newBuffer, x, y, x - 1, y, w + 1, h + 1);
                }
            }
            this.rw = rw;
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransBand);