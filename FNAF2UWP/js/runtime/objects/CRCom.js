// CRCom
// ----------------------------------------------------------------
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

function CRCom() {
    this.rcPlayer = 0;
    this.rcMovementType = 0;
    this.rcAnim = 0;
    this.rcImage = -1;
    this.rcScaleX = 1.0;
    this.rcScaleY = 1.0;
    this.rcAngle = 0;
    this.rcDir = 0;
    this.rcSpeed = 0;
    this.rcMinSpeed = 0;
    this.rcMaxSpeed = 0;
    this.rcChanged = false;
    this.rcCheckCollides = false;

    this.rcOldX = 0;
    this.rcOldY = 0;
    this.rcOldImage = -1;
    this.rcOldAngle = 0;
    this.rcOldDir = 0;
    this.rcOldX1 = 0;
    this.rcOldY1 = 0;
    this.rcOldX2 = 0;
    this.rcOldY2 = 0;
}

CRCom.prototype = {
    init: function () {
        this.rcScaleX = 1.0;
        this.rcScaleY = 1.0;
        this.rcAngle = 0;
        this.rcMovementType = -1;
    },
    kill: function (bFast) {
    }
}
