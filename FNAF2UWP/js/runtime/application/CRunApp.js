// CRunApp object
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

window["FusionVersion"] = "Clickteam Fusion HTML5 Exporter Build 291.2";

CRunApp.MAX_PLAYER = 4;
CRunApp.RUNTIME_VERSION = 0x0302;
CRunApp.MAX_KEY = 8;
CRunApp.GA_NOHEADING = 0x0002;
CRunApp.GA_STRETCHTOFIT = 0x0004;
CRunApp.GA_SPEEDINDEPENDANT = 0x0008;
CRunApp.GA_STRETCH = 0x0010;
CRunApp.GA_MENUHIDDEN = 0x0080;
CRunApp.GA_MENUBAR = 0x0100;
CRunApp.GA_MAXIMISE = 0x0200;
CRunApp.GA_MIX = 0x0400;
CRunApp.GA_FULLSCREENATSTART = 0x0800;
CRunApp.GANF_SAMPLESOVERFRAMES = 0x0001;
CRunApp.GANF_RUNFRAME = 0x0004;
CRunApp.GANF_SAMPLESEVENIFNOTFOCUS = 0x0008;
CRunApp.GANF_NOTHICKFRAME = 0x0040;
CRunApp.GANF_DONOTCENTERFRAME = 0x0080;
CRunApp.GANF_DISABLE_CLOSE = 0x0200;
CRunApp.GANF_HIDDENATSTART = 0x0400;
CRunApp.GANF_VSYNC = 0x1000;
CRunApp.GAOF_JAVASWING = 0x1000;
CRunApp.GAOF_JAVAAPPLET = 0x2000;
CRunApp.RUNTIME_CM = 1;
CRunApp.SL_RESTART = 0;
CRunApp.SL_STARTFRAME = 1;
CRunApp.SL_FRAMEFADEINLOOP = 2;
CRunApp.SL_FRAMELOOP = 3;
CRunApp.SL_FRAMEFADEOUTLOOP = 4;
CRunApp.SL_ENDFRAME = 5;
CRunApp.SL_QUIT = 6;
CRunApp.SL_WAITFORMOCHI = 7;
CRunApp.SL_FRAMELOOPFIRST = 8;//this is the first REAL run of the frame (not the one that happens potentially before loading and transition)
CRunApp.MAX_VK = 203;
CRunApp.VK_LEFT = 0x25;
CRunApp.VK_RIGHT = 0x27;
CRunApp.VK_UP = 0x26;
CRunApp.VK_DOWN = 0x28;
CRunApp.VK_LBUTTON = 200;
CRunApp.VK_MBUTTON = 201;
CRunApp.VK_RBUTTON = 202;
CRunApp.VK_NUMPAD0 = 0x60;
CRunApp.VK_NUMPAD1 = 0x61;
CRunApp.VK_NUMPAD2 = 0x62;
CRunApp.VK_NUMPAD3 = 0x63;
CRunApp.VK_NUMPAD4 = 0x64;
CRunApp.VK_NUMPAD5 = 0x65;
CRunApp.VK_NUMPAD6 = 0x66;
CRunApp.VK_NUMPAD7 = 0x67;
CRunApp.VK_NUMPAD8 = 0x68;
CRunApp.VK_NUMPAD9 = 0x69;
CRunApp.VK_S = 0x53;
CRunApp.VK_D = 0x44;
CRunApp.VK_E = 0x45;
CRunApp.VK_X = 0x58;
CRunApp.VK_F12 = 0x7B;
CRunApp.VK_SHIFT = 0x10;
CRunApp.VK_CONTROL = 0x11;
CRunApp.VK_MENU = 0x12;
CRunApp.CTRLTYPE_MOUSE = 0;
CRunApp.CTRLTYPE_JOY1 = 1;
CRunApp.CTRLTYPE_JOY2 = 2;
CRunApp.CTRLTYPE_JOY3 = 3;
CRunApp.CTRLTYPE_JOY4 = 4;
CRunApp.CTRLTYPE_KEYBOARD = 5;
CRunApp.ARF_INGAMELOOP = 0x0004;
CRunApp.BUILDFLAG_TEST = 0x0080;
CRunApp.AH2OPT_KEEPSCREENRATIO = 0x0001;
CRunApp.AH2OPT_RESAMPLESTRETCH = 0x0004;
CRunApp.AH2OPT_WEBGL = 0x10000;//4096
CRunApp.AH2OPT_KEEPRESOURCESBETWEENFRAMES = 0x8000;
CRunApp.AH2OPT_RUNEVENIFNOTFOCUS = 0x100000;
CRunApp.AH2OPT_PRELOADERQUIT = 0x800000;
CRunApp.AH2OPT_LOADDATAATSTART = 0x1000000;
CRunApp.AH2OPT_LOADSOUNDSONTOUCH = 0x2000000;
CRunApp.AH2OPT_DESTROYIFNOINACTIVATE = 0x4000000;
CRunApp.MAX_TOUCHES = 10;
CRunApp.FAKE_TOUCHIDENTIFIER = 0x2356A465;
CRunApp.TOUCHID_EMPTY = 0x69865358;
CRunApp.DISPLAY_TOP_LEFT = -1;
CRunApp.DISPLAY_CENTER = 0;
CRunApp.DISPLAY_ADJUSTWINSIZE = 1;
CRunApp.DISPLAY_FITINSIDE = 2;
CRunApp.DISPLAY_FITINSIDE_AND_ADJUSTWINSIZE = 3;
CRunApp.DISPLAY_FITOUTSIDE = 4;
CRunApp.DISPLAY_STRETCHTOFILL = 5;

CRunApp.FLAG_VIRTUAL_MOUSE_VISIBLE = 0x0000001; //WUARUNOPT_VIRTUALMOUSE_VISIBLE
CRunApp.FLAG_VIRTUAL_MOUSE_NATIVE = 0x0000002; //WUARUNOPT_VIRTUALMOUSE_NATIVE
CRunApp.FLAG_VIRTUAL_MOUSE_ANALOG = 0x0000004; //WUARUNOPT_VIRTUALMOUSE_ANALOG
CRunApp.FLAG_VIRTUAL_MOUSE_SUPPRESS_INPUT = 0x0000008; //APP_OPTION_VIRTUALMOUSE_SUPPRESSINPUT

CRunApp.CURSOR_UNKNOWN = -3;
CRunApp.CURSOR_NONE = -2;
CRunApp.CURSOR_DEFAULT = -1;
CRunApp.CURSOR_POINTER = 0;
CRunApp.CURSOR_CROSS = 1;
CRunApp.CURSOR_HAND = 2;
CRunApp.CURSOR_HELP = 3;
CRunApp.CURSOR_TEXT = 4;
CRunApp.CURSOR_SIZE_ALL = 5;
CRunApp.CURSOR_SIZE_NE_SW = 6;
CRunApp.CURSOR_SIZE_N_S = 7;
CRunApp.CURSOR_SIZE_NW_SE = 8;
CRunApp.CURSOR_SIZE_W_E = 9;
CRunApp.CURSOR_NO = 10;
CRunApp.CURSOR_UP = 11;
CRunApp.CURSOR_WAIT = 12;
CRunApp.CURSOR_ZOOM = 13;
CRunApp.CURSOR_PICK = 14;
CRunApp.CURSOR_FILL = 15;
CRunApp.CURSOR_HORIZONTAL_SPLIT = 16;
CRunApp.CURSOR_VERTICAL_SPLIT = 17;
CRunApp.CURSOR_COPY = 18;
CRunApp.CURSOR_MOVE = 19;
CRunApp.CURSOR_SHORTCUT = 20;

CRunApp.FILE_STORE_DATABASE_PATH = "CRunAppFileStore::database";

CRunApp.MOUSE_DOUBLE_CLICK_DELAY = 300;

//base application class
function CRunApp() {
    //get the platform we are running on
    this.browserDetect = new CBrowserDetect();
    this.iOS = this.browserDetect.OS == "iOS";
    this.Android = this.browserDetect.OS == "Android";
    this.Linux = this.browserDetect.OS == "Linux";
    this.MacOS = this.browserDetect.OS == "MacOS";
    this.Windows = this.browserDetect.OS == "Windows";
    this.WindowsPhone = this.browserDetect.OS == "Windows Phone";

    //definition
    this.isSubApp = false;
    this.isBootstrap = false;

    this.frameOffsets = null;
    this.frameEffects = null;
    this.frameEffectParams = null;
    this.frameMaxIndex = 0;
    this.framePasswords = null;

    this.appName = null;
    this.nGlobalValuesInit = 0;
    this.globalValuesInitTypes = null;
    this.globalValuesInit = null;
    this.nGlobalStringsInit = 0;
    this.globalStringsInit = null;
    this.OIList = null;
    this.imageBank = null;
    this.fontBank = null;
    this.soundBank = null;
    this.soundPlayer = null;
    this.appRunningState = 0;
    this.lives = null;
    this.scores = null;
    this.playerNames = null;
    this.gValues = null;
    this.gStrings = null;
    this.nextFrame = 0;
    this.currentFrame = 0;
    this.frame = null;
    this.file = null;
    this.renderer = null;

    //set starting frame
    this.startFrame = 0;


    this.root = null;
    this.canvas = null;
    this.container = null;

    this.parentApp = null;
    this.parentOptions = 0;

    this.containerX = 0;
    this.containerY = 0;
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.containerOverride = false;
    this.containerOverrideX = 0;
    this.containerOverrideY = 0;

    this.clipScaleX = 1.0;
    this.clipScaleY = 1.0;
    this.clipX = 0.0;
    this.clipY = 0.0;
    this.clipWidth = 0.0;
    this.clipHeight = 0.0;
    this.clipVirtualWidth = 0.0;
    this.clipVirtualHeight = 0.0;

    this.refTime = 0;
    this.run = null;

    this.xOffset = 0;
    this.yOffset = 0;
    this.gaFlags = 0;
    this.gaNewFlags = 0;
    this.gaMode = 0;
    this.gaOtherFlags = 0;
    this.gaCxWin = 0;
    this.gaCyWin = 0;
    this.gaScoreInit = 0;
    this.gaLivesInit = 0;
    this.gaBorderColour = 0;
    this.gaNbFrames = 0;
    this.gaFrameRate = 0;
    this.pcCtrlType = null;
    this.pcCtrlKeys = null;
    this.frameHandleToIndex = null;
    this.frameMaxHandle = 0;
    this.cx = 0;
    this.cy = 0;
    this.bMouseIn = false;
    this.keyBuffer = null;

    this.domOffsetX = 0;
    this.domOffsetY = 0;

    this.mouseRawInitialized = false;
    this.mouseRawX = 0;
    this.mouseRawY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseOffsetX = 0;
    this.mouseOffsetY = 0;
    this.mouseDoubleClickCode = null;
    this.mouseDoubleClickTimestamp = null;

    this.currentRenderWidth = 0;
    this.currentRenderHeight = 0;

    this.cursorCount = 0;
    this.cursor = CRunApp.CURSOR_UNKNOWN;
    this.cursorApplied = null;

    this.sysEvents = null;
    this.quit = false;
    this.extensionStorage = null;
    this.extLoader = null;
    this.embeddedFiles = null;
    this.unicode = false;
    this.deltaWheel = 0;
    this.effect = 0;
    this.effectParam = 0;
    this.alpha = 0;

    this.dwOptions = 0;
    this.dwBuildType = 0;
    this.dwBuildFlags = 0;
    this.wScreenRatioTolerance = 0;
    this.wScreenAngle = 0;
    this.viewMode = 0;

    this.file = null;
    this.resourcesPath = "";
    this.path = "";

    this.frameColor = 0;
    this.appEditorFilePath = null;
    this.appEditorRootPath = null;

    this.run = null;
    this.timer = 0;
    this.renderable = false;

    this.loading = false;
    this.loadingStarted = false;
    this.loadingTimestamp = null;
    this.loadingDataTotal = 0;
    this.loadingDataCurrent = 0;
    this.loadingDataStep = 30;//number of data load requests at once (this of course will be throtled by the browsers threading ability)
    this.loadingDataQueue = new CArrayList();
    this.loadingDataActive = new CArrayList();

    this.keyNew = false;
    this.subApps = new Array(0);

    this.preloader = null;
    this.preloaderEnabled = false;
    this.preloaderType = -1;
    this.preloaderHasReset = false;
    this.preloaderCircleCenterX = 0;
    this.preloaderCircleCenterY = 0;
    this.preloaderCircleRadius = 0;
    this.preloaderCircleThickness = 0;
    this.preloaderCircleColor = 0;
    this.preloaderBackColor = 0;
    this.preloaderFrameNumber = 0;        // premiÃ¨re frame = 0

    this.transition = null;
    this.transitionManager = null;
    this.transitionBuffer = null;
    this.processTransitionInAfterLoad = false;

    this.touchesID = null;
    this.touchesX = null;
    this.touchesY = null;
    this.mouseTouch = CRunApp.TOUCHID_EMPTY;

    this.virtualJoystickCurrent = null;
    this.virtualJoystickTouch = null;
    this.virtualJoystickAccelerometer = null;

    this.virtualMouse = null;
    this.virtualMouseOptionVisible = true;
    this.virtualMouseOptionNative = true;
    this.virtualMouseOptionAnalog = true;
    this.virtualMouseOptionSupress = false;
    this.virtualMouseOptionEnabled = true;
    this.virtualMouseOptionSpeed = 400;
    this.virtualMouseOptionBounds = CVirtualMouse.BOUNDS_CONTAIN;
    this.virtualMouseOptionAnalogSpeedMultiplier = 1.5;
    this.virtualMouseOptionCursorIdleOffsetX = 2;
    this.virtualMouseOptionCursorIdleOffsetY = 7;
    this.virtualMouseOptionCursorLeftDownOffsetX = 2;
    this.virtualMouseOptionCursorLeftDownOffsetY = 7;
    this.virtualMouseOptionCursorRightDownOffsetX = 2;
    this.virtualMouseOptionCursorRightDownOffsetY = 7;

    this.scaleX = 1.0;
    this.scaleY = 1.0;

    this.hasFocus = true;
    this.bStoppedFocus = false;
    this.iOS = false;
    this.firstFrameColor = 0;
    this.graphicFonts = null;

    this.previousFrameBuffer = null;
    this.lastFrameBuffer = null;

    this.zoom = false;
    this.mosaics = new Array();
    this.mosaicHTMLTexture = new Array();
    this.mosaicMaxHandle = 0;
    this.silentSound = null;
    this.oldFrameRate = -1000;
    this.fullScreen = false;

    this.touchMeMessage = "Please touch the screen to start";
    this.touchMeTextContainer = null;
    this.touchMeFont = null;
    this.touchMeRect = null;

    //gamepads
    this.gamepads = new Array(CRunApp.MAX_PLAYER);//max number of gamepads


    this.modalSubappObject = null;
}

