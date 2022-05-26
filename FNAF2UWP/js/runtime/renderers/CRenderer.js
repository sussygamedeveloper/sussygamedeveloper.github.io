// CRenderer object
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

ToDegrees = 57.295779513082320876798154814105;
ToRadians = 0.017453292519943295769236907684886;

//renderer base class
function CRenderer() {
    this.clipStack = new Array(32);
    this.clipStackPointer = 0;

    this.clipX = 0;
    this.clipY = 0;
    this.clipWidth = -1;
    this.clipHeight = -1;
    this.clipWorldX = 0.0;
    this.clipWorldY = 0.0;

    this.worldX = 0.0;
    this.worldY = 0.0;

    this.width = 0;
    this.height = 0;

    this.sizeStack = new Array(32);
    this.sizeStackPointer = 0;

    this.scaleX = 1.0;
    this.scaleY = 1.0;

    this.globalAlpha = 1.0;

    this._bounding = new Float32Array(4);
    this.boundingOffsetX = 0.0;
    this.boundingOffsetY = 0.0;
    this.boundingScaleX = 1.0;
    this.boundingScaleY = 1.0;

};

CRenderer.prototype = {
    //events
    onFree: function () {
    },

    onResize: function () {
    },

    onStart: function () {
    },

    onFinish: function () {
    },

    onClip: function (x, y, width, height) {
    },

    onImageLoaded: function (image) {
        //process a CImage being loaded
    },

    onFreeImage: function (image) {
    },

    onLoad:function(callback) {
        //default action is to just call teh callback
        callback.call();
    },

    //render api
    clearBackground: function (x, y, width, height, color) {
    },

    //render image api
    renderImage: function (source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, boundingCache) {
    },

    renderSimpleImage: function (source, x, y, w, h, inkEffect, inkEffectParam, boundingCache) {
    },

    renderSubImage: function (source, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height, inkEffect, inkEffectParam) {
    },

    renderImageWithSubPixelCorrection: function (source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, boundingCache) {
    },

    //render filled shape api
    renderFilledRect: function (x, y, w, h, color, inkEffect, inkEffectParam) {
    },

    renderRotatedRect: function (x, y, width, height, centerX, centerY, angle, scaleX, scaleY, color, inkEffect, inkEffectParam, boundingCache) {
    },

    renderFilledEllipse: function (x, y, w, h, color, inkEffect, inkEffectParam) {
    },

    renderFilledTriangle: function (x1, y1, x2, y2, x3, y3, color, inkEffect, inkEffectParam) {
    },

    renderFilledUpArrow: function(x,y,width,height,color,inkEffect, inkEffectParam) {
        this.renderFilledTriangle(x + (width / 2), y, x + width, y + height, x, y + height, color, inkEffect, inkEffectParam);
    },

    renderFilledDownArrow: function (x, y, width, height, color, inkEffect, inkEffectParam) {
        this.renderFilledTriangle(x + (width / 2), y + height, x, y, x + width, y, color, inkEffect, inkEffectParam);
    },

    renderFilledLeftArrow: function (x, y, width, height, color, inkEffect, inkEffectParam) {
        this.renderFilledTriangle(x, y + (height / 2), x + width, y, x + width, y + height, color, inkEffect, inkEffectParam);
    },

    renderFilledRightArrow: function (x, y, width, height, color, inkEffect, inkEffectParam) {
        this.renderFilledTriangle(x + width, y + (height / 2), x, y + height, x, y, color, inkEffect, inkEffectParam);
    },

    //render outline shape api
    renderLine: function (xA, yA, xB, yB, color, thickness, inkEffect, inkEffectParam) {
    },

    renderOutlineRect: function (x, y, w, h, color, thickness, inkEffect, inkEffectParam) {
        //draw an outline of a rect
    },

    renderOutlineEllipse: function (x, y, w, h, color, inkEffect, inkEffectParam) {
    },

    //render gradient shape api
    renderGradientRect: function (x, y, w, h, color1, color2, vertical, inkEffect, inkEffectParam) {
    },

    renderGradientEllipse: function (x, y, w, h, color1, color2, vertical, inkEffect, inkEffectParam) {
    },

    //render pattern shape api
    renderPatternRect: function (image, x, y, width, height, inkEffect, inkEffectParam) {
    },

    renderPatternEllipse: function (image, x, y, w, h, inkEffect, inkEffectParam) {
    },

    //clip api
    setClip: function (x, y, width, height, world) {
        //we can call clip with the world flag set, this indicates that the coordinates passed in are in world coordinates (eg they use the current frame position as well)
        if (world) {
            x -= this.worldX;
            y -= this.worldY;
        }

        //fix values
        if (x < 0) {
            width += x;
            x = 0;

            if (width < 0) {
                width = 0;
            }
        }

        if (y < 0) {
            height += y;
            y = 0;

            if (height < 0) {
                height = 0;
            }
        }

        if (x >= this.width) {
            x = 0;
            width = 0;
        }

        if (y >= this.height) {
            y = 0;
            height = 0;
        }

        //save clip
        this.clipX = x;
        this.clipY = y;
        this.clipWidth = width;
        this.clipHeight = height;

        //calculate clip world position
        this.clipWorldX = this.worldX + x;
        this.clipWorldY = this.worldY + y;

        //apply clip
        if (this.clipWidth > 0 && this.clipHeight > 0) {
            this.onClip(x, y, width, height);
        }
    },

    addClip: function (x, y, width, height, world) {
        //we can call clip with the world flag set, this indicates that the coordinates passed in are in world coordinates (eg they use the current frame position as well)
        if (world) {
            x -= this.worldX;
            y -= this.worldY;
        }

        //fix values
        if (x >= this.clipX + this.clipWidth) {
            width = 0;
        } else {
            if (x < this.clipX) {
                width += x;
                x = 0;

                if (width < 0) {
                    width = 0;
                }
            }

            if (x + width >= this.clipX + this.clipWidth) {
                width = this.clipX + this.clipWidth - x;
            }
        }

        if (y >= this.clipY + this.clipHeight) {
            height = 0;
        } else {
            if (y < this.clipY) {
                height += y;
                y = 0;

                if (height < 0) {
                    height = 0;
                }
            }

            if (y + height >= this.clipY + this.clipHeight) {
                height = this.clipY + this.clipHeight - y;
            }
        }

        //save clip
        this.clipX = x;
        this.clipY = y;
        this.clipWidth = width;
        this.clipHeight = height;

        //calculate clip world position
        this.clipWorldX = this.worldX + x;
        this.clipWorldY = this.worldY + y;

        //apply clip
        this.onClip(x, y, width, height);
    },

    pushClip: function () {
        //push the current clip onto the stack!
        var stack = this.clipStack;

        //add new clip and increase the internal pointer
        stack[this.clipStackPointer++] = this.clipX;
        stack[this.clipStackPointer++] = this.clipY;
        stack[this.clipStackPointer++] = this.clipWidth;
        stack[this.clipStackPointer++] = this.clipHeight;
    },

    popClip: function () {
        //remove the last clip from the stack and restore the one before it
        if (this.clipStackPointer > 0) {
            //move pointer
            this.clipStackPointer -= 4;

            //enable or disable
            if (this.clipStackPointer > 0) {
                //there is a clip on the stack
                var stack = this.clipStack;
                var pointer = this.clipStackPointer;

                //apply this clip
                this.setClip(stack[pointer], stack[pointer + 1], stack[pointer + 2], stack[pointer + 3], false);
            } else {
                //no more clips on teh stack
                this.setClip(0, 0, this.width, this.height, false);
            }
        }
    },

    isClipVisible:function() {
        return this.clipWidth > 0 && this.clipHeight > 0;
    },

    withinClip: function (x, y, width, height, centerX, centerY, angle, scaleX, scaleY, cache) {

        //calculate size of bounding (we really need to cache this!)
        var bounding;

        if (cache == null) {
            //we dont have a bounding cache so use the one built into the renderer
            if (angle == null || angle == 0.0 && scaleX == 1.0 && scaleY == 1.0) {
                //easy
                this._bounding[0] = -centerX;
                this._bounding[1] = -centerY;
                this._bounding[2] = width;
                this._bounding[3] = height;
            } else {
                //apply transformations
                CServices.calculateBounding(width, height, centerX, centerY, angle, scaleX, scaleY, this._bounding);
            }

            bounding = this._bounding;
        } else {
            //let the bounding cache do the hard work!
            bounding = cache.calculateBoundingCache(x, y, width, height, centerX, centerY, angle, scaleX, scaleY);
        }

        //get positioning of bounding and remember to apply the renderers bounding offset!
        x = x + bounding[0] + this.boundingOffsetX;
        y = y + bounding[1] + this.boundingOffsetY;

        //get dimensions of bounding
        width = bounding[2];
        height = bounding[3];

        var clipVirtualWidth = this.clipWidth / this.boundingScaleX;
        var clipVirtualHeight = this.clipHeight / this.boundingScaleY;

        return x + width >= this.clipWorldX && y + height >= this.clipWorldY && x < this.clipWorldX + clipVirtualWidth && y < this.clipWorldY + clipVirtualHeight;
    },

    //size api
    resize: function (width, height) {
        //has it changed?
        if (this.width != width || this.height != height) {
            //save new size
            this.width = width;
            this.height = height;

            //call internal event
            this.onResize();
        }
    },

    pushSize: function () {
        //push the current size onto the stack!
        var stack = this.sizeStack;

        //add new size and increase the internal pointer
        stack[this.sizeStackPointer++] = this.width;
        stack[this.sizeStackPointer++] = this.height;
    },

    popSize: function () {
        //remove last size from stack
        if (this.sizeStackPointer > 0) {
            //move pointer
            this.sizeStackPointer -= 2;

            //there is a size on the stack
            var stack = this.sizeStack;
            var pointer = this.sizeStackPointer;

            //apply this size
            this.resize(stack[pointer], stack[pointer + 1])
        }
    },

    //matrix api
    pushMatrix: function () {
    },

    popMatrix: function () {
    },

    translateMatrix: function (x, y) {
    },

    rotateMatrix: function (radians) {
    },

    scaleMatrix: function (x, y) {
    },

    //renderer api
    createImageContainer: function (source, width, height) {
        return new CRendererImageContainer(this, source, width, height);
    },

    //state api
    setWorldOffset: function(x, y) {
        //todo: convert anything that uses this to matrix based
        this.worldX = x;
        this.worldY = y;
    },

    setScale: function (scaleX, scaleY) {
        //save new scale
        this.scaleX = scaleX;
        this.scaleY = scaleY;

        //update sub pixel
        this.dxw = 0.0;
        this.dyw = 0.0;

        if (this.scaleX > 1.0) {
            // 1 pixel correction if zoom > 1.0
            this.dxw = 1.0;
        } else if (this.scaleX > 0.0 && this.scaleX < 1.0) {
            // 1/scale pixel correction if zoom < 1.0
            this.dxw = 1.0 / this.scaleX;
        }

        if (this.scaleY > 1.0) {
            this.dyw = 1.0;
        } else if (this.scaleY > 0.0 && this.scaleY < 1.0) {
            this.dyw = 1.0 / this.scaleY;
        }
    },

    setAlpha: function (alpha) {
        //this sets global alpha blend that is applied to all drawing operations thereafter. It is up to the renderer to apply the correct behaviour!
        this.globalAlpha = alpha;
    },

    //CImage API
    updateImage: function (image, source, enforce, sourceWidth, sourceHeight) {
        //changes an existing CImage by applying new image data from the source
    },

    //buffer api
    createImageBuffer: function (width, height, renderTarget) {
        //return image buffer in correct format
    },

    createTextContainer: function (app) {
        //return text buffer in correct format
    },

    //api
    free: function () {
        this.onFree();
    },

    start: function () {
        //let the target renderer do its thang
        this.onStart();
    },

    finish: function () {
        //let the target renderer do its thang
        this.onFinish();
    },
};
