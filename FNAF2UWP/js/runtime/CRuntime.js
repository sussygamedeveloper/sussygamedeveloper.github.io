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

CRuntime.PRELOADER_FRAMERATE = 15;

CRuntime.DEVICE_UNKNOWN = 0;
CRuntime.DEVICE_DESKTOP = 1;
CRuntime.DEVICE_PHONE = 2;
CRuntime.DEVICE_TABLET = 3;
CRuntime.DEVICE_CONSOLE = 4;

CRuntime.ORIENTATION_PORTRAIT = 0;
CRuntime.ORIENTATION_LANDSCAPE = 1;
CRuntime.ORIENTATION_PORTRAIT_FLIPPED = 2;
CRuntime.ORIENTATION_LANDSCAPE_FLIPPED = 3;

CRuntime.ROTATION_0 = 0;
CRuntime.ROTATION_90 = 90;
CRuntime.ROTATION_180 = 180;
CRuntime.ROTATION_270 = 270;

CRuntime.THEME_ELEMENT_BUTTON = 1;
CRuntime.THEME_ELEMENT_RADIO = 2;
CRuntime.THEME_ELEMENT_CHECKBOX = 3;
CRuntime.THEME_ELEMENT_DROPDOWN = 4;
CRuntime.THEME_ELEMENT_COMBO = 5;
CRuntime.THEME_ELEMENT_TEXTBOX = 6;
CRuntime.THEME_ELEMENT_LIST = 7;

//base runtime (should be extended by platform)
function CRuntime(canvasName, appName) {
    this.name = "";

    this.deviceType = CW10Runtime.DEVICE_UNKNOWN;
    this.deviceAccelerometer = false;
    this.deviceTouch = false;
    this.deviceOrientation = CRuntime.ORIENTATION_PORTRAIT;
    this.deviceRotation = CRuntime.ROTATION_0;

    this.application = null;
    this.separateLoops = false;
    this.frameRate = null;
    this.lastTimestamp = null;
    this.renderLock = 0;

    this.accelerometerRefCount = 0;
    this.accelerometerDirectX = 0.0;
    this.accelerometerDirectY = 0.0;
    this.accelerometerDirectZ = 0.0;
    this.accelerometerGravityX = 0.0;
    this.accelerometerGravityY = 0.0;
    this.accelerometerGravityZ = 0.0;
    this.accelerometerInstantX = 0.0;
    this.accelerometerInstantY = 0.0;
    this.accelerometerInstantZ = 0.0;
}

CRuntime.prototype = {
    //events
    onInit: function (root, canvas, container, appPath) {
        //prepare the runtime
        var that = this;

        //setup the document
        var scripts = document.getElementsByTagName("script");
        var path = scripts[scripts.length - 1].src;
        document.srcPath = path.substring(0, path.lastIndexOf("/") + 1);

        //create the app
        var file = new CFile();
        var app = this.createApp();
        this.application = app;

        app.onInit(false);
        app.onSetupFile(file, appPath);
        app.onSetupElements(root, canvas, container);

        //start the file load and pass in anonymous func that lets the runtime be called in context
        file.openFileAsync(appPath, function (success, file) {
            that.onLoaded();
        });
    },

    onSetupDevice: function() {
    },

    onSetupEvents:function() {

    },

    onLoaded: function () {
        //tell the root app to load


        this.application.load();
    },

    onUpdate: function () {
        //if we seperated update and render loops then do it here, otherwise do it in OnRender()
        //tell the root app to update
        this.application.onUpdate();

    },

    onRender: function () {
        //tell the root app to render

        //only render if we havn't locked render.
        if (!Runtime.isRenderLocked()) {
            this.application.onRender();
        }

    },

    onDialogeOpen: function (dialog) {
        //pause the app
        this.lockRender()
        this.application.run.pause();
    },

    onDialogeClose: function (dialog) {
        //resume the app
        this.application.run.resume();
        this.unlockRender();

        //focus the canvas
        this.application.canvas.focus();
    },

    onEnableMouseEmulation: function () {
    },

    onDisableMouseEmulation: function () {
    },

    onEnableAccelerometer: function () {
    },

    onDisableAccelerometer: function () {
    },

    onThemeElement: function(element, type) {
    },

    //internal
    _combinedLoop: function () {
        //get details
        var timestamp = Date.now();
        var frameSlice = (1000 / (this.frameRate == null ? this.application.gaFrameRate : this.frameRate));
        this.lastTimestamp = timestamp;

        //request next update first in the assumption that we will have finished in time
        setTimeout(this._combinedLoop.bind(this), Math.max(0, frameSlice));

        //update and render runtime
        this.onUpdate();
        this.onRender();

        //set next update/render
        //var took = Date.now() - timestamp;
        //setTimeout(this._combinedLoop.bind(this), Math.max(0, frameSlice - took));
    },

    /*
    _updateLoop: function () {
        //update loop works on timeout
        var timestamp = Date.now();
        this.onUpdate();

        var took = Date.now() - timestamp;

        //next update!
        var nextFrame = 0;
        setTimeout(this._updateLoop.bind(this), nextFrame);
    },

    _renderLoop: function () {
        //render loop works on request animation frame
        requestAnimationFrame(this._renderLoop.bind(this));

        //now do current update, but only based on current frame rate
        var timestamp = Date.now();
        var frameSlice = (1000 / (this.frameRate == null ? this.application.gaFrameRate : this.frameRate));

        if (this.lastTimestamp == null || timestamp >= this.lastTimestamp + frameSlice) {
            this.lastTimestamp = timestamp;

            //render
            if (this.application.run.rh2PauseCompteur == 0) {
                this.onRender();
            }
        }
    },
    */

    //app api
    createApp: function (source, cFile, path, subApp) {

    },

    //dialog api
    createMessageDialog: function (options, params) {

    },

    createInputDialog: function (options, params) {

    },

    //render lock api
    lockRender: function () {
        this.renderLock++;
    },

    unlockRender: function () {
        if (this.renderLock > 0) {
            this.renderLock--;
        }
    },

    isRenderLocked: function () {
        return this.renderLock > 0;
    },

    //api
    startUpdates: function () {
        //request animation frame, we only need to do this once in our app as from then on its scheduled automatically
        if (!this.updateStarted) {
            //flag started
            this.updateStarted = true;

            if (this.separateLoops) {
                //start seperate loops
                setTimeout(this._updateLoop.bind(this), 1);
                requestAnimationFrame(this._renderLoop.bind(this));
            } else {
                //start render/update loop
                setTimeout(this._combinedLoop.bind(this), 1);
            }
        }
    },

    setFrameRate: function (fps) {

        this.frameRate = fps;
    },

    //device api
    getDeviceDisplayInfo: function () {
        return new {
            width: 0,
            height: 0,
        }
    },

    getDeviceColorDepth: function() {
        return 0;
    },

    isConsole: function() {
        return this.deviceType == CRuntime.DEVICE_CONSOLE;
    },

    isTouchable: function() {
        return this.deviceTouch;
    },

    canToggleFullscreen: function() {
        return this.deviceType == CRuntime.DEVICE_DESKTOP || this.deviceType == CRuntime.DEVICE_TABLET;
    },

    //accelerometer api
    startAccelerometer: function() {
        if (this.accelerometerRefCount == 0 && this.hasAccelerometer()) {
            this.onEnableAccelerometer();
        }
        this.accelerometerRefCount++;
    },

    stopAccelerometer: function () {
        if (this.accelerometerRefCount > 0) {
            this.accelerometerRefCount--;

            if (this.accelerometerRefCount == 0) {
                this.onDisableAccelerometer();
            }
        }
    },

    hasAccelerometer: function () {
        return this.deviceAccelerometer;
    },

    //gamepad api
    createGamepad: function () {
        //should be handled by each runtime!
        return null;
    },

    //window api
    setWindowMaximized: function () {

    },

    setWindowMinimized: function () {

    },

    setWindowTitle: function(title) {
    },

    setWindowPosition: function (x, y) {
    },

    setWindowSize: function (width, height) {
    },

    getWindowTitle: function() {

    },

    getWindowWidth: function () {
    },

    getWindowHeight: function () {
    },

    getWindowClientWidth: function () {
    },

    getWindowClientHeight: function () {
    },

    //virtual mouse api
    isVirtualMouseAllowed: function () {

    },

    isNativeMouseEmulationAllowed: function () {
        return false;
    },
};
