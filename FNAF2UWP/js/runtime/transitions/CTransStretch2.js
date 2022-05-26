// CTransStretch2 object
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

function CTransStretch2() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
    this.phase = 0;
}

CTransStretch2.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
    },

    onStart: function (flag) {
        this.phase = 0;

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(this.newBuffer);                    // completed
        } else {
            var w, h;

            switch (this.configStyle) {
                // Top Left
                case 0:
                    if (this.phase == 0) {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w = this.newBufferWidth - w;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h = this.newBufferHeight - h;

                        this.stretch(this.oldBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w -= this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h -= this.newBufferHeight;
                        this.stretch(this.newBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Top Middle
                case 1:
                    if (this.phase == 0) {
                        w = this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h = this.newBufferHeight - h;

                        this.stretch(this.oldBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h -= this.newBufferHeight;
                        this.stretch(this.newBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Top Right
                case 2:
                    if (this.phase == 0) {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w = this.newBufferWidth - w;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h = this.newBufferHeight - h;

                        this.stretch(this.oldBuffer, this.newBufferWidth - w, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w -= this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h -= this.newBufferHeight;
                        this.stretch(this.newBuffer, this.newBufferWidth - w, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Middle Left
                case 3:
                    if (this.phase == 0) {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w = this.newBufferWidth - w;
                        h = this.newBufferHeight;

                        this.stretch(this.oldBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w -= this.newBufferWidth;
                        h = this.newBufferHeight;
                        this.stretch(this.newBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Center H
                case 4:
                    if (this.phase == 0) {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w = this.newBufferWidth - w;
                        h = this.newBufferHeight;

                        this.stretch(this.oldBuffer, this.newBufferWidth / 2 - w / 2, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w -= this.newBufferWidth;
                        h = this.newBufferHeight;
                        this.stretch(this.newBuffer, this.newBufferWidth / 2 - w / 2, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Center V
                case 5:
                    if (this.phase == 0) {
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h = this.newBufferHeight - h;
                        w = this.newBufferWidth;

                        this.stretch(this.oldBuffer, 0, this.newBufferHeight / 2 - h / 2, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h -= this.newBufferHeight;
                        w = this.newBufferWidth;
                        this.stretch(this.newBuffer, 0, this.newBufferHeight / 2 - h / 2, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Center H+V
                case 6:
                    if (this.phase == 0) {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w = this.newBufferWidth - w;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h = this.newBufferHeight - h;

                        this.stretch(this.oldBuffer, this.newBufferWidth / 2 - w / 2, this.newBufferHeight / 2 - h / 2, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w -= this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h -= this.newBufferHeight;
                        this.stretch(this.newBuffer, this.newBufferWidth / 2 - w / 2, this.newBufferHeight / 2 - h / 2, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Middle Right
                case 7:
                    if (this.phase == 0) {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w = this.newBufferWidth - w;
                        h = this.newBufferHeight;

                        this.stretch(this.oldBuffer, this.newBufferWidth - w, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w -= this.newBufferWidth;
                        h = this.newBufferHeight;
                        this.stretch(this.newBuffer, this.newBufferHeight - w, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Bottom Left
                case 8:
                    if (this.phase == 0) {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w = this.newBufferWidth - w;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h = this.newBufferHeight - h;

                        this.stretch(this.oldBuffer, 0, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w -= this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h -= this.newBufferHeight;
                        this.stretch(this.newBuffer, 0, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Bottom Middle
                case 9:
                    if (this.phase == 0) {
                        w = this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h = this.newBufferHeight - h;

                        this.stretch(this.oldBuffer, 0, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h -= this.newBufferHeight;
                        this.stretch(this.newBuffer, 0, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
                // Bottom Right
                case 10:
                    if (this.phase == 0) {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w = this.newBufferWidth - w;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h = this.newBufferHeight - h;

                        this.stretch(this.oldBuffer, this.newBufferWidth - w, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);

                        if (elapsedTime >= this.duration / 2) {
                            this.phase = 1;
                        }
                    }
                    else {
                        w = 2 * this.newBufferWidth * elapsedTime / this.duration;
                        w -= this.newBufferWidth;
                        h = 2 * this.newBufferHeight * elapsedTime / this.duration;
                        h -= this.newBufferHeight;
                        this.stretch(this.newBuffer, this.newBufferWidth - w, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    }
                    break;
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransStretch2);