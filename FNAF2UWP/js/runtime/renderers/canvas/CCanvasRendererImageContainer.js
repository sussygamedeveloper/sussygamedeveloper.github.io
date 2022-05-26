// CCanvasRendererImageContainer object
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

function CCanvasRendererImageContainer(renderer, source, width, height) {
    //call chain
    CRendererImageContainer.call(this, renderer, source, width, height);

    //call self
    this.source = null;

    //do the update
    this.update(source || null, width || 0, height || 0);
}

CCanvasRendererImageContainer.prototype = {
    //api
    free: function () {
        //null some bits
        this.image = null;

        //call chain
        CRendererImageContainer.prototype.free.call(this);
    },

    update: function (source, width, height) {
        //default behaviour is to just copy teh details provided
        this.source = source;
        this.width = width;
        this.height = height;
    },

    draw: function (context, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, boundingCache) {
        //let the renderer do the work
        if (this.width > 0 && this.height > 0) {
            context.renderImage(this.source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, boundingCache);
        }
    },

    drawSimple: function (context, x, y, inkEffect, inkEffectParam, boundingCache) {
        //let the renderer do the work
        if (this.width > 0 && this.height > 0) {
            context.renderSimpleImage(this.source, x, y, this.width, this.height, inkEffect, inkEffectParam, boundingCache);
        }
    },

    drawRect: function (context, x, y, width, height, inkEffect, inkEffectParam, boundingCache) {
        //let the renderer do the work
        if (this.width > 0 && this.height > 0) {
            context.renderSimpleImage(this.source, x, y, width, height, inkEffect, inkEffectParam, boundingCache);
        }
    },

    getImage: function () {
        this.source;
    },
};

//setup inheritance using extend
CServices.extend(CRendererImageContainer, CCanvasRendererImageContainer);