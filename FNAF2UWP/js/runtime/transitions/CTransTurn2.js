// CTransTurn2 object
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

function CTransTurn2() {
    //call chain
    CTrans.call(this);

    //call self
    this.configPos1 = 0;
    this.configCheck1 = 0;
    this.currentCircle = 0;
}

CTransTurn2.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configPos1 = file.readAInt();
        this.configCheck1 = file.readAInt();
    },

    onStart: function (flag) {
        this.currentCircle = 0;
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if ((elapsedTime / this.duration) > 1.0) {
            this.blit(this.newBuffer);                // completed
        } else {
            var x, y, xcenter, ycenter, dist;
            var angle = 0.0;

            xcenter = this.newBufferWidth / 2;
            ycenter = this.newBufferHeight / 2;

            angle = this.configPos1 * 6.28318 * elapsedTime / this.duration;
            angle -= this.currentCircle * 6.28318;
            if (this.configCheck1 == 1) {
                angle = 6.28318 - angle;
            }

            dist = this.newBufferWidth * elapsedTime / this.duration;
            x = Math.floor(xcenter + Math.cos(angle) * dist);
            y = Math.floor(ycenter + Math.sin(angle) * dist);

            this.blit(this.newBuffer);
            this.blit(this.oldBuffer, x - this.newBufferWidth / 2, y - this.newBufferHeight / 2, 0, 0, this.newBufferWidth, this.newBufferHeight);

            if (this.configCheck1 == 0) {
                if (angle >= 6.28318) {
                    this.currentCircle++;
                }
            }
            else {
                if (angle <= 0) {
                    this.currentCircle++;
                }
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransTurn2);