// CW10Application object
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

function CW10Application() {
    //call super constructor
    CRunApp.call(this);

    this.lastCursor = -1;
}

CW10Application.prototype = {
    //events
    onEnd: function () {
        //quit the app!
        if (this.parentApp == null) {
            //root app is ending
            //FusionComponent.FusionNative.quit();
        }
    },

    onSetupWindow: function () {
        //do we need to set the windowed/fullscreen modes?
        if (Runtime.canToggleFullscreen()) {
            //desktop/tablet

            //get the window size
            var windowSize = {
                width: this.gaCxWin,
                height: this.gaCyWin,
            };


            //set the minimum MIN window size (see remarks at: https://msdn.microsoft.com/en-us/library/windows/apps/windows.ui.viewmanagement.applicationview.setpreferredminsize)
            Runtime.appView.setPreferredMinSize({
                width: 192,
                height: 48
            });

            //set teh window size
            Windows.UI.ViewManagement.ApplicationView.preferredLaunchViewSize = windowSize;
            Runtime.appView.tryResizeView(windowSize);

            //set initial fullscreen mode
            var fullscreen = (this.gaFlags & CRunApp.GA_FULLSCREENATSTART) != 0;


            this.onChangeFullScreen(fullscreen);
        }
    },

    onChangeWindowColor: function(color) {
        document.body.style.background = CServices.getColorString(color);
    },

    onSetupEvents: function () {
        //call chain
        CRunApp.prototype.onSetupEvents.call(this);

        //call self
        var that = this;

        //gamepad events
        Windows.Gaming.Input.Gamepad.addEventListener("gamepadadded", function (e) {
            //inform the app of the connection
            var context = e.detail[0];
            var gamepad = that.connectGamepad(context);
        });

        Windows.Gaming.Input.Gamepad.addEventListener("gamepadremoved", function (e) {
            //inform the app of the disconnection
            var context = e.detail[0];
            var gamepad = that.disconnectGamepad(context);
        });

        //pointer events to handle all mouse, pen and touch
        this.canvas.addEventListener('pointerdown', function (event) {
            //where should re direct these events
            switch (event.pointerType) {
                case 'mouse':
                case 'pen':
                    that.onMouseDown(event);
                    break;
                case 'touch':
                    that.onTouchStart(event);
                    break;
            }

            //prevent default firing
            if (event.preventDefault) {
                event.preventDefault();
            }
        }, false);

        this.canvas.addEventListener('pointermove', function (event) {
            //where should re direct these events
            switch (event.pointerType) {
                case 'mouse':
                case 'pen':
                    that.onMouseMove(event);
                    break;
                case 'touch':
                    that.onTouchMove(event);
                    break;
            }

            //prevent default firing
            if (event.preventDefault) {
                event.preventDefault();
            }
        }, false);

        this.canvas.addEventListener('pointerup', function (event) {
            //where should re direct these events
            switch (event.pointerType) {
                case 'mouse':
                case 'pen':
                    that.onMouseUp(event);
                    break;
                case 'touch':
                    that.onTouchEnd(event);
                    break;
            }

            if (event.preventDefault) {
                event.preventDefault();
            }
        }, false);

        this.canvas.addEventListener('pointercancel', function (event) {
            //where should re direct these events
            switch (event.pointerType) {
                case 'touch':
                    that.onTouchEnd(event);
                    break;
            }

            if (event.preventDefault) {
                event.preventDefault();
            }
        }, false);

        //disable mouse/touch out for now so we dont lose mouse input on edge of application!

        /*
    
        this.canvas.addEventListener('pointerout', function (event) {
            //where should re direct these events
            switch (event.pointerType) {
                case 'mouse':
                case 'pen':
                    that.onMouseOut(event);
                    break;
            }
    
            if (event.preventDefault) {
                event.preventDefault();
            }
        }, false);
        */
    },

    onChangeFullScreen: function (fullScreen) {
        //change the fullscreen mode
        if (fullScreen) {
            //enter fullscreen
            if (!Runtime.appView.isFullScreenMode) {
                //set the preferred launching to fullscreen (for next time)
                Windows.UI.ViewManagement.ApplicationView.preferredLaunchWindowingMode = Windows.UI.ViewManagement.ApplicationViewWindowingMode.fullScreen;

                //attempt to go into fullscreen
                Runtime.appView.tryEnterFullScreenMode();
            }

        } else {
            //exit fullscreen
            if (Runtime.appView.isFullScreenMode) {
                //set the preferred launching to windowed (for next time)
                Windows.UI.ViewManagement.ApplicationView.preferredLaunchWindowingMode = Windows.UI.ViewManagement.ApplicationViewWindowingMode.preferredLaunchViewSize;

                //check to see if we need to exit fullscreen
                if (Runtime.appView.isFullScreenMode) {
                    Runtime.appView.exitFullScreenMode();
                }
            }
        }
    },

    onUpdateCanvasFocus: function () {
        //we should not force refocus
    },

    //mouse events
    onMouseDown: function (event) {
        var code = this._mouseButtonFromEvent(event);

        this.onMouseMove(event, this.canvas, 0x12345678);
        this.bMouseIn = true;
        this.keyNew = true;
        this.keyBuffer[code] = true;

        //handle mouse button event
        if (this.run != null && this.run.rhEvtProg != null) {
            //detect single/double click
            var now = Date.now();
            var detail = this.mouseDoubleClickTimestamp !== null && this.mouseDoubleClickCode == code && now - this.mouseDoubleClickTimestamp <= CRunApp.MOUSE_DOUBLE_CLICK_DELAY ? 2 : 1;
            this.mouseDoubleClickCode = code;
            this.mouseDoubleClickTimestamp = now;

            //fire event
            this.run.rhEvtProg.onMouseButton(code - CRunApp.VK_LBUTTON, detail);
        }

        //pass to sub apps
        for (var n = 0; n < this.subApps.length; n++) {
            this.subApps[n].onMouseDown(event);
        }

        //fake touch
        this.onTouchStart(new CFakePointerEvent(event.pageX, event.pageY, this.canvas));
    },

    onMouseMove: function (event, obj, flag) {
        //get the raw mouse position
        this.mouseRawX = event.pageX;
        this.mouseRawY = event.pageY;

        //now calculate real (game) mouse position
        this.mouseX = Math.floor((this.mouseRawX - this.domOffsetX - this.mouseOffsetX) / this.scaleX);
        this.mouseY = Math.floor((this.mouseRawY - this.domOffsetY - this.mouseOffsetY) / this.scaleY);

        //fire main mouse move
        if (this.run != null && this.run.rhEvtProg != null) {
            this.run.rhEvtProg.onMouseMove();
        }

        //fire mosue move for sub apps
        for (var n = 0; n < this.subApps.length; n++) {
            this.subApps[n].onMouseMove(event, obj);
        }

        //fake touch
        if (flag != 0x12345678) {
            this.onTouchMove(new CFakePointerEvent(this.mouseRawX, this.mouseRawY, this.canvas));
        }
    },

    onMouseUp: function (event) {
        var code = this._mouseButtonFromEvent(event);

        //fire main mouse move
        this.onMouseMove(event, this.canvas, 0x12345678);
        this.bMouseIn = true;
        this.keyBuffer[code] = false;

        //fire for sub apps
        var n;
        for (n = 0; n < this.subApps.length; n++) {
            this.subApps[n].onMouseUp(event);
        }

        //fake touch
        this.onTouchEnd(new CFakePointerEvent(event.pageX, event.pageY, this.canvas));
    },

    onMouseOut: function (event) {
        this.bMouseIn = false;
        this.keyBuffer[CRunApp.VK_LBUTTON] = 0;
        this.keyBuffer[CRunApp.VK_MBUTTON] = 0;
        this.keyBuffer[CRunApp.VK_RBUTTON] = 0;

        for (var n = 0; n < this.subApps.length; n++) {
            this.subApps[n].onMouseOut(event);
        }

        //fake touch
        if (!Runtime.isTouchable()) {
            this.onTouchEnd(new CFakePointerEvent(event.pageX, event.pageY, this.canvas));
        }
    },

    //touch events
    onTouchStart: function (event) {
        if (this.touchesID == null) {
            return;
        }

        var touchId = event.pointerId;
        for (var m = 0; m < CRunApp.MAX_TOUCHES; m++) {
            touchId = event.pointerId;

            //find empty touch slot
            if (this.touchesID[m] == CRunApp.TOUCHID_EMPTY) {
                this.touchesID[m] = touchId;
                this.touchesLocked[m] = false;

                //let delegates handle touch
                for (o = 0; o < this.touchDelegates.size() ; o++) {
                    if (this.touchDelegates.get(o).onTouchStarted(event)) {
                        this.touchesLocked[m] = true;
                        this.touchesLocked[m] = o;
                        break;
                    }
                }

                //continue handling if not locked by delegate
                if (!this.touchesLocked[m]) {
                    this.touchesX[m] = this.getTouchX(event);
                    this.touchesY[m] = this.getTouchY(event);

                    //do we need to send this further?
                    if (this.mouseTouch == CRunApp.TOUCHID_EMPTY && touchId != CRunApp.FAKE_TOUCHIDENTIFIER) {
                        this.mouseTouch = m;
                        this.mouseX = this.touchesX[m];
                        this.mouseY = this.touchesY[m];
                        this.bMouseIn = true;
                        this.keyNew = true;
                        this.keyBuffer[CRunApp.VK_LBUTTON] = true;

                        if (!this.iOS && this.run != null && this.run.rhEvtProg != null) {
                            this.run.rhEvtProg.onMouseButton(0, 1);
                        }

                        var p;
                        for (p = 0; p < this.subApps.length; p++) {
                            this.subApps[p].onTouchStart(event);
                        }
                    }
                }
                break;
            }
        }
    },

    onTouchMove: function (event) {
        if (this.touchesID == null) {
            return;
        }

        var touchId = event.pointerId;
        for (var m = 0; m < CRunApp.MAX_TOUCHES; m++) {
            touchId = event.pointerId;

            if (this.touchesID[m] == touchId) {
                if (this.touchesLocked[m]) {
                    this.touchDelegates.get(this.touchesLocked[m]).onTouchMoved(event);

                } else {
                    for (o = 0; o < this.touchDelegates.size() ; o++) {
                        this.touchDelegates.get(o).onTouchMoved(event);
                    }

                    this.touchesX[m] = this.getTouchX(event);
                    this.touchesY[m] = this.getTouchY(event);
                }

                if (this.mouseTouch == m) {
                    this.mouseX = this.touchesX[m];
                    this.mouseY = this.touchesY[m];

                    if (this.run != null && this.run.rhEvtProg != null) {
                        this.run.rhEvtProg.onMouseMove();
                    }

                    var p;
                    for (p = 0; p < this.subApps.length; p++) {
                        this.subApps[p].onTouchMove(event);
                    }
                }
                break;
            }
        }
    },

    onTouchEnd: function (event) {
        if (this.touchesID == null) {
            return;
        }

        var touchId = event.pointerId;
        for (var m = 0; m < CRunApp.MAX_TOUCHES; m++) {
            if (this.touchesID[m] == touchId) {
                this.touchesID[m] = CRunApp.TOUCHID_EMPTY;

                if (this.touchesLocked[m]) {
                    this.touchDelegates.get(this.touchesLocked[m]).onTouchEnded(event);
                } else {
                    for (o = 0; o < this.touchDelegates.size() ; o++) {
                        this.touchDelegates.get(o).onTouchEnded(event);
                    }
                    this.touchesX[m] = this.getTouchX(event);
                    this.touchesY[m] = this.getTouchY(event);
                }

                if (m == this.mouseTouch) {
                    this.mouseX = this.touchesX[m];
                    this.mouseY = this.touchesY[m];
                    this.mouseTouch = CRunApp.TOUCHID_EMPTY;
                    this.keyBuffer[CRunApp.VK_LBUTTON] = false;

                    if (this.iOS && this.run != null && this.run.rhEvtProg != null) {
                        this.run.rhEvtProg.onMouseButton(0, 1);
                    }

                    var p;
                    for (p = 0; p < this.subApps.length; p++) {
                        this.subApps[p].onTouchEnd(event);
                    }
                }
            }
        }
    },

    //preloader api
    createDefaultPreloader: function () {
        //just show blank screen by default (instead of using teh loading bar default)
        return new CPreloaderLastFrameBuffer(this);
        return new CPreloaderProgress(this);
    },
};

//setup inheritance using extend
CServices.extend(CRunApp, CW10Application);