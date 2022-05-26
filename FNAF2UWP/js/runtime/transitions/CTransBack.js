// CTransBack object
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

function CTransBack() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
}

CTransBack.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        this.blit(this.newBuffer);

        if ((elapsedTime / this.duration) <= 1.0) {
            var w, h;

            switch (this.configStyle) {
                // OPEN
                case 0:
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    w = this.newBufferWidth / 2 - w;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 - h;
                    this.stretch(this.oldBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth / 2, this.newBufferHeight / 2);

                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 - h;
                    this.stretch(this.oldBuffer, this.newBufferWidth / 2 + w, 0, this.newBufferWidth / 2 - w, h, this.newBufferWidth / 2, 0, this.newBufferWidth / 2, this.newBufferHeight / 2);

                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    w = this.newBufferWidth / 2 - w;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.stretch(this.oldBuffer, 0, this.newBufferHeight / 2 + h, w, this.newBufferHeight / 2 - h, 0, this.newBufferHeight / 2, this.newBufferWidth / 2, this.newBufferHeight / 2);

                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.stretch(this.oldBuffer, this.newBufferWidth / 2 + w, this.newBufferHeight / 2 + h, this.newBufferWidth / 2 - w, this.newBufferHeight / 2 - h, this.newBufferWidth / 2, this.newBufferHeight / 2, this.newBufferWidth / 2, this.newBufferHeight / 2);
                    break;
                // SLIDE
                case 1:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    w = this.newBufferWidth - w;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    h = this.newBufferHeight - h;
                    this.blit(this.oldBuffer, 0, 0, this.newBufferWidth - w, this.newBufferHeight - h, w, h);
                    break;
                // SLIDE
                case 2:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    h = this.newBufferHeight - h;
                    this.blit(this.oldBuffer, w, 0, 0, this.newBufferHeight - h, this.newBufferWidth - w, h);
                    break;
                // SLIDE
                case 3:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    w = this.newBufferWidth - w;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.blit(this.oldBuffer, 0, h, this.newBufferWidth - w, 0, w, this.newBufferHeight - h);
                    break;
                // SLIDE
                case 4:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.blit(this.oldBuffer, w, h, 0, 0, this.newBufferWidth - w, this.newBufferHeight - h);
                    break;
                // OPEN (SCROLLING)
                case 5:
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    w = this.newBufferWidth / 2 - w;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 - h;
                    this.blit(this.oldBuffer, w - this.newBufferWidth / 2, h - this.newBufferHeight / 2, 0, 0, this.newBufferWidth / 2, this.newBufferHeight / 2);

                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 - h;
                    this.blit(this.oldBuffer, this.newBufferWidth / 2 + w, h - this.newBufferHeight / 2, this.newBufferWidth / 2, 0, this.newBufferWidth / 2, this.newBufferHeight / 2);

                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    w = this.newBufferWidth / 2 - w;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.blit(this.oldBuffer, w - this.newBufferWidth / 2, this.newBufferHeight / 2 + h, 0, this.newBufferHeight / 2, this.newBufferWidth / 2, this.newBufferHeight / 2);

                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.blit(this.oldBuffer, this.newBufferWidth / 2 + w, this.newBufferHeight / 2 + h, this.newBufferWidth / 2, this.newBufferHeight / 2, this.newBufferWidth / 2, this.newBufferHeight / 2);
                    break;
                // SLIDE
                case 6:
                    w = this.newBufferWidth;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 - h;
                    this.blit(this.oldBuffer, 0, h - this.newBufferHeight / 2, 0, 0, this.newBufferWidth, this.newBufferHeight / 2);
                    this.blit(this.oldBuffer, 0, this.newBufferHeight - h, 0, this.newBufferHeight / 2, this.newBufferWidth, this.newBufferHeight / 2);
                    break;
                // SLIDE
                case 7:
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    w = this.newBufferWidth / 2 - w;
                    h = this.newBufferHeight;
                    this.blit(this.oldBuffer, w - this.newBufferWidth / 2, 0, 0, 0, this.newBufferWidth / 2, this.newBufferHeight);
                    this.blit(this.oldBuffer, this.newBufferWidth - w, 0, this.newBufferWidth / 2, 0, this.newBufferWidth / 2, this.newBufferHeight);
                    break;
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransBack);