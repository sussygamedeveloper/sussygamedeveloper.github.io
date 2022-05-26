// CTransZigZag2 object
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

function CTransZigZag2() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
    this.configPos1 = 0;
    this.linePosition = 0;
    this.direction = 0;
}

CTransZigZag2.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
        this.configPos1 = file.readAInt();
    },

    onStart: function (flag) {
        this.linePosition = 0;
        this.direction = 0;

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(this.newBuffer);                    // completed
        } else {
            var x, y, w, h;
            var nb = 0.0;

            if (this.configStyle == 0) {
                nb = this.newBufferHeight / this.configPos1;

                // TOP
                h = Math.floor(this.linePosition * nb) + Math.floor(nb);
                y = 0;
                w = this.newBufferWidth * elapsedTime / this.duration;
                w = w * this.configPos1 / 2;
                w -= this.newBufferWidth * this.linePosition;
                if (this.direction == 0) {
                    x = 0;
                } else {
                    x = this.newBufferWidth - w;
                }
                this.blit(this.newBuffer, x, y, x, y, w, h);

                // BOTTOM
                y = this.newBufferHeight - h;
                if (this.direction == 1) {
                    x = 0;
                } else {
                    x = this.newBufferWidth - w;
                }
                this.blit(this.newBuffer, x, y, x, y, w, h);

                // End of line
                if (w >= this.newBufferWidth) {
                    this.linePosition++;
                    this.direction++;
                    if (this.direction == 2) {
                        this.direction = 0;
                    }
                }
            }
            else {
                nb = this.newBufferWidth / this.configPos1;

                // LEFT
                w = Math.floor(this.linePosition * nb) + Math.floor(nb);
                x = 0;
                h = this.newBufferHeight * elapsedTime / this.duration;
                h = h * this.configPos1 / 2;
                h -= this.newBufferHeight * this.linePosition;
                if (this.direction == 0) {
                    y = 0;
                } else {
                    y = this.newBufferHeight - h;
                }
                this.blit(this.newBuffer, x, y, x, y, w, h);

                // RIGHT
                x = this.newBufferWidth - w;
                if (this.direction == 1) {
                    y = 0;
                } else {
                    y = this.newBufferHeight - h;
                }
                this.blit(this.newBuffer, x, y, x, y, w, h);

                // End of line
                if (h >= this.newBufferHeight) {
                    this.linePosition++;
                    this.direction++;
                    if (this.direction == 2) {
                        this.direction = 0;
                    }
                }
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransZigZag2);