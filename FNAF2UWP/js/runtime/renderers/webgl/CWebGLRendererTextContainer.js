// CWebGLRendererTextContainer object
// ----------------------------------------------------------
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

function CWebGLRendererTextContainer(renderer) {
    //call chain
    CRendererTextContainer.call(this, renderer);

    this.container = null;
}

CWebGLRendererTextContainer.prototype = {
    //constructor/destructor
    free: function () {
        //call self
        if (this.container != null) {
            this.container.free();
            this.container = null;
        }

        //call chain
        CRendererTextContainer.prototype.free.call(this);
    },

    //events
    onUpdate: function () {
        //we need to update a texture with the data in the internal canvas
        if (this.buffer && (this.bufferGraphicFont || !this.font.isGraphic)) {
            //we need a container
            if (this.container == null) {
                //create container
                this.container = new CWebGLRendererImageContainer(this.app.renderer, this.canvas, this.width, this.height);
            } else {
                //update container
                this.container.update(this.canvas, this.width, this.height);
            }
        }
    },

    onRenderBuffer: function (context, x, y, inkEffect, inkEffectParam, boundingCache) {
        //render the buffer
        this.container.drawSimple(context, x, y, inkEffect, inkEffectParam, boundingCache);
    },
};

//setup inheritance using extend
CServices.extend(CRendererTextContainer, CWebGLRendererTextContainer);