CRunApp.prototype = {
    //core events
    onInit: function (subApp) {
        this.isSubApp = subApp;

        //create gamepads
        for (var index = 0; index < this.gamepads.length; index++) {
            this.gamepads[index] = Runtime.createGamepad();
        }

    },

    onEnd: function () {
    },

    onUpdate: function () {
        //call built in update
        if (this.parentApp == null) {
            //update gamepads (please note that gamepads being updated here will not alter any core engine joystick states, this simply lets the system poll gamepads before doRunLoop)
            for (var index = 0; index < this.gamepads.length; index++) {
                if (this.gamepads[index].connected) {
                    this.gamepads[index]._update();
                }
            }

            //if we are loading then call to update loading
            if (this.loading) {
                //this might result in .loading = false in which case we also need to update teh app this loop (if we dont we get a weird screen flicker)
                this.updateLoading();
            }

            //if we are not loading, or, if loading finished in this same onUpdate call, then update the app
            if (!this.loading) {
                this.updateApplication();
            }
        }
    },

    onRender: function () {
        //root app only
        if (this.renderable && this.parentApp == null) {
            if (this.loading) {
                this.drawLoading();
            } else {
                if (this.frame) {
                    if (this.transition) {
                        this.drawTransition();
                    } else {
                        this.drawApplication();
                    }
                }
            }
        }
    },

    //setup events
    onSetupFile: function (file, path) {
        //save details
        this.file = file;
        this.path = path;

        //get resources path
        var pos = path.lastIndexOf("/");
        if (pos >= 0) {
            this.resourcesPath = path.substring(0, pos + 1);
        }
    },

    onSetupParentApp: function (pApp, sFrame, options, sprite, width, height) {
        this.parentApp = pApp;
        this.parentOptions = options;
        this.mainSprite = sprite;
        this.startFrame = sFrame;

        this.containerWidth = width;
        this.containerHeight = height;
    },

    onSetupWindow: function () {
        //setup the window of teh app
    },

    onChangeWindowColor: function (color) {
    },

    onSetupElements: function (root, canvas, parentContainer) {
        //setup the applications window

        //get elements based on passed in params
        if (!this.isSubApp) {
            //root app
            this.root = root;
            this.canvas = canvas;
            this.container = parentContainer;

        } else {
            //child app
            this.root = root;
            this.canvas = canvas;

            //create child container for this app
            this.container = document.createElement('div');
            this.container.className = 'fusionContainer';
            parentContainer.appendChild(this.container);
        }
    },

    onSetupEvents: function () {
        var that = this;

        document.addEventListener("keydown", function (event) {
            that.onKeyDown(event);
        }, false);

        document.addEventListener("keyup", function (event) {
            that.onKeyUp(event);
        }, false);

        //focus events
        document.addEventListener("blur", function (event) {
            that.hasFocus = false;
        }, false);
        document.addEventListener("focus", function (event) {
            that.hasFocus = true;
        }, false);

        //screen events
        window.addEventListener("resize", function (event) {
            that.resizeApplication();
        }, false);

        document.addEventListener("fullscreenchange", function () {
            that.fullScreen = document.fullscreen;
            that.resizeApplication();
        }, false);

        //scroll wheel events
        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
        document.addEventListener(mousewheelevt, function (event) {
            that.onMouseWheel(event);
        }, false)

        //block context menu event
        this.canvas.addEventListener("contextmenu", function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
        }, false);

        //block select event (could be done with css :P)
        document.onselectstart = function () {
            return false;
        }

        this.canvas.onselectstart = function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            return false;
        }

    },

    //update events
    onUpdateRootAppLayout: function () {
        //calculate any view related values based on teh current app/view mode

        //are we centering the view?
        var mode = this.viewMode;

        //get resolution (this is what the canvas will be contained in)
        var displayInfo = Runtime.getDeviceDisplayInfo();

        //centered option is defined by user
        var centered = (this.gaNewFlags & CRunApp.GANF_DONOTCENTERFRAME) == 0;

        //get max possible dimensions and also the VISIBLE dimensions of the frame (the actual frame size may be much bigger, but this is for scrolling only)
        var renderWidth, renderHeight;
        var frameMaxWidth, frameMaxHeight;

        if (this.frame) {
            //we have a current frame so we can use that
            renderWidth = this.run.rh3WindowSx;//this.frame.leEditWinWidth; // these are the dimensions for the visible area of the frame (this could either be clipped by window, or smaller than window)
            renderHeight = this.run.rh3WindowSy;//this.frame.leEditWinHeight;
            frameMaxWidth = this.frame.leWidth;
            frameMaxHeight = this.frame.leHeight;
        } else {
            //we dont have a frame yet!
            renderWidth = displayInfo.width;
            renderHeight = displayInfo.height;
            frameMaxWidth = renderWidth;
            frameMaxHeight = renderHeight;
        }

        //figure out the new canvas dimensions!
        var newCanvasX = 0.0;
        var newCanvasY = 0.0;
        var newCanvasWidth = renderWidth;
        var newCanvasHeight = renderHeight;

        //calculate ratios that are temporarily used for doing various "fit" operations
        var ratioWidth = displayInfo.width / renderWidth;
        var ratioHeight = displayInfo.height / renderHeight;

        //what display mode are we in? and what values do we have to change the defaults above?
        switch (this.viewMode) {
            case CRunApp.DISPLAY_CENTER:
                //1:1 centered in window (this is done after teh switch statement)
                break;

            case CRunApp.DISPLAY_ADJUSTWINSIZE:
                //resize visible area to fit window. center in screen if frame max dimensions are too small
                newCanvasWidth = Math.min(frameMaxWidth, displayInfo.width);
                newCanvasHeight = Math.min(frameMaxHeight, displayInfo.height);

                break;

            case CRunApp.DISPLAY_FITINSIDE:
                //aspect scale contents to fit inside window. center in screen
                var scale = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;

                //figure out aspect dimensions
                newCanvasWidth = renderWidth * scale;
                newCanvasHeight = renderHeight * scale;

                break;

            case CRunApp.DISPLAY_FITINSIDE_AND_ADJUSTWINSIZE:
                //aspect scale frame to fit window. resize canvas to fill black borders
                var scale = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;

                //calculate container dimensions
                newCanvasWidth = Math.min(Math.max(frameMaxWidth, renderWidth * scale), displayInfo.width);
                newCanvasHeight = Math.min(Math.max(frameMaxHeight, renderHeight * scale), displayInfo.height);

                break;

            case CRunApp.DISPLAY_FITOUTSIDE:
                //aspect scale frame to window. crop to remove black borders
                var scale = ratioWidth > ratioHeight ? ratioWidth : ratioHeight;

                //figure out aspect dimensions
                newCanvasWidth = renderWidth * scale;
                newCanvasHeight = renderHeight * scale;

                break;

            case CRunApp.DISPLAY_STRETCHTOFILL:
                //stretch frame to fill window
                newCanvasWidth = displayInfo.width;
                newCanvasHeight = displayInfo.height;

                break;
        }

        //center the container
        if (centered) {
            newCanvasX = displayInfo.x + (displayInfo.width / 2.0) - (newCanvasWidth / 2.0);
            newCanvasY = displayInfo.y + (displayInfo.height / 2.0) - (newCanvasHeight / 2.0);
        }

        //override
        if (this.containerOverride) {
            newCanvasX = displayInfo.x + this.containerOverrideX;
            newCanvasY = displayInfo.y + this.containerOverrideY;
        }

        //do we have anything overriding

        //modify elements
        this.onUpdateRootElement(newCanvasX, newCanvasY, newCanvasWidth, newCanvasHeight);
        this.onUpdateContainerElement(displayInfo.x, displayInfo.y, newCanvasWidth, newCanvasHeight);
        this.onUpdateCanvasElement(displayInfo.x, displayInfo.y, newCanvasWidth, newCanvasHeight, renderWidth, renderHeight);

        //modify renderer
        this.renderer.resize(renderWidth, renderHeight);
        this.renderer.setScale(1.0, 1.0);

        //modify scale
        this.scaleX = newCanvasWidth / renderWidth;
        this.scaleY = newCanvasHeight / renderHeight;

        //modify container
        this.containerX = newCanvasX;
        this.containerY = newCanvasY;
        this.containerWidth = newCanvasWidth;
        this.containerHeight = newCanvasHeight;

        //modify clip
        this.clipScaleX = 1.0;
        this.clipScaleY = 1.0;
        this.clipX = 0.0;
        this.clipY = 0.0;
        this.clipWidth = renderWidth;
        this.clipHeight = renderHeight;
        this.clipVirtualWidth = renderWidth;
        this.clipVirtualHeight = renderHeight;

        //calculate dom
        this.domOffsetX = 0;
        this.domOffsetY = 0;
        var pointer = this.canvas;
        while (pointer && pointer.tagName != 'BODY') {
            this.domOffsetX += pointer.offsetLeft;
            this.domOffsetY += pointer.offsetTop;
            pointer = pointer.offsetParent;
        }
    },

    onUpdateSubAppLayout: function () {
        //get the new scale factor
        var newScaleX, newScaleY;

        if (this.viewMode == CRunApp.DISPLAY_STRETCHTOFILL) {
            //stretch
            if (this.frame) {
                newScaleX = this.containerWidth / this.run.rh3WindowSx;
                newScaleY = this.containerHeight / this.run.rh3WindowSy;
            } else {
                //we dont have a frame yet!
                newScaleX = 1.0;
                newScaleY = 1.0;
            }
        } else {
            //top-left
            newScaleX = 1.0;
            newScaleY = 1.0;
        }

        var renderWidth, renderHeight;

        if (this.frame) {
            //we have a current frame so we can use that
            renderWidth = this.run.rh3WindowSx;
            renderHeight = this.run.rh3WindowSy;
        } else {
            //we dont have a frame yet!
            renderWidth = this.gaCxWin;
            renderHeight = this.gaCyWin;
        }

        //render scale (for rendering duh... scale is local as teh matrix stack keeps track of child scaling)
        this.mainSprite.scaleX = newScaleX;
        this.mainSprite.scaleY = newScaleY;

        //update scale
        this.scaleX = newScaleX * this.parentApp.scaleX;
        this.scaleY = newScaleY * this.parentApp.scaleY;

        //update clip
        this.clipScaleX = newScaleX * this.parentApp.clipScaleX;
        this.clipScaleY = newScaleY * this.parentApp.clipScaleY;
        this.clipX = this.parentApp.clipX + Math.round(this.mainSprite.x * this.parentApp.clipScaleX);
        this.clipY = this.parentApp.clipY + Math.round(this.mainSprite.y * this.parentApp.clipScaleY);
        this.clipWidth = Math.floor(this.containerWidth * this.parentApp.clipScaleX);
        this.clipHeight = Math.floor(this.containerHeight * this.parentApp.clipScaleY);
        this.clipVirtualWidth = this.containerWidth / this.parentApp.clipScaleX;
        this.clipVirtualHeight = this.containerHeight / this.parentApp.clipScaleY;

        //update elements
        var containerX = this.mainSprite.x * this.parentApp.scaleX;
        var containerY = this.mainSprite.y * this.parentApp.scaleY;
        var containerWidth = this.containerWidth * this.parentApp.scaleX;
        var containerHeight = this.containerHeight * this.parentApp.scaleY;

        this.currentRenderWidth = renderWidth;
        this.currentRenderHeight = renderHeight;

        this.onUpdateContainerElement(containerX, containerY, containerWidth, containerHeight);

        //update mosue offsets
        this.onUpdateMouseOffset();
    },

    onUpdateCanvasFocus: function () {
        //do we need to check focus of html element
    },

    onUpdateCanvasElement: function (x, y, width, height, renderWidth, renderHeight) {
        //modify the canvas element

        //modify the canvas
        var canvas = this.canvas;

        //save some values
        this.currentRenderWidth = renderWidth;
        this.currentRenderHeight = renderHeight;

        //render dimensions (this is the number of pixels drawn)
        if (renderWidth != canvas.width || renderHeight != canvas.height) {
            //only both changing this is if it has changed, that way we save the background
            canvas.width = renderWidth;
            canvas.height = renderHeight;
        }

        //physical dimensions (this is the size the canvas is drawn to screen, it can be scaled up to stretch the image)
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        //css styles
        canvas.style.margin = '0px';
        canvas.style.padding = '0px';
        canvas.style.display = 'block';
        canvas.style.boxSizing = 'content-box';

        //performance tweak
        canvas.style.touchAction = 'none';
        canvas.style.msTouchAction = 'none';

        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
    },

    onUpdateRootElement: function (x, y, width, height) {
        var root = this.root;

        //container
        root.style.fontSize = Math.min(this.scaleX, this.scaleY) + 'em';

        root.style.position = "absolute";
        root.style.width = width + "px";
        root.style.height = height + "px";
        root.style.left = x + "px";
        root.style.top = y + "px";
    },

    onUpdateContainerElement: function (x, y, width, height) {
        var container = this.container;

        //container
        container.style.position = "absolute";
        container.style.width = width + "px";
        container.style.height = height + "px";
        container.style.left = x + "px";
        container.style.top = y + "px";
    },

    onUpdateMouseOffset: function () {
        this.setMouseOffsets(this.parentApp.mouseOffsetX + (this.mainSprite.x * this.parentApp.scaleX), this.parentApp.mouseOffsetY + (this.mainSprite.y * this.parentApp.scaleY));
    },

    //load events
    onImageLoaded: function (image, path) {
        //process a CImage being loaded

        //pass this off to the renderer so it can decide if further action needs to take place
        this.renderer.onImageLoaded(image);
    },

    onDataLoaded: function (data, path) {
        //this replaces dataHasLoaded(), it is called after onImageLoaded() aswell as after any type of data being loaded


        this.loadingDataActive.removeObject(data);
        this.loadingDataCurrent++;
    },

    onDataLoadError: function (data, path) {

        //to continue load execution, just skip it, we can deal with this later!
        this.loadingDataActive.removeObject(data);
        this.loadingDataCurrent++;
    },

    //preloader events
    onShowPreloader: function () {
        return (this.dwOptions & CRunApp.AH2OPT_LOADDATAATSTART) != 0 || (this.frame.html5Options & CRunFrame.HTML5FOPT_DISPLAYPRELOADER) != 0;
    },

    //events
    onChangeFullScreen: function (fullScreen) {
        //change the fullscreen mode
    },

    //key events
    onKeyDown: function (event) {
        if (event) {
            // Handles key events
            var code = event.keyCode;
            this.keyBuffer[code] = true;
            this.keyNew = true;
            if (this.run != null && this.run.rhEvtProg != null) {
                this.run.rhEvtProg.onKeyDown(code);
            }
            var n;
            for (n = 0; n < this.subApps.length; n++) {
                this.subApps[n].onKeyDown(event);
            }
        }
    },

    onKeyUp: function (event) {
        if (event) {
            var code = event.keyCode;
            this.keyBuffer[code] = false;
            var n;
            for (n = 0; n < this.subApps.length; n++) {
                this.subApps[n].onKeyUp(event);
            }
        }
    },

    //mouse events
    onShowCursor: function (cursor) {
        var css = 'auto';

        switch (cursor) {
            case CRunApp.CURSOR_NONE:
                css = 'none';
                break;
            case CRunApp.CURSOR_POINTER:
                css = 'auto';
                break;
            case CRunApp.CURSOR_CROSS:
                css = 'crosshair';
                break;
            case CRunApp.CURSOR_HAND:
                css = 'pointer';
                break;
            case CRunApp.CURSOR_HELP:
                css = 'help';
                break;
            case CRunApp.CURSOR_TEXT:
                css = 'text';
                break;
            case CRunApp.CURSOR_SIZE_ALL:
                css = 'all-scroll';
                break;
            case CRunApp.CURSOR_SIZE_NE_SW:
                css = 'nesw-resize';
                break;
            case CRunApp.CURSOR_SIZE_N_S:
                css = 'ns-resize';
                break;
            case CRunApp.CURSOR_SIZE_NW_SE:
                css = 'nwse-resize';
                break;
            case CRunApp.CURSOR_SIZE_W_E:
                css = 'ew-resize';
                break;
            case CRunApp.CURSOR_NO:
                css = 'not-allowed';
                break;
            case CRunApp.CURSOR_UP:
                css = 'default';
                break;
            case CRunApp.CURSOR_WAIT:
                css = 'wait';
                break;
            case CRunApp.CURSOR_ZOOM:
                css = 'zoom-in';
                break;
            case CRunApp.CURSOR_PICK:
                css = 'pointer';
                break;
            case CRunApp.CURSOR_FILL:
                css = 'pointer';
                break;
            case CRunApp.CURSOR_HORIZONTAL_SPLIT:
                css = 'col-resize';
                break;
            case CRunApp.CURSOR_VERTICAL_SPLIT:
                css = 'row-resize';
                break;
            case CRunApp.CURSOR_COPY:
                css = 'copy';
                break;
            case CRunApp.CURSOR_MOVE:
                css = 'move';
                break;
            case CRunApp.CURSOR_SHORTCUT:
                css = 'alias';
                break;
        }

        //has it changed
        if (css != this.cursorApplied) {
            this.cursorApplied = css;
            this.canvas.style.cursor = css;
        }
    },

    onHideCursor: function () {
        this.onShowCursor(CRunApp.CURSOR_NONE);
    },

    onMouseDown: function (event) {
        //handled by target app
    },

    onMouseMove: function (event, obj, flag) {
        //handled by target app
    },

    onMouseUp: function (event) {
        //handled by target app
    },

    onMouseOut: function (event) {
        //handled by target app
    },

    onMouseWheel: function (event) {
        this.bMouseIn = true;
        if ((typeof event.wheelDelta != 'undefined')) {
            this.deltaWheel = event.wheelDelta / 40;
        } else {
            this.deltaWheel = -event.detail;
        }
        if (this.run != null && this.run.rhEvtProg != null) {
            this.run.onMouseWheel(this.deltaWheel);
        }
    },

    //touch events
    onTouchStart: function (event) {
        //handled by target app
    },

    onTouchMove: function (event) {
        //handled by target app
    },

    onTouchEnd: function (event) {
        //handled by target app
    },

    //internal
    _createRenderer: function () {
        //setup debug
        var createWebGL = (this.dwOptions & CRunApp.AH2OPT_WEBGL) != 0;


        //create renderer based on option (webGL or canvas)
        if (!this.isSubApp) {
            //what type of renderer ?
            if (createWebGL) {
                //create webgl context
                this.renderer = new CWebGLRenderer(this.canvas);
            } else {
                //create canvas context
                this.renderer = new CCanvasRenderer(this.canvas);
            }
        } else {
            //use parent renderer
            this.renderer = this.parentApp.renderer;
        }
    },

    _mouseButtonFromEvent: function (event) {
        if (event.which) {
            switch (event.which) {
                case 2:
                    return CRunApp.VK_MBUTTON;
                    break;
                case 3:
                    return CRunApp.VK_RBUTTON;
                    break;
                default:
                    return CRunApp.VK_LBUTTON;
                    break;
            }
        } else {
            switch (event.button) {
                case 2:
                    return CRunApp.VK_RBUTTON;
                    break;
                case 4:
                    return CRunApp.VK_MBUTTON;
                    break;
                default:
                    return CRunApp.VK_LBUTTON;
                    break;
            }
        }
    },

    _localStorageFilePath: function (path) {
        //prefix files in local storage so that we dont clash with anything in the future
        return "CRunAppFile::" + path;
    },

    _startContainerOverride: function () {
        //can only override when teh display is centered (i think)
        if (!this.isSubApp && !this.containerOverride && this.viewMode == CRunApp.DISPLAY_CENTER) {
            //save current state of frame for first time
            this.containerOverride = true;
            this.containerOverrideX = this.containerX;
            this.containerOverrideY = this.containerY;
        }
    },

    //internal file store

    /*
    _getFileStore: function () {
        return localStorage.getItem(CRunApp.FILE_STORE_DATABASE_PATH);
    },

    _fixFileStorePath: function (path) {
        path = CServices.stripLeadingPath(path, this.appEditorRootPath);

        path = path.split('\\').join('/');

        var start = 0;
        var end = path.length;
        while (path.charCodeAt(start) == 47) {
            start++;
        }

        while (path.charCodeAt(end) == 47) {
            end--;
        }

        if (start != 0 || end != path.length) {
            path = path.slice(start, end);
        }

        return path;
    },

    _findFileStorePath: function (path, store) {
        //make sure we have a store to deal with
        if (store == null) {
            store = this._getFileStore(store);
        }

        //split path into chunks
        parts = path.split("/");

        var parent = store.root;
        var child = null;
        var childIndex;
        var partIndex = 0;
        var children;
        var loop = true;

        //keep iterating until we dont have a parent
        while (loop) {
            loop = false;

            //get child array
            children = parent.children;

            //iterate over children, we must find a child otherwise will break out of main loop (because parent is null)
            for (childIndex = 0; childIndex < children.length; childIndex++) {
                child = children[childIndex];

                //check for patching part
                if (parts[partIndex] == child.name) {
                    //matches so lets adjust the parent and break out of this for loop
                    loop = true;
                    parent = child;
                    partIndex++;

                    break;
                }
            }

            //check for win
            if (partIndex == parts.length) {
                break;
            }

            //null this so that if the loop now ends we get no result
            child = null;
        }

        //at this stage var child will either be null or the file we wanted
        return child;
    },

    _buildFileStoreLookup: function () {
        //get the data store
        var store = localStorage.getItem(CRunApp.FILE_STORE_DATABASE_PATH);
        if (store == null) {
            //create fresh store
            store = {
                root: {
                    name: '',
                    path: '',
                    parent: null,
                    directory: true,
                    embedded: false,
                    deleted: false,
                    time: null,
                    context: null,
                    children: [],
                }
            };
        }

        //add embedded files
        if (this.embeddedFiles != null) {
            var embeddedFile;
            var path;

            for (var index = 0; index < this.embeddedFiles.length; index++) {
                embeddedFile = this.embeddedFiles[index];
                path = this._fixFileStorePath(embeddedFile.path);

                //check if we have a record of this file already
                var file = this._findFileStorePath(path, store);

                //add new
                if (file == null) {
                    file = this._addFileStorePath(path, false, true, null, embeddedFile.path, store);

                }
            }
        }

        //save this back to local storage
        localStorage.setItem(CRunApp.FILE_STORE_DATABASE_PATH, store);
    },

    _buildFileStoreParentPath:function(path, store) {
        //make sure we have a store to deal with
        if (store == null) {
            store = this._getFileStore(store);
        }

        //get path details
        var parentPath;
        var pos = path.lastIndexOf("/");
        if (pos == -1) {
            return store.root;
        } else {
            parentPath = path.slice(0, pos);
        }

        //make sure we have teh directory structure for this
        return this._buildFileStoreDirectories(parentPath, store);
    },

    _addFileStorePath: function (path, directory, embedded, time, context, store) {
        //make sure we have a store to deal with
        if (store == null) {
            store = this._getFileStore(store);
        }

        //build parent store
        var parentStore = this._buildFileStoreParentPath(path, store);

        //get the name of the new item
        var name;
        var pos = path.lastIndexOf("/");
        if (pos == -1) {
            name = path;
        } else {
            name = path.slice(pos + 1);
        }

        //check fail
        if (parentStore == null) {
            return null;
        }

        //we do :D time to add the details
        var child = {
            name: name,
            path: (parentStore.path.length ? parentStore.path + "/" : "") + name,
            parent: parentStore.path,
            directory: directory,
            embedded: embedded,
            deleted: false,
            time: time,
            context: context,
            children: (directory ? [] : null),
        }
        parentStore.children.push(child);

        //return the newly created child
        return child;
    },

    _buildFileStoreDirectories: function (path, store, time) {
        //make sure we have a store to deal with
        if (store == null) {
            store = this._getFileStore(store);
        }

        //skip
        if (path.length == 0) {
            return store.root;
        }

        //split path into chunks
        var parts = path.split("/");

        var parent = store.root;
        var child = null;
        var childIndex;
        var partIndex = 0;
        var children;
        var loop = true;
        var found = false;

        //keep iterating until we dont have a parent
        while (loop) {
            loop = false;
            found = false;

            //get child array
            children = parent.children;

            //iterate over children, we must find a child otherwise will break out of main loop (because parent is null)
            for (childIndex = 0; childIndex < children.length; childIndex++) {
                child = children[childIndex];

                //check for patching part
                if (parts[partIndex] == child.name) {
                    //check for invalid directory
                    if (!child.directory) {
                        return null;
                    }

                    //do we need to recreate this directory?
                    if (child.deleted) {
                        child.deleted = false;
                        child.time = time;
                    }

                    //so lets adjust the parent and break out of this for loop
                    loop = true;
                    found = true;
                    parent = child;
                    partIndex++;

                    break;
                }
            }

            //check for win
            if (partIndex == parts.length) {
                //finished
                break;
            } else {
                //doesnt exist so we should create it!
                if (!found) {
                    child = {
                        name: parts[partIndex],
                        path: (parent.path.length ? parent.path + "/" : "") + parts[partIndex],
                        parent: parent.path,
                        directory: true,
                        embedded: false,
                        deleted: false,
                        time: time,
                        context: null,
                        children: [],
                    };
                    children.push(child);

                    //continue loop?
                    loop = true;
                    parent = child;
                    partIndex++;

                    if (partIndex == parts.length) {
                        break;
                    }
                }
            }

            //null this so that if the loop now ends we get no result
            child = null;
        }

        //at this stage var child will either be null or the file we wanted
        return child;
    },

    _deleteFileStorePath: function (path, store, recurse) {
        //make sure we have a store to deal with
        if (store == null) {
            store = this._getFileStore(store);
        }

        //locate the path in question
        var pathStore = this._findFileStorePath(path, store);

        //check if we cant delete
        if (pathStore == null || pathStore.deleted || (pathStore.directory && !recurse)) {
            return false;
        }

        //delete it
        pathStore.deleted = true;

        //recurse (we always recurse without checking recurse flag, because function returns before trying..above)
        if (pathStore.directory) {
            var stack = [];
            var child;
            stack.concat(pathStore.children);

            while (stack.length > 0) {
                child = stack.pop();

                //set deleted
                child.deleted = true;

                //add children to stack
                if (child.directory) {
                    stack.concat(child.children);
                }
            }
        }

        return true;
    },

    _renameFileStorePath: function (oldPath, newPath, overwrite, store) {
        //TODO: not done
        //make sure we have a store to deal with
        if (store == null) {
            store = this._getFileStore(store);
        }

        //locate old path
        var oldStore = this._findFileStorePath(oldPath, store);

        //check if its valid
        if (oldStore == null || oldStore.deleted) {
            return false;
        }

        //locate new path
        var newStore = this._findFileStorePath(newStore, store);

        //we need to check if we are trying to move to an invalid place
        if (newStore != null && (!overwrite || newStore.directory != oldStore.directory || newStore.path.indexOf(oldStore.path) == 0)) {
            return false;
        }

        //make sure we have parent stores ready
        var oldParentStore = this._buildFileStoreParentPath(oldPath, store);
        if (newParentStore == null) {
            return false;
        }

        var newParentStore = this._buildFileStoreParentPath(newPath, store);
        if (newParentStore == null) {
            return false;
        }

        //remove from old PARENT
        var index;
        for (index = 0; index < oldParentStore.children.length; index++) {
            if (oldParentStore.children[index].name == oldStore.name) {
                oldParentStore.children.splice(index, 1);
            }
        }

        //copy details from old to new
        if (newStore == null) {
            newStore = this._addFileStorePath(newPath, oldStore.directory, oldStore.embedded, oldStore.time, oldStore.context, store);
        }

        //copy children to new store
        if (oldStore.directory) {
            for (index = 0; index < oldStore.children.length; index++) {
                newStore.children.push();
            }
        }
    },
    */

    //main update + draw routines
    updateLoading: function () {
        //so the preloader wont show if its disabled or the target (w10/html5) has denied it. Loading will still happen, but it will just not show a preloader
        var allowPreloader = this.onShowPreloader();

        //do we have a preloader?
        if (allowPreloader && this.preloader == null) {
            //so looks like we need to create one

            //get load type
            var loadType = -1;
            if (this.preloaderEnabled) {
                //if preloader is allowed
                loadType = this.preloaderType;
            }

            //which type are we loading
            switch (this.preloaderType) {
                case 0:
                    this.preloader = new CPreloaderImage(this)
                    break;
                case 1:
                    this.preloader = new CPreloaderFrame(this);
                    break;
                default:
                    //we still need a preloader so revert back to default loader instead
                    this.preloader = this.createDefaultPreloader();
                    break;
            }

            //reset
            this.preloaderLoaded = false;
            this.preloaderHasReset = false; // always make the preloader reset

            //block further execution
            return;
        }

        //once we get here we are executing the preloader main update routine!

        //update timer details
        this.timer = Date.now();

        //check if preloader itself is loading (not the content the preloader is tasked with loading)
        if (this.preloader != null && this.preloaderLoaded == false) {
            //the preloader is loading (was it a frame or was it an image?)
            this.preloaderLoaded = this.preloader.load();

            //block further execution
            return;
        }

        //so at this point we should proceed to start loading some data
        if (this.loadingStarted == false) {
            this.loadingStarted = true;
            this.loadingTimestamp = Date.now();
        }

        //regardless, we should start all data that needs to be loaded at the start of the frame
        while (this.loadingDataQueue.size() > 0 && this.loadingDataActive.size() < this.loadingDataStep) {
            var data = this.loadingDataQueue.get(0);
            this.loadingDataActive.add(data);
            this.loadingDataQueue.removeIndex(0);
            data.onLoadStart();
        }

        //check if we have finished loading
        var complete = false;
        if (this.loadingDataQueue.size() == 0 && this.loadingDataActive.size() == 0) {
            complete = true;
        }

        //deal with preloader
        if (allowPreloader && this.preloader != null) {
            //do we need to reset the preloader
            if (!this.preloaderHasReset) {
                this.preloader.reset();
                this.preloaderHasReset = true;

                //change to slower update rate
                Runtime.setFrameRate(CRuntime.PRELOADER_FRAMERATE);
            }

            //update preloader
            this.preloader.update();
            complete = this.preloader.isComplete();
        }

        //stop complete for debug mode

        //continue operation after loading has finished
        if (complete) {
            this.preloaderHasReset = false;
            this.run.resume();
            this.run.callComputeNewDisplay();
            this.loading = false;
            this.loadingStarted = false;
            this.imageBank.resetToLoad();
            this.soundBank.resetToLoad();
            this.fontBank.resetToLoad();
            this.loadingDataTotal = 0;
            this.loadingDataCurrent = 0;

            //need to tell the app to update view mode!
            this.resizeApplication();

            //restart frame rate after preloader (null reverts to the apps built in frame rate)
            Runtime.setFrameRate(null);

            //TODO: move this code below and in startTheFrame to a function so we are not duplicating code

            //do we have a delayed fade in to start (this would have been delayed from startTheFrame() 
            if (this.processTransitionInAfterLoad) {
                this.processTransitionInAfterLoad = false;

                //execute teh loop
                var quit = this.run.doRunLoop();
                if (quit != 0) {
                    //game over (i hink)
                    this.appRunningState = CRunApp.SL_ENDFRAME;
                } else {
                    //start the frame fade in
                    this.appRunningState = CRunApp.SL_FRAMELOOPFIRST;
                    this.startFrameTransitionIn();
                }
            }
        }
    },

    updateApplication: function () {
        var that = this;
        var result = false;


        //update timer details
        this.timer = Date.now();

        //update the virtual mouse
        if (this.parentApp == null) {
            this.updateVirtualMouse();
        }

        //call for the app to update
        if (this.isBootstrap) {
            this.renderable = true;
        } else {
            this.renderable = this.playApplication(false);
        }

        if (this.renderable) {
            //update loading (UGH)
            if (this.loading) {
                //yes, loading
                this.updateLoading();
            }

            //block more execution (eg we dont want to end the app!)
            result = true;
        }

        //end the app
        if (!result) {
            this.endApplication();
        }

        return result;
    },

    //draw api
    drawLoading: function () {
        //start render session
        this.renderer.start();

        if (this.preloader == null) {
            //apprently only fro root app
            if (this.parentApp == null) {
                //if we have no preloader we should either clear the background or use lastFrameBuffer
                if (!this.preloaderEnabled && this.lastFrameBuffer != null) {
                    //use lastframebuffer (only if no preloader enabled)
                    this.renderer.renderSimpleImage(this.lastFrameBuffer, 0, 0, this.currentRenderWidth, this.currentRenderHeight);

                } else {
                    //get the color we need
                    var color = this.frameColor;
                    if (this.preloaderEnabled && this.preloaderType == 0 && this.preloaderBackColor != -1) {
                        color = this.preloaderBackColor;
                    }

                    //no preloader so render clear background
                    if (this.frame.leClearBackground) {
                        this.renderer.clearBackground(0, 0, this.canvas.width, this.canvas.height);
                    } else {
                        this.renderer.renderFilledRect(0, 0, this.currentRenderWidth, this.currentRenderHeight, color);
                    }
                }
            }

        } else {
            //let the preloader do the rendering!
            this.preloader.render();
        }

        this.renderer.finish();
    },

    drawTransition: function () {
        //TODO: do we need resetEffect() anymore?
        this.renderer.resetEffect((this.dwOptions & CRunApp.AH2OPT_RESAMPLESTRETCH) != 0);

        //start render
        this.renderer.start();
        this.renderer.pushMatrix();
        this.renderer.setClip(this.clipX, this.clipY, this.clipWidth, this.clipHeight, false);

        if (this.renderer.isClipVisible()) {
            //render transition buffer
            this.renderer.renderSimpleImage(this.transitionBuffer, 0, 0);
        }

        //finish render
        this.renderer.popMatrix();
        this.renderer.finish();
    },

    drawApplication: function () {
        //TODO: do we need resetEffect() anymore?
        this.renderer.resetEffect((this.dwOptions & CRunApp.AH2OPT_RESAMPLESTRETCH) != 0);

        //start render
        this.renderer.start();
        this.renderer.pushMatrix();
        this.renderer.pushClip();
        this.renderer.setWorldOffset(this.run.rhWindowX, this.run.rhWindowY);
        this.renderer.setClip(this.clipX, this.clipY, this.clipWidth, this.clipHeight, false);

        if (this.renderer.isClipVisible()) {
            //clear/blank the screen
            if ((this.frame.leFlags & CRunFrame.LEF_KEEPDISPLAY) == 0 || this.lastFrameBuffer == null) {
                //nothing from previous frame so we can clear it
                if (this.frame.leClearBackground) {
                    //no color
                    this.renderer.clearBackground(0, 0, this.currentRenderWidth, this.currentRenderHeight);
                } else {
                    //use frame color
                    this.renderer.clearBackground(0, 0, this.currentRenderWidth, this.currentRenderHeight, this.frameColor);
                }
            } else {
                //clear with previous buffer
                this.renderer.renderSimpleImage(this.lastFrameBuffer, 0, 0, this.currentRenderWidth, this.currentRenderHeight, 0, 0);
            }

            //apply screen zoom settings to the matrix
            if (this.zoom) {
                //avoid any matrix calculations if we can!
                if (this.scXDest != 0.0 || this.scYDest != 0.0) {
                    this.renderer.translateMatrix(this.scXDest, this.scYDest);
                }

                if (this.scAngle != 0) {
                    this.renderer.rotateMatrix(-this.scAngle * ToRadians);
                }

                if (this.scScaleX != 1.0 || this.scScaleY != 1.0) {
                    this.renderer.scaleMatrix(Math.max(0.001, this.scScaleX), Math.max(0.001, this.scScaleY));
                }

                if (this.scXSpot != 0.0 || this.scYSpot != 0.0) {
                    this.renderer.translateMatrix(-this.scXSpot, -this.scYSpot);
                }
            }

            //start scene node draw
            this.renderer.boundingScaleX = 1.0;//this.scaleX;
            this.renderer.boundingScaleY = 1.0;//this.scaleY;
            this.renderer.boundingOffsetX = this.clipX;
            this.renderer.boundingOffsetY = this.clipY;
            this.mainSprite.draw(this.renderer, 0, 0);

            //call to debug

            //do we have a joystick to render?
            if (this.virtualJoystickCurrent != null) {
                this.virtualJoystickCurrent.render(this.renderer);
            }

            //do we have a virtual mouse to render?
            if (this.virtualMouse != null) {
                this.virtualMouse.draw();
            }
        }

        //finish render
        this.renderer.popClip();
        this.renderer.popMatrix();
        this.renderer.finish();
    },

    drawSubApplication: function (context, erase) {
        //so we are about to draw teh sub application!
        if (this.loading) {
            //loading

            //do we have last frame buffer
            if (this.lastFrameBuffer == null) {
                //nope so use frame color
                this.renderer.renderFilledRect(this.clipX, this.clipY, this.clipWidth, this.clipHeight, this.frameColor);
            } else {
                //yup so render it
                this.renderer.renderSimpleImage(this.lastFrameBuffer, this.clipX, this.clipY, this.clipWidth, this.clipHeight);
            }
        } else {
            if (this.transitionBuffer == null) {
                //render the sub application properly

                //start render
                this.renderer.start();
                this.renderer.pushMatrix();
                this.renderer.pushClip();

                //apply clip (in world coord)
                this.renderer.addClip(this.clipX, this.clipY, this.clipWidth, this.clipHeight, false);

                if (this.renderer.isClipVisible()) {
                    //render the background
                    if (!erase) {
                        this.renderer.clearBackground(this.clipX, this.clipY, this.clipWidth, this.clipHeight, this.frameColor);
                    }

                    //draw the sub app, we need to 
                    this.renderer.boundingScaleX = this.scaleX;
                    this.renderer.boundingScaleY = this.scaleY;
                    this.renderer.boundingOffsetX = this.clipX;
                    this.renderer.boundingOffsetY = this.clipY;
                    this.mainSprite.draw(this.renderer, 0, 0);
                }

                //finish render
                this.renderer.popClip();
                this.renderer.popMatrix();
                this.renderer.finish();
            } else {
                //render the transition

                //TODO: do we need resetEffect() anymore?
                this.renderer.resetEffect();
                this.renderer.renderSimpleImage(this.transitionBuffer, this.clipX, this.clipY, this.containerWidth, this.containerHeight, 0, 0);
            }
        }
    },

    //frame api
    getFrameWidth: function () {
        if (this.frame) {
            return this.frame.leEditWinWidth;
        } else {
            return this.gaCxWin;
        }
    },

    getFrameHeight: function () {
        if (this.frame) {
            return this.frame.leEditWinHeight;
        } else {
            return this.gaCyWin;
        }
    },

    //prelaoder api
    createDefaultPreloader: function () {
        //create a default preloader
        return new CPreloaderProgress(this);
    },

    //api
    bootstrap: function (callback) {
        //start a bare bones enviroment we can use (todo: certain things may not work when used)
        this.isBootstrap = true;
        this.unicode = true;
        this.appName = 'bootstrap';

        //create default values
        this.appRunningState = CRunApp.SL_FRAMELOOP;

        this.OIList = new COIList();
        this.imageBank = new CImageBank(this);
        this.fontBank = new CFontBank(this);
        this.soundBank = new CSoundBank(this);
        this.soundPlayer = new CSoundPlayer(this);

        this.pcCtrlKeys = new Array(CRunApp.MAX_PLAYER * CRunApp.MAX_KEY);

        this.appEditorFilePath = 'c:\\fusion\\bootstrap.mfa';
        this.appEditorRootPath = CServices.stripFileName(this.appEditorFilePath);

        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;

        this.currentFrame = -2;

        this.touchDelegates = new CArrayList();
        this.touchesID = new Array(CRunApp.MAX_TOUCHES);
        this.touchesLocked = new Array(CRunApp.MAX_TOUCHES);
        this.touchesLocked = new Array(CRunApp.MAX_TOUCHES);
        this.touchesX = new Array(CRunApp.MAX_TOUCHES);
        this.touchesY = new Array(CRunApp.MAX_TOUCHES);
        this.keyBuffer = new Array(CRunApp.MAX_VK);
        for (var n = 0; n < CRunApp.MAX_VK; n++) {
            this.keyBuffer[n] = false;
        }
        this.mainSprite = new CSceneNode();


        //create frame
        this.frame = new CRunFrame(this);
        this.frame.frameName = this.appName;
        this.frame.LOList = new CLOList();
        this.frame.leVirtualRect = new CRect();
        this.frame.mosaicHandles = new Array();
        //this.frame.evtProg = new CEventProgram(this);

        //create run
        this.run = new CRun(this);
        this.run.setFrame(this.frame);
        //this.run.allocRunHeader();

        //finish setting up event program
        /*
        this.frame.evtProg.rhPtr = this.run;
        this.frame.evtProg.listPointers = new Array(100);
        for (var n = 0; n < this.frame.evtProg.listPointers.length; n++) {
            this.frame.evtProg.listPointers[n] = 0;
        }
        */

        //setup colors
        this.gaBorderColour = CServices.RGBFlash(128, 128, 128);
        this.frame.leBackground = CServices.RGBFlash(255, 255, 255);

        //setup display
        this.viewMode = CRunApp.DISPLAY_STRETCHTOFILL;
        this.dwOptions |= CRunApp.AH2OPT_WEBGL;

        this.gaCxWin = 640;
        this.gaCyWin = 480;
        this.gaFrameRate = 60;

        this.frame.leWidth = 640;
        this.frame.leHeight = 480;

        //finish setting up
        this.gaBorderColour = this.frameColor
        this.frame.leEditWinWidth = Math.min(this.gaCxWin, this.frame.leWidth);
        this.frame.leEditWinHeight = Math.min(this.gaCyWin, this.frame.leHeight);
        this.run.rh3WindowSx = this.gaCxWin;
        this.run.rh3WindowSy = this.gaCyWin;

        //create renderer
        this._createRenderer();

        //setup
        this.onSetupWindow();
        this.onChangeWindowColor(this.gaBorderColour);
        this.onSetupEvents();
        this.resizeApplication();
        Runtime.setFrameRate(null);

        //setup renderer. The renderer is responsible for continuing the application
        this.renderer.onLoad(function () {
            //intiate updating!
            this.canvas.focus();
            Runtime.startUpdates();

            //fire back to the caller to say ready
            callback(this);
        }.bind(this))
    },

    load: function () {
        var that = this;

        //reset file list
        this.numberOfFiles = this.file.readAShort();
        this.currentFile = 1;

        //start loading teh first file
        this.loadingFile = new CFile();
        var size = this.file.readAInt();
        var filePath = this.path.substring(0, this.path.length - 1) + this.currentFile.toString();

        //call the loading file with anonymoud callback
        this.loadingFile.openFileAsync(filePath, function (success, file) {
            that.loadApplication();
        }, size);
    },

    loadApplication: function () {
        var that = this;

        //move file list pointer
        this.currentFile++;

        //is this the last file to load?
        if (this.currentFile > this.numberOfFiles) {
            var zip = new JSZip(this.loadingFile.getBytes(), "content");
            var unzipped = zip.file("Application.ccj").asBinary();
            this.loadingFile = null;
            this.file = new CFile();
            this.file.setBinary(unzipped);
            this.digest();

            //setup window
            if (!this.isSubApp) {
                this.onSetupWindow();
                this.onChangeWindowColor(this.gaBorderColour);
            }

            //setup renderer. The renderer is responsible for continuing the application
            this.renderer.onLoad(function() {
                this.startApplication();
            }.bind(this))

            //we are finished loading
            return;
        }

        //need to load another file!
        var size = this.file.readAInt();
        var filePath = this.path.substring(0, this.path.length - 1) + this.currentFile.toString();
        this.loadingFile.openFileAsync(filePath, function (success, file) {
            that.loadApplication();
        }, size);
    },

    digest: function () {
        // Charge le mini-header
        this.file.seek(0);
        var b = this.file.readBuffer(4);
        this.unicode = false;
        if (b[0] == 80 && b[1] == 65 && b[2] == 77 && b[3] == 85) {
            this.unicode = true;
        }
        this.file.setUnicode(this.unicode);
        this.file.skipBytes(8);
        this.file.skipBytes(4);

        // Reserve les objets
        this.OIList = new COIList();
        this.imageBank = new CImageBank(this);
        this.fontBank = new CFontBank(this);
        this.soundBank = new CSoundBank(this);
        this.soundPlayer = new CSoundPlayer(this);

        // Lis les chunks
        var posEnd;
        var nbPass = 0, n;
        var chID = 0;
        var chFlags;
        var chSize;
        while (chID != 0x7F7F) {
            chID = this.file.readAShort();
            chFlags = this.file.readAShort();
            chSize = this.file.readAInt();

            if (chSize == 0) {
                continue;
            }
            posEnd = this.file.getFilePointer() + chSize;

            switch (chID) {
                // CHUNK_APPHEADER
                case 0x2223:
                    this.loadAppHeader();
                    // Buffer pour les offsets frame
                    this.frameOffsets = new Array(this.gaNbFrames);
                    this.frameEffects = new Array(this.gaNbFrames);
                    this.frameEffectParams = new Array(this.gaNbFrames);

                    // Pour les password
                    this.framePasswords = new Array(this.gaNbFrames);
                    for (n = 0; n < this.gaNbFrames; n++) {
                        this.framePasswords[n] = null;
                    }

                    break;

                // CHUNK_APPHDR2
                case 0x2245:
                    this.dwOptions = this.file.readAInt();
                    this.dwBuildType = this.file.readAInt();
                    this.dwBuildFlags = this.file.readAInt();
                    this.wScreenRatioTolerance = this.file.readAShort();
                    this.wScreenAngle = this.file.readAShort();
                    this.viewMode = this.file.readAShort();

                    break;
                // CHUNK_APPNAME
                case 0x2224:
                    this.appName = this.file.readAString();
                    break;
                // Target file name
                case 0x222E:        // CHUNK_APPEDITORFILENAME:
                    this.appEditorFilePath = this.file.readAString();
                    this.appEditorRootPath = CServices.stripFileName(this.appEditorFilePath);
                    break;
                // CHUNK_GLOBALVALUES
                case 0x2232:
                    this.loadGlobalValues();
                    break;
                // CHUNK_GLOBALSTRINGS
                case 0x2233:
                    this.loadGlobalStrings();
                    break;
                // CHUNK_FRAMEITEMS
                // CHUNK_FRAMEITEMS_2
                case 0x2229:
                case 0x223F:
                    this.extLoader = new CExtLoader(this);
                    this.extLoader.createList(this.file);
                    this.OIList.preLoad(this.file);
                    break;
                // CHUNK_FRAMEHANDLES
                case 0x222B:
                    this.loadFrameHandles(chSize);
                    break;
                // CHUNK_FRAME
                case 0x3333:
                    // Repere les positions des frames dans le fichier
                    this.frameOffsets[this.frameMaxIndex] = this.file.getFilePointer();
                    var frID = 0;
                    var frFlags;
                    var frSize;
                    while (frID != 0x7F7F)        // CHUNK_LAST
                    {
                        frID = this.file.readAShort();
                        frFlags = this.file.readAShort();
                        frSize = this.file.readAInt();

                        if (frSize == 0) {
                            continue;
                        }
                        var frPosEnd = this.file.getFilePointer() + frSize;

                        switch (frID) {
                            case 0x3334:
                                if (this.frameMaxIndex == 0) {
                                    this.file.skipBytes(2 * 4);
                                    this.firstFrameColor = this.file.readAColor();
                                }
                                break;
                            case 0x3336:
                                this.framePasswords[this.frameMaxIndex] = this.file.readAString();
                                break;
                            case 0x3349:
                                this.frameEffects[this.frameMaxIndex] = this.file.readAInt();
                                this.frameEffectParams[this.frameMaxIndex] = this.file.readAInt();
                                break;
                            // CHUNK_MOSAICIMAGETABLE
                            case 0x3348:
                                var number = frSize / (3 * 2);
                                var n;
                                for (n = 0; n < number; n++) {
                                    var handle = this.file.readAShort();
                                    this.file.skipBytes(4);
                                    if (handle != 0) {
                                        this.mosaics[handle] = 1;
                                        this.mosaicMaxHandle = Math.max(this.mosaicMaxHandle, handle + 1);
                                    }
                                }
                                break;
                        }
                        this.file.seek(frPosEnd);
                    }
                    this.frameMaxIndex++;
                    break;

                //CHUNK CHUNK_WUAOPTIONS (this might also contain flags universal to all html5 runtimes)
                case 0x2252:
                    var flags = this.file.readAShort();

                    this.virtualMouseOptionVisible = (flags & CRunApp.FLAG_VIRTUAL_MOUSE_VISIBLE) != 0 ? CVirtualMouse.VISIBLE : CVirtualMouse.HIDDEN;
                    this.virtualMouseOptionNative = (flags & CRunApp.FLAG_VIRTUAL_MOUSE_NATIVE) != 0;
                    this.virtualMouseOptionAnalog = (flags & CRunApp.FLAG_VIRTUAL_MOUSE_ANALOG) != 0;
                    this.virtualMouseOptionSupress = (flags & CRunApp.FLAG_VIRTUAL_MOUSE_SUPPRESSINPUT) != 0;
                    this.virtualMouseOptionEnabled = this.file.readAShort();
                    this.virtualMouseOptionSpeed = this.file.readAShort();
                    this.virtualMouseOptionBounds = this.file.readAShort();
                    this.virtualMouseOptionAnalogSpeedMultiplier = this.file.readAShort() / 100.0;//convert fusion 100 based percent value into 1.0 based float
                    this.virtualMouseOptionCursorIdleOffsetX = this.file.readAShort();
                    this.virtualMouseOptionCursorIdleOffsetY = this.file.readAShort();
                    this.virtualMouseOptionCursorLeftDownOffsetX = this.file.readAShort();
                    this.virtualMouseOptionCursorLeftDownOffsetY = this.file.readAShort();
                    this.virtualMouseOptionCursorRightDownOffsetX = this.file.readAShort();
                    this.virtualMouseOptionCursorRightDownOffsetY = this.file.readAShort();

                    break;

                // CHUNK_BINARYFILES
                case 0x2238:
                    var nFiles = this.file.readAInt();
                    this.embeddedFiles = new Array(nFiles);
                    for (n = 0; n < nFiles; n++) {
                        this.embeddedFiles[n] = new CEmbeddedFile(this);
                        this.embeddedFiles[n].preLoad();
                    }
                    break;
                // CHUNK_IMAGE
                case 0x6666:
                    this.imageBank.preLoad(this.file);
                    break;
                // CHUNK_FONT
                case 0x6667:
                    this.fontBank.preLoad(this.file);
                    break;
                // CHUNK_SOUNDS
                case 0x6668:
                    this.soundBank.preLoad(this.file);
                    break;
            }

            // Positionne a la fin du chunk
            this.file.seek(posEnd);
        }

        //setup renderer
        this._createRenderer();

        // Fixe le flags multiple samples
        this.soundPlayer.setMultipleSounds((this.gaFlags & CRunApp.GA_MIX) != 0);

        // Cree le sprite principal, all draw operations stem from "main sprite"
        if (this.parentApp == null) {
            //if we are a sub app then this sprite ref is set via onSetupParentApp called from CCCA
            this.mainSprite = new CSceneNode();

        }
    },

    initScreenZoom: function () {
        this.zoom = false;
        this.scAngle = 0;
        this.scScale = this.scScaleX = this.scScaleY = 1.0;
        this.scXSpot = this.scXDest = this.gaCxWin / 2;
        this.scYSpot = this.scYDest = this.gaCyWin / 2;
    },

    startApplication: function () {
        //ios sound hack!
        if (this.iOS && this.soundBank.nHandlesReel > 0) { // && (this.dwOptions & CRunApp.AH2OPT_LOADSOUNDSONTOUCH) != 0) {
            this.silentSound = new CSound(this);
            this.silentSound.queueLoadSilentSample();
        }

        //setup sys events
        this.sysEvents = new CArrayList();

        //setup keys
        this.keyBuffer = new Array(CRunApp.MAX_VK);
        var n;
        for (n = 0; n < CRunApp.MAX_VK; n++) {
            this.keyBuffer[n] = false;
        }

        //setup touch
        this.touchDelegates = new CArrayList();
        this.touchesID = new Array(CRunApp.MAX_TOUCHES);
        this.touchesLocked = new Array(CRunApp.MAX_TOUCHES);
        this.touchesLocked = new Array(CRunApp.MAX_TOUCHES);
        this.touchesX = new Array(CRunApp.MAX_TOUCHES);
        this.touchesY = new Array(CRunApp.MAX_TOUCHES);

        for (n = 0; n < CRunApp.MAX_TOUCHES; n++) {
            this.touchesID[n] = CRunApp.TOUCHID_EMPTY;
            this.touchesX[n] = 0;
            this.touchesY[n] = 0;
            this.touchesLocked[n] = false;
            this.touchesLocked[n] = 0;
        }

        //do root/sub app setup
        if (this.parentApp == null) {
            this.onSetupEvents();
        }

        //finish setting up
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.appRunningState = 0;
        this.currentFrame = -2;
        this.run = new CRun(this);

        //request the first update
        if (this.parentApp == null) {
            this.canvas.focus();
            Runtime.startUpdates();
        }
    },

    resizeApplication: function () {
        //this is called at the start or when the screen mode/size changes
        this.updateLayout();

        //call for objects to resize
        if (this.run) {
            this.run.autoResize();
        }
    },

    resetKeyBuffer: function () {
        var n;
        for (n = 0; n < CRunApp.MAX_VK; n++) {
            this.keyBuffer[n] = false;
        }
    },

    renderFrameToBuffer: function (keepPreviousFrame) {
        //this will render the current frame to a new buffer. The buffer is in a format that is understood by any version of teh renderer

        var buffer = this.createImageBuffer(this.currentRenderWidth, this.currentRenderHeight);

        this.renderer.pushMatrix();
        this.renderer.pushClip();
        buffer.start();

        //clear
        if ((this.frame.leFlags & CRunFrame.LEF_KEEPDISPLAY) != 0 && keepPreviousFrame) {
            //clear with previous frame
            buffer.drawSimpleImage(this.lastFrameBuffer, 0, 0, this.currentRenderWidth, this.currentRenderHeight, 0, 0);
        } else {
            //clear with frame color
            buffer.clear(this.frameColor);
        }

        //draw frame
        buffer.drawSceneNode(this.mainSprite, 0, 0, this.isSubApp);

        buffer.finish();
        this.renderer.popClip();
        this.renderer.popMatrix();

        //return for chaining
        return buffer;
    },

    playApplication: function (onlyRestartApp) {
        this.onUpdateCanvasFocus();

        var continueLoop = true;
        var bContinue = true;

        //continue processing in a loop until continueLoop is set to false. This allows us to process many modes in 1 update
        do {
            switch (this.appRunningState) {
                case CRunApp.SL_RESTART:
                    //restart the app please
                    this.initGlobal();
                    this.nextFrame = this.startFrame;
                    this.appRunningState = 1;
                    this.killGlobalData();

                    if (onlyRestartApp) {
                        continueLoop = false;
                        break;
                    }

                case CRunApp.SL_STARTFRAME:
                    //do we need to change the frame?
                    if (this.nextFrame != this.currentFrame) {
                        this.frame = new CRunFrame(this);
                        this.frame.loadFullFrame(this.nextFrame);
                    }

                    //start it
                    this.startTheFrame();
                    break;

                case CRunApp.SL_FRAMEFADEINLOOP:
                    //update transition in
                    if (!this.updateFrameTransitionIn()) {
                        //it has ended
                        this.endFrameTransitionIn();

                        //what next?
                        if (this.appRunningState == CRunApp.SL_QUIT || this.appRunningState == CRunApp.SL_RESTART) {
                            this.endFrame();
                        }

                    } else {
                        //transition in has not finished yet
                        continueLoop = false;
                    }
                    break;

                case CRunApp.SL_FRAMELOOPFIRST:
                    this.appRunningState = CRunApp.SL_FRAMELOOP;

                    //do we need to set default mouse coords
                    if (!this.mouseRawInitialized) {
                        this.mouseRawInitialized = true;

                        //move the mouse
                        this.onMouseMove({
                            pageX: this.containerX + (this.containerWidth / 2),
                            pageY: this.containerY + (this.containerHeight / 2),
                        }, 0x12345678);

                        //update virtual mouse
                        this.positionVirtualMouse();
                    }
                    break;

                case CRunApp.SL_FRAMELOOP:

                    this.run.doRunLoop();

                    if (this.run.rhQuit != 0) {
                        //first capture the old frame into the buffer
                        this.lastFrameBuffer = this.renderFrameToBuffer(true);

                        //check if we need to fade out
                        if (this.startFrameTransitionOut()) {
                            //yup
                            this.appRunningState = CRunApp.SL_FRAMEFADEOUTLOOP;
                        } else {
                            //nope, so end the frame now!
                            this.endFrame();
                        }

                    } else {
                        //the frame is now executing as normal!
                        continueLoop = false;

                        //check to see if we can discard the hold of lastFrameBuffer
                        if ((this.frame.leFlags & CRunFrame.LEF_KEEPDISPLAY) == 0 && this.lastFrameBuffer != null) {
                            //this.lastFrameBuffer.free();
                            //this.lastFrameBuffer = null;
                        }
                    }
                    break;

                case CRunApp.SL_FRAMEFADEOUTLOOP:
                    //update transition out
                    if (!this.updateFrameTransitionOut()) {
                        //it has ended
                        this.endFrameTransitionOut();

                        //whats next?
                        if (this.appRunningState == CRunApp.SL_QUIT || this.appRunningState == CRunApp.SL_RESTART) {
                            this.endFrame();
                        }
                    } else {
                        //transition out has not finished yet
                        continueLoop = false;
                    }
                    break;

                case CRunApp.SL_ENDFRAME:
                    this.endFrame();
                    break;

                default:
                    continueLoop = false;
                    break;
            }
        } while (continueLoop);

        // Quit ?
        if (this.appRunningState == CRunApp.SL_QUIT) {
            bContinue = false;
        }
        // Continue?

        return bContinue;
    },

    endApplication: function () {
        //stop all sounds
        if (this.soundPlayer != null) {
            this.soundPlayer.stopAllSounds();
        }

        //call internal event
        this.onEnd();
    },

    startTheFrame: function () {
        this.frameColor = this.frame.leBackground;
        this.currentFrame = this.nextFrame;

        // Init runtime variables
        this.frame.leX = this.frame.leY = 0;
        this.frame.leLastScrlX = this.frame.leLastScrlY = 0;
        this.frame.rhOK = false;
        this.initScreenZoom();

        //do actions based on app or sub-app
        this.xOffset = 0;
        this.yOffset = 0;

        //[moved below in this function] update the window if we had a previous frame. This is because the app will already have done this during the loading routine otherwise!
        //this.resizeApplication();

        //create all of the planes for each layer. The planes are what contain backdrops, sprites(AO) and other things
        for (var n = 0; n < this.frame.nLayers; n++) {
            this.frame.layers[n].createPlanes(this.xOffset, this.yOffset);
        }

        //setup teh document title with frame details
        if (this.frame.leFlags & CRunFrame.LEF_DISPLAYNAME) {
            document.title = this.frame.frameName;
        }

        if (this.frame.leFlags & CRunFrame.LEF_TRANSPARENTBKD) {
            this.frame.leClearBackground = true;
        }

        //process this frame
        this.run.setFrame(this.frame);

        this.run.initRunLoop(this.frame.fadeIn != null);//this also draws the backdrop...?

        //update the window if we had a previous frame. This is because the app will already have done this during the loading routine otherwise!
        this.resizeApplication();

        this.appRunningState = CRunApp.SL_FRAMELOOPFIRST;

        //check for fade in
        if (this.frame.fadeIn != null) {
            //we have a fade in transition to contend with, check if we are currently loading the frame?
            if (this.loading) {
                //we are currentlt loading so delay teh frame transition until after load. This is then processed in updateApplication()
                this.processTransitionInAfterLoad = true;
            } else {
                //we are not loading so
                var quit = this.run.doRunLoop();
                if (quit != 0) {
                    //insta end frame!
                    this.appRunningState = CRunApp.SL_ENDFRAME;
                } else {
                    //start teh fade in
                    this.run.callComputeNewDisplay();

                    this.appRunningState = CRunApp.SL_FRAMELOOPFIRST;
                    this.startFrameTransitionIn();
                }
            }
        } else {
            //compute first display
            this.run.callComputeNewDisplay();
        }

        //pause if we are loading
        if (this.loading) {
            this.run.pause(true);
        }


    },

    resetLayers: function () {
        if (this.parentApp != null) {
            this.xOffset = 0;
            this.yOffset = 0;
        } else {
            //dont need to set offset anymore...
            this.xOffset = 0;//this.gaCxWin / 2 - this.frame.leEditWinWidth / 2;
            this.yOffset = 0;//this.gaCyWin / 2 - this.frame.leEditWinHeight / 2;
        }
        var n;
        for (n = 0; n < this.frame.nLayers; n++) {
            this.frame.layers[n].resetPlanes(this.xOffset, this.yOffset);
        }
    },

    endFrame: function () {
        var ul;
        ul = this.run.killRunLoop(false);

        if ((this.gaNewFlags & CRunApp.GANF_RUNFRAME) != 0) {
            this.appRunningState = CRunApp.SL_QUIT;
        } else {
            switch (CServices.LOWORD(ul)) {
                case 1:
                    this.nextFrame = this.currentFrame + 1;
                    if (this.preloaderType == 1 && this.nextFrame == this.preloaderFrameNumber) {
                        this.nextFrame++;
                    }
                    this.appRunningState = CRunApp.SL_STARTFRAME;
                    if (this.nextFrame >= this.gaNbFrames) {
                        this.appRunningState = CRunApp.SL_QUIT;
                    }
                    break;
                case 2:
                    this.nextFrame = Math.max(0, this.currentFrame - 1);
                    if (this.preloaderType == 1 && this.nextFrame == this.preloaderFrameNumber) {
                        if (this.nextFrame == 0) {
                            this.nextFrame = this.currentFrame;
                        } else {
                            this.nextFrame--;
                        }
                    }
                    this.appRunningState = CRunApp.SL_STARTFRAME;
                    break;
                case 3:
                    this.appRunningState = CRunApp.SL_STARTFRAME;
                    if ((CServices.HIWORD(ul) & 0x8000) != 0) {
                        this.nextFrame = CServices.HIWORD(ul) & 0x7FFF;
                        if (this.nextFrame >= this.gaNbFrames) {
                            this.nextFrame = this.gaNbFrames - 1;
                        }
                        if (this.nextFrame < 0) {
                            this.nextFrame = 0;
                        }
                    }
                    else {
                        if (CServices.HIWORD(ul) < this.frameMaxHandle) {
                            this.nextFrame = this.frameHandleToIndex[CServices.HIWORD(ul)];
                            if (this.nextFrame == -1) {
                                this.nextFrame = this.currentFrame + 1;
                            }
                        }
                        else {
                            this.nextFrame = this.currentFrame + 1;
                        }
                    }
                    break;

                case 4:
                    this.appRunningState = CRunApp.SL_RESTART;
                    this.nextFrame = this.startFrame;
                    break;

                default:
                    this.appRunningState = CRunApp.SL_QUIT;
                    break;
            }
        }

        if (this.appRunningState == CRunApp.SL_STARTFRAME) {
            // If invalid frame number, quit current game
            if (this.nextFrame < 0 || this.nextFrame >= this.gaNbFrames) {
                this.appRunningState = this.currentFrame;
            }
        }

        if (this.appRunningState != CRunApp.SL_STARTFRAME || this.nextFrame != this.currentFrame) {
            var n;
            for (n = 0; n < this.frame.nLayers; n++) {
                this.frame.layers[n].deletePlanes();
            }

            this.frame = null;
            this.currentFrame = -1;
        }
    },

    isPaused: function () {
        return this.run.rh2PauseCompteur != 0;
    },

    updateLayout: function () {
        //what are we updating?
        if (!this.isSubApp) {
            //root app
            this.onUpdateRootAppLayout();
        } else {
            //sub app
            this.onUpdateSubAppLayout();
        }

        //update virtual joystick
        if (this.virtualJoystick != null) {
            this.virtualJoystick.updateLayout();
        }

        //handle child apps
        for (var n = 0; n < this.subApps.length; n++) {
            this.subApps[n].updateLayout();
        }
    },

    //data api
    addDataToLoad: function (data) {
        this.loadingDataQueue.add(data);
        this.loadingDataTotal++;

        this.loading = true;
        this.loadingTimestamp = Date.now();
    },

    //frame override api
    setContainerOverrideX: function (x) {
        this._startContainerOverride();

        //override still may not be active (based on window sizing mode)
        if (this.containerOverride && x != this.containerOverrideX) {
            this.containerOverrideX = x;

            this.resizeApplication();
        }
    },

    setContainerOverrideY: function (y) {
        this._startContainerOverride();

        //override still may not be active (based on window sizing mode)
        if (this.containerOverride && y != this.containerOverrideY) {
            this.containerOverrideY = y;

            this.resizeApplication();
        }
    },

    getContainerOverrideX: function () {
        if (this.containerOverride) {
            return this.containerOverrideX;
        } else {
            return this.containerX;
        }
    },

    getContainerOverrideY: function () {
        if (this.containerOverride) {
            return this.containerOverrideY;
        } else {
            return this.containerY;
        }
    },

    //fade in
    startFrameTransitionIn: function () {
        var pData = this.frame.fadeIn;

        if (pData != null) {
            var buffer1 = null;
            var buffer2 = null;

            //get dimensions for the buffers that need creating
            var width = this.currentRenderWidth;
            var height = this.currentRenderHeight;

            //prepare buffer 1
            if ((pData.transFlags & CTransitionData.TRFLAG_COLOR) != 0 || this.lastFrameBuffer == null) {
                //solid color background
                buffer1 = this.createImageBuffer(width, height);
                buffer1.start();
                buffer1.clear(pData.transColor);
                buffer1.finish();

            } else {
                //use the this.lastFrameBuffer for this buffer, however we should resize it
                buffer1 = this.createImageBuffer(width, height);
                buffer1.start();
                buffer1.clear(pData.transColor);
                buffer1.drawSimpleImage(this.lastFrameBuffer, 0, 0, width, height);
                buffer1.finish();
            }

            //prepare buffer 2
            buffer2 = this.createImageBuffer(width, height);
            buffer2.start();
            buffer2.clear(this.frameColor);
            buffer2.drawSceneNode(this.mainSprite, 0, 0, this.isSubApp);
            buffer2.finish();

            //create the final display buffer (that teh transition will update)
            this.transitionBuffer = this.createImageBuffer(width, height);
            this.transitionBuffer.start();
            this.transitionBuffer.clear(pData.transColor);
            this.transitionBuffer.finish();

            //create the transition and check it worked!
            this.transition = this.getTransitionManager().createTransition(pData, this.transitionBuffer, buffer1, buffer2);

            //free our hold onto the buffers as the transition should have .use() them by now (this is ref counted)
            buffer1.free();
            buffer2.free();

            //check to see if we can return
            if (this.transition != null) {
                this.appRunningState = CRunApp.SL_FRAMEFADEINLOOP;
                return true;
            }
        }

        this.appRunningState = CRunApp.SL_FRAMELOOPFIRST;

        this.run.createRemainingFrameObjects();

        return false;
    },

    updateFrameTransitionIn: function () {
        if (this.transition != null) {
            //check if transition has completed?
            if (this.transition.isCompleted()) {
                return false;
            }

            //nope so carry on updating the buffer
            this.transition.update(CTrans.TRFLAG_FADEIN);
            return true;
        }

        //no transition so escape return
        return false;
    },

    endFrameTransitionIn: function () {
        if (this.transition != null) {
            //end the transition
            this.transition.end();

            //free the transition
            this.transition.free();
            this.transition = null;

            //free transition buffer
            this.transitionBuffer.free();
            this.transitionBuffer = null;

            //update running state
            if (this.appRunningState == CRunApp.SL_FRAMEFADEINLOOP) {
                this.appRunningState = CRunApp.SL_FRAMELOOPFIRST;
            }

            this.run.createRemainingFrameObjects();
        }
        return true;
    },

    //fade out
    startFrameTransitionOut: function () {
        var buffer1 = null;
        var buffer2 = null;
        var pData = this.frame.fadeOut;

        if (pData != null) {
            //get dimensions for the buffers that need creating
            var width = this.currentRenderWidth;
            var height = this.currentRenderHeight;

            //add ownership ref count to the last frame buffer
            buffer1 = this.lastFrameBuffer.use();

            //prepare buffer 2 (which will be a frame color as this is a fade out)
            buffer2 = this.createImageBuffer(width, height);
            buffer2.start();

            if ((pData.transFlags & CTransitionData.TRFLAG_COLOR) != 0) {
                //clear background
                buffer2.clear(pData.transColor);
            } else {
                //clear background
                buffer1.clear(this.gaBorderColour);
            }
            buffer2.finish();

            //create the final display buffer (that teh transition will update)
            this.transitionBuffer = this.createImageBuffer(width, height);
            this.transitionBuffer.start();
            this.transitionBuffer.finish();

            //create the transition and check it worked!
            this.transition = this.getTransitionManager().createTransition(pData, this.transitionBuffer, buffer1, buffer2);

            //free our hold onto the buffers as the transition should have .use() them by now (this is ref counted)
            buffer1.free();
            buffer2.free();

            if (this.transition != null) {
                this.appRunningState = CRunApp.SL_FRAMEFADEOUTLOOP;
                return true;
            }
        }

        return false;
    },

    updateFrameTransitionOut: function () {
        if (this.transition != null) {
            if (this.transition.isCompleted()) {
                this.endFrameTransitionOut();
                return false;
            }

            //update transition
            this.transition.update(CTrans.TRFLAG_FADEOUT);
        }
        return true;
    },

    endFrameTransitionOut: function () {
        if (this.transition != null) {
            //take ownership back of buffer2 and store it in teh old pointer

            //free last frame buffer if there was one
            if (this.lastFrameBuffer != null) {
                //this.lastFrameBuffer.free();
                //this.lastFrameBuffer = null;
            }

            //take ownership of transition newbuffer as lastFrameBuffer
            this.lastFrameBuffer = this.transition.newBuffer.use();

            //end the transition
            this.transition.end();

            //free the transition
            this.transition.free();
            this.transition = null;

            //free display buffer
            this.transitionBuffer.free();
            this.transitionBuffer = null;

            if (this.appRunningState == CRunApp.SL_FRAMEFADEOUTLOOP) {
                this.appRunningState = CRunApp.SL_ENDFRAME;
            }
        }
        return true;
    },

    //transition
    pauseTransition: function () {
        if (this.transition != null) {
            this.transition.pause();
        }
    },

    resumeTransition: function () {
        if (this.transition != null) {
            this.transition.resume();
        }
    },

    getTransitionManager: function () {
        if (this.transitionManager == null) {
            this.transitionManager = new CTransitionManager(this);
        }
        return this.transitionManager;
    },

    //api
    loadAppHeader: function () {
        this.file.skipBytes(4);
        this.gaFlags = this.file.readAShort();
        this.gaNewFlags = this.file.readAShort();
        this.gaMode = this.file.readAShort();
        this.gaOtherFlags = this.file.readAShort();
        this.gaCxWin = this.file.readAShort();
        this.gaCyWin = this.file.readAShort();
        this.gaScoreInit = this.file.readAInt();
        this.gaLivesInit = this.file.readAInt();
        var n, m;
        this.pcCtrlType = new Array(CRunApp.MAX_PLAYER);
        for (n = 0; n < CRunApp.MAX_PLAYER; n++) {
            this.pcCtrlType[n] = this.file.readAShort();
        }
        this.pcCtrlKeys = new Array(CRunApp.MAX_PLAYER * CRunApp.MAX_KEY);
        for (n = 0; n < CRunApp.MAX_PLAYER; n++) {
            for (m = 0; m < CRunApp.MAX_KEY; m++) {
                this.pcCtrlKeys[n * CRunApp.MAX_KEY + m] = this.file.readAShort();    //CKeyConvert.getFlashKey(file.readAShort());
            }
        }
        this.gaBorderColour = this.file.readAColor();
        this.gaNbFrames = this.file.readAInt();
        this.gaFrameRate = this.file.readAInt();
        this.file.skipBytes(1);
        this.file.skipBytes(3);
    },

    loadGlobalValues: function () {
        this.nGlobalValuesInit = this.file.readAShort();
        this.globalValuesInit = new Array(this.nGlobalValuesInit);
        this.globalValuesInitTypes = new Array(this.nGlobalValuesInit);
        var n;
        for (n = 0; n < this.nGlobalValuesInit; n++) {
            this.globalValuesInit[n] = this.file.readAInt();
        }
        this.file.readBytesAsArray(this.globalValuesInitTypes);
    },

    loadGlobalStrings: function () {
        this.nGlobalStringsInit = this.file.readAInt();
        this.globalStringsInit = new Array(this.nGlobalStringsInit);
        var n;
        for (n = 0; n < this.nGlobalStringsInit; n++) {
            this.globalStringsInit[n] = this.file.readAString();
        }
    },

    loadFrameHandles: function (size) {
        this.frameMaxHandle = (size / 2);
        this.frameHandleToIndex = new Array(this.frameMaxHandle);

        var n;
        for (n = 0; n < this.frameMaxHandle; n++) {
            this.frameHandleToIndex[n] = this.file.readAShort();
        }
    },

    HCellToNCell: function (hCell) {
        if (this.frameHandleToIndex == null || hCell == -1 || hCell >= this.frameMaxHandle) {
            return -1;
        }
        return this.frameHandleToIndex[hCell];
    },

    getGraphicFont: function (font) {
        if (this.graphicFonts) {
            var n;
            for (n = 0; n < this.graphicFonts.size(); n++) {
                gFont = this.graphicFonts.get(n);
                if (gFont.compareFont(font)) {
                    return gFont;
                }
            }
        }
        return font;
    },

    killGlobalData: function () {
        this.adGO = null;
    },

    initGlobal: function () {
        var n;

        // Vies et score
        if (this.parentApp == null || (this.parentApp != null && (this.parentOptions & CCCA.CCAF_SHARE_LIVES) == 0)) {
            this.lives = new Array(CRunApp.MAX_PLAYER);
            for (n = 0; n < CRunApp.MAX_PLAYER; n++) {
                this.lives[n] = this.gaLivesInit ^ 0xFFFFFFFF;
            }
        }
        else {
            this.lives = null;
        }
        if (this.parentApp == null || (this.parentApp != null && (this.parentOptions & CCCA.CCAF_SHARE_SCORES) == 0)) {
            this.scores = new Array(CRunApp.MAX_PLAYER);
            for (n = 0; n < CRunApp.MAX_PLAYER; n++) {
                this.scores[n] = this.gaScoreInit ^ 0xFFFFFFFF;
            }
        }
        else {
            this.scores = null;
        }
        this.playerNames = new Array(CRunApp.MAX_PLAYER);
        for (n = 0; n < CRunApp.MAX_PLAYER; n++) {
            this.playerNames[n] = "";
        }

        // Global values
        if (this.parentApp == null || (this.parentApp != null && (this.parentOptions & CCCA.CCAF_SHARE_GLOBALVALUES) == 0)) {
            this.gValues = new Array(this.nGlobalValuesInit);
            for (n = 0; n < this.nGlobalValuesInit; n++) {
                this.gValues[n] = this.globalValuesInit[n];
            }
        }
        else {
            this.gValues = null;
        }

        // Global strings
        if (this.parentApp == null || (this.parentApp != null && (this.parentOptions & CCCA.CCAF_SHARE_GLOBALVALUES) == 0)) {
            this.gStrings = new Array(this.nGlobalStringsInit);
            for (n = 0; n < this.nGlobalStringsInit; n++) {
                this.gStrings[n] = this.globalStringsInit[n];
            }
        }
        else {
            this.gStrings = null;
        }
    },

    getLives: function () {
        var app = this;
        while (app.lives == null) {
            app = this.parentApp;
        }
        return app.lives;
    },

    getScores: function () {
        var app = this;
        while (app.scores == null) {
            app = this.parentApp;
        }
        return app.scores;
    },

    getCtrlType: function () {
        //get the "joystick" type for this app
        var app = this;
        while (app.parentApp != null && (app.parentOptions & CCCA.CCAF_SHARE_PLAYERCTRLS) != 0) {
            app = app.parentApp;
        }
        return app.pcCtrlType;
    },

    getCtrlKeys: function () {
        //get the "joystick" configuration for this app
        var app = this;
        while (app.parentApp != null && (app.parentOptions & CCCA.CCAF_SHARE_PLAYERCTRLS) != 0) {
            app = app.parentApp;
        }
        return app.pcCtrlKeys;
    },

    //window api
    setWindowBackgroundColor: function (color) {
        if (color != this.gaBorderColour) {
            this.gaBorderColour = color;
            this.onChangeWindowColor(color);
        }
    },

    //global api
    getGlobalValues: function () {
        var app = this;
        while (app.gValues == null) {
            app = app.parentApp;
        }
        return app.gValues;
    },

    getNGlobalValues: function () {
        if (this.gValues != null) {
            return gValues.length;
        }
        return 0;
    },

    getGlobalStrings: function () {
        var app = this;
        while (app.gStrings == null) {
            app = app.parentApp;
        }
        return app.gStrings;
    },

    getNGlobalStrings: function () {
        if (this.gStrings != null) {
            return gStrings.length;
        }
        return 0;
    },

    checkGlobalValue: function (num) {
        var values = this.getGlobalValues();

        if (num < 0 || num > 1000) {
            return null;
        }
        var oldSize = values.length;
        if (num + 1 > oldSize) {
            var n;
            for (n = oldSize; n < num + 1; n++) {
                values.push(0);
            }
        }
        return values;
    },

    getGlobalValueAt: function (num) {
        var values = this.checkGlobalValue(num);
        if (values != null) {
            return values[num];
        }
        return 0;
    },

    setGlobalValueAt: function (num, value) {
        var values = this.checkGlobalValue(num);
        if (values != null) {
            values[num] = value;
        }
    },

    addGlobalValueAt: function (num, value) {
        var values = this.checkGlobalValue(num);
        if (values != null) {
            values[num] += value;
        }
    },

    checkGlobalString: function (num) {
        var strings = this.getGlobalStrings();

        if (num < 0 || num > 1000) {
            return null;
        }
        var oldSize = strings.length;
        if (num + 1 > oldSize) {
            var n;
            for (n = oldSize; n < num + 1; n++) {
                strings.push("");
            }
        }
        return strings;
    },

    getGlobalStringAt: function (num) {
        var strings = this.checkGlobalString(num);
        if (strings != null) {
            return strings[num];
        }
        return "";
    },

    setGlobalStringAt: function (num, value) {
        var strings = this.checkGlobalString(num);
        if (strings != null) {
            strings[num] = value;
        }
    },

    //key api
    getKeyState: function (code) {
        return this.keyBuffer[code];
    },

    //virtual mouse api
    createVirtualMouse: function () {
        //create teh virtual mouse
        if (this.virtualMouse == null) {
            //pump virtual mouse settings
            var settings = {
                native: this.virtualMouseOptionNative,
                speed: this.virtualMouseOptionSpeed,
                analog: this.virtualMouseOptionAnalog,
                analogMultiplier: this.virtualMouseOptionAnalogSpeedMultiplier,
                bounds: this.virtualMouseOptionBounds,
                enabled: this.virtualMouseOptionEnabled,
                visible: this.virtualMouseOptionVisible,
                suppress: this.virtualMouseOptionSupress,
                cursors: {
                    idle: {
                        offsetX: this.virtualMouseOptionCursorIdleOffsetX,
                        offsetY: this.virtualMouseOptionCursorIdleOffsetY,
                    },
                    leftDown: {
                        offsetX: this.virtualMouseOptionCursorLeftDownOffsetX,
                        offsetY: this.virtualMouseOptionCursorLeftDownOffsetY,
                    },
                    rightDown: {
                        offsetX: this.virtualMouseOptionCursorRightDownOffsetX,
                        offsetY: this.virtualMouseOptionCursorRightDownOffsetY,
                    },
                }
            };

            //create the virtual mouse
            this.virtualMouse = new CVirtualMouse(this, settings);
            this.virtualMouse.load();
        }

        //always setup the virtual mouse
        this.setupVirtualMouse();
    },

    setupVirtualMouse: function () {
        //update virtual mouse configuration. This will get called at the start of each frame
        if (this.virtualMouse != null) {
            this.virtualMouse.setupFrame(this.frame.virtualMouseOptionEnabled, this.frame.virtualMouseOptionVisible);
        }
    },

    updateVirtualMouse: function() {
        if (this.virtualMouse != null) {
            this.virtualMouse.update();
        }
    },

    positionVirtualMouse: function() {
        if (this.virtualMouse != null) {
            this.virtualMouse.position();
        }
    },

    handleVirtualMouseMouseEvent: function(event) {
        if (this.virtualMouse != null) {
            this.virtualMouse.handleMouseEvent(event);
        }
    },

    handleVirtualMouseJoystick: function (player, up, down, left, right, button1, button2, button3, button4) {
        //handle virtual mouse input

        //only process player1
        if (this.virtualMouse != null && player == 0) {
            //get gamepad details so we can potentially use analog data
            var gamepad = this.getGamepad(player);
            var multiplyX = 1.0;
            var multiplyY = 1.0;
            var multiplyUsed = false;

            if (gamepad != null && gamepad.connected) {
                if (gamepad.axisPressed(CGamepad.THUMB_LEFT_X) || gamepad.axisPressed(CGamepad.THUMB_LEFT_Y)) {
                    multiplyUsed = true;
                    multiplyX = gamepad.axisStrength(CGamepad.THUMB_LEFT_X, true);
                    multiplyY = gamepad.axisStrength(CGamepad.THUMB_LEFT_Y, true);
                }
            }

            //let the virtual mouse handle the input and then return supress flag
            return this.virtualMouse.handleJoystick(up, down, left, right, button1, button2, button3, button4, multiplyUsed, multiplyX, multiplyY);
        }

        //dont suppress input by default
        return false;
    },

    //mouse api
    setMouseOffsets: function (xOffset, yOffset) {
        this.mouseOffsetX = xOffset;
        this.mouseOffsetY = yOffset;
    },

    forceMouseButton: function (down) {
        //this only seems to get called from KcButton.js ... it forces the key buffer to be on for the left mouse button... massive hack!
        this.keyBuffer[CRunApp.VK_LBUTTON] = down;

        for (var n = 0; n < this.subApps.length; n++) {
            this.subApps[n].forceMouseButton(down);
        }
    },

    showCursor: function (count) {
        this.cursorCount = count;

        if (this.cursorCount >= 0) {
            this.onShowCursor(this.cursor);
        } else {
            this.onHideCursor();
        }
    },

    //touch api
    getTouchX: function (touch) {
        return Math.floor((touch.pageX - this.domOffsetX - this.mouseOffsetX) / this.scaleX);
    },

    getTouchY: function (touch) {
        return Math.floor((touch.pageY - this.domOffsetY - this.mouseOffsetY) / this.scaleY);
    },

    addTouchDelegate: function (object) {
        if (this.touchDelegates.indexOf(object) < 0) {
            this.touchDelegates.add(object);
        }
    },

    removeTouchDelegate: function (object) {
        this.touchDelegates.removeObject(object);
    },

    //file api
    loadFile: function (path, defaultValue, binary) {
        //remove leading slashes
        var start = 0;
        while (path.charCodeAt(start) == 47 || path.charCodeAt(start) == 92) {
            start++;
        }
        if (start > 0) {
            path = path.slice(start);
        }

        //check local storage
        var result = localStorage.getItem(this._localStorageFilePath(path));
        if (result !== null) {
            if (binary) {
                //bytes

                //need to convert into bytes
                return result;

            } else {
                //as string
                return result;
            }
        }

        //try various file methods
        try {
            //try embeded file
            var embeddedFile = this.getEmbeddedFile(path);
            if (embeddedFile) {
                var file = embeddedFile.open();

                //how
                if (binary) {
                    //bytes
                    return file.readBytesAsString();
                } else {
                    //as string

                    //check unicode status
                    file.detectUnicode();

                    //read the string and return it (true indicates we allow null character)
                    return file.readAString(file.getLength(), true);
                }
            }

        } catch (e) {
        }

        //nope!
        return defaultValue;
    },
    
    openFile: function (path, binary) {
        //remove leading slashes
        var start = 0;
        while (path.charCodeAt(start) == 47 || path.charCodeAt(start) == 92) {
            start++;
        }
        if (start > 0) {
            path = path.slice(start);
        }

        var file = null;

        //check local storage
        var string = localStorage.getItem(this._localStorageFilePath(path));
        if (string !== null) {
            file = new CFile();
            file.setText(string, true);
        }
        else {
            try {
                //try embeded file
                var embeddedFile = this.getEmbeddedFile(path);
                if (embeddedFile) {
                    file = embeddedFile.open();
                    if (!binary) {
                        file.detectUnicode();
                    }
                }

            } catch (e) {
            }
        }

        return file;
    },

    appendFile: function (path, value, binary) {
        var oldValue = this.loadFile(path, "", binary);
        var newValue = oldValue + value;
        this.saveFile(path, newValue);
    },

    saveFile: function(path, value) {
        localStorage.setItem(this._localStorageFilePath(path), value);
    },

    resetFile: function() {
        localStorage.removeItem(this._localStorageFilePath(path));
    },

    loadFileAsync: function (path, callback, defaultValue) {
        //check non callback first
        var result = this.loadFile(path, defaultValue);

        if (result !== null) {
            if (callback != null) {
                callback(result);
            }
        } else {
            //do async
            //try external file
            var file = new CFile();
            file.openFileAsync(path, function (success, file) {
                if (!success) {
                    if (callback != null) {
                        callback(defaultValue);
                    }
                } else {
                    if (callback != null) {
                        callback(file.readAString(file.getLength()));
                    }
                }
            });
        }
    },

    findFileSrc: function (src, mime) {
        // lets allow to use internet images for active picture
        if (/http/.test(src)) {
            return src;
        }

        //clean cache
        var pos = src.lastIndexOf('?');
        if (pos != -1) {
            src = src.substring(0, pos);
        }

        //check if there is an embeded
        var file = this.getEmbeddedFile(src);
        if (file != null) {
            //embeded file exists so lets get a data URI for it

            //get mime if none was provded
            if (mime == null) {
                mime = CServices.getMIMEType(src);
            }

            //open the embedded file ad read its data URI
            file = file.open();
            return file.readDataURI(mime);
        } else {
            //clean root dir
            src = CServices.stripLeadingPath(src, this.appEditorRootPath);

            //file does not exist so lets load from resources instead
            return this.resourcesPath + src.replace("\\", "/");
        }
    },

    getEmbeddedFile: function (path) {
        if (this.embeddedFiles != null) {
            var n;
            path = CServices.stripLeadingPath(path, this.appEditorRootPath);

            for (n = 0; n < this.embeddedFiles.length; n++) {
                if (CServices.compareStringsIgnoreCase(this.embeddedFiles[n].path, path)) {
                    return this.embeddedFiles[n];
                }
            }
        }
        return null;
    },

    //TODO: finish file store api related funcs below

    /*
    getFileType: function(path) {

    },

    createFolder: function(path) {

    },

    loadDirectory: function (path, ignoreFiles, ignoreDirectories) {
        //load a list of files/dirs in a dir
        path = this._fixFileStorePath(path);
        var dir = this._findFileStorePath(path);

        if (dir == null) {
            return null;
        } else {
            //check for invalid directory
            if (!dir.directory || dir.deleted) {
                return null;
            }

            //fix values
            if (ignoreDirectories == null) {
                ignoreDirectories = false;
            }

            if (ignoreFiles == null) {
                ignoreFiles = false;
            }

            //create list to return
            var list = [];
            var child;
            for (var index = 0; index < dir.children.length; index++) {
                child = dir.children[index];

                if ((child.directory & !ignoreDirectories) || (!child.directory & !ignoreFiles)) {
                    list.push(child.name);
                }
            }

            //done :D
            return list;
        }
    },

    createDirectory: function (path) {
        path = this._fixFileStorePath(path);
        var directory = this._buildFileStoreDirectories(path, null, Date.now());
        return directory;
    },

    deleteDirectory: function(path) {
        path = this._fixFileStorePath(path);
        this._deleteFileStorePath(path, null, true);
    },

    renameDirectory: function (oldPath, newPath) {
        //todo: not finished
        oldPath = this._fixFileStorePath(oldPath);
        newPath = this._fixFileStorePath(newPath);

        //skip
        if (oldPath == newPath) {
            return false;
        }

        //do it
        this._renameFileStorePath(oldPath, newPath, null);
    },
    */

    //virtual joystick api
    startVirtualJoystick: function (type, flags) {
        var active = this.virtualJoystickCurrent;
        var on = false;

        switch (type) {
            case CVirtualJoystick.TYPE_EXT://JOYSTICK_EXT defaults to touch (according to the old HTML5 runtime)
            case CVirtualJoystick.TYPE_TOUCH:
                on = Runtime.isTouchable();


                if (on) {
                    //do we need to create virtual joystick?
                    if (this.virtualJoystickTouch == null) {
                        this.virtualJoystickTouch = new CVirtualJoystickTouch(this, flags);
                    } else {
                        //reset
                        this.virtualJoystickTouch.reset(flags);
                    }

                    //prepare new active
                    active = this.virtualJoystickTouch;
                }
                break;

            case CVirtualJoystick.TYPE_ACCELEROMETER:
                on = Runtime.hasAccelerometer();


                if (on) {
                    //do we need to create virtual joystick?
                    if (this.virtualJoystickAccelerometer == null) {
                        this.virtualJoystickAccelerometer = new CVirtualJoystickAccelerometer(this, flags);
                    } else {
                        //reset
                        this.virtualJoystickAccelerometer.reset(flags);
                    }

                    //prepare new active
                    active = this.virtualJoystickAccelerometer;
                }
                break;
        }

        //set active if it has changed?
        if (active != this.virtualJoystickCurrent) {
            //stop old
            if (this.virtualJoystickCurrent != null) {
                this.virtualJoystickCurrent.stop();
            }

            //start new
            this.virtualJoystickCurrent = active;
            if (this.virtualJoystickCurrent != null) {
                this.virtualJoystickCurrent.start();
            }
        }
    },

    updateVirtualJoystick: function() {
        if (this.virtualJoystickCurrent != null) {
            return this.virtualJoystickCurrent.update();
        }
    },

    endVirtualJoystick: function (type) {
        //remove touch
        if (this.virtualJoystickTouch != null) {
            this.virtualJoystickTouch.free();
            this.virtualJoystickTouch = null;
        }

        //remove accelerometer
        if (this.virtualJoystickAccelerometer != null) {
            this.virtualJoystickAccelerometer.free();
            this.virtualJoystickAccelerometer = null;
        }

        //clear active
        this.virtualJoystickCurrent = null;
    },

    getVirtualJoystickState: function () {
        if (this.virtualJoystickCurrent == null) {
            return 0;
        } else {
            return this.virtualJoystickCurrent.getState();
        }
    },

    getVirtualJoystickObjectX: function(what) {
        if (this.virtualJoystickCurrent != null) {
            return this.virtualJoystickCurrent.getObjectX(what);
        }
    },

    getVirtualJoystickObjectY: function (what) {
        if (this.virtualJoystickCurrent != null) {
            return this.virtualJoystickCurrent.getObjectY(what);
        }
    },

    setVirtualJoystickObjectX: function (what, x) {
        if (this.virtualJoystickCurrent != null) {
            return this.virtualJoystickCurrent.setObjectX(what, x);
        }
    },

    setVirtualJoystickObjectY: function (what,y) {
        if (this.virtualJoystickCurrent != null) {
            return this.virtualJoystickCurrent.setObjectY(what, y);
        }
    },

    //continue api
    updateContinue: function () {
        //check to see if
        if (preloader.touchMeTextContainer == null) {
            //we need to create touchme text
            preloader.touchMeQuit = true;

            if (this.silentSound != null) {
                preloader.touchMeFont = new CFont();
                preloader.touchMeFont.createDefaultFont();
                preloader.touchMeFont.lfHeight = 24;

                //create text buffer
                preloader.touchMeTextContainer = this.createTextContainer();
                preloader.touchMeTextContainer.setShadow(1, 2, 0x000000);

                var width = preloader.touchMeTextContainer.getTextWidth(this.touchMeMessage, preloader.touchMeFont) + 64
                var height = preloader.touchMeFont.lfHeight + 6;

                preloader.touchMeTextContainer.manualClear();
                preloader.touchMeTextContainer.set(this.touchMeMessage, preloader.touchMeFont, 0xFFFF00, CRendererTextContainer.CENTER | CRendererTextContainer.MIDDLE, width, height);

                preloader.touchMeRect = new CRect();
                preloader.touchMeRect.left = this.gaCxWin / 2 - width / 2;
                preloader.touchMeRect.top = this.gaCyWin / 2 - height / 2;
                preloader.touchMeRect.right = preloader.touchMeRect.left + width;
                preloader.touchMeRect.bottom = preloader.touchMeRect.top + height;
                preloader.touchMeAlpha = 128;
                preloader.touchMePhase = 0;
                preloader.touchMeQuit = false;
            }

        } else {
            //we have the touchMe text created so check for updates
            if (this.silentSound == null) {
                preloader.touchMePhase = 2;
            }

            switch (preloader.touchMePhase) {
                case 0:
                    //fade text in
                    if (preloader.touchMeAlpha > 0) {
                        preloader.touchMeAlpha -= 2;
                        if (preloader.touchMeAlpha < 0) {
                            preloader.touchMeAlpha = 0;
                            preloader.touchMePhase++;
                        }
                    }
                    break;
                case 1:
                    //update (waiting for touch..)
                    break;
                case 2:
                    //fade out
                    if (preloader.touchMeAlpha < 128) {
                        preloader.touchMeAlpha += 4;
                        if (preloader.touchMeAlpha >= 128) {
                            preloader.touchMeAlpha = 128;
                            preloader.touchMeQuit = true;
                        }
                    }
                    break;
            }

            if (preloader.touchMeQuit) {
                //free text buffer
                preloader.touchMeTextContainer.free();

                //null stuff
                preloader.touchMeTextContainer = null;
                preloader.touchMeRect = null;
                preloader.touchMeFont = null;
            }
        }

        return preloader.touchMeQuit;
    },

    drawContinue: function (preloader) {
        if (preloader.touchMeTextContainer) {
            //render touch me
            this.renderer.renderFilledRect(preloader.touchMeRect.left, preloader.touchMeRect.top, preloader.touchMeRect.right - preloader.touchMeRect.left, preloader.touchMeRect.bottom - preloader.touchMeRect.top, this.frameColor, 0, 0);
            preloader.touchMeTextContainer.draw(this.renderer, preloader.touchMeRect.left, preloader.touchMeRect.top, CRSpr.BOP_BLEND, preloader.touchMeAlpha);
        } else {
            if (this.silentSound != null) {
                this.renderer.renderFilledRect(0, 0, this.currentRenderWidth, this.currentRenderHeight, this.frameColor, 0, 0);
            }
        }
    },

    //image api
    freeImage: function (image) {
        //pass off to renderer to handle
        this.renderer.onFreeImage(image);
    },

    updateImage: function (image, source) {
        this.rennderer.updateImage(image, source);
    },

    //buffer api
    createTextContainer: function () {
        return this.renderer.createTextContainer(this);
    },

    createImageBuffer: function (width, height) {
        return this.renderer.createImageBuffer(width, height);
    },

    //gamepad api
    connectGamepad: function (context) {
        //find an available player slot
        var gamepad;

        for (var index = 0; index < this.gamepads.length; index++) {
            gamepad = this.gamepads[index];

            //only match gamepad that isnt already connected
            if (!gamepad.connected) {
                //connect the gamepad and pass in the player and context (player is 1 based)
                gamepad._connect(index, context);

                //return the gamepad to indicate success
                return gamepad;
            }
        }

        //fail (too many gamepads)
        return null;
    },

    disconnectGamepad: function (context) {
        //search for gamepad that matches teh context
        var gamepad;

        for (var index = 0; index < this.gamepads.length; index++) {
            gamepad = this.gamepads[index];

            //find matching gamepad from context
            if (gamepad.connected && gamepad.context == context) {
                //found it so time to disconnect!
                gamepad._disconnect();

                //return the gamepad to indicate success
                return gamepad;
            }
        }

        //not found
        return null;
    },

    findGamepad: function (context) {
        //find gamepad with matching context
        var gamepad;

        for (var index = 0; index < this.gamepads.length; index++) {
            gamepad = this.gamepads[index];

            if (gamepad.connected && gamepad.context == context) {
                return gamepad;
            }
        }

        return null;
    },

    getGamepad: function (player) {
        if (this.parentApp != null)
            return this.parentApp.getGamepad(player);
        return this.gamepads[player];
    }
}
