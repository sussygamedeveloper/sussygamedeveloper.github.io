// CDialog object
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

function CDialog(options) {
    this._completed = true;
    this._open = false;
    this._options = options;
    this._params = null;
    this._callback = null;
}

CDialog.prototype = {
    //constructor/destructor
    free: function () {
    },

    //events
    onOpen: function () {
    },

    onClose: function () {
    },

    onFinish: function (result) {
    },

    //internal
    option: function (name, defaultValue) {
        //read an option value safely
        if (name && this._options && typeof this._options[name] != 'undefined') {
            return this._options[name];
        }

        return defaultValue;
    },

    param: function (name, defaultValue) {
        //read a param value safely
        if (name && this._params && typeof this._params[name] != 'undefined') {
            return this._params[name];
        }

        return defaultValue;
    },

    finish: function (success, result) {
        if (!this._completed) {
            //flag finished
            this._completed = true;

            //call internal event
            this.onFinish(success, result);

            //call callback
            if (this._callback) {
                this._callback.call(this, success, result, this.params);
            }

            //call runtime to unpause dialog
            Runtime.onDialogeClose(this);

            //wipe vars
            this._params = null;
            this._callback = null;
        }
    },

    //api
    open: function (callback, params) {
        //TODO: should probably close existing dialog first..
        if (!this._open && this._completed) {
            //update vars
            this._completed = false;
            this._open = true;
            this._params = params;
            this._callback = callback;

            //call runtime to open dialog
            Runtime.onDialogeOpen(this);

            //call event to open
            this.onOpen();
        }
    },

    close: function () {
        if (this._open) {
            this._open = false;

            //call event to close
            this.onClose();
        }
    },
}