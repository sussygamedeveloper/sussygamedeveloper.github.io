// CObject
// ----------------------------------------------------------------
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

CObject.HOF_DESTROYED = 0x0001;
CObject.HOF_TRUEEVENT = 0x0002;
CObject.HOF_REALSPRITE = 0x0004;
CObject.HOF_FADEIN = 0x0008;
CObject.HOF_FADEOUT = 0x0010;
CObject.HOF_OWNERDRAW = 0x0020;
CObject.HOF_NOCOLLISION = 0x2000;
CObject.HOF_FLOAT = 0x4000;
CObject.HOF_STRING = 0x8000;

function CObject() {
    //call chain
    CSceneNode.call(this);

    //call self


    this.hoNumber = 0;
    this.hoNextSelected = 0;
    this.hoAdRunHeader = null;
    this.hoHFII = 0;
    this.hoOi = 0;
    this.hoNumPrev = 0;
    this.hoNumNext = 0;
    this.hoType = 0;
    this.hoCreationId = 0;
    this.hoOiList = null;
    this.hoEvents = 0;
    this.hoPrevNoRepeat = null;
    this.hoBaseNoRepeat = null;
    this.hoMark1 = 0;
    this.hoMark2 = 0;
    this.hoMT_NodeName = null;
    this.hoEventNumber = 0;
    this.hoCommon = null;
    this.hoCalculX = 0;
    this.hoX = 0;
    this.hoCalculY = 0;
    this.hoY = 0;
    this.hoImgXSpot = 0;
    this.hoImgYSpot = 0;
    this.hoImgWidth = 0;
    this.hoImgHeight = 0;
    this.hoOEFlags = 0;
    this.hoFlags = 0;
    this.hoSelectedInOR = 0;
    this.hoOffsetValue = 0;
    this.hoLayer = 0;
    this.hoLimitFlags = 0;
    this.hoNextQuickDisplay = 0;
    this.hoCurrentParam = 0;
    this.hoIdentifier = 0;
    this.hoCallRoutine = false;
    this.roc = null;
    this.rom = null;
    this.roa = null;
    this.rov = null;
    this.ros = null;
}

CObject.prototype = {
    setScale: function (fScaleX, fScaleY) {
        if (this.roc.rcScaleX != fScaleX || this.roc.rcScaleY != fScaleY) {
            if (fScaleX >= 0) {
                this.roc.rcScaleX = fScaleX;
            }
            if (fScaleY >= 0) {
                this.roc.rcScaleY = fScaleY;
            }
            this.roc.rcChanged = true;

            var ifo = this.hoAdRunHeader.rhApp.imageBank.getImageInfoEx(this.roc.rcImage, this.roc.rcAngle, this.roc.rcScaleX, this.roc.rcScaleY);
            if (ifo) {
                this.hoImgWidth = ifo.width;
                this.hoImgHeight = ifo.height;
                this.hoImgXSpot = ifo.xSpot;
                this.hoImgYSpot = ifo.ySpot;
            } else {
                this.hoImgWidth = 32;
                this.hoImgHeight = 32;
                this.hoImgXSpot = 0;
                this.hoImgYSpot = 0;
            }
        }
    },

    action: function (num, act) {
        //unhandled actions!
    },

    shtCreate: function (p, x, y, dir) {
        var nLayer = this.hoLayer;
        var num = this.hoAdRunHeader.f_CreateObject(p.cdpHFII, p.cdpOi, x, y, dir, CRun.COF_NOMOVEMENT | CRun.COF_HIDDEN, nLayer, -1);
        if (num >= 0) {
            var pHo = this.hoAdRunHeader.rhObjectList[num];
            if (pHo.rom != null) {
                pHo.roc.rcDir = dir;
                pHo.rom.initSimple(pHo, CMoveDef.MVTYPE_BULLET, false);
                pHo.roc.rcSpeed = p.shtSpeed;
                pHo.rom.rmMovement.init2(this);

                if (nLayer != -1) {
                    if ((pHo.hoOEFlags & CObjectCommon.OEFLAG_SPRITES) != 0) {
                        var layer = this.hoAdRunHeader.rhFrame.layers[nLayer];
                        if ((layer.dwOptions & (CLayer.FLOPT_TOHIDE | CLayer.FLOPT_VISIBLE)) != CLayer.FLOPT_VISIBLE) {
                            pHo.ros.obHide();
                        }
                    }
                }

                // Put the object in the list of selected objects (Met l'objet dans la liste des objets selectionnes)
                this.hoAdRunHeader.rhEvtProg.evt_AddCurrentObject(pHo);

                // Force animation SHOOT if defined (Force l'animation SHOOT si definie)
                if ((this.hoOEFlags & CObjectCommon.OEFLAG_ANIMATIONS) != 0) {
                    if (this.roa.anim_Exist(CAnim.ANIMID_SHOOT)) {
                        this.roa.animation_Force(CAnim.ANIMID_SHOOT);
                        this.roa.animation_OneLoop();
                    }
                }
            }
            else {
                this.hoAdRunHeader.addToDestroyList(pHo.hoNumber);
            }
        }
    },

    fixedValue: function () {
        return (this.hoCreationId << 16) | (this.hoNumber & 0xFFFF);
    },

    init: function (ocPtr, cob) {
    },

    handle: function () {
    },

    callComputeNewDisplay: function () {

    },

    createFont: function () {
    },

    onGraphicFontChange: function () {
    },

    display: function () {
    },

    kill: function (bFast) {
    },

    getSurface: function (context) {
        return false;
    },

    getCollisionMask: function (flags) {
        return null;
    },

    setEffect: function (effect, effectParam) {
    },

    addSceneNode: function (x, y, i, layer, bShow) {
    },

    addOwnerDrawSceneNode: function (x, y, layer, quickDisplay, show) {
    },

    removeSceneNode: function () {
    },

    showSprite: function () {
    },

    hideSprite: function () {
    },

    setTransparency: function (t) {
    },

    autoResize: function () {
    },

    forcePosition: function () {
    }
};

//setup inheritance using extend
CServices.extend(CSceneNode, CObject);