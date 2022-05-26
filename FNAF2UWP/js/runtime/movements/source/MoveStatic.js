// CMoveStatic
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

function CMoveDefStatic() {
    //call chain
    CMoveDef.call(this);

    //call self
}

CMoveDefStatic.prototype = {
    load: function (file, length) {
    }
};

//setup inheritance using extend
CServices.extend(CMoveDef, CMoveDefStatic);

//CMoveStatic
function CMoveStatic() {
    //call chain
    CMove.call(this);

    //call self
}

CMoveStatic.prototype = {
    init: function (ho, mvPtr) {
        this.hoPtr = ho;
        this.hoPtr.roc.rcSpeed = 0;
        this.hoPtr.roc.rcCheckCollides = true;
        this.hoPtr.roc.rcChanged = true;
    },
    move: function () {
        if (this.hoPtr.roa != null) {
            if (this.hoPtr.roa.animate()) {
                //return; Removed in build 291, see bug #4750
            }
        }
        if (this.hoPtr.roc.rcCheckCollides) {
            this.hoPtr.roc.rcCheckCollides = false;
            this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
        }
    },
    setXPosition: function (x) {
        if (this.hoPtr.hoX != x) {
            this.hoPtr.hoX = x;
            this.hoPtr.rom.rmMoveFlag = true;
            this.hoPtr.roc.rcChanged = true;
        }
        this.hoPtr.roc.rcCheckCollides = true;
    },
    setYPosition: function (y) {
        if (this.hoPtr.hoY != y) {
            this.hoPtr.hoY = y;
            this.hoPtr.rom.rmMoveFlag = true;
            this.hoPtr.roc.rcChanged = true;
        }
        this.hoPtr.roc.rcCheckCollides = true;
    },
    setDir: function (dir) {
    },
    reverse: function (dir) {
    },
    stop: function () {
    },
    start: function () {
    },
    bounce: function () {
    },
    setSpeed: function (speed) {
    },
    setMaxSpeed: function (speed) {
    }
};

//setup inheritance using extend
CServices.extend(CMove, CMoveStatic);