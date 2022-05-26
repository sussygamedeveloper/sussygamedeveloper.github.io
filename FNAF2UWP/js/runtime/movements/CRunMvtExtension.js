// CRunMvtExtension object
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

function CRunMvtExtension() {
    this.ho = null;
    this.rh = null;
}

CRunMvtExtension.prototype = {
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

    getDir: function () {
        return this.ho.roc.rcDir;
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
        return this.ho.rom.rmMovement.newMake_Move(this.ho.roc.rcSpeed, this.ho.hoAdRunHeader.getDir(this.ho));
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
    }
}