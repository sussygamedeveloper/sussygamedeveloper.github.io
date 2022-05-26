// CMoveBullet
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

function CMoveBullet() {
    //call chain
    CMove.call(this);

    //call self
    this.MBul_Wait = false;
    this.MBul_ShootObject = null;
}

CMoveBullet.prototype = {
    init: function (ho, mvPtr) {
        this.hoPtr = ho;
        this.rhPtr = ho.hoAdRunHeader;
        this.rhPtr.GetBase();
        if (this.hoPtr.ros != null) {
            this.hoPtr.ros.setColFlag(false);
        }
        if (this.hoPtr.ros != null) {
            this.hoPtr.ros.rsFlags &= ~CRSpr.RSFLAG_VISIBLE;
            this.hoPtr.ros.obHide();
        }
        this.MBul_Wait = true;
        this.hoPtr.hoCalculX = 0;
        this.hoPtr.hoCalculY = 0;
        if (this.hoPtr.roa != null) {
            this.hoPtr.roa.init_Animation(CAnim.ANIMID_WALK);
        }
        this.hoPtr.roc.rcSpeed = 0;
        this.hoPtr.roc.rcCheckCollides = true;
        this.hoPtr.roc.rcChanged = true;
    },
    init2: function (parent) {
        this.hoPtr.roc.rcMaxSpeed = this.hoPtr.roc.rcSpeed;
        this.hoPtr.roc.rcMinSpeed = this.hoPtr.roc.rcSpeed;
        this.MBul_ShootObject = parent;
    },
    kill: function (bFast) {
        this.freeBullet(this.hoPtr);
    },
    move: function () {
        if (this.MBul_Wait) {
            if (this.MBul_ShootObject.roa != null) {
                if (this.MBul_ShootObject.roa.raAnimOn == CAnim.ANIMID_SHOOT) {
                    return;
                }
            }
            this.startBullet();
        }

        if (this.hoPtr.roa != null) {
            this.hoPtr.roa.animate();
        }
        this.newMake_Move(this.hoPtr.roc.rcSpeed, this.hoPtr.hoAdRunHeader.getDir(this.hoPtr));

        if (this.hoPtr.hoX < -64 || this.hoPtr.hoX > this.hoPtr.hoAdRunHeader.rhLevelSx + 64 || this.hoPtr.hoY < -64 || this.hoPtr.hoY > this.hoPtr.hoAdRunHeader.rhLevelSy + 64) {
            this.hoPtr.hoCallRoutine = false;
            this.hoPtr.hoAdRunHeader.addToDestroyList(this.hoPtr.hoNumber);
        }
        if (this.hoPtr.roc.rcCheckCollides) {
            this.hoPtr.roc.rcCheckCollides = false;
            this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
        }
    },
    startBullet: function () {
        if (this.hoPtr.ros != null) {
            this.hoPtr.ros.setColFlag(true);
        }
        if (this.hoPtr.ros != null) {
            this.hoPtr.ros.rsFlags |= CRSpr.RSFLAG_VISIBLE;
            this.hoPtr.ros.obShow();
        }
        if (this.rhPtr.rh4Box2DBase != null) {
            var hoParent = this.MBul_ShootObject;
            var pMovement = this.rhPtr.GetMBase(hoParent);
            if (pMovement != null) {
                var pBase = this.rhPtr.rh4Box2DBase;
                var pMBase = new CRunMBase();
                this.MBul_MBase = pMBase;
                pMBase.InitBase(this.hoPtr, CRunMBase.MTYPE_OBJECT);
                pMBase.m_identifier = pBase.identifier;
                this.MBul_Body = pBase.rCreateBullet(pMovement.m_currentAngle, this.hoPtr.roc.rcSpeed / 250. * 50.0, pMBase);
                pMBase.m_body = this.MBul_Body;
                if (this.MBul_Body == null) {
                    this.MBul_MBase = null;
                }
            }
        }
        this.MBul_Wait = false;
        this.MBul_ShootObject = null;
    },
    freeBullet: function (hoPtr) {
        if (this.MBul_Body != null) {
            var rhPtr = this.hoPtr.hoAdRunHeader;
            pBase = rhPtr.rh4Box2DBase;
            pBase.rDestroyBody(this.MBul_Body);
            this.MBul_Body = null;
        }
        if (this.MBul_MBase != null) {
            this.MBul_MBase = null;
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
CServices.extend(CMove, CMoveBullet);