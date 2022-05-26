// CMoveBall
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

function CMoveDefBall() {
    //call chain
    CMoveDef.call(this);

    //call self
    this.mbSpeed = 0;
    this.mbBounce = 0;
    this.mbAngles = 0;
    this.mbSecurity = 0;
    this.mbDecelerate = 0;
}

CMoveDefBall.prototype = {
    load: function (file, length) {
        this.mbSpeed = file.readAShort();
        this.mbBounce = file.readAShort();
        this.mbAngles = file.readAShort();
        this.mbSecurity = file.readAShort();
        this.mbDecelerate = file.readAShort();
    }
};

//setup inheritance using extend
CServices.extend(CMoveDef, CMoveDefBall);

//CMoveBall
CMoveBall.rebond_List = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    30, 31, 0, 1, 4, 3, 2, 1, 0, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 24, 25, 26, 27, 27, 28, 28, 28, 28, 29, 29,
    24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 16, 17, 18, 19, 19, 20, 20, 20, 20, 21, 21, 22, 23, 24, 25, 28, 27, 26, 25,
    0, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 20, 21, 22, 22, 23, 24, 24, 24, 24, 25, 26, 27, 28, 29, 30,
    8, 7, 6, 5, 4, 8, 9, 10, 11, 11, 12, 12, 12, 12, 13, 13, 14, 15, 16, 17, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    16, 15, 14, 13, 12, 11, 10, 9, 8, 12, 13, 14, 15, 15, 16, 16, 16, 16, 17, 17, 18, 19, 20, 21, 24, 23, 22, 21, 20, 19, 18, 17,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 23, 22, 21, 20, 19, 18, 17, 16, 17, 18, 19, 20, 21, 22, 23, 24, 23, 22, 21, 20, 19, 18, 17,
    3, 3, 4, 4, 4, 4, 5, 5, 6, 7, 8, 9, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 31, 30, 29, 28, 0, 1, 2,
    0, 0, 1, 1, 2, 3, 4, 5, 8, 7, 6, 5, 4, 3, 2, 1, 0, 31, 30, 29, 28, 27, 26, 25, 24, 28, 29, 30, 31, 31, 0, 0,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    0, 31, 30, 29, 28, 27, 26, 25, 24, 25, 26, 27, 28, 29, 30, 31, 0, 31, 30, 29, 28, 27, 25, 25, 24, 25, 26, 27, 28, 29, 30, 31,
    0, 4, 5, 6, 7, 7, 8, 8, 8, 8, 9, 9, 10, 11, 12, 13, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1,
    16, 15, 14, 13, 12, 11, 10, 9, 8, 9, 10, 11, 12, 13, 14, 15, 16, 15, 14, 13, 12, 11, 10, 9, 8, 9, 10, 11, 12, 13, 14, 15,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
];
CMoveBall.MaskBounce = [0xFFFFFFFC, 0xFFFFFFFE, 0xFFFFFFFF];
CMoveBall.PlusAngles = [-4, 4, -2, 2, -1, 1];
CMoveBall.PlusAnglesTry = [-4, 4, -4, 4, -4, 4];

function CMoveBall() {
    //call chain
    CMove.call(this);

    //call self
    this.MB_StartDir = 0;
    this.MB_Angles = 0;
    this.MB_Securite = 0;
    this.MB_SecuCpt = 0;
    this.MB_Bounce = 0;
    this.MB_Speed = 0;
    this.MB_MaskBounce = 0;
    this.MB_LastBounce = 0;
    this.MB_Blocked = false;
}

CMoveBall.prototype = {
    init: function (ho, mvPtr) {
        this.hoPtr = ho;
        var mbPtr = mvPtr;

        this.hoPtr.hoCalculX = 0;
        this.hoPtr.hoCalculY = 0;
        this.hoPtr.roc.rcSpeed = mbPtr.mbSpeed;
        this.hoPtr.roc.rcMaxSpeed = mbPtr.mbSpeed;
        this.hoPtr.roc.rcMinSpeed = mbPtr.mbSpeed;
        this.MB_Speed = mbPtr.mbSpeed << 8;
        var dec = mbPtr.mbDecelerate;                        //; Deceleration
        if (dec != 0) {
            dec = this.getAccelerator(dec);
            this.hoPtr.roc.rcMinSpeed = 0;                            //; Vitesse mini= 0
        }
        this.rmDecValue = dec;
        this.MB_Bounce = mbPtr.mbBounce;                //; Randomizator
        this.MB_Angles = mbPtr.mbAngles;                //; Securite 0.100
        this.MB_MaskBounce = CMoveBall.MaskBounce[this.MB_Angles];
        this.MB_Blocked = false;
        this.MB_LastBounce = -1;

        this.MB_Securite = (100 - mbPtr.mbSecurity) / 8;
        this.MB_SecuCpt = this.MB_Securite;
        this.moveAtStart(mvPtr);
        this.hoPtr.roc.rcChanged = true;
    },

    move: function () {
        this.hoPtr.rom.rmBouncing = false;
        this.hoPtr.hoAdRunHeader.rhVBLObjet = 1;

        this.hoPtr.roc.rcAnim = CAnim.ANIMID_WALK;
        if (this.hoPtr.roa != null) {
            this.hoPtr.roa.animate();
        }

        if (this.rmDecValue != 0) {
            var speed = this.MB_Speed;
            if (speed > 0) {
                var dSpeed = this.rmDecValue;
                if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                    dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                }
                speed -= dSpeed;
                if (speed < 0) {
                    speed = 0;
                }
                this.MB_Speed = speed;
                speed >>= 8;
                this.hoPtr.roc.rcSpeed = speed;
            }
        }
        this.newMake_Move(this.hoPtr.roc.rcSpeed, this.hoPtr.hoAdRunHeader.getDir(this.hoPtr));
    },
    stop: function () {
        if (this.rmStopSpeed == 0) {
            this.rmStopSpeed = this.hoPtr.roc.rcSpeed | 0x8000;
            this.hoPtr.roc.rcSpeed = 0;
            this.MB_Speed = 0;
            this.hoPtr.rom.rmMoveFlag = true;
        }
    },

    start: function () {
        var speed = this.rmStopSpeed;
        if (speed != 0) {
            speed &= 0x7FFF;
            this.hoPtr.roc.rcSpeed = speed;
            this.MB_Speed = speed << 8;
            this.rmStopSpeed = 0;
            this.hoPtr.rom.rmMoveFlag = true;
        }
    },
    bounce: function () {
        if (this.rmStopSpeed != 0) {
            return;
        }

        if (this.hoPtr.hoAdRunHeader.rhLoopCount == this.MB_LastBounce) {
            return;
        }
        this.MB_LastBounce = this.hoPtr.hoAdRunHeader.rhLoopCount;

        if (this.rmCollisionCount == this.hoPtr.hoAdRunHeader.rh3CollisionCount) {
            this.mb_Approach(this.MB_Blocked);
        }

        var x = this.hoPtr.hoX;
        var y = this.hoPtr.hoY;
        var rebond = 0;
        x -= 8;
        y -= 8;
        if (this.tst_Position(x, y, this.MB_Blocked) == false) {
            rebond |= 0x01;
        }
        x += 16;
        if (this.tst_Position(x, y, this.MB_Blocked) == false) {
            rebond |= 0x02;
        }
        y += 16;
        if (this.tst_Position(x, y, this.MB_Blocked) == false) {
            rebond |= 0x04;
        }
        x -= 16;
        if (this.tst_Position(x, y, this.MB_Blocked) == false) {
            rebond |= 0x08;
        }

        var dir = CMoveBall.rebond_List[rebond * 32 + this.hoPtr.hoAdRunHeader.getDir(this.hoPtr)];
        dir &= this.MB_MaskBounce;
        if (!this.mvb_Test(dir)) {
            var angles = CMoveBall.PlusAnglesTry[this.MB_Angles * 2 + 1];
            var angles2 = angles;
            var bFlag = false;
            do {
                dir -= angles;
                dir &= 31;
                if (this.mvb_Test(dir)) {
                    bFlag = true;
                    break;
                }
                dir += 2 * angles;
                dir &= 31;
                if (this.mvb_Test(dir)) {
                    bFlag = true;
                    break;
                }
                dir -= angles;
                dir &= 31;
                angles += angles2;
            } while (angles <= 16);

            if (bFlag == false) {
                this.MB_Blocked = true;
                this.hoPtr.roc.rcDir = this.hoPtr.hoAdRunHeader.random(32) & this.MB_MaskBounce;
                this.hoPtr.rom.rmBouncing = true;
                this.hoPtr.rom.rmMoveFlag = true;
                return;
            }
        }

        this.MB_Blocked = false;
        this.hoPtr.roc.rcDir = dir;
        var rnd = this.hoPtr.hoAdRunHeader.random(100);
        if (rnd < this.MB_Bounce) {
            rnd >>= 2;
            if (rnd < 25) {
                rnd -= 12;
                rnd &= 31;
                rnd &= this.MB_MaskBounce;
                if (this.mvb_Test(rnd)) {
                    this.hoPtr.roc.rcDir = rnd;
                    this.hoPtr.rom.rmBouncing = true;
                    this.hoPtr.rom.rmMoveFlag = true;
                    return;
                }
            }
        }

        dir = this.hoPtr.hoAdRunHeader.getDir(this.hoPtr) & 0x0007;
        if (this.MB_SecuCpt != 12) {
            if (dir == 0) {
                this.MB_SecuCpt--;
                if (this.MB_SecuCpt < 0) {
                    dir = this.hoPtr.hoAdRunHeader.getDir(this.hoPtr) + CMoveBall.PlusAngles[this.hoPtr.hoAdRunHeader.random(2) + this.MB_Angles * 2];
                    dir &= 31;
                    if (this.mvb_Test(dir)) {
                        this.hoPtr.roc.rcDir = dir;
                        this.MB_SecuCpt = this.MB_Securite;
                    }
                }
            }
            else {
                this.MB_SecuCpt = this.MB_Securite;
            }
        }
        this.hoPtr.rom.rmBouncing = true;
        this.hoPtr.rom.rmMoveFlag = true;
    },

    mvb_Test: function (dir) {
        var calculX = this.hoPtr.hoX * 65536 + (this.hoPtr.hoCalculX & 0x0000FFFF);
        var calculY = this.hoPtr.hoY * 65536 + (this.hoPtr.hoCalculY & 0x0000FFFF);
        var x = (CMove.Cosinus32[dir] * 2048) + calculX;
        var y = (CMove.Sinus32[dir] * 2048) + calculY;
        x = Math.floor(x / 65536);
        y = Math.floor(y / 65536);
        return this.tst_Position(x, y, false);
    },
    setDir: function (dir) {
    },
    setSpeed: function (speed) {
        if (speed < 0) {
            speed = 0;
        }
        if (speed > 250) {
            speed = 250;
        }
        this.hoPtr.roc.rcSpeed = speed;
        this.MB_Speed = speed << 8;
        this.rmStopSpeed = 0;
        this.hoPtr.rom.rmMoveFlag = true;
    },
    setMaxSpeed: function (speed) {
        this.setSpeed(speed);
    },

    reverse: function () {
        if (this.rmStopSpeed == 0) {
            this.hoPtr.rom.rmMoveFlag = true;
            this.hoPtr.roc.rcDir += 16;
            this.hoPtr.roc.rcDir &= 31;
        }
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
CServices.extend(CMove, CMoveBall);