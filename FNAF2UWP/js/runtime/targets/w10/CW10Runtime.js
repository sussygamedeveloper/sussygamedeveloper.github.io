// CW10Runtime object
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

function CW10Runtime() {
    //call chain
    CRuntime.call(this);

    //call self
    this.name = "UWP";

    this.application = null;

    this.updateFPS = -1;
    this.updateStarted = false;

    this.appView = null;
    this.accelerometer = null;
    this.displayInfo = null;
    this.orientationChangedHandler = null;
    this.accelerometerReadingChangedHandler = null;
    this.useWinJSTheme = false;
}

CW10Runtime.prototype = {
    //events
    onSetupDevice: function () {
        //get some w10 objects
        this.touchCapabilities = new Windows.Devices.Input.TouchCapabilities();
        this.accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();
        this.appView = Windows.UI.ViewManagement.ApplicationView.getForCurrentView();
        this.displayInfo = Windows.Graphics.Display.DisplayInformation.getForCurrentView();

        //setup
        this._setupDeviceType();//this should come first!
        this._setupDeviceTouch();
        this._setupDeviceOrientation();

        //hack to fix xbox
        if (this.deviceType == CRuntime.DEVICE_CONSOLE) {
            this.appView.setDesiredBoundsMode(Windows.UI.ViewManagement.ApplicationViewBoundsMode.useCoreWindow);//disable safe tv borders
        }
    },

    onSetupEvents: function () {
        //setup orientation changed
        this.orientationChangedHandler = this._handleOrientationChanged.bind(this);

        this.displayInfo.addEventListener("orientationchanged", this.orientationChangedHandler);
    },

    onEnableMouseEmulation: function () {
        //enable xbox mouse emulation
        if (this.deviceType == CRuntime.DEVICE_CONSOLE) {
            navigator.gamepadInputEmulation = "mouse";
        }
    },

    onDisableMouseEmulation: function () {
        //disable xbox mouse emulation
        if (this.deviceType == CRuntime.DEVICE_CONSOLE) {
            navigator.gamepadInputEmulation = "gamepad";
        }
    },

    onEnableAccelerometer: function () {
        this.accelerometerReadingChangedHandler = this._handleAccelerometerReadingChanged.bind(this);
        this.accelerometer.addEventListener("readingchanged", this.accelerometerReadingChangedHandler);
    },

    onDisableAccelerometer: function () {
        if (this.accelerometerHandler != null) {
            this.accelerometer.removeEventListener("readingchanged", this.accelerometerReadingChangedHandler);
            this.accelerometerReadingChangedHandler = null;
        }
    },

    onThemeElement: function (element, type) {
        //apply winjs styles to certain elements
        if (CRuntime.useWinJSTheme) {
            switch (type) {
                case CRuntime.THEME_ELEMENT_BUTTON:
                    element.className += (element.className.length ? ' ' : '') + 'win-button';
                    break;
                case CRuntime.THEME_ELEMENT_RADIO:
                    element.className += (element.className.length ? ' ' : '') + 'win-radio';
                    break;
                case CRuntime.THEME_ELEMENT_CHECKBOX:
                    element.className += (element.className.length ? ' ' : '') + 'win-checkbox';
                    break;
                case CRuntime.THEME_ELEMENT_DROPDOWN:
                    element.className += (element.className.length ? ' ' : '') + 'win-dropdown';
                    break;
                case CRuntime.THEME_ELEMENT_COMBO:
                    element.className += (element.className.length ? ' ' : '') + 'win-dropdown';
                    break;
                case CRuntime.THEME_ELEMENT_TEXTBOX:
                    element.className += (element.className.length ? ' ' : '') + 'win-textbox';
                    break;
                case CRuntime.THEME_ELEMENT_LIST:
                    break;
            }
        }
    },

    //internal
    _setupDeviceTouch: function () {
        //check device has touch
        //TODO: this is a hack until microsoft can fix
        if (this.deviceType == CRuntime.DEVICE_TABLET || (this.deviceType == CRuntime.DEVICE_DESKTOP && this.touchCapabilities.touchPresent != 0)) {
            this.deviceTouch = true;
        } else {
            this.deviceTouch = this.touchCapabilities.touchPresent != 0;
        }
    },

    _setupDeviceType: function () {
        //figure out what type of UWP device this is
        var versionInfo = Windows.System.Profile.AnalyticsInfo.versionInfo;

        //detect acceleromter
        if (Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.Devices.Sensors.Accelerometer")) {
            this.accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();
            if (this.accelerometer != null) {
                this.deviceAccelerometer = true;
            }
        }

        //this is technically a hack as these values can change at anytime. These values are inteded for analytics only. Why oh why has this not been added officially?
        switch (versionInfo.deviceFamily) {
            case "Windows.Desktop":
                //need to check see if we have touch screen and acceleromter, this is a safe bet that it is running on a tablet
                var isTablet = false;
                if (this.hasAccelerometer()) {
                    //we have an accelerometer so now lets check for touch screen
                    var touch = new Windows.Devices.Input.TouchCapabilities();
                    isTablet = touch.touchPresent != 0;
                }

                if (isTablet) {
                    this.deviceType = CRuntime.DEVICE_TABLET;
                } else {
                    this.deviceType = CRuntime.DEVICE_DESKTOP;
                }

                break;
            case "Windows.Mobile":
                this.deviceType = CRuntime.DEVICE_PHONE;
                break;
            case "Windows.Xbox":
                this.deviceType = CRuntime.DEVICE_CONSOLE;
                break;
        }

    },

    _setupDeviceOrientation: function() {
        this._handleOrientationChanged();
    },

    _handleOrientationChanged: function (event) {
        //get current orientation
        var current = this.displayInfo.currentOrientation;
        var orientations = Windows.Graphics.Display.DisplayOrientations

        //need to plumb this into device orientation values
        if (this.displayInfo.nativeOrientation == orientations.landscape) {
            //landscape
            switch (current) {
                case orientations.landscape://rotation 0
                    this.deviceRotation = 0;
                    this.deviceOrientation = CRuntime.ORIENTATION_LANDSCAPE;
                    break;

                case orientations.portrait://rotation 90
                    this.deviceRotation = 90;
                    this.deviceOrientation = CRuntime.ORIENTATION_PORTRAIT;
                    break;

                case orientations.landscapeFlipped://rotation 180
                    this.deviceRotation = 180;
                    this.deviceOrientation = CRuntime.ORIENTATION_LANDSCAPE_FLIPPED;
                    break;

                case orientations.portraitFlipped://rotation 270
                    this.deviceRotation = 270;
                    this.deviceOrientation = CRuntime.ORIENTATION_PORTRAIT_FLIPPED;
                    break;
            }
        } else {
            //portrait
            switch (current) {
                case orientations.portrait://rotation 0
                    this.deviceRotation = 0;
                    this.deviceOrientation = CRuntime.ORIENTATION_PORTRAIT;
                    break;

                case orientations.landscapeFlipped://rotation 90
                    this.deviceRotation = 90;
                    this.deviceOrientation = CRuntime.ORIENTATION_LANDSCAPE_FLIPPED;
                    break;

                case orientations.portraitFlipped://rotation 180
                    this.deviceRotation = 180;
                    this.deviceOrientation = CRuntime.ORIENTATION_PORTRAIT_FLIPPED;
                    break;

                case orientations.landscape://rotation 270
                    this.deviceRotation = 270;
                    this.deviceOrientation = CRuntime.ORIENTATION_LANDSCAPE;
                    break;
            }
        }
    },

    _handleAccelerometerReadingChanged: function (event) {
        /*
        accelerometer extension has the following value types:
        - direct
            these are RAW values that have been adjusted based on the device orientation
        - gravity
            these are values with gravity applied. These values are filtered so that we dont see jumps in data readings (eg only take 10% of the reading)
        - instant
            this is the change since last direct value

        fusion should always translate the devices own defined format for accelerometer data into the one it knows about

        the gravity values consider the device screen to be facing towards the sky

        values should always range from -1 to 1.0

        if an android phone in portrait mode, is tilted fully forward, this results in the y axis being -1

        when filtering the value for jumps in data, we can do so by:
        filtered = ((direct * 0.1) + (filtered * (0.9)));
        so we are taking 10% of the current reading and adding it to 90% of the previous reading
        */

        //get the reading
        var reading = event.detail[0].reading;

        //change reading based on orientation
        var orientations = Windows.Graphics.Display.DisplayOrientations;

        //get direct values and convert based on orientation
        var directX = 0.0;
        var directY = 0.0;
        var directZ = 0.0;

        switch (this.deviceRotation) {
            case CRuntime.ROTATION_0:
                directX = reading.accelerationX;
                directY = -reading.accelerationY;
                directZ = reading.accelerationZ;
                break;

            case CRuntime.ROTATION_90:
                directX = reading.accelerationY;
                directY = reading.accelerationX;
                directZ = reading.accelerationZ;
                break;

            case CRuntime.ROTATION_180:
                directX = -reading.accelerationX;
                directY = reading.accelerationY;
                directZ = reading.accelerationZ;
                break;

            case CRuntime.ROTATION_270:
                directX = -reading.accelerationY;
                directY = -reading.accelerationX;
                directZ = reading.accelerationZ;
                break;
        }

        //eliminate gravity
        // alpha is calculated as t / (t + dT)
        // with t, the low-pass filter's time-constant
        // and dT, the event delivery rate

        /*final float alpha = 0.8;

        gravity[0] = alpha * gravity[0] + (1 - alpha) * event.values[0];
        gravity[1] = alpha * gravity[1] + (1 - alpha) * event.values[1];
        gravity[2] = alpha * gravity[2] + (1 - alpha) * event.values[2];

        linear_acceleration[0] = event.values[0] - gravity[0];
        linear_acceleration[1] = event.values[1] - gravity[1];
        linear_acceleration[2] = event.values[2] - gravity[2];
        */

        var filteringFactor = 0.8;//lets filter out some of this sample

        this.accelerometerDirectX = directX;
        this.accelerometerDirectY = directY;
        this.accelerometerDirectZ = directZ;

        this.accelerometerGravityX = ((directX * filteringFactor) + (this.accelerometerGravityX * (1.0 - filteringFactor)));
        this.accelerometerGravityY = ((directY * filteringFactor) + (this.accelerometerGravityY * (1.0 - filteringFactor)));
        this.accelerometerGravityZ = ((directZ * filteringFactor) + (this.accelerometerGravityZ * (1.0 - filteringFactor)));

        this.accelerometerInstantX = directX - ((directX * filteringFactor) + (this.accelerometerInstantX * (1.0 - filteringFactor)));
        this.accelerometerInstantY = directY - ((directY * filteringFactor) + (this.accelerometerInstantY * (1.0 - filteringFactor)));
        this.accelerometerInstantZ = directZ - ((directZ * filteringFactor) + (this.accelerometerInstantZ * (1.0 - filteringFactor)));
    },

    //app api
    createApp: function () {
        return new CW10Application();
    },

    //dialog api
    createMessageDialog: function (options, params) {
        return new CW10MessageDialog(options, params);
    },

    createInputDialog: function (options, params) {
        return new CW10InputDialog(options, params);
    },

    //device api
    getDeviceDisplayInfo: function () {
        var bounds = this.appView.visibleBounds;
        var scale = this.displayInfo.rawPixelsPerViewPixel;

        if (this.appView.isFullScreen) {
            //fullscreen
            if (this.deviceType == CRuntime.DEVICE_CONSOLE) {
                //hack to fix xbox bug (TODO: remove this)
                return {
                    x: 0,
                    y: 0,
                    width: bounds.width + bounds.x + bounds.x,
                    height: bounds.height + bounds.y + bounds.y,
                    scale: scale,
                };
            } else {
                //everything else uses this
                return {
                    x: 0,
                    y: 0,
                    width: bounds.width,
                    height: bounds.height,
                    scale: scale,
                };
            }
        } else {
            //windowed
            return {
                x: 0,
                y: 0,
                width: bounds.width,
                height: bounds.height,
                scale: scale,
            };
        }
    },

    getDeviceColorDepth: function () {
        return screen.colorDepth;
    },

    //gamepad api
    createGamepad: function () {
        return new CW10Gamepad();
    },

    //window api
    setWindowMaximized: function () {
        //this is a hack
        this.setWindowSize(screen.availWidth-40, screen.availHeight-40);
    },

    setWindowMinimized: function () {
        this.setWindowSize(192, 48);
    },

    setWindowTitle: function (title) {
        this.appView.title = title;
    },

    setWindowPosition: function (x, y) {
    },

    setWindowSize: function (width, height) {
        //get the window size
        var windowSize = {
            width: width,
            height: height,
        };

        //set the window size
        Windows.UI.ViewManagement.ApplicationView.preferredLaunchViewSize = windowSize;
        this.appView.tryResizeView(windowSize);
    },

    getWindowTitle: function () {
        return this.appView.title;
    },

    getWindowWidth: function () {
        return window.innerWidth;
    },

    getWindowHeight: function () {
        return window.innerHeight;
    },

    getWindowClientWidth: function () {
        return window.innerWidth;
    },

    getWindowClientHeight: function () {
        return window.innerHeight;
    },

    //virtual mosue api
    isVirtualMouseAllowed: function () {
        //enabel for desktop and for console
        return this.deviceType == CRuntime.DEVICE_DESKTOP || this.deviceType == CRuntime.DEVICE_CONSOLE;
    },

    isNativeMouseEmulationAllowed: function () {
        return this.deviceType == CRuntime.DEVICE_CONSOLE;
    },
};

//setup inheritance using extend
CServices.extend(CRuntime, CW10Runtime);