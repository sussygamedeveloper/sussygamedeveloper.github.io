// CTransAdvancedScrolling object
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

function CTransAdvancedScrolling() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
    this.newBufferWidth = 0;
    this.newBufferHeight = 0;
    this.style = 0;
}

CTransAdvancedScrolling.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
    },

    onStart: function (flag) {
        this.newBufferWidth = this.newBuffer.width;
        this.newBufferHeight = this.newBuffer.height;

        if (this.configStyle != 8) {
            this.style = this.configStyle;
        } else {
            this.style = Math.floor(Math.random() * 8);
        }

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(this.newBuffer);                                                    // completed
        } else {
            var w, h;

            switch (this.style) {
                case 0:
                    // Scrolling (To right, to left and to down)
                    /////////////////////////////////////////////

                    w = this.newBufferWidth / 3 * elapsedTime / this.duration;
                    h = this.newBufferHeight;
                    this.blit(this.newBuffer, 0, 0, this.newBufferWidth / 3 - w, 0, w, h);                    // Left Side
                    this.blit(this.newBuffer, this.newBufferWidth - w, 0, 2 * this.newBufferWidth / 3, 0, w, h);    // Right Side

                    w = this.newBufferWidth / 3;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.blit(this.newBuffer, w, 0, w, this.newBufferHeight - h, w, h);                    // Top side
                    break;
                case 1:
                    // Scrolling (To right, to left and to up)
                    /////////////////////////////////////////////

                    w = this.newBufferWidth / 3 * elapsedTime / this.duration;
                    h = this.newBufferHeight;
                    this.blit(this.newBuffer, 0, 0, this.newBufferWidth / 3 - w, 0, w, h);                    // Left Side
                    this.blit(this.newBuffer, this.newBufferWidth - w, 0, 2 * this.newBufferWidth / 3, 0, w, h);    // Right Side

                    w = this.newBufferWidth / 3;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.blit(this.newBuffer, w, this.newBufferHeight - h, w, 0, w, h);                    // Bottom side
                    break;
                case 2:
                    // To right, to left and to up
                    ////////////////////////////////

                    w = this.newBufferWidth / 3 * elapsedTime / this.duration;
                    h = this.newBufferHeight;
                    this.blit(this.newBuffer, 0, 0, this.newBufferWidth / 3 - w, 0, w, h);                    // Left Side
                    this.blit(this.newBuffer, this.newBufferWidth - w, 0, 2 * this.newBufferWidth / 3, 0, w, h);    // Right Side

                    w = this.newBufferWidth / 3;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.blit(this.newBuffer, w, 0, w, 0, w, h);                                    // Top side
                    break;
                case 3:
                    // To right, to left and to down
                    /////////////////////////////////

                    w = this.newBufferWidth / 3 * elapsedTime / this.duration;
                    h = this.newBufferHeight;
                    this.blit(this.newBuffer, 0, 0, this.newBufferWidth / 3 - w, 0, w, h);                    // Left Side
                    this.blit(this.newBuffer, this.newBufferWidth - w, 0, 2 * this.newBufferWidth / 3, 0, w, h);    // Right Side

                    w = this.newBufferWidth / 3;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.blit(this.newBuffer, w, this.newBufferHeight - h, w, this.newBufferHeight - h, w, h);    // Bottom side
                    break;
                case 4:
                    // To right, to left, to down and to up
                    ////////////////////////////////////////

                    w = this.newBufferWidth / 3 * elapsedTime / this.duration;
                    h = this.newBufferHeight;
                    this.blit(this.newBuffer, 0, 0, this.newBufferWidth / 3 - w, 0, w, h);                    // Left Side
                    this.blit(this.newBuffer, this.newBufferWidth - w, 0, 2 * this.newBufferWidth / 3, 0, w, h);    // Right Side

                    w = this.newBufferWidth / 3;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.blit(this.newBuffer, w, 0, w, this.newBufferHeight / 2 - h, w, h);                    // Top side
                    this.blit(this.newBuffer, w, this.newBufferHeight - h, w, this.newBufferHeight / 2, w, h);    // Bottom side
                    break;
                case 5:
                    // To right, to left, to down and to up
                    ////////////////////////////////////////

                    w = this.newBufferWidth / 3 * elapsedTime / this.duration;
                    h = this.newBufferHeight;
                    this.blit(this.newBuffer, 0, 0, this.newBufferWidth / 3 - w, 0, w, h);                    // Left Side
                    this.blit(this.newBuffer, this.newBufferWidth - w, 0, 2 * this.newBufferWidth / 3, 0, w, h);    // Right Side

                    w = this.newBufferWidth / 3;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.blit(this.newBuffer, w, 0, w, 0, w, h);                                    // Top side
                    this.blit(this.newBuffer, w, this.newBufferHeight - h, w, this.newBufferHeight - h, w, h);    // Bottom side
                    break;
                case 6:
                    // Scrolling (3 bands)
                    ///////////////////////

                    w = this.newBufferWidth / 3;
                    h = this.newBufferHeight * elapsedTime / this.duration;

                    this.blit(this.newBuffer, 0, this.newBufferHeight - h, 0, 0, w, h);                    // Band 1
                    this.blit(this.newBuffer, w, 0, w, this.newBufferHeight - h, w, h);                    // Band 2
                    this.blit(this.newBuffer, w * 2, this.newBufferHeight - h, w * 2, 0, w, h);                // Band 3
                    break;
                case 7:
                    // Scrolling (7 bands)
                    ///////////////////////

                    w = this.newBufferWidth / 7;
                    h = this.newBufferHeight * elapsedTime / this.duration;

                    this.blit(this.newBuffer, 0, this.newBufferHeight - h, 0, 0, w, h);                    // Band 1
                    this.blit(this.newBuffer, w, 0, w, this.newBufferHeight - h, w, h);                    // Band 2
                    this.blit(this.newBuffer, w * 2, this.newBufferHeight - h, w * 2, 0, w, h);                // Band 3
                    this.blit(this.newBuffer, w * 3, 0, w * 3, this.newBufferHeight - h, w, h);                // Band 4
                    this.blit(this.newBuffer, w * 4, this.newBufferHeight - h, w * 4, 0, w, h);                // Band 5
                    this.blit(this.newBuffer, w * 5, 0, w * 5, this.newBufferHeight - h, w, h);                // Band 6
                    this.blit(this.newBuffer, w * 6, this.newBufferHeight - h, w * 6, 0, w * 2, h);                // Band 7
                    break;
                default:
                    this.blit(this.newBuffer);
                    break;
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransAdvancedScrolling);