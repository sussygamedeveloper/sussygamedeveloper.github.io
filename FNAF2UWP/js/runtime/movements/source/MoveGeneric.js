// CMoveGeneric
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

function CMoveDefGeneric() {
    //call chain
    CMoveDef.call(this);

    //call self
    this.mgSpeed = 0;
    this.mgAcc = 0;
    this.mgDec = 0;
    this.mgBounceMult = 0;
    this.mgDir = 0;
}

CMoveDefGeneric.prototype = {
    load: function (file, length) {
        this.mgSpeed = file.readAShort();
        this.mgAcc = file.readAShort();
        this.mgDec = file.readAShort();
        this.mgBounceMult = file.readAShort();
        this.mgDir = file.readAInt();
    }
};

//setup inheritance using extend
CServices.extend(CMoveDef, CMoveDefGeneric);

//CMoveGeneric
function CMoveGeneric() {
    //call chain
    CMove.call(this);

    //call self
    this.MG_Bounce = 0;
    this.MG_OkDirs = 0;
    this.MG_BounceMu = 0;
    this.MG_Speed = 0;
    this.MG_LastBounce = 0;
    this.MG_DirMask = 0;
}

CMoveGeneric.prototype = {
    init: function (ho, mgPtr) {
        this.hoPtr = ho;

        this.hoPtr.hoCalculX = 0;
        this.hoPtr.hoCalculY = 0;
        this.MG_Speed = 0;
        this.hoPtr.roc.rcSpeed = 0;
        this.MG_Bounce = 0;
        this.MG_LastBounce = -1;
        this.hoPtr.roc.rcPlayer = mgPtr.mvControl;
        this.rmAcc = mgPtr.mgAcc;
        this.rmAccValue = this.getAccelerator(this.rmAcc);
        this.rmDec = mgPtr.mgDec;
        this.rmDecValue = this.getAccelerator(this.rmDec);
        this.hoPtr.roc.rcMaxSpeed = mgPtr.mgSpeed;
        this.hoPtr.roc.rcMinSpeed = 0;
        this.MG_BounceMu = mgPtr.mgBounceMult;
        this.MG_OkDirs = mgPtr.mgDir;
        this.rmOpt = mgPtr.mvOpt;
        this.hoPtr.roc.rcChanged = true;
    },

    move: function () {
        var direction;
        var autorise;
        var speed, speed8, dir;

        this.hoPtr.hoAdRunHeader.rhVBLObjet = 1;

        direction = this.hoPtr.hoAdRunHeader.getDir(this.hoPtr);
        this.hoPtr.roc.rcOldDir = direction;

        if (this.MG_Bounce == 0) {
            this.hoPtr.rom.rmBouncing = false;

            autorise = 0;
            {
                var j = this.hoPtr.hoAdRunHeader.rhPlayer[this.hoPtr.roc.rcPlayer - 1] & 15;
                if (j != 0) {
                    dir = CMove.Joy2Dir[j];
                    if (dir != -1) {
                        var flag = 1 << dir;
                        if ((flag & this.MG_OkDirs) != 0) {
                            autorise = 1;
                            direction = dir;
                        }
                    }
                }
            }

            var dSpeed;
            speed = this.MG_Speed;
            if (autorise == 0) {
                if (speed != 0) {
                    dSpeed = this.rmDecValue;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    speed -= dSpeed;
                    if (speed <= 0) {
                        speed = 0;
                    }
                }
            }
            else {
                speed8 = speed >> 8;
                if (speed8 < this.hoPtr.roc.rcMaxSpeed) {
                    dSpeed = this.rmAccValue;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    speed += dSpeed;
                    speed8 = speed >> 8;
                    if (speed8 > this.hoPtr.roc.rcMaxSpeed) {
                        speed = this.hoPtr.roc.rcMaxSpeed << 8;
                    }
                }
            }
            this.MG_Speed = speed;
            this.hoPtr.roc.rcSpeed = speed >> 8;

            this.hoPtr.roc.rcDir = direction;

            this.hoPtr.roc.rcAnim = CAnim.ANIMID_WALK;
            if (this.hoPtr.roa != null) {
                this.hoPtr.roa.animate();
            }

            if (this.newMake_Move(this.hoPtr.roc.rcSpeed, this.hoPtr.hoAdRunHeader.getDir(this.hoPtr)) == false) {
                return;
            }

            if (this.hoPtr.roc.rcSpeed == 0) {
                speed = this.MG_Speed;
                if (speed == 0) {
                    return;
                }
                if (this.hoPtr.roc.rcOldDir == this.hoPtr.hoAdRunHeader.getDir(this.hoPtr)) {
                    return;
                }
                this.hoPtr.roc.rcSpeed = speed >> 8;
                this.hoPtr.roc.rcDir = this.hoPtr.roc.rcOldDir;
                if (this.newMake_Move(this.hoPtr.roc.rcSpeed, this.hoPtr.hoAdRunHeader.getDir(this.hoPtr)) == false) {
                    return;
                }
            }
        }

        while (true) {
            if (this.MG_Bounce == 0 || this.hoPtr.hoAdRunHeader.rhVBLObjet == 0) {
                return;
            }
            speed = this.MG_Speed;
            speed -= this.rmDecValue;
            if (speed > 0) {
                this.MG_Speed = speed;
                speed >>= 8;
                this.hoPtr.roc.rcSpeed = speed;
                dir = this.hoPtr.hoAdRunHeader.getDir(this.hoPtr);
                if (this.MG_Bounce != 0) {
                    dir += 16;
                    dir &= 31;
                }
                if (this.newMake_Move(speed, dir) == false) {
                    return;
                }
                continue;
            }
            else {
                this.MG_Speed = 0;
                this.hoPtr.roc.rcSpeed = 0;
                this.MG_Bounce = 0;
            }
            break;
        }
        ;
    },

    bounce: function () {
        if (this.rmCollisionCount == this.hoPtr.hoAdRunHeader.rh3CollisionCount) {
            this.mv_Approach((this.rmOpt & CMove.MVTOPT_8DIR_STICK) != 0);
        }
        if (this.hoPtr.hoAdRunHeader.rhLoopCount == this.MG_LastBounce) {
            return;
        }
        this.MG_LastBounce = this.hoPtr.hoAdRunHeader.rhLoopCount;
        this.MG_Bounce++;
        if (this.MG_Bounce >= 12) {
            this.stop();
            return;
        }
        this.hoPtr.rom.rmBouncing = true;
        this.hoPtr.rom.rmMoveFlag = true;
    },

    reverse: function () {
    },

    setDir: function (dir) {
    },

    stop: function () {
        this.hoPtr.roc.rcSpeed = 0;
        this.MG_Bounce = 0;
        this.MG_Speed = 0;
        this.hoPtr.rom.rmMoveFlag = true;
        if (this.rmCollisionCount == this.hoPtr.hoAdRunHeader.rh3CollisionCount) {
            this.mv_Approach((this.rmOpt & CMove.MVTOPT_8DIR_STICK) != 0);
            this.MG_Bounce = 0;
        }
    },

    start: function () {
        this.hoPtr.rom.rmMoveFlag = true;
        this.rmStopSpeed = 0;
    },

    setMaxSpeed: function (speed) {
        if (speed < 0) {
            speed = 0;
        }
        if (speed > 250) {
            speed = 250;
        }
        this.hoPtr.roc.rcMaxSpeed = speed;
        if (this.hoPtr.roc.rcSpeed > speed) {
            this.hoPtr.roc.rcSpeed = speed;
            this.MG_Speed = speed << 8;
        }
        this.hoPtr.rom.rmMoveFlag = true;
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
        this.hoPtr.roc.rcSpeed = speed;
        this.MG_Speed = speed << 8;
        this.hoPtr.rom.rmMoveFlag = true;
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
    set8DirsGeneric: function (dirs) {
        this.MG_OkDirs = dirs;
    }
};

//setup inheritance using extend
CServices.extend(CMove, CMoveGeneric);