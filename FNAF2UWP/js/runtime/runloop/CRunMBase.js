// CRunMBase Object
// -----------------------------------------------------------------------
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

CRunMBase.MTYPE_OBJECT = 0;
CRunMBase.MTYPE_ELEMENT = 1;
CRunMBase.MTYPE_PARTICULE = 2;
CRunMBase.MTYPE_FAKEOBJECT = 3;
CRunMBase.MTYPE_BORDERLEFT = 4;
CRunMBase.MTYPE_BORDERRIGHT = 5;
CRunMBase.MTYPE_BORDERTOP = 6;
CRunMBase.MTYPE_BORDERBOTTOM = 7;
CRunMBase.MTYPE_OBSTACLE = 8;
CRunMBase.MTYPE_PLATFORM = 9;
CRunMBase.MSUBTYPE_OBJECT = 0;
CRunMBase.MSUBTYPE_BOTTOM = 1;
CRunMBase.MSUBTYPE_TOP = 2;
CRunMBase.MSUBTYPE_LEFT = 3;
CRunMBase.MSUBTYPE_RIGHT = 4;
CRunMBase.ANGLE_MAGIC = 123456789;

function CRunMBase() {
    CBoundingCache.call(this);

    this.m_type = 0;
    this.m_subType = CRunMBase.MSUBTYPE_OBJECT;
    this.m_identifier = 0;
    this.m_stopFlag = false;
    this.m_pHo = null;
    this.m_body = null;
    this.m_currentAngle = 0;
    this.m_eventCount = 0;
    this.m_collidingObject = null;
    this.ho = null;
    this.rh = null;
    this.rc = new CRect();
    this.m_addVX = 0;
    this.m_addVY = 0;
    this.m_addVFlag = false;
    this.m_setVX = 0;
    this.m_setVY = 0;
    this.m_setVFlag = false;
    this.m_image = -1;
    this.m_background = false;
}

CRunMBase.prototype = {
    InitBase: function (pHo, type) {
        this.m_pHo = pHo;
        this.m_type = type;
        this.m_stopFlag = false;
        m_currentAngle = 0;
    },
    AddVelocity: function (vx, vy) {
        this.m_addVX = vx;
        this.m_addVY = vy;
        this.m_addVFlag = true;
    },
    SetVelocity: function (vx, vy) {
        var angle = this.m_body.GetAngle();
        var position = this.m_body.GetPosition();
        position.x += vx / 2.56;
        position.y += vy / 2.56;
        this.m_base.rBodySetTransform(this.m_body, position, angle);
    },
    ResetAddVelocity: function () {
        if (this.m_addVFlag) {
            this.m_addVFlag = false;
            this.m_addVX = 0;
            this.m_addVY = 0;
        }
        if (this.m_setVFlag) {
            this.m_setVFlag = false;
            this.m_setVX = 0;
            this.m_setVY = 0;
        }
    },
    PrepareCondition: function () {
        this.m_stopFlag = false;
        this.m_eventCount = this.m_pHo.hoAdRunHeader.rh4EventCount;
    },
    IsStop: function () {
        return this.m_stopFlag;
    },
    SetStopFlag: function (flag) {
        this.m_stopFlag = flag;
    },
    SetCollidingObject: function (object) {
        this.m_collidingObject = object;
    },
    CreateBody: function () {
        return false;
    },
    CreateJoint: function () {
    },
    SetFriction: function (friction) {
    },
    SetRestitution: function (restitution) {
    },
    SetGravity: function (gravity) {
    },
    SetDensity: function (density) {
    },
    init: function (hoPtr) {
        this.ho = hoPtr;
        this.rh = this.ho.hoAdRunHeader;
    },

    initialize: function (file) {
    },

    kill: function () {
    },

    move: function () {
        return false;
    },

    setPosition: function (x, y) {
    },

    setXPosition: function (x) {
    },

    setYPosition: function (y) {
    },

    stop: function (bCurrent) {
    },

    bounce: function (bCurrent) {
    },

    reverse: function () {
    },

    start: function () {
    },

    setSpeed: function (speed) {
    },

    setMaxSpeed: function (speed) {
    },

    setDir: function (dir) {
    },

    setAcc: function (acc) {
    },

    setDec: function (dec) {
    },

    setRotSpeed: function (speed) {
    },

    set8Dirs: function (dirs) {
    },

    setGravity: function (gravity) {
    },

    extension: function (func, param) {
        return 0;
    },

    actionEntry: function (action) {
        return 0;
    },

    getSpeed: function () {
        return 0;
    },

    getAcceleration: function () {
        return 0;
    },

    getDeceleration: function () {
        return 0;
    },

    getGravity: function () {
        return 0;
    },

    dirAtStart: function (dir) {
        return this.ho.rom.dirAtStart(this.ho, dir, 32);
    },

    animations: function (anm) {
        this.ho.roc.rcAnim = anm;
        if (this.ho.roa != null) {
            this.ho.roa.animate();
        }
    },

    collisions: function () {
        this.ho.hoAdRunHeader.rh3CollisionCount++;
        this.ho.rom.rmMovement.rmCollisionCount = this.ho.hoAdRunHeader.rh3CollisionCount;
        this.ho.hoAdRunHeader.newHandle_Collisions(this.ho);
    },

    approachObject: function (destX, destY, originX, originY, htFoot, planCol, ptDest) {
        destX -= this.ho.hoAdRunHeader.rhWindowX;
        destY -= this.ho.hoAdRunHeader.rhWindowY;
        originX -= this.ho.hoAdRunHeader.rhWindowX;
        originY -= this.ho.hoAdRunHeader.rhWindowY;
        var bRet = this.ho.rom.rmMovement.mpApproachSprite(destX, destY, originX, originY, htFoot, planCol, ptDest);
        ptDest.x += this.ho.hoAdRunHeader.rhWindowX;
        ptDest.y += this.ho.hoAdRunHeader.rhWindowY;
        return bRet;
    },

    moveIt: function () {
        return this.ho.rom.rmMovement.newMake_Move(this.ho.roc.rcSpeed, this.hoPtr.hoAdRunHeader.getDir(this.hoPtr));
    },

    testPosition: function (x, y, htFoot, planCol, flag) {
        return this.ho.rom.rmMovement.tst_SpritePosition(x, y, htFoot, planCol, flag);
    },

    getJoystick: function (player) {
        return this.ho.hoAdRunHeader.rhPlayer[player];
    },

    colMaskTestRect: function (x, y, sx, sy, layer, plan) {
        return !this.ho.hoAdRunHeader.colMask_Test_Rect(x, y, sx, sy, layer, plan);
    },

    colMaskTestPoint: function (x, y, layer, plan) {
        return !this.ho.hoAdRunHeader.colMask_Test_XY(x, y, layer, plan);
    },

    getParamDouble: function () {
        return this.ho.rom.rmMovement.callParam;
    },

    getParam: function () {
        return this.ho.rom.rmMovement.callParam;
    },

    getAngle: function () {
        return 0;
    },

    setAngle: function (angle) {
    }
}

//setup inheritance using extend
CServices.extend(CBoundingCache, CRunMBase);