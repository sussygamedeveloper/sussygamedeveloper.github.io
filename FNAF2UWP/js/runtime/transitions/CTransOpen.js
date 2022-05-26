// CTransOpen object
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

function CTransOpen() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
}

CTransOpen.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
    },

    onStart: function (flag) {
        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();
        var percentage = elapsedTime / this.duration;

        if (percentage > 1.0) {
            this.blit(this.newBuffer);                    // completed
        } else {
            var x, y, w, h;
            if (percentage < 0.25) {
                w = this.newBufferWidth * 2 * elapsedTime / this.duration;
                w *= 2;
                h = this.newBufferHeight / 7;
                x = this.newBufferWidth / 2 - w / 2;
                y = this.newBufferHeight / 2 - h / 2;
                this.blit(this.newBuffer, x, y, x, y, w, h);

                w = this.newBufferWidth / 7;
                h = this.newBufferHeight * 2 * elapsedTime / this.duration;
                h *= 2;
                x = this.newBufferWidth / 2 - w / 2;
                y = this.newBufferHeight / 2 - h / 2;
                this.blit(this.newBuffer, x, y, x, y, w, h);
            }
            else {
                x = this.newBufferWidth / 2;
                w = this.newBufferWidth * elapsedTime / this.duration - x;
                h = this.newBufferHeight / 2;
                y = 0;
                this.blit(this.newBuffer, x, y, x, y, w, h);

                y = this.newBufferHeight / 2;
                h = this.newBufferHeight * elapsedTime / this.duration - y;
                w = this.newBufferWidth / 2;
                x = w;
                this.blit(this.newBuffer, x, y, x, y, w, h);

                w = this.newBufferWidth * elapsedTime / this.duration - this.newBufferWidth / 2;
                x = this.newBufferWidth / 2 - w;
                h = this.newBufferHeight / 2;
                y = h;
                this.blit(this.newBuffer, x, y, x, y, w, h);

                h = this.newBufferHeight * elapsedTime / this.duration - this.newBufferHeight / 2;
                y = this.newBufferHeight / 2 - h;
                w = this.newBufferWidth / 2;
                x = 0;
                this.blit(this.newBuffer, x, y, x, y, w, h);
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransOpen);