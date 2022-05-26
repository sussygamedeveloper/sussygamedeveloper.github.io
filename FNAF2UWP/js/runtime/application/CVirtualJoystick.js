// CVirtualJoystick object
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

CVirtualJoystick.TYPE_NONE = 0;
CVirtualJoystick.TYPE_TOUCH = 1;
CVirtualJoystick.TYPE_ACCELEROMETER = 2;
CVirtualJoystick.TYPE_EXT = 3;

function CVirtualJoystick(app, flags) {
    this.app = app;
    this.active = false;
    this.dirtyLayout = true;
}

CVirtualJoystick.prototype = {
    //constructor/destructor
    free: function () {
        this.stop();
        this.app = null;
    },

    //events
    onInit: function() {

    },

    onStart: function() {

    },

    onStop: function() {

    },

    onReset: function () {
    },

    onRender: function (context) {
    },

    onUpdateLayout: function () {
    },

    //api
    start: function () {
        if (!this.active) {
            this.active = true;
            this.onStart();
        }
    },

    stop: function () {
        if (this.active) {
            this.active = false;
            this.onStop();
        }
    },

    updateLayout: function () {
        this.dirtyLayout = true;
    },

    update: function () {
        //do we need to recalculate the layout?
        if (this.dirtyLayout) {
            this.onUpdateLayout();
            this.dirtyLayout = false;
        }
    },

    render: function(context) {
        this.onRender(context);
    },

    reset: function (flags) {
        this.onReset(flags);
    },

    getState: function () {
        return this.state;
    },

    setObjectX: function (what, x) {
    },

    setObjectY: function (what, y) {
    },

    getObjectX: function (what) {
        return 0;
    },

    getObjectY: function (what) {
        return 0;
    },
}
