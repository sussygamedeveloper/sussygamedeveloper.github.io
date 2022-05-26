// CMoveRace
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

function CMoveDefRace() {
    //call chain
    CMoveDef.call(this);

    //call self
    this.mrSpeed = 0;
    this.mrAcc = 0;
    this.mrDec = 0;
    this.mrRot = 0;
    this.mrBounceMult = 0;
    this.mrAngles = 0;
    this.mrOkReverse = 0;
}

CMoveDefRace.prototype = {
    load: function (file, length) {
        this.mrSpeed = file.readAShort();
        this.mrAcc = file.readAShort();
        this.mrDec = file.readAShort();
        this.mrRot = file.readAShort();
        this.mrBounceMult = file.readAShort();
        this.mrAngles = file.readAShort();
        this.mrOkReverse = file.readAShort();
    }
};

//setup inheritance using extend
CServices.extend(CMoveDef, CMoveDefRace);

//CMoveRace
CMoveRace.RaceMask = [
    0xFFFFFFF8,
    0xFFFFFFFC,
    0xFFFFFFFE,
    0xFFFFFFFF
];

function CMoveRace() {
    //call chain
    CMove.call(this);

    //call self
    this.MR_Bounce = 0;
    this.MR_BounceMu = 0;
    this.MR_Speed = 0;
    this.MR_RotSpeed = 0;
    this.MR_RotCpt = 0;
    this.MR_RotPos = 0;
    this.MR_RotMask = 0;
    this.MR_OkReverse = 0;
    this.MR_OldJoy = 0;
    this.MR_LastBounce = 0;
}

CMoveRace.prototype = {
    init: function (ho, mrPtr) {
        this.hoPtr = ho;

        this.MR_Speed = 0;
        this.hoPtr.roc.rcSpeed = 0;
        this.MR_Bounce = 0;
        this.MR_LastBounce = -1;
        this.hoPtr.roc.rcPlayer = mrPtr.mvControl;
        this.rmAcc = mrPtr.mrAcc;
        this.rmAccValue = this.getAccelerator(mrPtr.mrAcc);
        this.rmDec = mrPtr.mrDec;
        this.rmDecValue = this.getAccelerator(mrPtr.mrDec);
        this.hoPtr.roc.rcMaxSpeed = mrPtr.mrSpeed;
        this.hoPtr.roc.rcMinSpeed = 0;
        this.MR_BounceMu = mrPtr.mrBounceMult;
        this.MR_OkReverse = mrPtr.mrOkReverse;
        this.hoPtr.rom.rmReverse = 0;
        this.rmOpt = mrPtr.mvOpt;
        this.MR_OldJoy = 0;

        this.MR_RotMask = CMoveRace.RaceMask[mrPtr.mrAngles];
        this.MR_RotSpeed = mrPtr.mrRot;
        this.MR_RotCpt = 0;
        this.MR_RotPos = this.hoPtr.hoAdRunHeader.getDir(this.hoPtr);
        this.hoPtr.hoCalculX = 0;
        this.hoPtr.hoCalculY = 0;
        this.moveAtStart(mrPtr);

        this.hoPtr.roc.rcChanged = true;
    },

    move: function () {
        var j;
        var add, accel, speed, dir, speed8;
        var dSpeed;

        this.hoPtr.hoAdRunHeader.rhVBLObjet = 1;

        if (this.MR_Bounce == 0) {
            this.hoPtr.rom.rmBouncing = false;

            j = this.hoPtr.hoAdRunHeader.rhPlayer[this.hoPtr.roc.rcPlayer - 1] & 0x0F;

            add = 0;
            if ((j & 0x08) != 0) {
                add = -1;
            }
            if ((j & 0x04) != 0) {
                add = 1;
            }
            if (add != 0) {
                dSpeed = this.MR_RotSpeed;
                if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                    dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                }
                this.MR_RotCpt += dSpeed;
                while (this.MR_RotCpt > 100) {
                    this.MR_RotCpt -= 100;
                    this.MR_RotPos += add;
                    this.MR_RotPos &= 31;
                    this.hoPtr.roc.rcDir = this.MR_RotPos & this.MR_RotMask;
                }
                ;
                this.hoPtr.roc.rcChanged = true;
            }

            accel = 0;
            if (this.hoPtr.rom.rmReverse != 0) {
                if ((j & 0x01) != 0) {
                    accel = 1;
                }
                if ((j & 0x02) != 0) {
                    accel = 2;
                }
            }
            else {
                if ((j & 0x01) != 0) {
                    accel = 2;
                }
                if ((j & 0x02) != 0) {
                    accel = 1;
                }
            }
            speed = this.MR_Speed;
            while (true) {
                if ((accel & 1) != 0) {
                    if (this.MR_Speed == 0) {
                        if (this.MR_OkReverse == 0) {
                            break;
                        }
                        if ((this.MR_OldJoy & 0x03) != 0) {
                            break;
                        }
                        this.hoPtr.rom.rmReverse ^= 1;
                        dSpeed = this.rmAccValue;
                        if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                            dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                        }
                        speed += dSpeed;
                        speed8 = speed >> 8;
                        if (speed8 > this.hoPtr.roc.rcMaxSpeed) {
                            speed = this.hoPtr.roc.rcMaxSpeed << 8;
                            this.MR_Speed = speed;
                        }
                        this.MR_Speed = speed;
                        break;
                    }
                    dSpeed = this.rmDecValue;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    speed -= dSpeed;
                    if (speed < 0) {
                        speed = 0;
                    }
                    this.MR_Speed = speed;
                }
                else if ((accel & 2) != 0) {
                    dSpeed = this.rmAccValue;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    speed += dSpeed;
                    speed8 = speed >> 8;
                    if (speed8 > this.hoPtr.roc.rcMaxSpeed) {
                        speed = this.hoPtr.roc.rcMaxSpeed << 8;
                        this.MR_Speed = speed;
                    }
                    this.MR_Speed = speed;
                }
                break;
            }
            ;
            this.MR_OldJoy = j;

            this.hoPtr.roc.rcSpeed = this.MR_Speed >> 8;
            this.hoPtr.roc.rcAnim = CAnim.ANIMID_WALK;
            if (this.hoPtr.roa != null) {
                this.hoPtr.roa.animate();
            }

            dir = this.hoPtr.hoAdRunHeader.getDir(this.hoPtr);
            if (this.hoPtr.rom.rmReverse != 0) {
                dir += 16;
                dir &= 31;
            }
            if (this.newMake_Move(this.hoPtr.roc.rcSpeed, dir) == false) {
                return;
            }
        }
        do {
            if (this.MR_Bounce == 0) {
                break;
            }
            if (this.hoPtr.hoAdRunHeader.rhVBLObjet == 0) {
                break;
            }
            speed = this.MR_Speed;
            speed -= this.rmDecValue;
            if (speed <= 0) {
                this.MR_Speed = 0;
                this.MR_Bounce = 0;
                break;
            }
            this.MR_Speed = speed;
            speed >>= 8;
            dir = this.hoPtr.hoAdRunHeader.getDir(this.hoPtr);
            if (this.MR_Bounce != 0) {
                dir += 16;
                dir &= 31;
            }
            if (this.newMake_Move(speed, dir) == false) {
                break;
            }
        } while (true);
    },

    reverse: function () {
    },

    stop: function () {
        this.MR_Bounce = 0;
        this.MR_Speed = 0;
        this.hoPtr.rom.rmReverse = 0;
        if (this.rmCollisionCount == this.hoPtr.hoAdRunHeader.rh3CollisionCount) {
            this.mv_Approach((this.rmOpt & CMove.MVTOPT_8DIR_STICK) != 0);
            this.hoPtr.rom.rmMoveFlag = true;
        }
    },
    start: function () {
        this.rmStopSpeed = 0;
        this.hoPtr.rom.rmMoveFlag = true;
    },
    bounce: function () {
        if (this.rmCollisionCount == this.hoPtr.hoAdRunHeader.rh3CollisionCount) {
            this.mv_Approach((this.rmOpt & CMove.MVTOPT_8DIR_STICK) != 0);
        }
        if (this.hoPtr.hoAdRunHeader.rhLoopCount != this.MR_LastBounce) {
            this.MR_Bounce = this.hoPtr.rom.rmReverse;
            this.hoPtr.rom.rmReverse = 0;
            this.MR_Bounce++;
            if (this.MR_Bounce >= 16) {
                this.stop();
                return;
            }
            this.hoPtr.rom.rmMoveFlag = true;
            this.hoPtr.rom.rmBouncing = true;
        }
    },

    setSpeed: function (speed) {
        if (speed < 0) {
            speed = 0;
        }
        if (speed > 250) {
            speed = 250;
        }
        if (speed > this.hoPtr.roc.rcMaxSpeed) {
            speed = this.hoPtr.roc.rcMaxSpeed;
        }
        speed <<= 8;
        this.MR_Speed = speed;
        this.hoPtr.rom.rmMoveFlag = true;
    },
    setMaxSpeed: function (speed) {
        if (speed < 0) {
            speed = 0;
        }
        if (speed > 250) {
            speed = 250;
        }
        this.hoPtr.roc.rcMaxSpeed = speed;
        speed <<= 8;
        if (this.MR_Speed > speed) {
            this.MR_Speed = speed;
        }
        this.hoPtr.rom.rmMoveFlag = true;
    },

    setRotSpeed: function (speed) {
        this.MR_RotSpeed = speed;
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
    },

    setDir: function (dir) {
        this.MR_RotPos = dir;
        this.hoPtr.roc.rcDir = dir & this.MR_RotMask;
    }
};

//setup inheritance using extend
CServices.extend(CMove, CMoveRace);