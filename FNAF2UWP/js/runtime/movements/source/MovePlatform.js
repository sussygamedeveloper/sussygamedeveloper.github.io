// CMovePlatform
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

function CMoveDefPlatform() {
    //call chain
    CMoveDef.call(this);

    //call self
    this.mpSpeed = 0;
    this.mpAcc = 0;
    this.mpDec = 0;
    this.mpJumpControl = 0;
    this.mpGravity = 0;
    this.mpJump = 0;
}

CMoveDefPlatform.prototype = {
    load: function (file, length) {
        this.mpSpeed = file.readAShort();
        this.mpAcc = file.readAShort();
        this.mpDec = file.readAShort();
        this.mpJumpControl = file.readAShort();
        this.mpGravity = file.readAShort();
        this.mpJump = file.readAShort();
    }
};

//setup inheritance using extend
CServices.extend(CMoveDef, CMoveDefPlatform);

//CMovePlatform
CMovePlatform.MPJC_NOJUMP = 0;
CMovePlatform.MPJC_DIAGO = 1;
CMovePlatform.MPJC_BUTTON1 = 2;
CMovePlatform.MPJC_BUTTON2 = 3;
CMovePlatform.MPTYPE_WALK = 0;
CMovePlatform.MPTYPE_CLIMB = 1;
CMovePlatform.MPTYPE_JUMP = 2;
CMovePlatform.MPTYPE_FALL = 3;
CMovePlatform.MPTYPE_CROUCH = 4;
CMovePlatform.MPTYPE_UNCROUCH = 5;

function CMovePlatform() {
    //call chain
    CMove.call(this);

    //call self
    this.MP_Type = 0;
    this.MP_Bounce = 0;
    this.MP_BounceMu = 0;
    this.MP_XSpeed = 0;
    this.MP_Gravity = 0;
    this.MP_Jump = 0;
    this.MP_YSpeed = 0;
    this.MP_XMB = 0;
    this.MP_YMB = 0;
    this.MP_HTFOOT = 0;
    this.MP_JumpControl = 0;
    this.MP_JumpStopped = 0;
    this.MP_PreviousDir = 0;
    this.MP_ObjectUnder = null;
    this.MP_XObjectUnder = 0;
    this.MP_YObjectUnder = 0;
    this.MP_NoJump = false;
}

CMovePlatform.prototype = {
    init: function (ho, mpPtr) {
        this.hoPtr = ho;
        this.rhPtr = this.hoPtr.hoAdRunHeader;

        this.hoPtr.hoCalculX = 0;
        this.hoPtr.hoCalculY = 0;
        this.MP_XSpeed = 0;
        this.hoPtr.roc.rcSpeed = 0;
        this.MP_Bounce = 0;
        this.hoPtr.roc.rcPlayer = mpPtr.mvControl;
        this.rmAcc = mpPtr.mpAcc;
        this.rmAccValue = this.getAccelerator(this.rmAcc);
        this.rmDec = mpPtr.mpDec;
        this.rmDecValue = this.getAccelerator(this.rmDec);
        this.hoPtr.roc.rcMaxSpeed = mpPtr.mpSpeed;
        this.hoPtr.roc.rcMinSpeed = 0;

        this.MP_Gravity = mpPtr.mpGravity;
        this.MP_Jump = mpPtr.mpJump;
        var jump = mpPtr.mpJumpControl;
        if (jump > 3) {
            jump = CMovePlatform.MPJC_DIAGO;
        }
        this.MP_JumpControl = jump;
        this.MP_YSpeed = 0;

        this.MP_JumpStopped = 0;
        this.MP_ObjectUnder = null;

        this.moveAtStart(mpPtr);
        this.MP_PreviousDir = this.hoPtr.hoAdRunHeader.getDir(this.hoPtr);
        this.hoPtr.roc.rcChanged = true;
        this.MP_Type = CMovePlatform.MPTYPE_WALK;
    },

    move: function () {
        var x, y;
        this.hoPtr.hoAdRunHeader.rhVBLObjet = 1;
        var joyDir = this.hoPtr.hoAdRunHeader.rhPlayer[this.hoPtr.roc.rcPlayer - 1];
        this.calcMBFoot();

        var xSpeed = this.MP_XSpeed;
        var speed8, dSpeed;
        if (this.MP_JumpStopped == 0) {
            if (xSpeed <= 0) {
                if ((joyDir & 4) != 0) {
                    dSpeed = this.rmAccValue;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    xSpeed -= dSpeed;
                    speed8 = xSpeed / 256;
                    if (speed8 < -this.hoPtr.roc.rcMaxSpeed) {
                        xSpeed = -this.hoPtr.roc.rcMaxSpeed * 256;
                    }
                }
                else if (xSpeed < 0) {
                    dSpeed = this.rmDecValue;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    xSpeed += dSpeed;
                    if (xSpeed > 0) {
                        xSpeed = 0;
                    }
                }
                if ((joyDir & 8) != 0) {
                    xSpeed = -xSpeed;
                }
            }
            if (xSpeed >= 0) {
                if ((joyDir & 8) != 0) {
                    dSpeed = this.rmAccValue;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    xSpeed += dSpeed;
                    speed8 = xSpeed / 256;
                    if (speed8 > this.hoPtr.roc.rcMaxSpeed) {
                        xSpeed = this.hoPtr.roc.rcMaxSpeed * 256;
                    }
                }
                else if (xSpeed > 0) {
                    dSpeed = this.rmDecValue;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    xSpeed -= dSpeed;
                    if (xSpeed < 0) {
                        xSpeed = 0;
                    }
                }
                if ((joyDir & 4) != 0) {
                    xSpeed = -xSpeed;
                }
            }
            this.MP_XSpeed = xSpeed;
        }

        var ySpeed = this.MP_YSpeed;
        var flag = false;
        while (true) {
            switch (this.MP_Type) {
                case 2:     // MPTYPE_FALL:
                case 3:     // MPTYPE_JUMP:
                    dSpeed = this.MP_Gravity << 5;
                    if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                        dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                    }
                    ySpeed = ySpeed + dSpeed;
                    if (ySpeed > 0xFA00) {
                        ySpeed = 0xFA00;
                    }
                    break;
                case 0:     // MPTYPE_WALK:
                    if ((joyDir & 1) != 0) {
                        if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB - 4) == CRun.INTBAD) {
                            break;
                        }
                        this.MP_Type = CMovePlatform.MPTYPE_CLIMB;
                        flag = true;
                        continue;
                    }
                    if ((joyDir & 2) != 0) {
                        if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB + 4) == CRun.INTBAD) {
                            break;
                        }
                        this.MP_Type = CMovePlatform.MPTYPE_CLIMB;
                        flag = true;
                        continue;
                    }
                    break;
                case 1:         // MPTYPE_CLIMB:
                    if (flag == false) {
                        this.MP_JumpStopped = 0;
                        if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB) == CRun.INTBAD) {
                            if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB - 4) == CRun.INTBAD) {
                                break;
                            }
                        }
                    }
                    if (ySpeed <= 0) {
                        if ((joyDir & 1) != 0) {
                            dSpeed = this.rmAccValue;
                            if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                                dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                            }
                            ySpeed -= dSpeed;
                            speed8 = ySpeed / 256;
                            if (speed8 < -this.hoPtr.roc.rcMaxSpeed) {
                                ySpeed = -this.hoPtr.roc.rcMaxSpeed * 256;
                            }
                        }
                        else {
                            dSpeed = this.rmDecValue;
                            if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                                dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                            }
                            ySpeed += dSpeed;
                            if (ySpeed > 0) {
                                ySpeed = 0;
                            }
                        }
                        if ((joyDir & 2) != 0) {
                            ySpeed = -ySpeed;
                        }
                    }
                    if (ySpeed >= 0) {
                        if ((joyDir & 2) != 0) {
                            dSpeed = this.rmAccValue;
                            if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                                dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                            }
                            ySpeed += dSpeed;
                            speed8 = ySpeed / 256;
                            if (speed8 > this.hoPtr.roc.rcMaxSpeed) {
                                ySpeed = this.hoPtr.roc.rcMaxSpeed * 256;
                            }
                        }
                        else {
                            dSpeed = this.rmDecValue;
                            if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                                dSpeed = dSpeed * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
                            }
                            ySpeed -= dSpeed;
                            if (ySpeed < 0) {
                                ySpeed = 0;
                            }
                        }
                        if ((joyDir & 1) != 0) {
                            ySpeed = -ySpeed;
                        }
                    }
                    break;
            }
            break;
        }
        this.MP_YSpeed = ySpeed;

        var dir = 0;
        if (xSpeed < 0) {
            dir = 16;
        }
        var sX = xSpeed;
        var sY = ySpeed;
        if (sY != 0) {
            var flags = 0;
            if (sX < 0) {
                flags |= 1;
                sX = -sX;
            }
            if (sY < 0) {
                flags |= 2;
                sY = -sY;
            }
            sX <<= 8;
            sX = sX / sY;
            var i;
            for (i = 0; ; i += 2) {
                if (sX >= CMove.CosSurSin32[i]) {
                    break;
                }
            }
            dir = CMove.CosSurSin32[i + 1];
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
        }

        sX = xSpeed;
        var cosinus = CMove.Cosinus32[dir];
        var sinus = CMove.Sinus32[dir];
        if (cosinus < 0) {
            cosinus = -cosinus;
        }
        if (sinus < 0) {
            sinus = -sinus;
        }
        if (cosinus < sinus) {
            cosinus = sinus;
            sX = ySpeed;
        }
        if (sX < 0) {
            sX = -sX;
        }
        sX = sX / cosinus;
        if (sX > 250) {
            sX = 250;
        }
        this.hoPtr.roc.rcSpeed = sX;

        switch (this.MP_Type) {
            case 1:
                if (ySpeed < 0) {
                    this.hoPtr.roc.rcDir = 8;
                } else if (ySpeed > 0) {
                    this.hoPtr.roc.rcDir = 24;
                }
                break;
            case 3:
                this.hoPtr.roc.rcDir = dir;
                break;
            default:
                if (xSpeed < 0) {
                    this.hoPtr.roc.rcDir = 16;
                } else if (xSpeed > 0) {
                    this.hoPtr.roc.rcDir = 0;
                }
                break;
        }

        switch (this.MP_Type) {
            case 4:      // MPTYPE_CROUCH:
                this.hoPtr.roc.rcAnim = CAnim.ANIMID_CROUCH;
                break;
            case 5:     // MPTYPE_UNCROUCH:
                this.hoPtr.roc.rcAnim = CAnim.ANIMID_UNCROUCH;
                break;
            case 3:     // MPTYPE_FALL:
                this.hoPtr.roc.rcAnim = CAnim.ANIMID_FALL;
                break;
            case 2:     // MPTYPE_JUMP:
                this.hoPtr.roc.rcAnim = CAnim.ANIMID_JUMP;
                break;
            case 1:     // MPTYPE_CLIMB:
                this.hoPtr.roc.rcAnim = CAnim.ANIMID_CLIMB;
                break;
            default:
                this.hoPtr.roc.rcAnim = CAnim.ANIMID_WALK;
                break;
        }

        if (this.hoPtr.roa != null) {
            this.hoPtr.roa.animate();
        }
        this.calcMBFoot();

        this.newMake_Move(this.hoPtr.roc.rcSpeed, dir);

        if ((this.MP_Type == CMovePlatform.MPTYPE_WALK || this.MP_Type == CMovePlatform.MPTYPE_CLIMB) && this.MP_NoJump == false) {
            var bJump = false;
            var j = this.MP_JumpControl;
            if (j != 0) {
                j--;
                if (j == 0) {
                    if ((joyDir & 5) == 5) {
                        bJump = true;
                    }
                    if ((joyDir & 9) == 9) {
                        bJump = true;
                    }
                }
                else {
                    j <<= 4;
                    if ((joyDir & j) != 0) {
                        bJump = true;
                    }
                }
            }
            if (bJump) {
                this.MP_YSpeed = -this.MP_Jump << 8;
                this.MP_Type = CMovePlatform.MPTYPE_JUMP;
            }
        }
        switch (this.MP_Type) {
            case 2:         // MPTYPE_JUMP:
                if (this.MP_YSpeed >= 0) {
                    this.MP_Type = CMovePlatform.MPTYPE_FALL;
                }
                break;

            case 3:         // MPTYPE_FALL:
                if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB) != CRun.INTBAD) {
                    this.MP_YSpeed = 0;
                    this.MP_Type = CMovePlatform.MPTYPE_CLIMB;
                    this.hoPtr.roc.rcDir = 8;
                }
                break;

            case 0:         // MPTYPE_WALK:
                if ((joyDir & 3) != 0 && (joyDir & 12) == 0) {
                    if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB) != CRun.INTBAD) {
                        this.MP_Type = CMovePlatform.MPTYPE_CLIMB;
                        this.MP_XSpeed = 0;
                        break;
                    }
                }
                if ((joyDir & 2) != 0) {
                    if (this.hoPtr.roa != null) {
                        if (this.hoPtr.roa.anim_Exist(CAnim.ANIMID_CROUCH)) {
                            this.MP_XSpeed = 0;
                            this.MP_Type = CMovePlatform.MPTYPE_CROUCH;
                        }
                    }
                }

                if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB) != CRun.INTBAD) {
                    break;
                }

                if (this.tst_SpritePosition(this.hoPtr.hoX, this.hoPtr.hoY + 10, this.MP_HTFOOT, CRunFrame.CM_TEST_PLATFORM, true) == false) {
                    x = this.hoPtr.hoX - this.hoPtr.hoAdRunHeader.rhWindowX;
                    y = this.hoPtr.hoY - this.hoPtr.hoAdRunHeader.rhWindowY;
                    var d = y + this.MP_HTFOOT - 1;
                    var pt = new CPoint();
                    this.mpApproachSprite(x, d, x, y, this.MP_HTFOOT, CRunFrame.CM_TEST_PLATFORM, pt);

                    this.hoPtr.hoX = pt.x + this.hoPtr.hoAdRunHeader.rhWindowX;
                    this.hoPtr.hoY = pt.y + this.hoPtr.hoAdRunHeader.rhWindowY;
                    this.MP_NoJump = false;
                }
                else {
                    this.MP_Type = CMovePlatform.MPTYPE_FALL;
                }
                break;

            case 1:         // MPTYPE_CLIMB:
                if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB) == CRun.INTBAD) {
                    if (this.MP_YSpeed < 0) {
                        for (sY = 0; sY < 32; sY++) {
                            if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB + sY) != CRun.INTBAD) {
                                this.hoPtr.hoY += sY;
                                break;
                            }
                        }
                    }
                    this.MP_YSpeed = 0;
                }
                if ((joyDir & 12) != 0) {
                    this.MP_Type = CMovePlatform.MPTYPE_WALK;
                    this.MP_YSpeed = 0;
                }
                break;

            case 4:         // MPTYPE_CROUCH:
                if ((joyDir & 2) == 0) {
                    if (hoPtr.roa != null) {
                        if (this.hoPtr.roa.anim_Exist(CAnim.ANIMID_UNCROUCH)) {
                            this.MP_Type = CMovePlatform.MPTYPE_UNCROUCH;
                            this.hoPtr.roc.rcAnim = CAnim.ANIMID_UNCROUCH;
                            this.hoPtr.roa.animate();
                            this.hoPtr.roa.raAnimRepeat = 1;
                            break;
                        }
                    }
                    this.MP_Type = CMovePlatform.MPTYPE_WALK;
                }
                break;

            case 5:         // MPTYPE_UNCROUCH:
                if (this.hoPtr.roa != null) {
                    if (this.hoPtr.roa.raAnimNumberOfFrame == 0) {
                        this.MP_Type = CMovePlatform.MPTYPE_WALK;
                    }
                }
                break;
        }

        if (this.MP_Type == CMovePlatform.MPTYPE_WALK || this.MP_Type == CMovePlatform.MPTYPE_CROUCH || this.MP_Type == CMovePlatform.MPTYPE_UNCROUCH) {
            do {
                var pOiColList = null;
                if (this.hoPtr.hoOiList != null) {
                    pOiColList = this.hoPtr.hoOiList.oilColList;
                }
                if (this.hoPtr.hoAdRunHeader.objectAllCol_IXY(this.hoPtr, this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY, this.hoPtr.hoX, this.hoPtr.hoY, pOiColList) == null) {
                    var list = this.hoPtr.hoAdRunHeader.objectAllCol_IXY(this.hoPtr, this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY, this.hoPtr.hoX, this.hoPtr.hoY + 1, pOiColList);
                    if (list != null && list.size() == 1) {
                        var pHo2 = list.get(0);
                        if (this.MP_ObjectUnder == null || this.MP_ObjectUnder != pHo2) {
                            if (this.hoPtr.hoOi != pHo2.hoOi) {
                                this.MP_ObjectUnder = pHo2;
                                this.MP_XObjectUnder = pHo2.hoX;
                                this.MP_YObjectUnder = pHo2.hoY;
                                break;
                            }
                        }
                        var dx = pHo2.hoX - this.MP_XObjectUnder;
                        var dy = pHo2.hoY - this.MP_YObjectUnder;
                        this.MP_XObjectUnder = pHo2.hoX;
                        this.MP_YObjectUnder = pHo2.hoY;

                        this.hoPtr.hoX += dx;
                        this.hoPtr.hoY += dy;
                        this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
                        this.hoPtr.roc.rcChanged = true;
                        break;
                    }
                }
                this.MP_ObjectUnder = null;
            } while (false);
        }
        else {
            this.MP_ObjectUnder = null;
        }
    },

    mpStopIt: function () {
        this.hoPtr.roc.rcSpeed = 0;
        this.MP_XSpeed = 0;
        this.MP_YSpeed = 0;
    },
    bounce: function () {
        this.stop();
    },
    stop: function () {
        this.MP_Bounce = 0;

        if (this.rmCollisionCount != this.hoPtr.hoAdRunHeader.rh3CollisionCount) {
            this.mpStopIt();
            return;
        }
        this.hoPtr.rom.rmMoveFlag = true;
        var scrX = this.hoPtr.hoX - this.hoPtr.hoAdRunHeader.rhWindowX;
        var scrY = this.hoPtr.hoY - this.hoPtr.hoAdRunHeader.rhWindowY;
        var x, y, dir;

        switch (this.hoPtr.hoAdRunHeader.rhEvtProg.rhCurCode & 0xFFFF0000) {
            case (-12 << 16):         // CNDL_EXTOUTPLAYFIELD:
                x = this.hoPtr.hoX - this.hoPtr.hoImgXSpot;
                y = this.hoPtr.hoY - this.hoPtr.hoImgYSpot;
                dir = this.hoPtr.hoAdRunHeader.quadran_Out(x, y, x + this.hoPtr.hoImgWidth, y + this.hoPtr.hoImgHeight);

                x = this.hoPtr.hoX;
                y = this.hoPtr.hoY;
                if ((dir & CRun.BORDER_LEFT) != 0) {
                    x = this.hoPtr.hoImgXSpot;
                    this.MP_XSpeed = 0;
                    this.MP_NoJump = true;
                }
                if ((dir & CRun.BORDER_RIGHT) != 0) {
                    x = this.hoPtr.hoAdRunHeader.rhLevelSx - this.hoPtr.hoImgWidth + this.hoPtr.hoImgXSpot;
                    this.MP_XSpeed = 0;
                    this.MP_NoJump = true;
                }
                if ((dir & CRun.BORDER_TOP) != 0) {
                    y = this.hoPtr.hoImgYSpot;
                    this.MP_YSpeed = 0;
                    this.MP_NoJump = false;
                }
                if ((dir & CRun.BORDER_BOTTOM) != 0) {
                    y = this.hoPtr.hoAdRunHeader.rhLevelSy - this.hoPtr.hoImgHeight + this.hoPtr.hoImgYSpot;
                    this.MP_YSpeed = 0;
                    this.MP_NoJump = false;
                }
                this.hoPtr.hoX = x;
                this.hoPtr.hoY = y;
                if (this.MP_Type == CMovePlatform.MPTYPE_JUMP) {
                    this.MP_Type = CMovePlatform.MPTYPE_FALL;
                } else {
                    this.MP_Type = CMovePlatform.MPTYPE_WALK;
                }
                this.MP_JumpStopped = 0;
                return;

            case (-13 << 16):        // CNDL_EXTCOLBACK:
            case (-14 << 16):        // CNDL_EXTCOLLISION:
                this.MP_NoJump = false;
                var pt = new CPoint();
                if (this.MP_Type == CMovePlatform.MPTYPE_FALL) {
                    this.mpApproachSprite(scrX, scrY, this.hoPtr.roc.rcOldX - this.hoPtr.hoAdRunHeader.rhWindowX, this.hoPtr.roc.rcOldY - this.hoPtr.hoAdRunHeader.rhWindowY, this.MP_HTFOOT, CRunFrame.CM_TEST_PLATFORM, pt);

                    this.hoPtr.hoX = pt.x + this.hoPtr.hoAdRunHeader.rhWindowX;
                    this.hoPtr.hoY = pt.y + this.hoPtr.hoAdRunHeader.rhWindowY;
                    this.MP_Type = CMovePlatform.MPTYPE_WALK;
                    this.hoPtr.roc.rcChanged = true;

                    if (this.tst_SpritePosition(this.hoPtr.hoX, this.hoPtr.hoY + 1, 0, CRunFrame.CM_TEST_PLATFORM, true)) {
                        this.hoPtr.roc.rcSpeed = 0;
                        this.MP_XSpeed = 0;
                    }
                    else {
                        this.MP_JumpStopped = 0;
                        this.hoPtr.roc.rcSpeed = Math.abs(this.MP_XSpeed / 256);
                        this.MP_YSpeed = 0;
                    }
                    return;
                }
                if (this.MP_Type == CMovePlatform.MPTYPE_WALK) {
                    if (this.mpApproachSprite(scrX, scrY, scrX, scrY - this.MP_HTFOOT, 0, CRunFrame.CM_TEST_PLATFORM, pt)) {
                        this.hoPtr.hoX = pt.x + this.hoPtr.hoAdRunHeader.rhWindowX;
                        this.hoPtr.hoY = pt.y + this.hoPtr.hoAdRunHeader.rhWindowY;
                        this.hoPtr.roc.rcChanged = true;
                        return;
                    }
                    if (this.mpApproachSprite(scrX, scrY, this.hoPtr.roc.rcOldX - this.hoPtr.hoAdRunHeader.rhWindowX, this.hoPtr.roc.rcOldY - this.hoPtr.hoAdRunHeader.rhWindowY, 0, CRunFrame.CM_TEST_PLATFORM, pt)) {
                        this.hoPtr.hoX = pt.x + this.hoPtr.hoAdRunHeader.rhWindowX;
                        this.hoPtr.hoY = pt.y + this.hoPtr.hoAdRunHeader.rhWindowY;
                        this.hoPtr.roc.rcChanged = true;
                        this.mpStopIt();
                        return;
                    }
                }
                if (this.MP_Type == CMovePlatform.MPTYPE_JUMP) {
                    if (this.mpApproachSprite(scrX, scrY, scrX, scrY - this.MP_HTFOOT, 0, CRunFrame.CM_TEST_PLATFORM, pt)) {
                        this.hoPtr.hoX = pt.x + this.hoPtr.hoAdRunHeader.rhWindowX;
                        this.hoPtr.hoY = pt.y + this.hoPtr.hoAdRunHeader.rhWindowY;
                        this.hoPtr.roc.rcChanged = true;
                        return;
                    }
                    this.MP_JumpStopped = 1;
                    this.MP_XSpeed = 0;
                }
                if (this.MP_Type == CMovePlatform.MPTYPE_CLIMB) {
                    if (this.mpApproachSprite(scrX, scrY, this.hoPtr.roc.rcOldX - this.hoPtr.hoAdRunHeader.rhWindowX, this.hoPtr.roc.rcOldY - this.hoPtr.hoAdRunHeader.rhWindowY, 0, CRunFrame.CM_TEST_PLATFORM, pt)) {
                        this.hoPtr.hoX = pt.x + this.hoPtr.hoAdRunHeader.rhWindowX;
                        this.hoPtr.hoY = pt.y + this.hoPtr.hoAdRunHeader.rhWindowY;
                        this.hoPtr.roc.rcChanged = true;
                        this.mpStopIt();
                        return;
                    }
                }
                this.hoPtr.roc.rcImage = this.hoPtr.roc.rcOldImage;
                this.hoPtr.roc.rcAngle = this.hoPtr.roc.rcOldAngle;
                if (this.tst_SpritePosition(this.hoPtr.hoX, this.hoPtr.hoY, 0, CRunFrame.CM_TEST_PLATFORM, true)) {
                    return;
                }

                this.hoPtr.hoX = this.hoPtr.roc.rcOldX;
                this.hoPtr.hoY = this.hoPtr.roc.rcOldY;
                this.hoPtr.roc.rcChanged = true;
                break;
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
        this.MP_XSpeed = this.hoPtr.roc.rcSpeed * CMove.Cosinus32[this.hoPtr.hoAdRunHeader.getDir(this.hoPtr)];
        this.MP_YSpeed = this.hoPtr.roc.rcSpeed * CMove.Sinus32[this.hoPtr.hoAdRunHeader.getDir(this.hoPtr)];
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
        if (this.MP_XSpeed > speed) {
            this.MP_XSpeed = speed;
        }
        this.hoPtr.rom.rmMoveFlag = true;
    },

    setGravity: function (gravity) {
        this.MP_Gravity = gravity;
    },

    setDir: function (dir) {
        this.hoPtr.roc.rcDir = dir;
        this.MP_XSpeed = this.hoPtr.roc.rcSpeed * CMove.Cosinus32[dir];
        this.MP_YSpeed = this.hoPtr.roc.rcSpeed * CMove.Sinus32[dir];
    },

    calcMBFoot: function () {
        var ifoHeight, ifoSpotY;

        if (this.hoPtr.roc.rcImage > 0) {
            var ifo = this.hoPtr.hoAdRunHeader.rhApp.imageBank.getImageInfoEx(this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY);
            ifoHeight = ifo.height;
            ifoSpotY = ifo.ySpot;

        } else {
            ifoHeight = this.hoPtr.hoImgHeight;
            ifoSpotY = this.hoPtr.hoImgYSpot;
        }

        this.MP_XMB = 0;
        this.MP_YMB = ifoHeight - ifoSpotY;
        this.MP_HTFOOT = ((ifoHeight * 2) + ifoHeight) >>> 3;
    },

    mpHandle_Background: function () {
        this.calcMBFoot();
        if (this.rhPtr.check_Ladder(this.hoPtr.hoLayer, this.hoPtr.hoX + this.MP_XMB, this.hoPtr.hoY + this.MP_YMB) != CRun.INTBAD) {
            return;
        }

        if (this.hoPtr.hoAdRunHeader.colMask_TestObject_IXY(this.hoPtr, this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY, this.hoPtr.hoX, this.hoPtr.hoY, 0, CRunFrame.CM_TEST_OBSTACLE) == false) {
            if (this.MP_Type == CMovePlatform.MPTYPE_JUMP && this.MP_YSpeed < 0) {
                return;
            }

            if (this.hoPtr.hoAdRunHeader.colMask_TestObject_IXY(this.hoPtr, this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY, this.hoPtr.hoX, this.hoPtr.hoY, this.MP_HTFOOT, CRunFrame.CM_TEST_PLATFORM) == false) {
                return;
            }
        }
        this.hoPtr.hoAdRunHeader.rhEvtProg.handle_Event(this.hoPtr, (-13 << 16) | (this.hoPtr.hoType & 0xFFFF));
    }
};

//setup inheritance using extend
CServices.extend(CMove, CMovePlatform);