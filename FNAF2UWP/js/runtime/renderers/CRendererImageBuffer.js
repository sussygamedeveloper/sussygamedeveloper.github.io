// CRendererImageBuffer object
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

function CRendererImageBuffer(renderer, width, height, renderTarget) {
    this.width = width;
    this.height = height;
    this.rendering = 0;
    this.renderer = renderer != null ? renderer : null;
    this.renderTarget = renderTarget == null ? true : renderTarget;
    this.refCount = 1;
}

CRendererImageBuffer.prototype = {
    //events
    onPrepareTexture: function () {
    },
    onFree: function () {
    },
    onStart: function () {
    },
    onFinish: function () {
    },

    //internal

    //api
    free: function () {
        //only free if the ref count is the last one
        if (this.refCount == 1) {
            //finish rendering first
            if (this.rendering) {
                this.finish();
            }

            this.onFree();

            if (this.renderer != null) {
                this.renderer = null;
            }
        } else {
            //reduce ref count
            this.refCount--;
        }
    },

    use: function () {
        //increase ref count of teh buffer
        this.refCount++;

        //return self for chaining
        return this;
    },

    start: function () {
        //we can nest rendering calls but the start/finish actions will only happen on teh first or last call
        if (this.rendering == 0) {
            //resize the renderer (remember old size so we can restore it)
            this.renderer.pushSize();
            this.renderer.resize(this.width, this.height);

            this.renderer.start();
            this.onStart();
        }
        this.rendering++;
    },

    finish: function () {

        if (this.rendering == 1) {
            this.renderer.finish();
            this.onFinish();

            //restore renderer size
            this.renderer.popSize();
        }
        this.rendering--;
    },

    clear: function (color) {

        if (color == null) {
            this.renderer.clearBackground(0, 0, this.width, this.height);
        } else {
            this.renderer.renderFilledRect(0, 0, this.width, this.height, color);
        }
    },

    resize: function (width, height) {
        //make sure not rendering


        //dont bother resizing if its teh same size
        if (width != this.width || height != this.height) {
            this.width = width;
            this.height = height;
        }
    },

    setAlpha: function (alpha) {
        //set global alpha blend in renderer
        this.renderer.setAlpha(alpha);
    },

    getImage: function () {
        //return drawable
    },

    getData: function () {
        //get the current data from the buffer
    },

    drawRect: function (x, y, width, height, color, inkEffect, inkEffectParam) {

        color = color || CServices.RGBFlash(0, 0, 0);

        this.renderer.renderFilledRect(x, y, width, height, color, inkEffect, inkEffectParam);
    },

    drawSceneNode: function (sprite, x, y, ignoreRoot) {

        if (ignoreRoot) {
            var oldX = sprite.x;
            var oldY = sprite.y;
            var oldScaleX = sprite.scaleX;
            var oldScaleY = sprite.scaleY;
            sprite.x = 0;
            sprite.y = 0;
            sprite.scaleX = 1.0;
            sprite.scaleY = 1.0;

            sprite.draw(this.renderer, x, y);

            sprite.x = oldX;
            sprite.y = oldY;
            sprite.scaleX = oldScaleX;
            sprite.scaleY = oldScaleY;
        } else {
            sprite.draw(this.renderer, x, y);
        }
    },

    drawImage: function (source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam) {

        //defaults
        angle = angle || 0.0;
        scaleX = scaleX || 1.0;
        scaleY = scaleY || 1.0;

        //call for renderer to do the work
        this.renderer.renderImage(source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam);
    },

    drawSimpleImage: function (source, x, y, width, height, inkEffect, inkEffectParam) {

        //call for renderer to do the work
        this.renderer.renderSimpleImage(source, x, y, width, height, inkEffect, inkEffectParam);
    },

    drawSubImage: function (source, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height, inkEffect, inkEffectParam) {

        //call for renderer to do the work
        this.renderer.renderSubImage(source, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height, inkEffect, inkEffectParam);
    },

    upload: function (source) {
        //upload image data from various sources into the image buffer
    },

    captureGameCanvas: function (sourceX, sourceY, sourceWidth, sourceHeight) {
    },
};
