// CTransStretch object
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

function CTransStretch() {
    //call chain
    CTrans.call(this);

    //call self
    this.configStyle = 0;
}

CTransStretch.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configStyle = file.readAInt();
    },

    onstart: function (flag) {
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
            this.blit(drawBuffer);                    // completed
        } else {
            var w, h;

            switch (this.configStyle) {
                // Top Left
                case 0:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.stretch(drawBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    break;
                // Top Right
                case 1:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.stretch(drawBuffer, this.newBufferWidth - w, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    break;
                // Bottom Left
                case 2:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.stretch(drawBuffer, 0, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    break;
                // Bottom Right
                case 3:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.stretch(drawBuffer, this.newBufferWidth - w, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    break;
                // 4 corners
                case 4:
                    // Top Left
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    if (h < 5) {
                        h = 5;
                    }
                    this.stretch(drawBuffer, 0, 0, w, h, 0, 0, this.oldBuffer.width / 2, this.oldBuffer.height / 2);
                    // Top Right
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    if (h < 5) {
                        h = 5;
                    }
                    this.stretch(drawBuffer, this.newBufferWidth - w, 0, w, h, this.newBufferWidth / 2, 0, this.newBufferWidth / 2, this.newBufferHeight / 2);
                    // Bottom Left
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.stretch(drawBuffer, 0, this.newBufferHeight - h, w, h, 0, this.newBufferHeight / 2, this.newBufferWidth / 2, this.newBufferHeight / 2);
                    // Bottom Right
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.stretch(drawBuffer, this.newBufferWidth - w, this.newBufferHeight - h, w, h, this.newBufferWidth / 2, this.newBufferHeight / 2, this.newBufferWidth / 2, this.newBufferHeight / 2);
                    break;
                // Center
                case 5:
                    // Top Left
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    if (h < 5) {
                        h = 5;
                    }
                    this.stretch(drawBuffer, this.newBufferWidth / 2 - w, this.newBufferHeight / 2 - h, w, h, 0, 0, this.oldBuffer.width / 2, this.oldBuffer.height / 2);
                    // Top Right
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    if (h < 5) {
                        h = 5;
                    }
                    this.stretch(drawBuffer, this.newBufferWidth / 2, this.newBufferHeight / 2 - h, w, h, this.newBufferWidth / 2, 0, this.newBufferWidth / 2, this.newBufferHeight / 2);
                    // Bottom Left
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.stretch(drawBuffer, this.newBufferWidth / 2 - w, this.newBufferHeight / 2, w, h, 0, this.newBufferHeight / 2, this.newBufferWidth / 2, this.newBufferHeight / 2);
                    // Bottom Right
                    w = this.newBufferWidth / 2 * elapsedTime / this.duration;
                    h = this.newBufferHeight / 2 * elapsedTime / this.duration;
                    this.stretch(drawBuffer, this.newBufferWidth / 2, this.newBufferHeight / 2, w, h, this.newBufferWidth / 2, this.newBufferHeight / 2, this.newBufferWidth / 2, this.newBufferHeight / 2);
                    break;
                // Top Middle
                case 6:
                    w = this.newBufferWidth;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.stretch(drawBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    break;
                // Middle Left
                case 7:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    h = this.newBufferHeight;
                    this.stretch(drawBuffer, 0, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    break;
                // Middle Right
                case 8:
                    w = this.newBufferWidth * elapsedTime / this.duration;
                    h = this.newBufferHeight;
                    this.stretch(drawBuffer, this.newBufferWidth - w, 0, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    break;
                // Bottom Middle
                case 9:
                    w = this.newBufferWidth;
                    h = this.newBufferHeight * elapsedTime / this.duration;
                    this.stretch(drawBuffer, 0, this.newBufferHeight - h, w, h, 0, 0, this.newBufferWidth, this.newBufferHeight);
                    break;
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransStretch);