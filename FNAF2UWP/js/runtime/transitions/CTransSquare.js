// CTransSquare object
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

function CTransSquare() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
    this.configPos1 = 0;
    this.configStretch = 0;
}

CTransSquare.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
        this.configPos1 = file.readAInt();
        this.configStretch = file.readAInt();
    },

    onStart: function (flag) {
        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        if (elapsedTime / this.duration > 1.0) {
            this.blit(this.newBuffer);                                                    // completed
        } else {
            var x, y, w, h;
            var width, height;

            // Inside Square
            /////////////////

            width = this.newBufferWidth * this.configPos1 / 100;
            height = this.newBufferHeight * this.configPos1 / 100;

            w = width * elapsedTime / this.duration;
            h = height * elapsedTime / this.duration;
            x = this.newBufferWidth / 2 - w / 2;
            y = this.newBufferHeight / 2 - h / 2;

            // No Stretch
            if (this.configStretch == 0) {
                this.blit(this.newBuffer, x, y, x, y, w, h);
            } else {
                this.stretch(this.newBuffer, x, y, w, h, this.newBufferWidth / 2 - width / 2, this.newBufferHeight / 2 - height / 2, width, height);
            }

            // Outside Square
            //////////////////

            var pos = 100 - this.configPos1;
            width = this.newBufferWidth * pos / 100;
            height = this.newBufferHeight * pos / 100;

            w = width / 2 * elapsedTime / this.duration;
            h = height / 2 * elapsedTime / this.duration;
            this.blit(this.newBuffer, 0, 0, 0, 0, this.newBufferWidth, h);                                    // Up To Down
            this.blit(this.newBuffer, 0, 0, 0, 0, w, this.newBufferHeight);                                    // Left to Right
            this.blit(this.newBuffer, 0, this.newBufferHeight - h, 0, this.newBufferHeight - h, this.newBufferWidth, h);    // Down To Up
            this.blit(this.newBuffer, this.newBufferWidth - w, 0, this.newBufferWidth - w, 0, w, this.newBufferHeight);    // Right To Left
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransSquare);