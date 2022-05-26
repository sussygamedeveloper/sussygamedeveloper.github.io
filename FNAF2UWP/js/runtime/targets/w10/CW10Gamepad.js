// CW10Gamepad object
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

function CW10Gamepad() {
    //call parent
    CGamepad.call(this);
}

CW10Gamepad.prototype = {
    //events
    onPoll: function (data) {
        //(https://msdn.microsoft.com/en-us/library/windows/apps/windows.gaming.input.gamepadbuttons.aspx)
        var gamepadButtonFlags = Windows.Gaming.Input.GamepadButtons;

        //poll win10
        var reading = this.context.getCurrentReading();

        //update buttons
        data.button[CGamepad.MENU] = (reading.buttons & gamepadButtonFlags.menu) != 0;
        data.button[CGamepad.BACK] = (reading.buttons & gamepadButtonFlags.view) != 0;
        data.button[CGamepad.A] = (reading.buttons & gamepadButtonFlags.a) != 0;
        data.button[CGamepad.B] = (reading.buttons & gamepadButtonFlags.b) != 0;
        data.button[CGamepad.X] = (reading.buttons & gamepadButtonFlags.x) != 0;
        data.button[CGamepad.Y] = (reading.buttons & gamepadButtonFlags.y) != 0;
        data.button[CGamepad.UP] = (reading.buttons & gamepadButtonFlags.dpadUp) != 0;
        data.button[CGamepad.DOWN] = (reading.buttons & gamepadButtonFlags.dpadDown) != 0;
        data.button[CGamepad.LEFT] = (reading.buttons & gamepadButtonFlags.dpadLeft) != 0;
        data.button[CGamepad.RIGHT] = (reading.buttons & gamepadButtonFlags.dpadRight) != 0;
        data.button[CGamepad.SHOULDER_LEFT] = (reading.buttons & gamepadButtonFlags.leftShoulder) != 0;
        data.button[CGamepad.SHOULDER_RIGHT] = (reading.buttons & gamepadButtonFlags.rightShoulder) != 0;
        data.button[CGamepad.THUMB_LEFT] = (reading.buttons & gamepadButtonFlags.leftThumbstick) != 0;
        data.button[CGamepad.THUMB_RIGHT] = (reading.buttons & gamepadButtonFlags.rightThumbstick) != 0;

        //update axis
        data.axis[CGamepad.THUMB_LEFT_X] = reading.leftThumbstickX;
        data.axis[CGamepad.THUMB_LEFT_Y] = reading.leftThumbstickY;
        data.axis[CGamepad.THUMB_RIGHT_X] = reading.rightThumbstickX;
        data.axis[CGamepad.THUMB_RIGHT_Y] = reading.rightThumbstickY;
        data.axis[CGamepad.TRIGGER_LEFT] = reading.leftTrigger;
        data.axis[CGamepad.TRIGGER_RIGHT] = reading.rightTrigger;
    },

    onSetVibration: function(leftMotor, rightMotor) {
        this.context.vibration = {
            leftMotor: leftMotor,
            rightMotor: rightMotor,
            leftTrigger: 0.0,
            rightTrigger: 0.0,
        };
    },

    //internal
    _testButton: function (flag, newButtons) {
        var oldState = (this.oldButtons & flag) != 0;
        var newState = (newButtons & flag) != 0;
    },
};

//setup inheritance using extend
CServices.extend(CGamepad, CW10Gamepad);