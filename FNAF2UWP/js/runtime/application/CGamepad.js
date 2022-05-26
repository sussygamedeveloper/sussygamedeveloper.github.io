// CGamepad object
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

//sizes
CGamepad.TOTAL_BUTTONS = 14;
CGamepad.TOTAL_AXIS = 6;

//states
CGamepad.IDLE = 0;
CGamepad.HIT = 1;
CGamepad.HELD = 2;
CGamepad.RELEASED = 3;

//buttons
CGamepad.MENU = 0;
CGamepad.BACK = 1;
CGamepad.A = 2;
CGamepad.B = 3;
CGamepad.X = 4;
CGamepad.Y = 5;
CGamepad.UP = 6;
CGamepad.DOWN = 7;
CGamepad.LEFT = 8;
CGamepad.RIGHT = 9;
CGamepad.SHOULDER_LEFT = 10;
CGamepad.SHOULDER_RIGHT = 11;
CGamepad.THUMB_LEFT = 12;
CGamepad.THUMB_RIGHT = 13;
CGamepad.BUTTON_COUNT = 14;

//axis
CGamepad.THUMB_LEFT_X = 0;
CGamepad.THUMB_LEFT_Y = 1;
CGamepad.THUMB_RIGHT_X = 2;
CGamepad.THUMB_RIGHT_Y = 3;
CGamepad.TRIGGER_LEFT = 4;
CGamepad.TRIGGER_RIGHT = 5;
CGamepad.AXIS_COUNT = 6;

//class
function CGamepad() {
    //public
    this.player = -1;
    this.context = null;
    this.connected = false;
    this.drift = 0.4;

    //private
    this.vibrationTimeout = null;

    //create button arrays
    this._buttonState = new Int16Array(CGamepad.TOTAL_BUTTONS);
    for (index = 0; index < CGamepad.TOTAL_BUTTONS; index++) {
        this._buttonState[index] = CGamepad.IDLE;
    }

    //create axis arrays
    this._axisValue = new Float32Array(CGamepad.TOTAL_AXIS);

    this._axisState = new Int16Array(CGamepad.TOTAL_AXIS);
    for (index = 0; index < CGamepad.TOTAL_AXIS; index++) {
        this._axisState[index] = CGamepad.IDLE;
    }

    //create poll data structures
    this._pollData = {
        button: new Int16Array(CGamepad.TOTAL_BUTTONS),
        axis: new Float32Array(CGamepad.TOTAL_AXIS),
    };
}

//methods
CGamepad.prototype = {
    //events
    onPoll: function (data) {
        //extended class can use this to poll the system for gamepad info
    },

    onConnect: function () {
    },

    onDisconnect: function () {
    },

    onSetVibration: function(leftMotor, rightMotor) {
    },

    //internal
    _connect: function (player, context) {
        this.player = player;
        this.connected = true;
        this.context = context;
        this.onConnect();
    },

    _disconnect: function () {
        this.onDisconnect();
        this._player = -1;
        this.connected = false;
        this.context = null;
    },

    _update: function (data) {
        //call internal update, we ignore data and just pass it to the extended function
        var index;

        //reset reelease states
        for (index = 0; index < CGamepad.TOTAL_BUTTONS; index++) {
            if (this._buttonState[index] == CGamepad.RELEASED) {
                this._buttonState[index] = CGamepad.IDLE;
            }
        }

        for (index = 0; index < CGamepad.TOTAL_AXIS; index++) {
            if (this._axisState[index] == CGamepad.RELEASED) {
                this._axisState[index] = CGamepad.IDLE;
            }
        }

        //reset poll data
        for (index = 0; index < CGamepad.TOTAL_BUTTONS; index++) {
            this._pollData.button[index] = false;
        }

        for (index = 0; index < CGamepad.TOTAL_AXIS; index++) {
            this._pollData.axis[index] = 0.0;
        }

        //call to poll the data
        this.onPoll(this._pollData);

        //process polled buttons
        var newState;
        for (index = 0; index < CGamepad.TOTAL_BUTTONS; index++) {
            newState = this._buttonState[index];

            //find the new state for gamepad button
            if (this._pollData.button[index]) {
                //polled data is pressed
                if (newState == CGamepad.IDLE) {
                    newState = CGamepad.HIT;
                } else if (newState == CGamepad.HIT) {
                    newState = CGamepad.HELD;
                }
            } else {
                //polled data is unpressed
                if (newState == CGamepad.HIT || newState == CGamepad.HELD) {
                    newState = CGamepad.RELEASED;
                }
            }

            //check if it changes
            if (newState != this._buttonState[index]) {
                //TODO: could signal "has changed" events here
                this._buttonState[index] = newState;
            }
        }

        //process polled axis
        var testValue;
        for (index = 0; index < CGamepad.TOTAL_AXIS; index++) {
            //process value
            this._axisValue[index] = this._pollData.axis[index];

            //process state
            newState = this._axisState[index];

            testValue = Math.abs(this._axisValue[index]);
            if (testValue >= this.drift && testValue <= 1.0) {
                //"pressed"
                if (newState == CGamepad.IDLE) {
                    newState = CGamepad.HIT;
                } else if (newState == CGamepad.HIT) {
                    newState = CGamepad.HELD;
                }
            } else {
                //"unpressed"
                if (newState == CGamepad.HIT || newState == CGamepad.HELD) {
                    newState = CGamepad.RELEASED;
                }
            }

            //check if it changes
            if (newState != this._axisState[index]) {
                //TODO: could signal "has changed" events here
                this._axisState[index] = newState;
            }
        }
    },

    _getDirectionAxisState: function (button, axisX, axisY) {
        //check to see if 
        switch (button) {
            case CGamepad.UP:
                if (this._axisValue[axisY] > 0) {
                    return this._axisState[axisY];
                }
                break;

            case CGamepad.DOWN:
                if (this._axisValue[axisY] < 0) {
                    return this._axisState[axisY];
                }
                break;

            case CGamepad.LEFT:
                if (this._axisValue[axisX] < 0) {
                    return this._axisState[axisX];
                }
                break;

            case CGamepad.RIGHT:
                if (this._axisValue[axisX] > 0) {
                    return this._axisState[axisX];
                }
                break;
        }

        return CGamepad.IDLE;
    },

    //button api
    buttonState: function (button) {
        return this._buttonState[button];
    },

    buttonHit: function (button) {
        return this._buttonState[button] == CGamepad.HIT;
    },

    buttonHeld: function (button) {
        return this._buttonState[button] == CGamepad.HELD;
    },

    buttonPressed: function (button) {
        return this._buttonState[button] == CGamepad.HIT || this._buttonState[button] == CGamepad.HELD;
    },

    buttonReleased: function (button) {
        return this._buttonState[button] == CGamepad.RELEASED;
    },

    anyButtonPressed: function () {
        for (var index = 0; index < CGamepad.BUTTON_COUNT; index++) {
            if (this._buttonState[index] == CGamepad.HIT || this._buttonState[index] == CGamepad.HELD) {
                return true;
            }
        }

        return false;
    },

    //axis api
    axisValue: function (axis) {
        return this._axisValue[axis];
    },

    axisStrength: function (axis, removeDrift, drift) {
        if (removeDrift) {
            //drift 3rd param is optional
            if (drift === null) {
                drift = this.drift;
            }
            return Math.max(0.0, ((Math.abs(this._axisValue[axis]) - drift) * 1.0) / (1.0 - drift));
        } else {
            return Math.abs(this._axisValue[axis]);
        }
    },

    axisState: function (axis) {
        return this._axisState[axis];
    },

    axisHit: function (axis) {
        return this._axisState[axis] == CGamepad.HIT;
    },

    axisHeld: function (axis) {
        return this._axisState[axis] == CGamepad.HELD;
    },

    axisPressed: function (axis) {
        //not to be confused with pressing thumbstick
        return this._axisState[axis] == CGamepad.HIT || this._axisState[axis] == CGamepad.HELD
    },

    axisReleased: function (axis) {
        return this._axisState[axis] == CGamepad.RELEASED;
    },

    //direction api
    directionState: function (button) {
        var buttonState = this._buttonState[button];
        var axisState = this._getDirectionAxisState(button, CGamepad.THUMB_LEFT_X, CGamepad.THUMB_LEFT_Y);

        //check held
        if (buttonState == CGamepad.HELD || axisState == CGamepad.HELD) {
            return CGamepad.HELD;
        }

        //check hit
        if (buttonState == CGamepad.HIT || axisState == CGamepad.HIT) {
            return CGamepad.HIT;
        }

        //check released
        if (buttonState == CGamepad.RELEASED || axisState == CGamepad.RELEASED) {
            return CGamepad.RELEASED;
        }

        //idle
        return CGamepad.IDLE;
    },

    directionHit: function (button) {
        //special case function for checking state with dpad or thumb
        var buttonState = this._buttonState[button];
        var axisState = this._getDirectionAxisState(button, CGamepad.THUMB_LEFT_X, CGamepad.THUMB_LEFT_Y);
        return (buttonState == CGamepad.HIT || axisState == CGamepad.HIT) && buttonState != CGamepad.HELD && axisState != CGamepad.HELD;
    },

    directionHeld: function (button) {
        //special case function for checking state with dpad or thumb
        var buttonState = this._buttonState[button];
        var axisState = this._getDirectionAxisState(button, CGamepad.THUMB_LEFT_X, CGamepad.THUMB_LEFT_Y);
        return buttonState == CGamepad.HELD || axisState == CGamepad.HELD
    },

    directionPressed: function (button) {
        //special case function for checking state with dpad or thumb
        var buttonState = this._buttonState[button];
        var axisState = this._getDirectionAxisState(button, CGamepad.THUMB_LEFT_X, CGamepad.THUMB_LEFT_Y);
        return buttonState == CGamepad.HIT || axisState == CGamepad.HIT || buttonState == CGamepad.HELD || axisState == CGamepad.HELD
    },

    directionReleased: function (button) {
        //special case function for checking state with dpad or thumb
        var buttonState = this._buttonState[button];
        var axisState = this._getDirectionAxisState(button, CGamepad.THUMB_LEFT_X, CGamepad.THUMB_LEFT_Y);
        return (buttonState == CGamepad.RELEASED || axisState == CGamepad.RELEASED) && (buttonState == axisState || buttonState == CGamepad.IDLE || axisState == CGamepad.IDLE);
    },

    //api
    vibrate: function(leftMotor, rightMotor, duration) {
        //clear previous vibration timer
        if (this.vibrationTimeout != null) {
            clearTimeout(this.vibrationTimeout);
            this.vibrationTimeout = null;
        }

        //make it vibrate
        this.onSetVibration(duration > 0 ? leftMotor : 0.0, duration > 0 ? rightMotor : 0.0);

        //timer callback
        if (duration > 0) {
            var that = this;

            this.vibrationTimeout = setTimeout(function () {
                //callback so we need to turn off vibration!
                that.vibrationTimeout = null;
                that.onSetVibration(0.0, 0.0);
            }, duration);
        }
    }
};
