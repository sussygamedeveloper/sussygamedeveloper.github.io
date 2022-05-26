// CTransLine object
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

function CTransLine() {
    //call chain
    CTrans.call(this);

    //call self
    this.configPos1 = 0;
    this.configStyle = 0;
    this.configScrolling = 0;
}

CTransLine.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configPos1 = file.readAInt();
        this.configStyle = file.readAInt();
        this.configScrolling = file.readAInt();
    },

    onStart: function (flag) {
        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(this.newBuffer);      // completed
        } else {
            var x, y, w, h;
            var i = 0;        // Loop
            var j = 0;        // Loop
            var linesize = 0;

            // Horizontal
            if (this.configStyle == 0) {
                linesize = this.newBufferHeight / this.configPos1;
                for (i = 0; i < this.configPos1; i++) {
                    if (j == 0) {
                        x = 0;
                        y = (i * linesize);
                        w = this.newBufferWidth * elapsedTime / this.duration;

                        // Last
                        if (i == this.configPos1 - 1) {
                            h = this.newBufferHeight;
                        } else {
                            h = (linesize + 1.0);
                        }

                        // Without scrolling or with scrolling
                        if (this.configScrolling == 0) {
                            this.blit(this.newBuffer, x, y, x, y, w, h);
                        } else {
                            this.blit(this.newBuffer, x, y, this.newBufferWidth - w, y, w, h);
                        }

                        j = 1;
                    }
                    else {
                        y = (i * linesize);//h;
                        w = this.newBufferWidth * elapsedTime / this.duration;
                        x = this.newBufferWidth - w;

                        // Last
                        if (i == this.configPos1 - 1) {
                            h = this.newBufferHeight;
                        } else {
                            h = (linesize + 1.0);
                        }

                        // Without scrolling or with scrolling
                        if (this.configScrolling == 0) {
                            this.blit(this.newBuffer, x, y, x, y, w, h);
                        } else {
                            this.blit(this.newBuffer, x, y, 0, y, w, h);
                        }

                        j = 0;
                    }
                }
            }
            // Vertical
            else {
                linesize = this.newBufferWidth / this.configPos1;
                for (i = 0; i < this.configPos1; i++) {
                    if (j == 0) {
                        x = (i * linesize);
                        y = 0;
                        h = this.newBufferHeight * elapsedTime / this.duration;

                        // Last
                        if (i == this.configPos1 - 1) {
                            w = this.newBufferWidth;
                        } else {
                            w = (linesize + 1);
                        }

                        // Without scrolling or with scrolling
                        if (this.configScrolling == 0) {
                            this.blit(this.newBuffer, x, y, x, y, w, h);
                        } else {
                            this.blit(this.newBuffer, x, y, x, this.newBufferHeight - h, w, h);
                        }

                        j = 1;
                    }
                    else {
                        x = (i * linesize);
                        h = this.newBufferHeight * elapsedTime / this.duration;
                        y = this.newBufferHeight - h;

                        // Last
                        if (i == this.configPos1 - 1) {
                            w = this.newBufferWidth;
                        } else {
                            w = (linesize + 1);
                        }

                        // Without scrolling or with scrolling
                        if (this.configScrolling == 0) {
                            this.blit(this.newBuffer, x, y, x, y, w, h);
                        } else {
                            this.blit(this.newBuffer, x, y, x, 0, w, h);
                        }
                        j = 0;
                    }
                }
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransLine);