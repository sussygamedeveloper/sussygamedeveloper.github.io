// CTransPush object
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

function CTransPush() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
    this.refresh = 0;
}

CTransPush.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
    },

    onStart: function (flag) {
        this.refresh = false;

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var elapsedTime = this.getDeltaTime();

        var percentage = elapsedTime / this.duration;
        if (percentage > 1.0) {
            this.blit(this.newBuffer);
        } else {
            var x, y, w, h;

            // First Scrolling
            if (percentage <= 0.5) {
                switch (this.configStyle) {
                    case 0:
                        w = this.newBufferWidth * elapsedTime / this.duration * 2;
                        h = this.newBufferHeight / 2;
                        x = this.newBufferWidth - w;
                        y = this.newBufferHeight / 2;
                        this.blit(this.newBuffer, 0, 0, x, y, w, h);
                        break;
                    case 1:
                        w = this.newBufferWidth * elapsedTime / this.duration * 2;
                        h = this.newBufferHeight / 2;
                        x = this.newBufferWidth - w;
                        y = this.newBufferHeight / 2;
                        this.blit(this.newBuffer, x, 0, 0, y, w, h);
                        break;
                    case 2:
                        w = this.newBufferWidth * elapsedTime / this.duration * 2;
                        h = this.newBufferHeight / 2;
                        x = this.newBufferWidth - w;
                        y = this.newBufferHeight / 2;
                        this.blit(this.newBuffer, 0, y, x, 0, w, h);
                        break;
                    case 3:
                        w = this.newBufferWidth * elapsedTime / this.duration * 2;
                        h = this.newBufferHeight / 2;
                        x = this.newBufferWidth - w;
                        y = this.newBufferHeight / 2;
                        this.blit(this.newBuffer, x, y, 0, 0, w, h);
                        break;
                }
            }

            // Second Scrolling
            if (percentage > 0.5) {
                if (this.refresh == false) {
                    if (this.configStyle <= 1) {
                        this.blit(this.newBuffer, 0, 0, 0, this.newBufferHeight / 2, this.newBufferWidth, this.newBufferHeight / 2);
                    } else {
                        this.blit(this.newBuffer, 0, this.newBufferHeight / 2, 0, 0, this.newBufferWidth, this.newBufferHeight / 2);
                    }
                    this.refresh = true;
                }

                percentage = elapsedTime - this.duration / 2.0;
                percentage /= this.duration / 2.0;
                percentage *= 1000;
                h = this.newBufferHeight / 2 * percentage / 1000; // Math.floor()?

                switch (this.configStyle) {
                    case 0:
                    case 1:
                        this.stretch(this.newBuffer, 0, h, this.newBufferWidth, this.newBufferHeight / 2, 0, this.newBufferHeight / 2, this.newBufferWidth, this.newBufferHeight / 2);
                        this.stretch(this.newBuffer, 0, 0, this.newBufferWidth, h, 0, this.newBufferHeight / 2 - h, this.newBufferWidth, h);
                        break;
                    case 2:
                    case 3:
                        this.stretch(this.newBuffer, 0, this.newBufferHeight / 2 - h, this.newBufferWidth, this.newBufferHeight / 2, 0, 0, this.newBufferWidth, this.newBufferHeight / 2);
                        this.stretch(this.newBuffer, 0, this.newBufferHeight - h, this.newBufferWidth, h, 0, this.newBufferHeight / 2, this.newBufferWidth, h);
                        break;
                }
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransPush);