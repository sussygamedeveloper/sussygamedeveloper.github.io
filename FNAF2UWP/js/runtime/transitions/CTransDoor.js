// CTransDoor object
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

function CTransDoor() {
    //call chain
    CTrans.call(this);

    //call self
    this.direction = 0;
    this.wBandE = 0;
    this.rw = 0;
}

CTransDoor.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.direction = file.readAShort();
    },

    onStart: function (flag) {
        switch (this.direction) {
            case CTrans.CENTER_LEFTRIGHT:
            case CTrans.LEFTRIGHT_CENTER:
                this.wBandE = this.oldBuffer.width / 2;
                break;
            default:
                this.wBandE = this.oldBuffer.height / 2;
                break;
        }
        this.rw = 0;

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        if (this.wBandE == 0) {
            this.blit(this.newBuffer);
        } else {
            var x = 0, y = 0, w = 0, h = 0;
            var rw = this.wBandE * this.getDeltaTime() / this.duration;
            if (rw > this.rw) {
                // 1st band
                switch (this.direction) {
                    case CTrans.CENTER_LEFTRIGHT:
                        x = this.oldBuffer.width / 2 - rw;
                        y = 0;
                        w = rw - this.rw;
                        h = this.newBuffer.height;
                        break;
                    case CTrans.LEFTRIGHT_CENTER:
                        x = this.rw;
                        y = 0;
                        w = rw - this.rw;
                        h = this.newBuffer.height;
                        break;
                    case CTrans.CENTER_TOPBOTTOM:
                        x = 0;
                        y = this.oldBuffer.height / 2 - rw;
                        w = this.newBuffer.width;
                        h = rw - this.rw;
                        break;
                    case CTrans.TOPBOTTOM_CENTER:
                        x = 0;
                        y = this.rw;
                        w = this.newBuffer.width;
                        h = rw - this.rw;
                        break;
                }
                this.blit(this.newBuffer, x, y, x, y, w, h);

                // 2nd band
                switch (this.direction) {
                    case CTrans.CENTER_LEFTRIGHT:
                        x = this.oldBuffer.width / 2 + this.rw;
                        break;
                    case CTrans.LEFTRIGHT_CENTER:
                        x = this.oldBuffer.width - rw;
                        break;
                    case CTrans.CENTER_TOPBOTTOM:
                        y = this.oldBuffer.height / 2 + this.rw;
                        break;
                    case CTrans.TOPBOTTOM_CENTER:
                        y = this.oldBuffer.height - rw;
                        break;
                }
                this.blit(this.newBuffer, x, y, x, y, w, h);
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransDoor);