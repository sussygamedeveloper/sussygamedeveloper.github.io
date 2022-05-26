// CRAni object
// -----------------------------------------------------------------
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

CRAni.anim_Defined = [
    CAnim.ANIMID_STOP,
    CAnim.ANIMID_WALK,
    CAnim.ANIMID_RUN,
    CAnim.ANIMID_BOUNCE,
    CAnim.ANIMID_SHOOT,
    CAnim.ANIMID_JUMP,
    CAnim.ANIMID_FALL,
    CAnim.ANIMID_CLIMB,
    CAnim.ANIMID_CROUCH,
    CAnim.ANIMID_UNCROUCH,
    12,
    13,
    14,
    15,
    -1
];

function CRAni() {
    this.hoPtr = null;
    this.raAnimForced = 0;                // Flags if forced
    this.raAnimDirForced = 0;
    this.raAnimSpeedForced = 0;
    this.raAnimStopped = false;
    this.raAnimOn = 0;                // Current animation
    this.raAnimOffset = null;
    this.raAnimDir = 0;                // Direction of current animation
    this.raAnimPreviousDir = 0;                       // Previous OK direction
    this.raAnimDirOffset = null;
    this.raAnimSpeed = 0;
    this.raAnimMinSpeed = 0;                          // Minimum speed of movement
    this.raAnimMaxSpeed = 0;                          // Maximum speed of movement
    this.raAnimDeltaSpeed = 0;
    this.raAnimCounter = 0;                           // Animation speed counter
    this.raAnimDelta = 0;                // Speed counter
    this.raAnimRepeat = 0;                // Number of repeats
    this.raAnimRepeatLoop = 0;            // Looping picture
    this.raAnimFrame = 0;                // Current frame
    this.raAnimNumberOfFrame = 0;                     // Number of frames
    this.raAnimFrameForced = 0;
    this.raRoutineAnimation = 0;
    this.raOldAngle = -1;
}

CRAni.prototype = {
    init: function (ho) {
        this.hoPtr = ho;

        this.raRoutineAnimation = 0;
        this.init_Animation(CAnim.ANIMID_WALK);

        if (this.anim_Exist(CAnim.ANIMID_APPEAR)) {
            this.raRoutineAnimation = 1;
            this.animation_Force(CAnim.ANIMID_APPEAR);
            this.animation_OneLoop();
            this.animations();

        } else {

            var i;
            for (i = 0; CRAni.anim_Defined[i] >= 0; i++) {
                if (this.anim_Exist(CRAni.anim_Defined[i])) {
                    break;
                }
            }

            if (CRAni.anim_Defined[i] < 0) {
                if (this.anim_Exist(CAnim.ANIMID_DISAPPEAR)) {
                    this.raRoutineAnimation = 2;
                    this.animation_Force(CAnim.ANIMID_DISAPPEAR);
                    this.animation_OneLoop();
                    this.animations();
                }
            }
        }
    },

    init_Animation: function (anim) {
        this.hoPtr.roc.rcAnim = anim;
        this.raAnimStopped = false;
        this.raAnimForced = 0;
        this.raAnimDirForced = 0;
        this.raAnimSpeedForced = 0;
        this.raAnimFrameForced = 0;
        this.raAnimCounter = 0;
        this.raAnimFrame = 0;
        this.raAnimOffset = null;
        this.raAnimDirOffset = null;
        this.raAnimOn = -1;
        this.raAnimMinSpeed = -1;
        this.raAnimPreviousDir = -1;
        this.raAnimOffset = null;
        this.raAnimDirOffset = null;
        this.animations();
    },

    check_Animate: function () {
        this.animIn(0);
    },

    extAnimations: function (anim) {
        this.hoPtr.roc.rcAnim = anim;
        this.animate();
    },

    animate: function () {
        switch (this.raRoutineAnimation) {
            case 0:
                return this.animations();
            case 1:
                this.anim_Appear();
                return false;
            case 2:
                this.anim_Disappear();
                return false;
        }
        return false;
    },

    animations: function () {
        var x = this.hoPtr.hoX;
        this.hoPtr.roc.rcOldX = x;
        x -= this.hoPtr.hoImgXSpot;
        this.hoPtr.roc.rcOldX1 = x;
        x += this.hoPtr.hoImgWidth;
        this.hoPtr.roc.rcOldX2 = x;

        var y = this.hoPtr.hoY;
        this.hoPtr.roc.rcOldY = y;
        y -= this.hoPtr.hoImgYSpot;
        this.hoPtr.roc.rcOldY1 = y;
        y += this.hoPtr.hoImgHeight;
        this.hoPtr.roc.rcOldY2 = y;

        this.hoPtr.roc.rcOldImage = this.hoPtr.roc.rcImage;
        this.hoPtr.roc.rcOldAngle = this.hoPtr.roc.rcAngle;

        return this.animIn(1);
    },

    animIn: function (vbl) {
        var ocPtr = this.hoPtr.hoCommon;

        var speed = this.hoPtr.roc.rcSpeed;
        var anim = this.hoPtr.roc.rcAnim;

        if (this.raAnimSpeedForced != 0) {
            speed = this.raAnimSpeedForced - 1;
        }

        //update auto animations
        if (anim == CAnim.ANIMID_WALK) {
            if (speed == 0) {
                anim = CAnim.ANIMID_STOP;
            }

            if (speed >= 75) {
                anim = CAnim.ANIMID_RUN;
            }
        }

        //override with forced animation
        if (this.raAnimForced != 0) {
            anim = this.raAnimForced - 1;
        }

        //is teh animation changing?
        if (anim != this.raAnimOn) {
            this.raAnimOn = anim;

            if (anim >= ocPtr.ocAnimations.ahAnimMax) {
                anim = ocPtr.ocAnimations.ahAnimMax - 1;
            }

            var anPtr = ocPtr.ocAnimations.ahAnims[anim];

            if (anPtr != this.raAnimOffset) {
                this.raAnimOffset = anPtr;
                this.raAnimDir = -1;
                this.raAnimFrame = 0;

                if ((this.hoPtr.hoOEFlags & CObjectCommon.OEFLAG_DONTRESETANIMCOUNTER) == 0) {		// Added for bug http://bugbox.clickteam.com/issues/3421, triggered by fix below...
                    this.raAnimCounter = 0;		// Build 284.11, report from Android, fixes bug http://bugbox.clickteam.com/issues/1882
                }
            }
        }
        var frame;
        var ifo;
        var rhPtr = this.hoPtr.hoAdRunHeader;
        var dir = this.hoPtr.roc.rcDir;
        var bAngle = false;

        if (this.raAnimDirForced != 0) {
            dir = this.raAnimDirForced - 1;
        }

        var adPtr;
        if (this.raAnimDir != dir) {
            this.raAnimDir = dir;

            adPtr = this.raAnimOffset.anDirs[dir];

            if (adPtr == null) {
                if ((this.raAnimOffset.anAntiTrigo[dir] & 0x40) != 0) {
                    dir = this.raAnimOffset.anAntiTrigo[dir] & 0x3F;

                } else if ((this.raAnimOffset.anTrigo[dir] & 0x40) != 0) {
                    dir = this.raAnimOffset.anTrigo[dir] & 0x3F;

                } else {

                    var offset = dir;
                    if (this.raAnimPreviousDir < 0) {
                        dir = this.raAnimOffset.anTrigo[dir] & 0x3F;

                    } else {
                        dir -= this.raAnimPreviousDir;
                        dir &= 31;

                        if (dir > 15) {
                            dir = this.raAnimOffset.anTrigo[offset] & 0x3F;
                        } else {
                            dir = this.raAnimOffset.anAntiTrigo[offset] & 0x3F;
                        }
                    }
                }
                adPtr = this.raAnimOffset.anDirs[dir];

            } else {
                this.raAnimPreviousDir = dir;
                adPtr = this.raAnimOffset.anDirs[dir];
            }

            if (this.raAnimOffset.anDirs[0] != null && (this.hoPtr.hoCommon.ocFlags2 & CObjectCommon.OCFLAGS2_AUTOMATICROTATION) != 0) {
                this.hoPtr.roc.rcAngle = (this.raAnimDir * 360) / 32;
                adPtr = this.raAnimOffset.anDirs[0];
                this.raAnimDirOffset = null;
                bAngle = true;
            }

            if (this.raAnimDirOffset != adPtr) {
                this.raAnimDirOffset = adPtr;
                this.raAnimRepeat = adPtr.adRepeat;
                this.raAnimRepeatLoop = adPtr.adRepeatFrame;

                var minSpeed = adPtr.adMinSpeed;
                var maxSpeed = adPtr.adMaxSpeed;

                if (minSpeed != this.raAnimMinSpeed || maxSpeed != this.raAnimMaxSpeed) {
                    this.raAnimMinSpeed = minSpeed;
                    this.raAnimMaxSpeed = maxSpeed;
                    maxSpeed -= minSpeed;
                    this.raAnimDeltaSpeed = maxSpeed;
                    this.raAnimDelta = minSpeed;
                    this.raAnimSpeed = -1;
                }

                this.raAnimNumberOfFrame = adPtr.adNumberOfFrame;

                if (this.raAnimFrameForced != 0 && this.raAnimFrameForced - 1 >= this.raAnimNumberOfFrame) {
                    this.raAnimFrameForced = 0;
                }

                if (this.raAnimFrame >= this.raAnimNumberOfFrame) {
                    this.raAnimFrame = 0;
                }

                frame = adPtr.adFrames[this.raAnimFrame];

                if (this.raAnimStopped == false) {
                    this.hoPtr.roc.rcImage = frame;
                    ifo = this.hoPtr.hoAdRunHeader.rhApp.imageBank.getImageInfoEx(frame, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY);

                    if (ifo != null) {
                        this.hoPtr.hoImgWidth = ifo.width;
                        this.hoPtr.hoImgHeight = ifo.height;
                        this.hoPtr.hoImgXSpot = ifo.xSpot;
                        this.hoPtr.hoImgYSpot = ifo.ySpot;
                    }

                    this.hoPtr.roc.rcChanged = true;
                    this.hoPtr.roc.rcCheckCollides = true;
                }

                if (this.raAnimNumberOfFrame == 1) {
                    if (this.raAnimMinSpeed == 0) {
                        this.raAnimNumberOfFrame = 0;
                    }

                    frame = this.hoPtr.roc.rcImage;

                    if (frame == 0) {
                        return false;
                    }

                    ifo = this.hoPtr.hoAdRunHeader.rhApp.imageBank.getImageInfoEx(frame, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY);

                    if (ifo != null) {
                        this.hoPtr.hoImgWidth = ifo.width;
                        this.hoPtr.hoImgHeight = ifo.height;
                        this.hoPtr.hoImgXSpot = ifo.xSpot;
                        this.hoPtr.hoImgYSpot = ifo.ySpot;
                    }
                    return false;
                }
            }
        }

        if (vbl == 0 && this.raAnimFrameForced == 0) {
            return false;
        }
        if (bAngle == false && this.raAnimNumberOfFrame == 0) {
            return false;
        }

        var delta = this.raAnimDeltaSpeed;
        if (speed != this.raAnimSpeed) {
            this.raAnimSpeed = speed;

            if (delta == 0) {
                this.raAnimDelta = this.raAnimMinSpeed;
                if (this.raAnimSpeedForced != 0) {
                    this.raAnimDelta = this.raAnimSpeedForced - 1;
                }
            } else {

                var deltaSpeed = this.hoPtr.roc.rcMaxSpeed - this.hoPtr.roc.rcMinSpeed;
                if (deltaSpeed == 0) {
                    if (this.raAnimSpeedForced != 0) {
                        delta *= speed;
                        delta /= 100;
                        delta += this.raAnimMinSpeed;
                        if (delta > this.raAnimMaxSpeed) {
                            delta = this.raAnimMaxSpeed;
                        }
                        this.raAnimDelta = delta;

                    } else {
                        delta /= 2;
                        delta += this.raAnimMinSpeed;
                        this.raAnimDelta = delta;
                    }
                } else {
                    delta *= speed;
                    delta /= deltaSpeed;
                    delta += this.raAnimMinSpeed;
                    if (delta > this.raAnimMaxSpeed) {
                        delta = this.raAnimMaxSpeed;
                    }
                    this.raAnimDelta = delta;
                }
            }
        }

        adPtr = this.raAnimDirOffset;
        frame = this.raAnimFrameForced;
        var counter;
        if (frame == 0) {
            if (this.raAnimDelta == 0 || this.raAnimStopped) {
                return false;
            }

            counter = this.raAnimCounter;
            frame = this.raAnimFrame;
            var aDelta = this.raAnimDelta;

            if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
                aDelta = Math.round(aDelta * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef);
            }

            counter += aDelta;
            while (counter > 100) {
                counter -= 100;
                frame++;
                if (frame >= this.raAnimNumberOfFrame) {
                    frame = this.raAnimRepeatLoop;
                    if (this.raAnimRepeat != 0) {
                        this.raAnimRepeat--;
                        if (this.raAnimRepeat == 0) {
                            this.raAnimFrame = this.raAnimNumberOfFrame-1;
                            this.raAnimNumberOfFrame = 0;

                            if (this.raAnimForced != 0) {
                                this.raAnimForced = 0;
                                this.raAnimDirForced = 0;
                                this.raAnimSpeedForced = 0;
                            }

                            if (this.raAnimFrame < adPtr.adNumberOfFrame) {
                                var image = adPtr.adFrames[this.raAnimFrame];
                                if (image != this.hoPtr.roc.rcImage) {
                                    this.hoPtr.roc.rcImage = image;
                                    this.hoPtr.roc.rcChanged = true;
                                    this.hoPtr.roc.rcCheckCollides = true;
                                }
                            }
                            this.raAnimCounter = counter;

                            if ((this.hoPtr.hoAdRunHeader.rhGameFlags & CRun.GAMEFLAGS_INITIALISING) != 0) {
                                return false;
                            }

                            if (bAngle) {
                                this.hoPtr.roc.rcChanged = true;
                                this.hoPtr.roc.rcCheckCollides = true;
                                ifo = this.hoPtr.hoAdRunHeader.rhApp.imageBank.getImageInfoEx(this.hoPtr.roc.rcImage, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY);
                                if (ifo != null) {
                                    this.hoPtr.hoImgWidth = ifo.width;
                                    this.hoPtr.hoImgHeight = ifo.height;
                                    this.hoPtr.hoImgXSpot = ifo.xSpot;
                                    this.hoPtr.hoImgYSpot = ifo.ySpot;
                                }
                            }

                            var cond = (-2 << 16);        // CNDL_EXTANIMENDOF;
                            cond |= (this.hoPtr.hoType & 0xFFFF);
                            this.hoPtr.hoAdRunHeader.rhEvtProg.rhCurParam0 = this.hoPtr.roa.raAnimOn;
                            return this.hoPtr.hoAdRunHeader.rhEvtProg.handle_Event(this.hoPtr, cond);
                        }
                    }
                }
            }
            ;
            this.raAnimCounter = counter;
        }
        else {
            frame--;
        }
        this.raAnimFrame = frame;
        this.hoPtr.roc.rcChanged = true;
        this.hoPtr.roc.rcCheckCollides = true;
        var image = adPtr.adFrames[frame];
        if (this.hoPtr.roc.rcImage != image || this.raOldAngle != this.hoPtr.roc.rcAngle) {
            this.hoPtr.roc.rcImage = image;
            this.raOldAngle = this.hoPtr.roc.rcAngle;
            if (image >= 0) {
                ifo = this.hoPtr.hoAdRunHeader.rhApp.imageBank.getImageInfoEx(image, this.hoPtr.roc.rcAngle, this.hoPtr.roc.rcScaleX, this.hoPtr.roc.rcScaleY);
                if (ifo != null) {
                    this.hoPtr.hoImgWidth = ifo.width;
                    this.hoPtr.hoImgHeight = ifo.height;
                    this.hoPtr.hoImgXSpot = ifo.xSpot;
                    this.hoPtr.hoImgYSpot = ifo.ySpot;
                }
            }
        }
        return false;
    },

    anim_Exist: function (animId) {
        var ahPtr = this.hoPtr.hoCommon.ocAnimations;
        if (ahPtr.ahAnimExists[animId] == 0) {
            return false;
        }
        return true;
    },

    animation_OneLoop: function () {
        if (this.raAnimRepeat == 0) {
            this.raAnimRepeat = 1;
        }
    },

    animation_Force: function (anim) {
        this.raAnimForced = anim + 1;
        this.animIn(0);
    },

    animation_Restore: function () {
        this.raAnimForced = 0;
        this.animIn(0);
    },

    animDir_Force: function (dir) {
        dir &= 31;
        this.raAnimDirForced = dir + 1;
        this.animIn(0);
    },

    animDir_Restore: function () {
        this.raAnimDirForced = 0;
        this.animIn(0);
    },

    animSpeed_Force: function (speed) {
        if (speed < 0) {
            speed = 0;
        }
        if (speed > 100) {
            speed = 100;
        }
        this.raAnimSpeedForced = speed + 1;
        this.animIn(0);
    },

    animSpeed_Restore: function () {
        this.raAnimSpeedForced = 0;
        this.animIn(0);
    },

    anim_Restart: function () {
        this.raAnimOn = -1;
        this.animIn(0);
    },

    animFrame_Force: function (frame) {
        if (frame >= this.raAnimNumberOfFrame) {
            frame = this.raAnimNumberOfFrame - 1;
        }
        if (frame < 0) {
            frame = 0;
        }
        this.raAnimFrameForced = frame + 1;
        this.animIn(0);
    },

    animFrame_Restore: function () {
        this.raAnimFrameForced = 0;
        this.animIn(0);
    },

    anim_Appear: function () {
        this.animIn(1);

        if (this.raAnimForced != CAnim.ANIMID_APPEAR + 1) {
            if (this.anim_Exist(CAnim.ANIMID_STOP) || this.anim_Exist(CAnim.ANIMID_WALK) || this.anim_Exist(CAnim.ANIMID_RUN)) {
                this.raRoutineAnimation = 0;
                this.animation_Restore();
            } else {
                this.raRoutineAnimation = 2;
                this.hoPtr.hoAdRunHeader.init_Disappear(this.hoPtr);
            }
        }
    },

    anim_Disappear: function () {
        if ((this.hoPtr.hoFlags & CObject.HOF_FADEOUT) == 0) {
            this.animIn(1);                                    // Un cran d'animations
            if (this.raAnimForced != CAnim.ANIMID_DISAPPEAR + 1) {
                this.hoPtr.hoAdRunHeader.addToDestroyList(this.hoPtr.hoNumber);
            }
        }
    }
}
