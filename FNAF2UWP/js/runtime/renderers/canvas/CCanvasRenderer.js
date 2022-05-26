// CCanvasRenderer object
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

function CCanvasRenderer(element) {
    //call chain
    CRenderer.call(this, element);

    //call self
    this.canvas = element;
    this.oldEffect = -1;
    this.smoothing = false;
    this.oldSmoothing = false;
    this.stashGlobalAlpha = null;
    this.stashGlobalCompositeOperation = null;
    this.dxw = 0.0;               // sub-pixel margin size for destination rectangle
    this.dyw = 0.0;               // sub-pixel margin size for destination rectangle
    this.matrix = new Matrix2D();


    if (!(this._context = element.getContext('2d'))) {
        throw new Error("Failed to init canvas renderer");
    }
};

CCanvasRenderer.prototype = {
    //events
    onResize: function () {
        this._context.scale(this.scaleX, this.scaleY);
    },

    onStart: function () {
        //save ZERO render state
        this._context.save();
    },

    onFinish: function () {
        //restore render state to ZERO
        this._context.restore();
    },

    onClip: function (x, y, width, height) {
        //let the renderer enable clip
        var context = this._context;

        //reset clip
        if (x == null) {
            x = 0;
            y = 0;
        }

        if (width == null || width == -1) {
            width = this.width;
            height = this.height;
        }

        //reset transform matrix temporarily so we are in screen space
        context.setTransform(1, 0, 0, 1, 0, 0);

        //apply clip
        context.beginPath();
        context.rect(x, y, width, height);
        context.clip();

        //restore transform matrix
        this._applyMatrix();
    },

    //internal
    _calculateGradient: function (x, y, w, h, vertical, color1, color2) {
        var gradient = vertical ? this._context.createLinearGradient(x, y, x, y + h) : this._context.createLinearGradient(x, y, x + w, y);

        gradient.addColorStop(0, CServices.getColorString(color1));
        gradient.addColorStop(1, CServices.getColorString(color2));

        this._context.fillStyle = gradient;
    },

    _sourceToImage: function (source) {
        if (source instanceof CCanvasRendererImageBuffer) {
            //render buffer
            return source.getImage();

        } else if (source instanceof CImage) {
            //CImage
            if (source.mosaicId == 0) {
                //whole image
                return source.img;
            } else {
                //atlas image
                return source.app.imageBank.mosaics[source.mosaicId].image.img;
            }

        } else {
            //everything else (eg <img> or <canvas>)
            return source;
        }
    },

    _renderSource: function (source, destinationX, destinationY, angle, scaleX, scaleY, inkEffect, inkEffectParam, sourceX, sourceY, sourceWidth, sourceHeight, destinationWidth, destinationHeight, boundingCache) {
        //generic drawImage handler for other draw operations

        //what are we rendering?
        var image = this._sourceToImage(source);
        if (image == null || image.width == 0.0 || image.height == 0.0) {
            return;
        }

        //setup vars
        var isFusionImage = source instanceof CImage;
        var xSpot = 0.0;
        var ySpot = 0.0;

        //check for special fusion image cases
        if (isFusionImage) {
            //adjust source position for mosaic
            if (source.mosaicId > 0) {
                sourceX = source.mosaicX + sourceX;
                sourceY = source.mosaicY + sourceY;
            }

            //spot
            xSpot = source.xSpot;
            ySpot = source.ySpot;
        }

        //do we have anything to draw? (also check clip)
        if (scaleX == 0.0 || scaleY == 0.0 || sourceWidth <= 0 || sourceHeight <= 0 || destinationWidth <= 0 || destinationHeight <= 0 || !this.withinClip(destinationX, destinationY, destinationWidth, destinationHeight, xSpot, ySpot, angle, scaleX, scaleY, boundingCache)) {
            return;
        }

        //get details
        var context = this._context;

        //setup renderer
        this.setInkEffect(inkEffect, inkEffectParam);

        //do we have any matrix operations?
        if (angle == 0.0 && scaleX == 1.0 && scaleY == 1.0) {
            //no matrix, simple draw!
            context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX - xSpot, destinationY - ySpot, destinationWidth, destinationHeight);

        } else {
            //matrix RELOADED (yes)

            //save matrix state
            this.pushMatrix();

            //translate
            this.translateMatrix(destinationX, destinationY);

            //rotate
            if (angle != 0.0) {
                this.rotateMatrix(-angle * ToRadians);
            }

            //scale
            if (scaleX != 1.0 || scaleY != 1.0) {
                this.scaleMatrix(Math.max(0.001, scaleX), Math.max(0.001, scaleY));
            }

            //hotspot translate
            if (xSpot != 0.0 || ySpot != 0.0) {
                this.translateMatrix(-xSpot, -ySpot);
            }

            //draw it
            context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, destinationWidth, destinationHeight);

            //restore matrix state
            this.popMatrix();
        }
    },

    _applyMatrix: function () {
        var matrix = this.matrix.matrix;
        this._context.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    },

    //render api
    clearBackground: function (x, y, width, height, color) {
        var context = this._context;

        if (color === undefined) {
            //no color (alpha)
            context.clearRect(x, y, width, height);
        } else {
            //use color
            context.fillStyle = CServices.getColorString(color);
            context.fillRect(x, y, width, height);
        }
    },

    //render image api
    renderImage: function (source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, boundingCache) {
        //pass it off to the internal function for handling
        return this._renderSource(source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, 0, 0, source.width, source.height, source.width, source.height, boundingCache);
    },

    renderSimpleImage: function (source, x, y, width, height, inkEffect, inkEffectParam, boundingCache) {
        //fix missing values (that are required)
        if (width == null || height == null) {
            width = source.width;
            height = source.height;
        }

        //pass it off to the internal function for handling
        return this._renderSource(source, x, y, 0.0, 1.0, 1.0, inkEffect, inkEffectParam, 0, 0, source.width, source.height, width, height, boundingCache);

        // Not sure if we should add sub-pixel margin to this routine as it's not used by backdrops
        // Do it later if necessary only
        //this._context.drawImage(image, x, y, width + this.dxw, height + this.dyw);
    },

    renderSubImage: function (source, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height, inkEffect, inkEffectParam) {
        //pass it off to the internal function for handling
        return this._renderSource(source, x, y, 0.0, 1.0, 1.0, inkEffect, inkEffectParam, sourceX, sourceY, sourceWidth, sourceHeight, width, height, null);
    },

    renderImageWithSubPixelCorrection: function (source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, boundingCache) {
        //pass it off to the internal function for handling (but add the dxw and dyw values to destination size)
        return this._renderSource(source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, 0, 0, source.width, source.height, source.width + this.dxw, source.height + this.dyw, boundingCache);
    },

    //render filled shape api
    renderFilledRect: function (x, y, w, h, color, inkEffect, inkEffectParam) {
        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        context.fillStyle = CServices.getColorString(color);
        context.fillRect(x, y, w, h);
    },

    renderRotatedRect: function (x, y, width, height, centerX, centerY, angle, scaleX, scaleY, color, inkEffect, inkEffectParam, boundingCache) {
        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        context.fillStyle = CServices.getColorString(color);

        //do we have any matrix operations?
        if (angle == 0.0 && scaleX == 1.0 && scaleY == 1.0) {
            //no matrix, simple draw!
            context.fillRect(x - centerX, y - centerY, width, height);

        } else {
            //matrix RELOADED (yes)

            //save matrix state
            this.pushMatrix();

            //translate
            this.translateMatrix(x, y);

            //rotate
            if (angle != 0.0) {
                this.rotateMatrix(-angle * ToRadians);
            }

            //scale
            if (scaleX != 1.0 || scaleY != 1.0) {
                this.scaleMatrix(Math.max(0.001, scaleX), Math.max(0.001, scaleY));
            }

            //hotspot translate
            if (centerX != 0.0 || centerY != 0.0) {
                this.translateMatrix(-centerX, -centerY);
            }

            //draw it
            context.fillRect(0, 0, width, height);

            //restore matrix state
            this.popMatrix();
        }
    },

    renderFilledEllipse: function (x, y, w, h, color, inkEffect, inkEffectParam) {
        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        context.fillStyle = CServices.getColorString(color);

        CServices.createEllipse(context, x, y, w, h);
        context.fill();
    },

    renderFilledTriangle: function (x1, y1, x2, y2, x3, y3, color, inkEffect, inkEffectParam) {
        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        context.fillStyle = CServices.getColorString(color);

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.closePath();
        context.fill();
    },

    //render outline shape api
    renderLine: function (xA, yA, xB, yB, color, thickness, inkEffect, inkEffectParam) {
        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        context.strokeStyle = CServices.getColorString(color);
        context.lineCap = 'round';
        context.lineWidth = thickness;

        context.beginPath();
        context.moveTo(xA, yA);
        context.lineTo(xB, yB);
        context.closePath();

        context.stroke();
    },

    renderOutlineRect: function (x, y, w, h, color, thickness, inkEffect, inkEffectParam) {
        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        context.strokeStyle = CServices.getColorString(color);
        context.lineWidth = thickness;
        context.strokeRect(x, y, w, h);
    },

    renderOutlineEllipse: function (x, y, w, h, thickness, color, inkEffect, inkEffectParam) {
        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);
        context.lineWidth = thickness;
        context.strokeStyle = CServices.getColorString(color);

        CServices.createEllipse(context, x, y, w, h);
        this._context.stroke();
    },

    //render gradient shape api
    renderGradientRect: function (x, y, w, h, color1, color2, vertical, inkEffect, inkEffectParam) {
        if (color1 == color2) {
            return this.renderFilledRect(x, y, w, h, color1, inkEffect, inkEffectParam);
        }

        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        this._calculateGradient(x, y, w, h, vertical, color1, color2);

        context.fillRect(x, y, w, h);
    },

    renderGradientEllipse: function (x, y, w, h, color1, color2, vertical, inkEffect, inkEffectParam) {
        if (color1 == color2) {
            return this.renderFilledEllipse(x, y, w, h, color1, inkEffect, inkEffectParam);
        }

        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        this._calculateGradient(x, y, w, h, vertical, color1, color2);

        CServices.createEllipse(context, x, y, w, h);
        this._context.fill();
    },

    //render pattern shape api
    renderPatternRect: function (image, x, y, width, height, inkEffect, inkEffectParam) {
        var context = this._context;

        //get the image details
        var renderImage = null;
        var renderImageX = 0;
        var renderImageY = 0;
        if (image.mosaicId == 0) {
            if (image.img != null) {
                renderImage = image.img;
            }
        } else {
            renderImage = image.app.imageBank.mosaics[image.mosaicId].image.img
            renderImageX = image.mosaicX;
            renderImageY = image.mosaicY;
        }

        //skip if no renderable image
        if (renderImage == null) {
            return;
        }

        //setup render
        this.setInkEffect(inkEffect, inkEffectParam);
        this.pushClip();
        this.addClip(x-this.worldX, y-this.worldY, width, height, false);

        //precalc values so we are not doing it in the for loops
        var imageWidth = image.width;
        var imageHeight = image.height;

        var renderStepX, renderStepY;
        var renderStepTotalX = Math.floor(width / imageWidth) + 1;
        var renderStepTotalY = Math.floor(height / imageHeight) + 1;

        var renderX;
        var renderY;
        var renderWidth = imageWidth + this.dxw;
        var renderHeight = imageHeight + this.dyw;

        //render time!
        for (renderStepY = 0; renderStepY < renderStepTotalY; renderStepY++) {
            renderX = x;
            renderY = y + renderStepY * imageHeight;
            for (renderStepX = 0; renderStepX < renderStepTotalX; renderStepX++) {
                context.drawImage(renderImage, renderImageX, renderImageY, imageWidth, imageHeight, renderX, renderY, renderWidth, renderHeight);
                renderX += imageWidth;
            }
        }

        //restore
        this.popClip();
    },

    renderPatternEllipse: function (image, x, y, w, h, inkEffect, inkEffectParam) {
        if (!(image instanceof CImage)) {
            throw new Error("renderPatternEllipse: bad image type: " + (typeof image));
        }

        var context = this._context;

        this.setInkEffect(inkEffect, inkEffectParam);

        if (image.mosaicId == 0) {
            if (image.img != null) {
                context.fillStyle = context.createPattern(image.img, 'repeat');
            }
        }
        else {
            if (!image.pattern) {
                image.pattern = document.createElement("canvas");
                image.pattern.width = image.width;
                image.pattern.height = image.height;
                var context = image.pattern.getContext("2d");
                context.drawImage(image.app.imageBank.mosaics[image.mosaicId].image.img,
                    image.mosaicX, image.mosaicY,
                    image.width, image.height, 0, 0,
                    image.width, image.height);
            }
            context.fillStyle = context.createPattern(image.pattern, 'repeat');
        }
        CServices.createEllipse(context, x, y, w, h);
        this._context.fill();
    },

    //clip api
    pushClip: function () {
        CRenderer.prototype.pushClip.call(this);
        this._context.save();
    },

    popClip: function () {
        CRenderer.prototype.popClip.call(this);
        this._context.restore();
    },

    //matrix api
    pushMatrix: function () {
        this.matrix.push();
    },

    popMatrix: function () {
        this.matrix.pop();
        this._applyMatrix();
    },

    translateMatrix: function (x, y) {
        if (x != 0.0 || y != 0.0) {
            this.matrix.translate(x, y);
            this._applyMatrix();
        }
    },

    rotateMatrix: function (angle) {
        if (angle != 0.0) {
            this.matrix.rotate(angle);
            this._applyMatrix();
        }
    },

    scaleMatrix: function (x, y) {
        if (x != 1.0 || y != 1.0) {
            this.matrix.scale(x, y);
            this._applyMatrix();
        }
    },

    //state api
    setInkEffect: function (effect, effectParam) {
        var context = this._context;

        //check to see if we have provided null (no) ffect
        if (effect == null) {
            effect = CRSpr.BOP_BLEND;
            effectParam = 0;
        }

        //check to see if the effect hasnt changed
        if (effect == this.oldEffect && effectParam == this.oldEffectParam) {
            return;
        }
        this.oldEffect = effect;
        this.oldEffectParam = effectParam;

        //get masked effect
        var effectMasked = effect & CRSpr.BOP_MASK;

        //apply smoothing?
        var smoothing = ((effect & CRSpr.BOP_SMOOTHING) != 0) | this.smoothing;
        if (smoothing != this.oldSmoothing) {
            this.oldSmoothing = smoothing;
            context["imageSmoothingEnabled"] = smoothing;
            context["webkitImageSmoothingEnabled"] = smoothing;
            context["mozImageSmoothingEnabled"] = smoothing;
            context["msImageSmoothingEnabled"] = smoothing;
        }

        //calculate the alpha blend value
        var newAlpha;
        if ((effect & CRSpr.BOP_RGBAFILTER) != 0) {
            newAlpha = (((effectParam >>> 24) & 0xFF) / 255.0);
        } else if (effectMasked == CRSpr.BOP_BLEND) {
            newAlpha = ((128 - effectParam) / 128.0);
        } else {
            newAlpha = 1.0;
        }
        this.setAlpha(newAlpha);

        //calculate the composite mode (TODO: does this need to be webgl?)
        switch (effectMasked) {
            case CRSpr.BOP_ADD:
                context.globalCompositeOperation = 'lighter';
                break;
            case CRSpr.BOP_XOR:
                context.globalCompositeOperation = "xor";
                break;
            default:
                context.globalCompositeOperation = "source-over";
                break;
        }
    },

    resetEffect: function (smooth) {
        var context = this._context;

        //reset alpha
        this.setAlpha(1.0);

        //reset smoothing
        this.smoothing = smooth;
        this.oldSmoothing = smooth;
        context["imageSmoothingEnabled"] = smooth;
        context["webkitImageSmoothingEnabled"] = smooth;
        context["mozImageSmoothingEnabled"] = smooth;
        context["msImageSmoothingEnabled"] = smooth;

        //reset effect
        this.oldEffect = -1;
        this.setInkEffect(0, 0);
    },

    setScale: function (scaleX, scaleY) {
        //call chain
        CRenderer.prototype.setScale.call(this, scaleX, scaleY);

        //call self
        this._context.scale(scaleX, scaleY);
    },

    setAlpha: function (alpha) {
        //set global alpha
        if (alpha != this.globalAlpha) {
            //save in renderer
            this.globalAlpha = alpha;

            //apply to the render context
            this._context.globalAlpha = alpha;
        }
    },

    //buffer api
    createImageBuffer: function (width, height, renderTarget) {
        //return image buffer in correct context
        return new CCanvasRendererImageBuffer(this, width, height, renderTarget);
    },

    createTextContainer: function (app) {
        return new CCanvasRendererTextContainer(app);
    },

    //CImage api
    updateImage: function (image, source, enforce, sourceWidth, sourceHeight) {
        //changes an existing CImage by applying new image data from the source

        //can only update non mosaic images (apparently...)
        if (image.mosaicId == 0) {
            image.width = sourceWidth == null?source.width:sourceWidth;
            image.height = sourceHeight == null ? source.height : sourceHeight;
            image.img = source;
        }
    },
};

//setup inheritance using extend
CServices.extend(CRenderer, CCanvasRenderer);