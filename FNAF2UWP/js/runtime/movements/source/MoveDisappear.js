// CMoveDisappear
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

function CMoveDisappear() {
    //call chain
    CMove.call(this);

    //call self
}

CMoveDisappear.prototype = {
    init: function (ho, mvPtr) {
        this.hoPtr = ho;
    },
    move: function () {
        if ((this.hoPtr.hoFlags & CObject.HOF_FADEOUT) == 0) {
            if (this.hoPtr.roa != null) {
                this.hoPtr.roa.animate();
                if (this.hoPtr.roa.raAnimForced != CAnim.ANIMID_DISAPPEAR + 1) {
                    this.hoPtr.hoAdRunHeader.addToDestroyList(this.hoPtr.hoNumber);
                }
            }
        }
    },
    setXPosition: function (x) {
        if (this.hoPtr.hoX != x) {
            this.hoPtr.hoX = x;
            this.hoPtr.rom.rmMoveFlag = true;
            this.hoPtr.roc.rcChanged = true;
        }
    },
    setYPosition: function (y) {
        if (this.hoPtr.hoY != y) {
            this.hoPtr.hoY = y;
            this.hoPtr.rom.rmMoveFlag = true;
            this.hoPtr.roc.rcChanged = true;
        }
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
CServices.extend(CMove, CMoveDisappear);