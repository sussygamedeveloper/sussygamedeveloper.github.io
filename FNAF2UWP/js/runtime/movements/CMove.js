"use strict";
// CMove
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

//class
function CMove() {
    this.hoPtr = null;
    this.rmAcc = 0;
    this.rmDec = 0;
    this.rmCollisionCount = 0;
    this.rmStopSpeed = 0;
    this.rmAccValue = 0;
    this.rmDecValue = 0;
    this.rmOpt = 0;
}

//constants / functions / globals
CMove.Cosinus32 = [
    256, 251, 236, 212, 181, 142, 97, 49,
    0, -49, -97, -142, -181, -212, -236, -251,
    -256, -251, -236, -212, -181, -142, -97, -49,
    0, 49, 97, 142, 181, 212, 236, 251
];
CMove.Sinus32 = [
    0, -49, -97, -142, -181, -212, -236, -251,
    -256, -251, -236, -212, -181, -142, -97, -49,
    0, 49, 97, 142, 181, 212, 236, 251,
    256, 251, 236, 212, 181, 142, 97, 49
];
CMove.accelerators = [
    0x0002, 0x0003, 0x0004, 0x0006, 0x0008, 0x000a, 0x000c, 0x0010, 0x0014, 0x0018,
    0x0030, 0x0038, 0x0040, 0x0048, 0x0050, 0x0058, 0x0060, 0x0068, 0x0070, 0x0078,
    0x0090, 0x00A0, 0x00B0, 0x00c0, 0x00d0, 0x00e0, 0x00f0, 0x0100, 0x0110, 0x0120,
    0x0140, 0x0150, 0x0160, 0x0170, 0x0180, 0x0190, 0x01a0, 0x01b0, 0x01c0, 0x01e0,
    0x0200, 0x0220, 0x0230, 0x0250, 0x0270, 0x0280, 0x02a0, 0x02b0, 0x02d0, 0x02e0,
    0x0300, 0x0310, 0x0330, 0x0350, 0x0360, 0x0380, 0x03a0, 0x03b0, 0x03d0, 0x03e0,
    0x0400, 0x0460, 0x04c0, 0x0520, 0x05a0, 0x0600, 0x0660, 0x06c0, 0x0720, 0x07a0,
    0x0800, 0x08c0, 0x0980, 0x0a80, 0x0b40, 0x0c00, 0x0cc0, 0x0d80, 0x0e80, 0x0f40,
    0x1000, 0x1990, 0x1332, 0x1460, 0x1664, 0x1800, 0x1999, 0x1b32, 0x1cc6, 0x1e64,
    0x2000, 0x266c, 0x2d98, 0x3404, 0x3a70, 0x40dc, 0x4748, 0x4db4, 0x5400, 0x6400,
    0x6400
];
CMove.Joy2Dir = [
    -1,
    8,
    24,
    -1,
    16,
    12,
    20,
    16,
    0,
    4,
    28,
    0,
    -1,
    8,
    24,
    -1
];
CMove.CosSurSin32 = [
    2599, 0, 844, 31, 479, 30, 312, 29, 210, 28, 137, 27, 78, 26, 25, 25, 0, 24
];
CMove.mvap_TableDirs = [
    0, -2, 0, 2, 0, -4, 0, 4, 0, -8, 0, 8, -4, 0, -8, 0, 0, 0,
    -2, -2, 2, 2, -4, -4, 4, 4, -8, -8, 8, 8, -4, 4, -8, 8, 0, 0,
    -2, 0, 2, 0, -4, 0, 4, 0, -8, 0, 8, 0, 0, 4, 0, 8, 0, 0,
    -2, 2, 2, -2, -4, 4, 4, -4, -8, 8, 8, -8, 4, 4, 8, 8, 0, 0,
    0, 2, 0, -2, 0, 4, 0, -4, 0, 8, 0, -8, 4, 0, 8, 0, 0, 0,
    2, 2, -2, -2, 4, 4, -4, -4, 8, 8, -8, -8, 4, -4, 8, -8, 0, 0,
    2, 0, -2, 0, 4, 0, -4, 0, 8, 0, -8, 0, 0, -4, 0, -8, 0, 0,
    2, -2, -2, 2, 4, -4, -4, 4, 8, -8, -8, 8, -4, -4, -8, -8, 0, 0
];
CMove.MVTOPT_8DIR_STICK = 0x01;
CMove.getDeltaX = function (pente, angle) {
    return (pente * CMove.Cosinus32[angle]) / 256.0;
};
CMove.getDeltaY = function (pente, angle) {
    return (pente * CMove.Sinus32[angle]) / 256.0;
};

//methods
CMove.prototype = {
    newMake_Move: function (speed, angle) {
        this.hoPtr.hoAdRunHeader.rh3CollisionCount++;
        this.rmCollisionCount = this.hoPtr.hoAdRunHeader.rh3CollisionCount;
        this.hoPtr.rom.rmMoveFlag = false;

        if (speed == 0) {
            this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
            return false;
        }

        var x;
        var y;
        var speedShift;
        if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
            speedShift = Math.floor(speed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef * 32.0);
        }
        else {
            speedShift = speed << 5;
        }
        while (speedShift > 2048) {
            x = this.hoPtr.hoX * 65536 + (this.hoPtr.hoCalculX & 0x0000FFFF);
            y = this.hoPtr.hoY * 65536 + (this.hoPtr.hoCalculY & 0x0000FFFF);
            x += CMove.Cosinus32[angle] * 2048;
            y += CMove.Sinus32[angle] * 2048;
            this.hoPtr.hoCalculX = x & 0x0000FFFF;
            this.hoPtr.hoX = Math.floor(x / 65536);
            this.hoPtr.hoCalculY = y & 0x0000FFFF;
            this.hoPtr.hoY = Math.floor(y / 65536);

            if (this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr)) {
                return true;
            }
            if (this.hoPtr.rom.rmMoveFlag) {
                break;
            }
            speedShift -= 0x0800;
        }

        if (!this.hoPtr.rom.rmMoveFlag) {
            x = this.hoPtr.hoX * 65536 + (this.hoPtr.hoCalculX & 0x0000FFFF);
            y = this.hoPtr.hoY * 65536 + (this.hoPtr.hoCalculY & 0x0000FFFF);
            x += CMove.Cosinus32[angle] * speedShift;
            y += CMove.Sinus32[angle] * speedShift;
            this.hoPtr.hoCalculX = x & 0x0000FFFF;
            this.hoPtr.hoX = Math.floor(x / 65536);
            this.hoPtr.hoCalculY = y & 0x0000FFFF;
            this.hoPtr.hoY = Math.floor(y / 65536);

            if (this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr)) {
                return true;
            }
        }

        this.hoPtr.roc.rcChanged = true;

        if (!this.hoPtr.rom.rmMoveFlag) {
            this.hoPtr.hoAdRunHeader.rhVBLObjet = 0;
        }

        return this.hoPtr.rom.rmMoveFlag;
    },

    moveAtStart: function (mvPtr) {
        if (mvPtr.mvMoveAtStart == 0) {
            this.stop();
        }
    },

    getAccelerator: function (acceleration) {
        if (acceleration <= 100) {
            return CMove.accelerators[acceleration];
        }
        return acceleration << 8;
    },

    mv_Approach: function (bStickToObject) {
        if (bStickToObject) {
            this.mb_Approach(false);
            return;
        }

        var flag = false;

        var x;
        var y;
        var dir;
        var index;
        switch (this.hoPtr.hoAdRunHeader.rhEvtProg.rhCurCode & 0xFFFF0000) {
            case (-12 << 16):         // CNDL_EXTOUTPLAYFIELD:
                x = this.hoPtr.hoX - this.hoPtr.hoImgXSpot;
                y = this.hoPtr.hoY - this.hoPtr.hoImgYSpot;
                dir = this.hoPtr.hoAdRunHeader.quadran_Out(x, y, x + this.hoPtr.hoImgWidth, y + this.hoPtr.hoImgHeight);
                x = this.hoPtr.hoX;
                y = this.hoPtr.hoY;
                if ((dir & CRun.BORDER_LEFT) != 0) {
                    x = this.hoPtr.hoImgXSpot;
                }
                if ((dir & CRun.BORDER_RIGHT) != 0) {
                    x = this.hoPtr.hoAdRunHeader.rhLevelSx - this.hoPtr.hoImgWidth + this.hoPtr.hoImgXSpot;
                }
                if ((dir & CRun.BORDER_TOP) != 0) {
                    y = this.hoPtr.hoImgYSpot;
                }
                if ((dir & CRun.BORDER_BOTTOM) != 0) {
                    y = this.hoPtr.hoAdRunHeader.rhLevelSy - this.hoPtr.hoImgHeight + this.hoPtr.hoImgYSpot;
                }
                this.hoPtr.hoX = x;
                this.hoPtr.hoY = y;
                return;
            case (-13 << 16):        // CNDL_EXTCOLBACK:
            case (-14 << 16):        // CNDL_EXTCOLLISION:
                index = (this.hoPtr.hoAdRunHeader.getDir(this.hoPtr) >> 2) * 18;
                do {
                    if (this.tst_Position(this.hoPtr.hoX + CMove.mvap_TableDirs[index], this.hoPtr.hoY + CMove.mvap_TableDirs[index + 1], flag)) {
                        this.hoPtr.hoX += CMove.mvap_TableDirs[index];
                        this.hoPtr.hoY += CMove.mvap_TableDirs[index + 1];
                        return;
                    }
                    index += 2;
                } while (CMove.mvap_TableDirs[index] != 0 || CMove.mvap_TableDirs[index + 1] != 0);

                if (flag == false) {
                    this.hoPtr.hoX = this.hoPtr.roc.rcOldX;
                    this.hoPtr.hoY = this.hoPtr.roc.rcOldY;
                    this.hoPtr.roc.rcImage = this.hoPtr.roc.rcOldImage;
                    this.hoPtr.roc.rcAngle = this.hoPtr.roc.rcOldAngle;
                    return;
                }
                break;
            default:
                break;
        }
    },

    mb_Approach: function (flag) {
        var x;
        var y;
        var dir;
        var pt;
        var index;

        switch (this.hoPtr.hoAdRunHeader.rhEvtProg.rhCurCode & 0xFFFF0000) {
            case (-12 << 16):         // CNDL_EXTOUTPLAYFIELD:
                x = this.hoPtr.hoX - this.hoPtr.hoImgXSpot;
                y = this.hoPtr.hoY - this.hoPtr.hoImgYSpot;
                dir = this.hoPtr.hoAdRunHeader.quadran_Out(x, y, x + this.hoPtr.hoImgWidth, y + this.hoPtr.hoImgHeight);
                x = this.hoPtr.hoX;
                y = this.hoPtr.hoY;
                if ((dir & CRun.BORDER_LEFT) != 0) {
                    x = this.hoPtr.hoImgXSpot;
                }
                if ((dir & CRun.BORDER_RIGHT) != 0) {
                    x = this.hoPtr.hoAdRunHeader.rhLevelSx - this.hoPtr.hoImgWidth + this.hoPtr.hoImgXSpot;
                }
                if ((dir & CRun.BORDER_TOP) != 0) {
                    y = this.hoPtr.hoImgYSpot;
                }
                if ((dir & CRun.BORDER_BOTTOM) != 0) {
                    y = this.hoPtr.hoAdRunHeader.rhLevelSy - this.hoPtr.hoImgHeight + this.hoPtr.hoImgYSpot;
                }
                this.hoPtr.hoX = x;
                this.hoPtr.hoY = y;
                return;

            case (-13 << 16):        // CNDL_EXTCOLBACK:
            case (-14 << 16):        // CNDL_EXTCOLLISION:
                pt = new CPoint();
                if (this.mbApproachSprite(this.hoPtr.hoX, this.hoPtr.hoY, this.hoPtr.roc.rcOldX, this.hoPtr.roc.rcOldY, flag, pt)) {
                    this.hoPtr.hoX = pt.x;
                    this.hoPtr.hoY = pt.y;
                    return;
                }
                index = (this.hoPtr.hoAdRunHeader.getDir(this.hoPtr) >> 2) * 18;
                do {
                    if (this.tst_Position(this.hoPtr.hoX + CMove.mvap_TableDirs[index], this.hoPtr.hoY + CMove.mvap_TableDirs[index + 1], flag)) {
                        this.hoPtr.hoX += CMove.mvap_TableDirs[index];
                        this.hoPtr.hoY += CMove.mvap_TableDirs[index + 1];
                        return;
                    }
                    index += 2;
                } while (CMove.mvap_TableDirs[index] != 0 || CMove.mvap_TableDirs[index + 1] != 0);

                if (flag == false) {
                    this.hoPtr.hoX = this.hoPtr.roc.rcOldX;
                    this.hoPtr.hoY = this.hoPtr.roc.rcOldY;
                    this.hoPtr.roc.rcImage = this.hoPtr.roc.rcOldImage;
                    this.hoPtr.roc.rcAngle = this.hoPtr.roc.rcOldAngle;
                    return;
                }
                break;
            default:
                break;
        }
    },

    tst_SpritePosition: function (x, y, htFoot, planCol, flag) {
        var sprOi;
        sprOi = -1;
        if (flag) {
            sprOi = this.hoPtr.hoOi;
        }
        var oilPtr = this.hoPtr.hoOiList;

        if ((oilPtr.oilLimitFlags & 0x000F) != 0) {
            var xx = x - this.hoPtr.hoImgXSpot;
            var yy = y - this.hoPtr.hoImgYSpot;
            if ((this.hoPtr.hoAdRunHeader.quadran_Out(xx, yy, xx + this.hoPtr.hoImgWidth, yy + this.hoPtr.hoImgHeight) & oilPtr.oilLimitFlags) != 0) {
                return false;
            }
        }

        if ((oilPtr.oilLimitFlags & 0x0010) != 0) {
            if (this.hoPtr.hoAdRunHeader.colMask_TestObject_IXY(this.hoPtr, this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY, x, y, htFoot, planCol)) {
                return false;
            }
        }

        if (oilPtr.oilLimitList == -1) {
            return true;
        }

        // Demande les collisions a cette position...
        var list = this.hoPtr.hoAdRunHeader.objectAllCol_IXY(this.hoPtr, this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY, x, y, oilPtr.oilColList);
        if (list == null) {
            return true;
        }

        var lb = this.hoPtr.hoAdRunHeader.rhEvtProg.limitBuffer;
        var index;
        for (index = 0; index < list.size(); index++) {
            var hoSprite = list.get(index);
            var oi = hoSprite.hoOi;
            if (oi != sprOi) {
                var ll;
                for (ll = oilPtr.oilLimitList; lb[ll] >= 0; ll++) {
                    if (lb[ll] == oi) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    tst_Position: function (x, y, flag) {
        var sprOi;

        sprOi = -1;
        if (flag) {
            sprOi = this.hoPtr.hoOi;
        }
        var oilPtr = this.hoPtr.hoOiList;

        if ((oilPtr.oilLimitFlags & 0x000F) != 0) {
            var xx = x - this.hoPtr.hoImgXSpot;
            var yy = y - this.hoPtr.hoImgYSpot;
            var dir = this.hoPtr.hoAdRunHeader.quadran_Out(xx, yy, xx + this.hoPtr.hoImgWidth, yy + this.hoPtr.hoImgHeight);
            if ((dir & oilPtr.oilLimitFlags) != 0) {
                return false;
            }
        }

        if ((oilPtr.oilLimitFlags & 0x0010) != 0) {
            if (this.hoPtr.hoAdRunHeader.colMask_TestObject_IXY(this.hoPtr, this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY, x, y, 0, CRunFrame.CM_TEST_PLATFORM)) {
                return false;
            }
        }

        if (oilPtr.oilLimitList == -1) {
            return true;
        }

        var list = this.hoPtr.hoAdRunHeader.objectAllCol_IXY(this.hoPtr, this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY, x, y, oilPtr.oilColList);
        if (list == null) {
            return true;
        }

        var lb = this.hoPtr.hoAdRunHeader.rhEvtProg.limitBuffer;
        var index;
        for (index = 0; index < list.size(); index++) {
            var hoSprite = list.get(index);
            var oi = hoSprite.hoOi;
            if (oi != sprOi) {
                var ll;
                for (ll = oilPtr.oilLimitList; lb[ll] >= 0; ll++) {
                    if (lb[ll] == oi) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    mpApproachSprite: function (destX, destY, maxX, maxY, htFoot, planCol, ptFinal) {
        var presX = destX;
        var presY = destY;
        var loinX = maxX;
        var loinY = maxY;

        var x = CServices.floatToInt((presX + loinX) / 2);
        var y = CServices.floatToInt((presY + loinY) / 2);
        var oldX, oldY;

        do {
            if (this.tst_SpritePosition(x + this.hoPtr.hoAdRunHeader.rhWindowX, y + this.hoPtr.hoAdRunHeader.rhWindowY, htFoot, planCol, false)) {
                loinX = x;
                loinY = y;
                oldX = x;
                oldY = y;
                x = CServices.floatToInt((loinX + presX) / 2);
                y = CServices.floatToInt((loinY + presY) / 2);
                if (x == oldX && y == oldY) {
                    if (loinX != presX || loinY != presY) {
                        if (this.tst_SpritePosition(presX + this.hoPtr.hoAdRunHeader.rhWindowX, presY + this.hoPtr.hoAdRunHeader.rhWindowY, htFoot, planCol, false)) {
                            x = presX;
                            y = presY;
                        }
                    }
                    ptFinal.x = x;
                    ptFinal.y = y;
                    return true;
                }
            }
            else {
                presX = x;
                presY = y;
                oldX = x;
                oldY = y;
                x = CServices.floatToInt((loinX + presX) / 2);
                y = CServices.floatToInt((loinY + presY) / 2);
                if (x == oldX && y == oldY) {
                    if (loinX != presX || loinY != presY) {
                        if (this.tst_SpritePosition(loinX + this.hoPtr.hoAdRunHeader.rhWindowX, loinY + this.hoPtr.hoAdRunHeader.rhWindowY, htFoot, planCol, false)) {
                            ptFinal.x = loinX;
                            ptFinal.y = loinY;
                            return true;
                        }
                    }
                    ptFinal.x = x;
                    ptFinal.y = y;
                    return false;
                }
            }
        } while (true);
    },

    mbApproachSprite: function (destX, destY, maxX, maxY, flag, ptFinal) {
        var presX = destX;
        var presY = destY;
        var loinX = maxX;
        var loinY = maxY;

        var x = CServices.floatToInt((presX + loinX) / 2);
        var y = CServices.floatToInt((presY + loinY) / 2);
        var oldX, oldY;

        do {
            if (this.tst_Position(x, y, flag)) {
                loinX = x;
                loinY = y;
                oldX = x;
                oldY = y;
                x = CServices.floatToInt((loinX + presX) / 2);
                y = CServices.floatToInt((loinY + presY) / 2);
                if (x == oldX && y == oldY) {
                    if (loinX != presX || loinY != presY) {
                        if (this.tst_Position(presX, presY, flag)) {
                            x = presX;
                            y = presY;
                        }
                    }
                    ptFinal.x = x;
                    ptFinal.y = y;
                    return true;
                }
            }
            else {
                presX = x;
                presY = y;
                oldX = x;
                oldY = y;
                x = CServices.floatToInt((loinX + presX) / 2);
                y = CServices.floatToInt((loinY + presY) / 2);
                if (x == oldX && y == oldY) {
                    if (loinX != presX || loinY != presY) {
                        if (this.tst_Position(loinX, loinY, flag)) {
                            ptFinal.x = loinX;
                            ptFinal.y = loinY;
                            return true;
                        }
                    }
                    ptFinal.x = x;
                    ptFinal.y = y;
                    return false;
                }
            }
        } while (true);
    },

    setAcc: function (acc) {
        this.rmAcc = acc;
        this.rmAccValue = this.getAccelerator(acc);
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            this.movement.setAcc(acc);
        }
    },

    setDec: function (dec) {
        this.rmDec = dec;
        this.rmDecValue = this.getAccelerator(dec);
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            this.movement.setDec(dec);
        }
    },

    setRotSpeed: function (speed) {
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_RACE) {
            if (speed > 250) {
                speed = 250;
            }
            if (speed < 0) {
                speed = 0;
            }
            this.setRotSpeed(speed);
        }
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            this.movement.setRotSpeed(speed);
        }
    },

    set8Dirs: function (dirs) {
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_GENERIC) {
            this.set8DirsGeneric(dirs);
        }
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            this.movement.set8Dirs(dirs);
        }
    },

    setGravity: function (gravity) {
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_PLATFORM) {
            if (gravity > 250) {
                gravity = 250;
            }
            if (gravity < 0) {
                gravity = 0;
            }
            this.setGravity(gravity);
        }
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            this.movement.setGravity(gravity);
        }
    },

    getSpeed: function () {
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            return this.movement.getSpeed();
        }
        return this.hoPtr.roc.rcSpeed;
    },

    getDir: function () {
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            if (this.movement.getDir) {
                return this.movement.getDir();
            }
        }
        return this.hoPtr.roc.rcDir;
    },

    getAcc: function () {
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            return this.movement.getAcceleration();
        }
        return this.rmAcc;
    },

    getDec: function () {
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            return this.movement.getDeceleration();
        }
        return this.rmDec;
    },

    getGravity: function () {
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_PLATFORM) {
            return this.mp.MP_Gravity;
        }
        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
            return this.movement.getGravity();
        }
        return 0;
    },

    kill: function (bFast) {
    },

    start: function () {
    }
}
