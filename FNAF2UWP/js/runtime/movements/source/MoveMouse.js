// CMoveMouse
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

function CMoveDefMouse() {
    //call chain
    CMoveDef.call(this);

    //call self
    this.mmDx = 0;
    this.mmFx = 0;
    this.mmDy = 0;
    this.mmFy = 0;
    this.mmFlags = 0;
}

CMoveDefMouse.prototype = {
    load: function (file, length) {
        this.mmDx = file.readShort();
        this.mmFx = file.readShort();
        this.mmDy = file.readShort();
        this.mmFy = file.readShort();
        this.mmFlags = file.readAShort();
    }
};

//setup inheritance using extend
CServices.extend(CMoveDef, CMoveDefMouse);

//CMoveMouse
function CMoveMouse() {
    //call chain
    CMove.call(this);

    //call self
    this.MM_DXMouse = 0;
    this.MM_DYMouse = 0;
    this.MM_FXMouse = 0;
    this.MM_FYMouse = 0;
    this.MM_Stopped = 0;
    this.MM_OldSpeed = 0;
}

CMoveMouse.prototype = {
    init: function (ho, mmPtr) {
        this.hoPtr = ho;

        this.hoPtr.roc.rcPlayer = mmPtr.mvControl;
        this.MM_DXMouse = mmPtr.mmDx + this.hoPtr.hoX;
        this.MM_DYMouse = mmPtr.mmDy + this.hoPtr.hoY;
        this.MM_FXMouse = mmPtr.mmFx + this.hoPtr.hoX;
        this.MM_FYMouse = mmPtr.mmFy + this.hoPtr.hoY;
        this.hoPtr.roc.rcSpeed = 0;
        this.MM_OldSpeed = 0;
        this.MM_Stopped = 0;
        this.hoPtr.roc.rcMinSpeed = 0;
        this.hoPtr.roc.rcMaxSpeed = 100;
        this.rmOpt = mmPtr.mvOpt;
        this.moveAtStart(mmPtr);
        this.hoPtr.roc.rcChanged = true;
    },

    move: function () {
        var newX = this.hoPtr.hoX;
        var newY = this.hoPtr.hoY;
        var deltaX, deltaY, flags, speed, dir, index;

        if (this.rmStopSpeed == 0) {
            if (this.hoPtr.hoAdRunHeader.rh2InputMask[this.hoPtr.roc.rcPlayer - 1] != 0) {
                newX = this.hoPtr.hoAdRunHeader.rh2MouseX;
                if (newX < this.MM_DXMouse) {
                    newX = this.MM_DXMouse;
                }
                if (newX > this.MM_FXMouse) {
                    newX = this.MM_FXMouse;
                }

                newY = this.hoPtr.hoAdRunHeader.rh2MouseY;
                if (newY < this.MM_DYMouse) {
                    newY = this.MM_DYMouse;
                }
                if (newY > this.MM_FYMouse) {
                    newY = this.MM_FYMouse;
                }

                deltaX = newX - this.hoPtr.hoX;
                deltaY = newY - this.hoPtr.hoY;
                flags = 0;
                if (deltaX < 0) {
                    deltaX = -deltaX;
                    flags |= 0x01;
                }
                if (deltaY < 0) {
                    deltaY = -deltaY;
                    flags |= 0x02;
                }
                speed = (deltaX + deltaY) << 2;
                if (speed > 250) {
                    speed = 250;
                }
                this.hoPtr.roc.rcSpeed = speed;
                if (speed != 0) {
                    deltaX <<= 8;
                    if (deltaY == 0) {
                        deltaY = 1;
                    }
                    deltaX /= deltaY;
                    for (index = 0; ; index += 2) {
                        if (deltaX >= CMove.CosSurSin32[index]) {
                            break;
                        }
                    }
                    dir = CMove.CosSurSin32[index + 1];
                    if ((flags & 0x02) != 0) {
                        dir = -dir + 32;
                        dir &= 31;
                    }
                    if ((flags & 0x01) != 0) {
                        dir -= 8;
                        dir &= 31;
                        dir = -dir;
                        dir &= 31;
                        dir += 8;
                        dir &= 31;
                    }
                    this.hoPtr.roc.rcDir = dir;
                }
            }
        }

        if (this.hoPtr.roc.rcSpeed != 0) {
            this.MM_Stopped = 0;
            this.MM_OldSpeed = this.hoPtr.roc.rcSpeed;
        }
        this.MM_Stopped++;
        if (this.MM_Stopped > 10) {
            this.MM_OldSpeed = 0;
        }
        this.hoPtr.roc.rcSpeed = this.MM_OldSpeed;
        if (this.hoPtr.roa != null) {
            this.hoPtr.roa.animate();
        }
        ;

        this.hoPtr.hoX = newX;
        this.hoPtr.hoY = newY;
        this.hoPtr.roc.rcChanged = true;
        this.hoPtr.hoAdRunHeader.rh3CollisionCount++;
        this.rmCollisionCount = this.hoPtr.hoAdRunHeader.rh3CollisionCount;
        this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
    },

    stop: function () {
        if (this.rmCollisionCount == this.hoPtr.hoAdRunHeader.rh3CollisionCount) {
            this.mv_Approach((this.rmOpt & CMove.MVTOPT_8DIR_STICK) != 0);
        }
        this.hoPtr.roc.rcSpeed = 0;
    },
    start: function () {
        this.rmStopSpeed = 0;
        this.hoPtr.rom.rmMoveFlag = true;
    },
    bounce: function () {
        this.stop();
    },
    reverse: function () {
    },
    setDir: function (dir) {
    },
    setXPosition: function (x) {
        if (this.hoPtr.hoX != x) {
            this.hoPtr.hoX = x;
            this.hoPtr.rom.rmMoveFlag = true;
            this.hoPtr.roc.rcChanged = true;
            this.hoPtr.roc.rcCheckCollides = true;
        }
    },
    setYPosition: function (y) {
        if (this.hoPtr.hoY != y) {
            this.hoPtr.hoY = y;
            this.hoPtr.rom.rmMoveFlag = true;
            this.hoPtr.roc.rcChanged = true;
            this.hoPtr.roc.rcCheckCollides = true;
        }
    }
};

//setup inheritance using extend
CServices.extend(CMove, CMoveMouse);