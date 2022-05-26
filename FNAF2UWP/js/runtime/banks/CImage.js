// CImage object
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

//constants / globals
CImage.maxRotatedMasks = 10;

//functions
function CImage(app) {
    this.ready = true;
    this.success = true;

    this.app = app;
    this.appData = false;//signals that this is being loaded as part of appData
    this.handle = -1;
    this.loadSrc = null;
    this.width = 0;
    this.height = 0;
    this.xSpot = 0;
    this.ySpot = 0;
    this.xAP = 0;
    this.yAP = 0;
    this.useCount = 0;
    this.img = null;
    this.maskNormal = null;
    this.maskPlatform = null;
    this.maskRotation = null;
    this.filePointer = null;
    this.mosaicId = 0;
    this.mosaicX = 0;
    this.mosaicY = 0;

    this.readyDelegates = null;

    //TODO: this should be in webgl speciffic version of CImage
    this.texture = null;
    this.textureCoords = null;
    this.texturePow2 = 0;//2;//0 leave as is, 1 rect pow2, 2 square pow2
    this.textureFlip = false;//flips texture coordinates in _updateTextureCoords
    this.textureInnerWidth = 0;
    this.textureInnerHeight = 0;
    this.texturePaddedWidth = 0;
    this.texturePaddedHeight = 0;

    this.temporary = false;//all images are considered perminent unless otherwise specified
}

//functions
CImage.createFromFile = function (application, fileName) {
    //get src
    var src = application.resourcesPath + fileName;

    //create image and queue load
    var image = new CImage(application);
    image.queueLoad(src);

    //done
    return image;
}

