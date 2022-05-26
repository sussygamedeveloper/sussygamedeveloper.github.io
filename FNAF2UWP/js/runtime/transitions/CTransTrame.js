// CTransTrame object
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

function CTransTrame() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
    this.index1 = 0;
    this.index2 = 0;
}

CTransTrame.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
    },

    onStart: function (flag) {
        this.index1 = 0;
        this.index2 = 0;

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(this.newBuffer);                    // completed
        } else {
            var w, h, i, j, k;

            h = this.newBufferHeight * elapsedTime / this.duration;
            w = this.newBufferWidth * elapsedTime / this.duration;

            if (this.configStyle == 0) {
                k = h % 2;
                for (i = 0; i < this.newBufferWidth; i += 2) {
                    for (j = this.index1; j < h; j++) {
                        this.blit(this.newBuffer, i, j, i, j, 1, 1);
                    }
                    for (j = this.newBufferHeight - h - k; j < this.newBufferHeight - this.index1; j++) {
                        this.blit(this.newBuffer, i + 1, j + 1, i + 1, j + 1, 1, 1);
                    }
                }
                if (h % 2 == 0) {
                    this.index1 = h;
                } else {
                    this.index1 = h - 1;
                }
            }

            if (this.configStyle == 1) {
                k = w % 2;
                for (j = 0; j < this.newBufferHeight; j++) {
                    for (i = this.index2; i < w; i += 2) {
                        this.blit(this.newBuffer, i + 1, j, i + 1, j, 1, 1);
                    }
                    for (i = this.newBufferWidth - w - k; i < this.newBufferWidth - this.index2; i += 2) {
                        this.blit(this.newBuffer, i, j + 1, i, j + 1, 1, 1);
                    }
                }
                if (w % 2 == 0) {
                    this.index2 = w;
                } else {
                    this.index2 = w - 1;
                }
            }

            if (this.configStyle == 2) {
                k = h % 2;
                for (i = 0; i < this.newBufferWidth; i += 2) {
                    for (j = this.index1; j < h; j += 2) {
                        this.blit(this.newBuffer, i, j, i, j, 1, 1);
                    }
                    for (j = this.newBufferHeight - h - k; j < this.newBufferHeight - this.index1; j += 2) {
                        this.blit(this.newBuffer, i + 1, j + 1, i + 1, j + 1, 1, 1);
                    }
                }

                k = w % 2;
                for (j = 0; j < this.newBufferHeight; j += 2) {
                    for (i = this.index2; i < w; i += 2) {
                        this.blit(this.newBuffer, i + 1, j, i + 1, j, 1, 1);
                    }
                    for (i = this.newBufferWidth - w - k; i < this.newBufferWidth - this.index2; i += 2) {
                        this.blit(this.newBuffer, i, j + 1, i, j + 1, 1, 1);
                    }
                }
                if (h % 2 == 0) {
                    this.index1 = h;
                } else {
                    this.index1 = h - 1;
                }
                if (w % 2 == 0) {
                    this.index2 = w;
                } else {
                    this.index2 = w - 1;
                }
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransTrame);