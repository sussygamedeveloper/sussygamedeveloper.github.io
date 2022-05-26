// CMoveExtension
//----------------------------------------------------------------------------------
/* Copyright (c) 1996-2016 Clickteam
 *
 * This source code is part of the HTML5 exporter for Clickteam Multimedia Fusion 2.
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

function CMoveExtension(m) {
    //call chain
    CMove.call(this);

    //call self
    this.movement = m;
    this.callParam = 0;
}

CMoveExtension.prototype = {
    init: function (ho, mvPtr) {
        this.hoPtr = ho;

        var file = ho.hoAdRunHeader.rhApp.file.createFromFile(mvPtr.data);
        this.movement.initialize(file);
        this.hoPtr.roc.rcCheckCollides = true;
        this.hoPtr.roc.rcChanged = true;
    },

    kill: function () {
        this.movement.kill();
    },

    move: function () {
        /*      // FRANCOIS
         if (typeof this.movement == 'undefined')
         {
         debugger;
         return;
         }
         */
        if (this.movement.move()) {
            this.hoPtr.roc.rcChanged = true;
        }
    },

    stop: function () {
        this.movement.stop(this.rmCollisionCount == this.hoPtr.hoAdRunHeader.rh3CollisionCount);
    },

    start: function () {
        this.movement.start();
    },

    bounce: function () {
        this.movement.bounce(this.rmCollisionCount == this.hoPtr.hoAdRunHeader.rh3CollisionCount);
    },

    setSpeed: function (speed) {
        this.movement.setSpeed(speed);
    },

    setMaxSpeed: function (speed) {
        this.movement.setMaxSpeed(speed);
    },

    reverse: function () {
        this.movement.reverse();
    },

    setXPosition: function (x) {
        this.movement.setXPosition(x);
        this.hoPtr.roc.rcChanged = true;
        this.hoPtr.roc.rcCheckCollides = true;
    },

    setYPosition: function (y) {
        this.movement.setYPosition(y);
        this.hoPtr.roc.rcChanged = true;
        this.hoPtr.roc.rcCheckCollides = true;
    },

    setDir: function (dir) {
        this.movement.setDir(dir);
        this.hoPtr.roc.rcChanged = true;
        this.hoPtr.roc.rcCheckCollides = true;
    },

    callMovement: function (func, param) {
        this.callParam = param;
        return this.movement.actionEntry(func);
    }
};

//setup inheritance using extend
CServices.extend(CMove, CMoveExtension);