//methods
CImage.prototype = {
    //constructor/destructor
    free: function () {
        //pass this off to the app to free
        Runtime.application.freeImage(this);

        //clean up some stuff
        this.img = null;
        this.texture = null;
    },

    //events
    onLoadStart: function (callback) {
        //create html image
        this.img = new Image();
        var that = this;
        var app = this.app;


        //load event
        this.img.onload = function () {
            //pass this back to the app so it can process further
            that.onLoadSuccess.call(that, that.loadSrc, callback);
        }

        //error event
        this.img.onerror = function () {
            that.onLoadFail.call(that, that.loadSrc, callback);
        }

        //figure out the img src and start the load
        this.img.src = this.loadSrc;
    },

    onLoadSuccess: function (src, callback) {
        this.success = true;

        //read properties from image
        if (!this.appData) {
            this.width = this.img.width;
            this.height = this.img.height;
        }

        //let app process image
        this.app.onImageLoaded(this, src);

        //notify app
        if (this.appData) {
            this.app.onDataLoaded(this, src);
        }

        //handle ready state
        this._handleReady();

        //fire success callback
        if (callback != null) {
            callback.call(this, src, this.success);
        }
    },

    onLoadFail: function (src, callback) {
        this.success = false;

        //notify app
        if (this.appData) {
            this.app.onDataLoadError(this, src);
        }

        //handle ready state
        this._handleReady();

        //fire success callback
        if (callback != null) {
            callback.call(this, src, this.success);
        }
    },

    //delegate events
    onMosaicReady: function(mosaic) {
        this.success = mosaic.success;
        this._handleReady();
    },

    //internal
    _updateTextureCoords: function () {
        //this function will take the properties of the image and update teh tex coords

        //do we need to create the array?
        if (this.textureCoords == null) {
            this.textureCoords = new Float32Array(8);
        }

        var texCoords = this.textureCoords;

        //get coords that are same for flipped or not
        var xRange = 1.0 / this.texturePaddedWidth;
        var yRange = 1.0 / this.texturePaddedHeight;
        var yDiff = this.texturePaddedHeight - this.height;
        var texLeft = xRange * this.mosaicX;
        var texRight = xRange * (this.mosaicX + this.width);
        var texBottom;
        var texTop;

        //calculate flipped/not-flipped (take into account pow 2 textures being larger then actual stored image)
        if (this.textureFlip) {
            texTop = yRange * (this.texturePaddedHeight - this.mosaicY - yDiff);
            texBottom = yRange * (this.texturePaddedHeight - this.mosaicY - this.height - yDiff);
        } else {
            texTop = yRange * this.mosaicY;
            texBottom = yRange * (this.mosaicY + this.height);
        }

        //save into array
        texCoords[0] = texLeft;
        texCoords[1] = texTop;
        texCoords[2] = texRight;
        texCoords[3] = texTop;
        texCoords[4] = texRight;
        texCoords[5] = texBottom;
        texCoords[6] = texLeft;
        texCoords[7] = texBottom;
    },

    _handleReady: function() {
        this.ready = true;

        //call delegates
        if (this.readyDelegates != null) {
            var delegate = null;

            for (var index = 0; index < this.readyDelegates.length; index++) {
                delegate = this.readyDelegates[index];
                delegate.onImageReady(this);
            }

            //dont need these delegates anymore
            this.clearReadyDelegates();
        }
    },

    //api
    queueLoad: function (src) {
        var app = this.app;

        //this queues the item to load in the app
        this.appData = true;
        this.ready = false;
        this.success = false;

        //where are we loading from?
        if (src == null) {
            //from app file
            this.filePointer = app.file.getFilePointer();

            this.handle = app.file.readAShort();
            this.width = app.file.readAShort();
            this.height = app.file.readAShort();
            this.xSpot = app.file.readShort();
            this.ySpot = app.file.readShort();
            this.xAP = app.file.readShort();
            this.yAP = app.file.readShort();

            //get src if not defined
            if (src == null) {
                this.loadSrc = this.app.resourcesPath + CServices.formatDiscName(this.handle, "png");
            }


            //can we load from mosaics?
            if (this.app.frame.mosaicHandles != null) {
                //we can try
                this.mosaicId = this.app.frame.mosaicHandles[this.handle];

                if (this.mosaicId != 0) {
                    //load mosaic
                    this.mosaicX = this.app.frame.mosaicX[this.handle];
                    this.mosaicY = this.app.frame.mosaicY[this.handle];

                    //let the runtime load the mosaic
                    var mosaic = this.app.imageBank.loadMosaic(this.mosaicId);

                    //setup ready state
                    this.success = mosaic.success;
                    mosaic.tryReadyDelegate(this);
                } else {
                    //load image
                    this.app.addDataToLoad(this);
                }
            } else {
                //no mosaics so just load
                this.app.addDataToLoad(this);
            }

        } else {
            //quickly queue from src
            this.loadSrc = src;
            this.app.addDataToLoad(this);
        }
    },

    loadNow: function (src, callback) {
        //starts a load now
        this.appData = false;
        this.loadSrc = src;
        this.ready = false;
        this.success = false;
        this.onLoadStart(callback);

        //return self for chaining
        return this;
    },

    readHandle: function (file) {
        this.filePointer = file.getFilePointer();
        this.handle = file.readAShort();
        file.skipBytes(12);
    },

    createElement: function (element) {
        //can we reuse the element?
        if (element == null) {
            var element = document.createElement('div');
        }

        //setup style
        element.style.width = this.width + 'px';
        element.style.height = this.height + 'px';
        element.style.backgroundRepeat = 'no-repeat';

        //setup the image
        if (this.mosaicId == 0) {
            element.style.backgroundImage = "url('" + this.img.src + "')";
        } else {
            element.style.backgroundPosition = '-' + this.mosaicX + 'px -' + this.mosaicY + 'px';
            element.style.backgroundImage = "url('" + this.app.resourcesPath + "M" + CServices.formatDiscName(this.mosaicId, "png") + "')";
        }

        //return for chaining
        return element;
    },

    getPixel: function (x, y) {
        var data = this.getData(x, y, 1, 1);
        return (data[0] << 16) | (data[1] << 8) | data[2];
    },

    getData: function (x, y, width, height) {
        //return the entire data for this image/texture
        if (x == null) {
            x = 0;
        }

        if (y == null) {
            y = 0;
        }

        if (width == null) {
            width = this.width;
        }

        if (height == null) {
            height = this.height;
        }

        //do we have a texture we can use?
        if (this.texture != null) {
            //read from texture
            if (this.mosaicId == 0) {
                return this.texture.getData(x, y, width, height);
            } else {
                return this.texture.getData(this.mosaicX+x, this.mosaicY+y, width, height);
            }

        } else {
            //read from image using temporary canvas (ugh)

            //prepare source and details
            var source;
            if (this.mosaicId == 0) {
                source = this.img;
            } else {
                source = this.app.imageBank.mosaics[this.mosaicId].image.img;
                x += this.mosaicX;
                y += this.mosaicY;
            }

            //check out of bounds
            if (x + width < 0 || y + height < 0 || x >= source.width || y >= source.height) {
                //return null
                return new Int32Array(width * height);
            }

            //create temporary canvas
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext("2d");

            //draw image to canvas
            context.drawImage(source, x, y, width, height, 0, 0, width, height);

            //get the data
            return context.getImageData(0, 0, width, height).data;
        }
    },

    getMask: function (flags, angle, scaleX, scaleY) {

        if ((flags & CMask.GCMF_PLATFORM) == 0) {
            if (this.maskNormal == null) {
                this.maskNormal = new CMask();
                this.maskNormal.createMask(this.app, this, flags);
            }
            if (angle == 0 && scaleX == 1.0 && scaleY == 1.0) {
                return this.maskNormal;
            }

            var rMask;
            if (this.maskRotation == null) {
                this.maskRotation = new CArrayList();
            }
            var n;
            var tick = 0x7FFFFFFF;
            var nOldest = -1;
            for (n = 0; n < this.maskRotation.size(); n++) {
                rMask = this.maskRotation.get(n);
                if (angle == rMask.angle && scaleX == rMask.scaleX && scaleY == rMask.scaleY) {
                    return rMask.mask;
                }
                if (rMask.tick < tick) {
                    tick = rMask.tick;
                    nOldest = n;
                }
            }
            if (this.maskRotation.size() < this.maxRotatedMasks) {
                nOldest = -1;
            }
            rMask = new CRotatedMask();
            rMask.mask = new CMask();
            rMask.mask.createRotatedMask(this.maskNormal, angle, scaleX, scaleY);
            rMask.angle = angle;
            rMask.scaleX = scaleX;
            rMask.scaleY = scaleY;
            rMask.tick = this.app.timer;
            if (nOldest < 0) {
                this.maskRotation.add(rMask);
            }
            else {
                this.maskRotation.set(nOldest, rMask);
            }
            return rMask.mask;
        }
        else {
            if (this.maskPlatform == null) {
                if (this.maskNormal == null) {
                    this.maskNormal = new CMask();
                    this.maskNormal.createMask(this.app, this, 0);
                }
                this.maskPlatform = new CMask();
                this.maskPlatform.createMask(this.app, this, flags);
            }
            return this.maskPlatform;
        }
    },

    //delegate api
    clearReadyDelegates: function() {
        this.readyDelegates = null;
    },

    addReadyDelegate: function (delegate) {
        if (this.readyDelegates == null) {
            //first delegate
            this.readyDelegates = [];
            this.readyDelegates.push(delegate);
        } else {
            //multiple delgates
            if (this.readyDelegates.indexOf(delegate) == -1) {
                this.readyDelegates.push(delegate);
            }
        }
    },

    removeReadyDelegate: function (delegate) {
        if (this.readyDelegates != null) {
            var index = this.readyDelegates.indexOf(delegate);
            if (index >= 0) {
                this.readyDelegates.splice(index, 1);
            }
        }
    },

    tryReadyDelegate: function (delegate) {
        this.addReadyDelegate(delegate);

        //can we handle it now?
        if (this.ready) {
            this._handleReady();
        }
    },
}
