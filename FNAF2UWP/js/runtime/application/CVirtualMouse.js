// CVirtualMouse object
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

CVirtualMouse.FADE_IN_LENGTH = 200;
CVirtualMouse.FADE_OUT_LENGTH = 100;

CVirtualMouse.LEFT = 0;
CVirtualMouse.RIGHT = 1;

//these constants are shared between enabled and visible settings
CVirtualMouse.INHERIT = -1;
CVirtualMouse.DISABLED = 0;
CVirtualMouse.ENABLED = 1;
CVirtualMouse.SUPPORTED_DEVICES = 2;
CVirtualMouse.NATIVE = 3;
CVirtualMouse.HIDDEN = 0;
CVirtualMouse.VISIBLE = 1;

CVirtualMouse.CURSOR_IDLE = 0;
CVirtualMouse.CURSOR_LEFT_DOWN = 1;
CVirtualMouse.CURSOR_RIGHT_DOWN = 2;

CVirtualMouse.BOUNDS_FREE = 0;
CVirtualMouse.BOUNDS_CONTAIN = 1;
CVirtualMouse.BOUNDS_WRAP = 2;

function CVirtualMouse(app, settings) {
    this.native = settings.native;
    this.analog = settings.analog;
    this.analogMultiplier = settings.analogMultiplier;
    this.speed = settings.speed;//pixels per second
    this.bounds = settings.bounds;
    this.appEnabled = settings.enabled;
    this.appVisible = settings.visible;
    this.suppress = settings.suppress;

    this.alpha = 0.0;
    this.fadeActive = false;
    this.fadeStart = 0.0;
    this.fadeTarget = 0.0;
    this.fadeTargetVisible = false;
    this.fadeLength = 0;
    this.fadeTimestamp = 0;

    this.app = app;
    this.currentCursor = CVirtualMouse.CURSOR_IDLE;
    this.cursors = [
        {
            image: null,
            offsetX: settings.cursors.idle.offsetX,
            offsetY: settings.cursors.idle.offsetY,
        },
        {
            image: null,
            offsetX: settings.cursors.leftDown.offsetX,
            offsetY: settings.cursors.leftDown.offsetY,
        },
        {
            image: null,
            offsetX: settings.cursors.rightDown.offsetX,
            offsetY: settings.cursors.rightDown.offsetY,
        }
    ];
    this.moving = false;
    this.loaded = false;
    this.visible = CVirtualMouse.VISIBLE;
    this.firstSetup = true;
    this.states = [false, false];
    this.event = {
        pageX: 0,
        pageY: 0,
        button: 0,
    };
    this.timestamp = Date.now();
    this.x = 0.0;
    this.y = 0.0;
}

