// CTransCell object
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

function CTransCell() {
    //call chain
    CTrans.call(this);

    //call self
    this.configPos1 = 0;
    this.configPos2 = 0;
}

CTransCell.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configPos1 = file.readAInt();
        this.configPos2 = file.readAInt();
    },

    onStart: function (flag) {
        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(this.newBuffer);                    // completed
        } else {
            var x, y, w, h, i, j, w2, h2;
            var width, height;

            width = this.newBufferWidth / this.configPos1;
            height = this.newBufferHeight / this.configPos2;
            w = this.newBufferWidth / this.configPos1;
            h = this.newBufferHeight / this.configPos2;

            for (i = 0; i < this.configPos1; i++) {
                for (j = 0; j < this.configPos2; j++) {
                    x = (i * width);
                    y = (j * height);

                    w2 = w * elapsedTime / this.duration;
                    h2 = h * elapsedTime / this.duration;
                    this.stretch(this.newBuffer, x + (w - w2) / 2, y + (h - h2) / 2, w2, h2, x + (w - w2) / 2, y + (h - h2) / 2, w2, h2);
                }
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransCell);