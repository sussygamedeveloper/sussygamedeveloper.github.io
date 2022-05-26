// CMosaic object
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

function CMosaic(imageBank, handle) {
    this.success = true;
    this.ready = true;
    this.imageBank = imageBank;
    this.app = imageBank.app;
    this.appData = false;//signals that this is being loaded as part of appData
    this.handle = handle;
    this.image = null;
    this.texture = null;
    this.readyDelegates = null;
}

CMosaic.prototype = {
    //constructor/destructor
    free: function () {
        if (this.image != null) {
            this.image.free();
            this.image = null;
        }
    },

    //events
    onLoadStart: function (callback) {
        var that = this;
        var app = this.app;

        //figure out the src path
        var src = this.app.resourcesPath + "M" + CServices.formatDiscName(this.handle, "png");



        //create CImage and pass off the loading responsibility to it!
        this.image = new CImage(this.app);
        this.image.loadNow(src, function (src, success) {
            //was it success or fail?
            if (success) {
                that.onLoadSuccess(src, callback);
            } else {
                that.onLoadFail(src, callback);
            }
        });
    },

    onLoadSuccess: function (src, callback) {
        //by the time this is called the this.image (CImage) has been fully loaded into memory/GPU
        this.success = true;

        //fetch details after app has processed loaded image
        this.texture = this.image.texture;

        //inform app that mosaic loaded
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

    //internal
    _handleReady: function () {
        this.ready = true;

        //call delegates
        if (this.readyDelegates != null) {
            var delegate = null;

            for (var index = 0; index < this.readyDelegates.length; index++) {
                delegate = this.readyDelegates[index];
                delegate.onMosaicReady(this);
            }

            //dont need these delegates anymore
            this.clearReadyDelegates();
        }
    },

    //api
    queueLoad: function () {
        //add to the app to start loading
        this.appData = true;
        this.ready = false;
        this.success = false;
        this.app.addDataToLoad(this);
    },

    //delegate api
    clearReadyDelegates: function () {
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