CVirtualMouse.prototype = {
    //internal
    _handleMove: function (horizontal, vertical) {
        var app = this.app;

        //figure out new raw positions
        var ms = Date.now();
        var difference = ms - this.timestamp;
        this.timestamp = ms;
        var pixelsMoved = (this.speed / 1000) * difference;

        var newRawX = app.mouseRawX + (pixelsMoved * horizontal);
        var newRawY = app.mouseRawY + (pixelsMoved * vertical);

        //check for bounds
        switch(this.bounds) {
            case CVirtualMouse.BOUNDS_CONTAIN:
                //contain within the bounds of the canvas
                if (newRawX < app.containerX) {
                    newRawX = app.containerX;
                } else if (newRawX > app.containerX + app.containerWidth) {
                    newRawX = app.containerX + app.containerWidth;
                }

                if (newRawY < app.containerY) {
                    newRawY = app.containerY;
                } else if (newRawY > app.containerY+ app.containerHeight) {
                    newRawY = app.containerY + app.containerHeight;
                }
                break;

            case CVirtualMouse.BOUNDS_WRAP:
                //wrap within the bounds of the canvas
                if (newRawX < app.containerX) {
                    newRawX = app.containerX + app.containerWidth + (app.containerX - newRawX);
                } else if (newRawX > app.containerX + app.containerWidth) {
                    newRawX = newRawX - app.containerWidth;
                }

                if (newRawY < app.containerY) {
                    newRawY = app.containerY + app.containerHeight + (app.containerY - newRawY);
                } else if (newRawY > app.containerY + app.containerHeight) {
                    newRawY = newRawY - app.containerHeight;
                }
                break;
        }

        //has anything changed
        if (newRawX != app.mouseRawX || newRawY != app.mouseRawY) {
            //prepare event data
            var event = this.event;
            event.pageX = newRawX;
            event.pageY = newRawY;

            //fake app event
            app.onMouseMove(event);
        }
    },

    _handleDown: function(button) {
        var app = this.app;
        var event = this.event;

        //prepare event data
        event.pageX = app.mouseRawX;
        event.pageY = app.mouseRawY;

        switch(button) {
            case CVirtualMouse.LEFT:
                event.button = 0;
                break;
            case CVirtualMouse.RIGHT:
                event.button = 2;
                break;
        }

        //fake app event, but we supress it if the mouse is not currently visible
        app.onMouseDown(event);
    },

    _handleUp: function (button) {
        var app = this.app;
        var event = this.event;

        //prepare event data
        event.pageX = app.mouseRawX;
        event.pageY = app.mouseRawY;

        switch (button) {
            case CVirtualMouse.LEFT:
                event.button = 0;
                break;
            case CVirtualMouse.RIGHT:
                event.button = 2;
                break;
        }

        //fake app event
        app.onMouseUp(event);
    },

    _updateCursor: function() {
        if (this.states[CVirtualMouse.LEFT]) {
            this.currentCursor = CVirtualMouse.CURSOR_LEFT_DOWN;
        } else if (this.states[CVirtualMouse.RIGHT]) {
            this.currentCursor = CVirtualMouse.CURSOR_RIGHT_DOWN;
        } else {
            this.currentCursor = CVirtualMouse.CURSOR_IDLE;
        }
    },

    _fadeTo: function (target, length) {
        //only fade if its different
        if (target != this.fadeTarget) {
            this.fadeStart = this.alpha;
            this.fadeTarget = target;
            this.fadeTimestamp = this.app.timer;
            this.fadeLength = length * Math.abs(target - this.alpha);
            this.fadeActive = true;

            //figure out what state the target makes us
            if (this.fadeTarget == 0.0) {
                //hidden
                this.fadeTargetVisible = false;
            } else {
                //visible
                this.fadeTargetVisible = true;
            }
        }
    },

    //api
    load: function () {
        //load all of the images
        if (!this.loaded) {
            this.loaded = true;
            this.cursors[CVirtualMouse.CURSOR_IDLE].image = CImage.createFromFile(this.app, "mouse-cursor-idle.png");
            this.cursors[CVirtualMouse.CURSOR_LEFT_DOWN].image = CImage.createFromFile(this.app, "mouse-cursor-left-down.png");
            this.cursors[CVirtualMouse.CURSOR_RIGHT_DOWN].image = CImage.createFromFile(this.app, "mouse-cursor-right-down.png");
        }
    },

    update: function () {
        //update the fade
        if (this.fadeActive) {
            var ms = this.app.timer - this.fadeTimestamp;

            //check for finished
            if (ms < this.fadeLength) {
                //not finished

                if (this.fadeTargetVisible) {
                    this.alpha = ((this.fadeTarget - this.fadeStart) / this.fadeLength) * ms;
                } else {
                    this.alpha = 1.0 - (((this.fadeStart - this.fadeTarget) / this.fadeLength) * ms);
                }
            } else {
                //finished
                this.alpha = this.fadeTarget;
                this.fadeActive = false;
            }
        }

        //update render position
        if (this.moving) {
            this.x = this.app.mouseX;
            this.y = this.app.mouseY;
        }
    },

    draw: function () {
        if (this.enabled == CVirtualMouse.ENABLED && this.visible == CVirtualMouse.VISIBLE && this.alpha > 0.0) {
            var app = this.app;
            var renderer = app.renderer;
            var cursor = this.cursors[this.currentCursor];

            //can we render?
            if (cursor.image) {
                renderer.setAlpha(this.alpha)
                renderer.renderSimpleImage(cursor.image, this.x - cursor.offsetX, this.y - cursor.offsetY);
            }
        }
    },

    handleMouseEvent: function(event) {
        //a mouse event has happened so we should hide the virtual mouse
        this.moving = false;

        //skip handling this if we can
        if (this.enabled != CVirtualMouse.ENABLED) {
            this.alpha = 0.0;
            this.fadeTarget = 0.0;
            this.fadeTargetVisible = false;
            return false;
        }

        //start fade out if we handled any input
        if (!this.fadeActive || this.fadeTargetVisible) {
            this._fadeTo(0.0, CVirtualMouse.FADE_OUT_LENGTH);
        }
    },

    handleJoystick: function (up, down, left, right, button1, button2, button3, button4, multiply, multiplyX, multiplyY) {
        var handled = false;

        //skip handling this if we can
        if (this.enabled != CVirtualMouse.ENABLED) {
            this.alpha = 1.0;
            this.fadeTarget = 1.0;
            this.fadeTargetVisible = true;
            return false;
        }

        //check for not moving
        if (!up && !down && !left && !right) {
            //not moving
            this.moving = false;
        } else {
            handled = true;

            //moving
            if (!this.moving) {
                //this is a new move session, we need to set the timestamp so that if there is a delay inbetween _handleMove() then it doesnt cause a big jump
                this.moving = true;
                this.timestamp = Date.now();
            }

            //handle the move
            if (!multiply || !this.analog) {
                //ignore multiply data
                multiplyX = 1.0;
                multiplyY = 1.0;
            } else {
                //apply analog multiplier
                multiplyX *= this.analogMultiplier;
                multiplyY *= this.analogMultiplier;
            }

            //get movement vectors
            var horizontal = left ^ right ? (left ? -multiplyX : multiplyX) : 0.0;
            var vertical = up ^ down ? (up ? -multiplyY : multiplyY) : 0.0;

            //handle move
            if (horizontal != 0.0 || vertical != 0.0) {
                this._handleMove(horizontal, vertical);
            }
        }

        //handle left mouse button
        if (!this.states[CVirtualMouse.LEFT]) {
            if (button1) {
                handled = true;
                this.states[CVirtualMouse.LEFT] = true;
                this._handleDown(CVirtualMouse.LEFT);
            }
        } else {
            handled = true;

            if (!button1) {
                this.states[CVirtualMouse.LEFT] = false;
                this._handleUp(CVirtualMouse.LEFT);
            }
        }

        //handle right mouse button
        if (!this.states[CVirtualMouse.RIGHT]) {
            if (button2) {
                handled = true;
                this.states[CVirtualMouse.RIGHT] = true;
                this._handleDown(CVirtualMouse.RIGHT);
            }
        } else {
            handled = true;

            if (!button2) {
                this.states[CVirtualMouse.RIGHT] = false;
                this._handleUp(CVirtualMouse.RIGHT);
            }
        }

        //update internal position if a button is pressed
        if (handled && !this.moving) {
            this.x = this.app.mouseX;
            this.y = this.app.mouseY;
        }

        //update the cursor
        this._updateCursor();

        //start fade in if we handled any input
        if (handled && (!this.fadeActive || !this.fadeTargetVisible)) {
            this._fadeTo(1.0, CVirtualMouse.FADE_IN_LENGTH);
        }

        //return supress
        return this.suppress;
    },

    setupFrame: function (enabled, visible) {
        var showByDefault = false;

        //inherit values from app
        if (enabled == CVirtualMouse.INHERIT) {
            enabled = this.appEnabled;
        }

        if (visible == CVirtualMouse.INHERIT) {
            visible = this.appVisible;
        }

        //check if target disables virtual mouse
        if (enabled == CVirtualMouse.SUPPORTED_DEVICES) {
            if (!Runtime.isVirtualMouseAllowed()) {
                //not supported by target
                enabled = CVirtualMouse.DISABLED;
            } else {
                //supported by target
                enabled = CVirtualMouse.ENABLED;
            }
        }

        //check for native emulation
        if (enabled == CVirtualMouse.ENABLED && this.native && Runtime.isNativeMouseEmulationAllowed()) {
            enabled = CVirtualMouse.NATIVE;
        }

        //check for shown by default
        if (enabled == CVirtualMouse.ENABLED && Runtime.isConsole()) {
            showByDefault = true;
        }

        //check the state of enabled
        if (enabled != this.enabled) {
            switch (enabled) {
                case CVirtualMouse.ENABLED:
                    this.enabled = CVirtualMouse.ENABLED;
                    Runtime.onDisableMouseEmulation();

                    //initial visibility will get handled after this switch statement

                    break;

                case CVirtualMouse.NATIVE:
                    this.enabled = CVirtualMouse.NATIVE;
                    Runtime.onEnableMouseEmulation();

                    //instant fade out
                    this.alpha = 0.0;
                    this.fadeActive = false;
                    this.fadeTarget = 0.0;
                    this.fadeTargetVisible = false;

                    break;

                default:
                    this.enabled = CVirtualMouse.DISABLED;
                    Runtime.onDisableMouseEmulation();

                    //instant fade out
                    this.alpha = 0.0;
                    this.fadeActive = false;
                    this.fadeTarget = 0.0;
                    this.fadeTargetVisible = false;

                    break;
            }
        }

        //check teh state of visible
        if (visible != this.visible) {
            this.visible = visible;
        }

        //handle other first run det
        if (this.firstSetup) {
            this.firstSetup = false;

            //initial position
            this.x = this.app.mouseX;
            this.y = this.app.mouseY;

            //initial visibility
            this.fadeActive = false;
            if (enabled == CVirtualMouse.ENABLED && showByDefault && (!this.fadeActive || !this.fadeTargetVisible)) {
                this.alpha = 1.0;
                this.fadeTarget = 1.0;
                this.fadeTargetVisible = true;
            } else {
                this.alpha = 0.0;
                this.fadeTarget = 0.0;
                this.fadeTargetVisible = false;
            }
        }
    },

    position: function () {
        //reset back to the apps mouse position
        this.x = this.app.mouseX;
        this.y = this.app.mouseY;
    },
}
