// CTransScroll object
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

function CTransScroll() {
    //call chain
    CTrans.call(this);

    //call self
    this.direction;
    this.wBandE;
    this.rw;
}

CTransScroll.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.direction = file.readAInt();
    },

    onStart: function (flag) {
        switch (this.direction) {
            case CTrans.LEFT_RIGHT:
            case CTrans.RIGHT_LEFT:
                this.wBandE = this.oldBufferWidth;
                break;
            default:
                this.wBandE = this.oldBufferHeight;
                break;
        }
        this.rw = 0;

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        if (this.duration == 0) {
            this.blit(this.newBuffer);
        } else {
            var rw = this.wBandE * this.getDeltaTime() / this.duration;
            if (rw > this.rw) {
                var x = 0, y = 0;

                switch (this.direction) {
                    case CTrans.LEFT_RIGHT:
                        x = rw - this.oldBufferWidth;
                        y = 0;
                        break;
                    case CTrans.RIGHT_LEFT:
                        x = this.oldBufferWidth - rw;
                        y = 0;
                        break;
                    case CTrans.TOP_BOTTOM:
                        x = 0;
                        y = rw - this.oldBufferHeight;
                        break;
                    case CTrans.BOTTOM_TOP:
                        x = 0;
                        y = this.oldBufferHeight - rw;
                        break;
                }
                this.blit(this.newBuffer, x, y, 0, 0, this.oldBufferWidth, this.oldBufferHeight);
                this.rw = rw;
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransScroll);