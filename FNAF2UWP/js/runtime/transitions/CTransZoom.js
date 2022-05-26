// CTransZoom object
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

function CTransZoom() {
    //call chain
    CTrans.call(this);

    //call self
}

CTransZoom.prototype = {
    onStart: function (flag) {
        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        var sourceWidth = this.oldBuffer.width;
        var sourceHeight = this.oldBuffer.height;

        if (this.duration == 0) {
            //font need to do anything complicates
            this.blit(this.newBuffer);
        } else {
            //zoom
            var layer1, layer2;
            var width, height;
            var deltaTime = this.getDeltaTime();

            //what fade position?
            if ((flag & CTrans.TRFLAG_FADEOUT) != 0) {
                //fade out
                layer1 = this.newBuffer;
                layer2 = this.oldBuffer;
                width = Math.floor(sourceWidth - sourceWidth * deltaTime / this.duration);
                height = Math.floor(sourceHeight - sourceHeight * deltaTime / this.duration);
            } else {
                //fade in
                layer1 = this.oldBuffer;
                layer2 = this.newBuffer;
                width = Math.floor(sourceWidth * deltaTime / this.duration);
                height = Math.floor(sourceHeight * deltaTime / this.duration);
            }

            //background
            this.blit(layer1);

            //foreground
            this.stretch(layer2, (sourceWidth - width) / 2, (sourceHeight - height) / 2, width, height, 0, 0, sourceWidth, sourceHeight);
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransZoom);