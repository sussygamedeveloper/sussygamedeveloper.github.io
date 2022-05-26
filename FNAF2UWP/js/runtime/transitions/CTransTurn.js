// CTransTurn object
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

function CTransTurn() {
    //call chain
    CTrans.call(this);

    //call self
    this.configPos1 = 0;
    this.configCheck1 = 0;
    this.configCheck2 = 0;
    this.angle = 0;
}

CTransTurn.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configPos1 = file.readAInt();
        this.configCheck1 = file.readAInt();
        this.configCheck2 = file.readAInt();
    },

    onStart: function (flag) {
        this.angle = 0.0;
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(this.newBuffer);            // completed
        } else {
            var x, y, w, h;
            var dist, xcenter, ycenter;

            xcenter = this.newBufferWidth / 2;
            ycenter = this.newBufferHeight / 2;

            this.angle = this.configPos1 * 6.28318 * elapsedTime / this.duration;

            // Inverse ?
            if (this.configCheck2 == 1) {
                this.angle = 6.28318 - this.angle;
            }

            dist = this.newBufferWidth / 2 - this.newBufferWidth / 2 * elapsedTime / this.duration;
            x = Math.floor(xcenter + Math.cos(this.angle) * dist);
            y = Math.floor(ycenter + Math.sin(this.angle) * dist);

            w = this.newBufferWidth * elapsedTime / this.duration;
            h = this.newBufferHeight * elapsedTime / this.duration;

            this.pasteOld();

            // Full Image ?
            if (this.wCheck1 == 1) {
                this.stretch(this.newBuffer, x - w / 2, y - h / 2, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
            } else {
                this.stretch(this.newBuffer, x - w / 2, y - h / 2, w, h, this.newBufferWidth - w, this.newBufferHeight - h, w, h);
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransTurn);