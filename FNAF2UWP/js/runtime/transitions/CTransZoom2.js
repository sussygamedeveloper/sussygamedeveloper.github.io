// CTransZoom2 object
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

function CTransZoom2() {
    //call chain
    CTrans.call(this);

    //call self
    this.configPos1 = 0;
}

CTransZoom2.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configPos1 = file.readAInt();
    },

    onStart: function (flag) {
        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        var drawBuffer;
        if ((flag & CTrans.TRFLAG_FADEIN) != 0) {
            drawBuffer = this.newBuffer;
        } else {
            drawBuffer = this.oldBuffer;
        }

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(drawBuffer);        // completed
        } else {
            var x, y, w, h;

            if (this.configPos1 == 0) {
                w = this.newBufferWidth * elapsedTime / this.duration;
                h = this.newBufferHeight * elapsedTime / this.duration;
                x = this.newBufferWidth / 2 - w / 2;
                y = this.newBufferHeight / 2 - h / 2;

                this.stretch(drawBuffer, 0, 0, this.newBufferWidth, this.newBufferHeight, x, y, w, h);
            }
            else {
                w = this.newBufferWidth * elapsedTime / this.duration;
                w = this.newBufferWidth - w;
                h = this.newBufferHeight * elapsedTime / this.duration;
                h = this.newBufferHeight - h;
                x = this.newBufferWidth / 2 - w / 2;
                y = this.newBufferHeight / 2 - h / 2;

                this.stretch(drawBuffer, 0, 0, this.newBufferWidth, this.newBufferHeight, x, y, w, h);
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransZoom2);