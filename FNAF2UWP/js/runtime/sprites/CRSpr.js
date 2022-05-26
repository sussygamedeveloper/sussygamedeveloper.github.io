// CRSpr object
// ----------------------------------------------------------
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

CRSpr.RSFLAG_HIDDEN = 0x0001;
CRSpr.RSFLAG_INACTIVE = 0x0002;
CRSpr.RSFLAG_SLEEPING = 0x0004;
CRSpr.RSFLAG_ROTATE_ANTIA = 0x0010;
CRSpr.RSFLAG_VISIBLE = 0x0020;
CRSpr.RSFLAG_RAMBO = 0x0040;
CRSpr.RSFLAG_COLBOX = 0x0080;

CRSpr.SPRTYPE_TRUESPRITE = 0;
CRSpr.SPRTYPE_OWNERDRAW = 1;

CRSpr.BOP_COPY = 0;
CRSpr.BOP_BLEND = 1;
CRSpr.BOP_INVERT = 2;
CRSpr.BOP_XOR = 3;
CRSpr.BOP_AND = 4;
CRSpr.BOP_OR = 5;
CRSpr.BOP_BLEND_REPLACETRANSP = 6;
CRSpr.BOP_DWROP = 7;
CRSpr.BOP_ANDNOT = 8;
CRSpr.BOP_ADD = 9;
CRSpr.BOP_MONO = 10;
CRSpr.BOP_SUB = 11;
CRSpr.BOP_BLEND_DONTREPLACECOLOR = 12;
CRSpr.BOP_EFFECTEX = 13;
CRSpr.BOP_MAX = 13;

CRSpr.BOP_MASK = 0x0000FFF;
CRSpr.BOP_RGBAFILTER = 0x1000;
CRSpr.BOP_SMOOTHING = 0x2000;

//CRSpr is basically a container to handle all of the "drawable" features of a generic object. For example a CActive retrieves information about effects/visibility/etc from this.ros, and then renders itself
function CRSpr() {
    //the CRSpr is only ever created in RunLoop.js CRun.f_CreateObject()
    this.hoPtr = null;
    this.rsFlash = 0;
    this.rsFlashCpt = 0;
    this.rsLayer = 0;
    this.rsCreaFlags = 0;
    this.rsBackColor = 0;
    this.rsEffect = 0;
    this.rsEffectParam = 0;
    this.rsFlags = 0;
    this.rsSpriteType = 0;
    this.rsTransparency = 0;
    this.transition = null;
}

CRSpr.prototype = {
    init1: function (ho, ocPtr, cobPtr) {
        //hoPtr (for future reference) is the object that is related to this runsprite
        this.hoPtr = ho;

        this.rsLayer = cobPtr.cobLayer;

        this.rsFlags = 0;

        this.rsFlags |= CRSpr.RSFLAG_RAMBO;
        if ((this.hoPtr.hoLimitFlags & CObjInfo.OILIMITFLAGS_QUICKCOL) == 0) {
            this.rsFlags &= ~CRSpr.RSFLAG_RAMBO;
        }

        if ((this.hoPtr.hoOiList.oilOCFlags2 & CObjectCommon.OCFLAGS2_COLBOX) != 0) {
            this.rsFlags |= CRSpr.RSFLAG_COLBOX;
        }

        if ((cobPtr.cobFlags & CRun.COF_HIDDEN) != 0) {
            this.rsFlags |= CRSpr.RSFLAG_HIDDEN;
            if (this.hoPtr.hoType == COI.OBJ_TEXT) {
                this.hoPtr.hoFlags |= CObject.HOF_NOCOLLISION;
                this.rsFlags &= ~CRSpr.RSFLAG_RAMBO;
            }
        } else {
            this.rsFlags |= CRSpr.RSFLAG_VISIBLE;
        }

        this.rsEffect = this.hoPtr.hoOiList.oilInkEffect;
        this.rsEffectParam = this.hoPtr.hoOiList.oilEffectParam;

        var globalAlpha = 1;
        if ((this.rsEffect & CRSpr.BOP_RGBAFILTER) != 0) {
            globalAlpha = (((this.rsEffectParam >>> 24) & 0xFF) / 255.0);
        } else if ((this.rsEffect & CRSpr.BOP_MASK) == CRSpr.BOP_BLEND) {
            globalAlpha = ((128 - this.rsEffectParam) / 128.0);
        }

        this.rsTransparency = 128 - globalAlpha * 128;

        if (this.hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_STATIC) {
            this.rsFlags |= CRSpr.RSFLAG_INACTIVE;
        }
    },

    init2: function (bTransition) {
        this.createSprite(bTransition);

        if (bTransition && this.hoPtr.hoCommon.ocFadeIn) {
            this.hoPtr.hoFlags |= CObject.HOF_FADEIN;
        }
    },

    handle: function () {
        var rhPtr = this.hoPtr.hoAdRunHeader;

        //handle fade in
        if ((this.hoPtr.hoFlags & CObject.HOF_FADEIN) != 0) {
            //do we need to create the transition?
            if (!this.transition) {
                this.createTransition(false);
            }

            //update transition
            this.performFadeIn();
            return;
        }

        //handle fade out
        if ((this.hoPtr.hoFlags & CObject.HOF_FADEOUT) != 0) {
            //perform the fade out
            this.performFadeOut();
            return;
        }

        //get dimensions for this
        var x1 = this.hoPtr.hoX - this.hoPtr.hoImgXSpot;
        var y1 = this.hoPtr.hoY - this.hoPtr.hoImgYSpot;
        var x2 = x1 + this.hoPtr.hoImgWidth;
        var y2 = y1 + this.hoPtr.hoImgHeight;

        //is it currently sleeping?
        if ((this.rsFlags & CRSpr.RSFLAG_SLEEPING) == 0) {
            //no its not asleep

            //flash visibility
            if (this.rsFlash != 0) {
                this.rsFlashCpt -= rhPtr.rhTimerDelta;
                if (this.rsFlashCpt < 0) {
                    this.rsFlashCpt = this.rsFlash;
                    if ((this.rsFlags & CRSpr.RSFLAG_VISIBLE) == 0) {
                        this.rsFlags |= CRSpr.RSFLAG_VISIBLE;
                        this.obShow();
                    } else {
                        this.rsFlags &= ~CRSpr.RSFLAG_VISIBLE;
                        this.obHide();
                    }
                }
            }

            //handle object movement
            if (this.hoPtr.rom != null) {
                this.hoPtr.rom.move();
            }

            //I think this does: indicates that this runtime sprite is actually conrolled by a player so we should skip the next code after this (e.g. it can never goto sleep)
            if (this.hoPtr.roc.rcPlayer != 0) {
                return;
            }

            //handle sleeping/killing this object

            //if the object is told NEVER to sleep, we should handle this seperately
            if ((this.hoPtr.hoOEFlags & CObjectCommon.OEFLAG_NEVERSLEEP) != 0) {
                //this object should NEVER gotosleep... but we should stioll see if we can kill it

                // Build 285.1: handle "Destroy if too far" even if "Inactivate if too far" is set to No
                if ((this.hoPtr.hoOEFlags & CObjectCommon.OEFLAG_NEVERKILL) == 0 && (rhPtr.rhApp.dwOptions & CRunApp.AH2OPT_DESTROYIFNOINACTIVATE) != 0 && (x2 < rhPtr.rh3XMinimumKill || x1 > rhPtr.rh3XMaximumKill || y2 < rhPtr.rh3YMinimumKill || y1 > rhPtr.rh3YMaximumKill)) {
                    rhPtr.addToDestroyList(this.hoPtr.hoNumber);
                }

                return;
            }

            //check to see if it is within range
            if (x2 >= rhPtr.rh3XMinimum && x1 <= rhPtr.rh3XMaximum && y2 >= rhPtr.rh3YMinimum && y1 <= rhPtr.rh3YMaximum) {
                //yup so break out of this function
                return;
            }

            //check to see if the object is outside of the KILL zone
            if (x2 >= rhPtr.rh3XMinimumKill && x1 <= rhPtr.rh3XMaximumKill && y2 >= rhPtr.rh3YMinimumKill && y1 <= rhPtr.rh3YMaximumKill) {
                //nope, so just make it sleep
                this.rsFlags |= CRSpr.RSFLAG_SLEEPING;

                this.hoPtr.removeSceneNode();

                return;

            } else {
                //it is, let us see if we can kill it then?
                if ((this.hoPtr.hoOEFlags & CObjectCommon.OEFLAG_NEVERKILL) == 0) {
                    //yup, time to die!
                    rhPtr.addToDestroyList(this.hoPtr.hoNumber);
                }

                return;
            }
        } else {
            //the object is currently asleep, so we should check to see if we can wake it up
            if (x2 >= rhPtr.rh3XMinimum && x1 <= rhPtr.rh3XMaximum && y2 >= rhPtr.rh3YMinimum && y1 <= rhPtr.rh3YMaximum) {
                //time to wake up!!!!
                this.rsFlags &= ~CRSpr.RSFLAG_SLEEPING;
                this.init2(false);

                //so we need to rejuggle the zorder, we do this by calling setZOrder on the related object. So if it is a CActive, look in Active.js
                //this.hoPtr.setZOrder(this.hoPtr.zOrder);
            }
        }
    },

    createSprite: function (bTransition) {
        //how is this sprite drawn?
        if ((this.hoPtr.hoOEFlags & CObjectCommon.OEFLAG_ANIMATIONS) != 0) {
            //this is an "active object" style object
            this.hoPtr.addSceneNode(this.hoPtr.hoX - this.hoPtr.hoAdRunHeader.rhWindowX, this.hoPtr.hoY - this.hoPtr.hoAdRunHeader.rhWindowY, this.hoPtr.roc.rcImage, this.rsLayer, (this.rsFlags & CRSpr.RSFLAG_HIDDEN) == 0);
            this.rsSpriteType = CRSpr.SPRTYPE_TRUESPRITE;
            this.hoPtr.setEffect(this.rsEffect, this.rsEffectParam);

        } else {
            //this is for extensions and such to render dynamically
            this.hoPtr.hoFlags |= CObject.HOF_OWNERDRAW;
            this.hoPtr.addOwnerDrawSceneNode(this.hoPtr.hoX - this.hoPtr.hoAdRunHeader.rhWindowX, this.hoPtr.hoY - this.hoPtr.hoAdRunHeader.rhWindowY, this.rsLayer, (this.hoPtr.hoOEFlags & CObjectCommon.OEFLAG_QUICKDISPLAY) != 0, (this.rsFlags & CRSpr.RSFLAG_HIDDEN) == 0);
            this.hoPtr.setEffect(this.rsEffect, this.rsEffectParam);
            this.rsSpriteType = CRSpr.SPRTYPE_OWNERDRAW;
        }
    },

    createTransition: function (out) {
        this.hoPtr.hoFlags &= ~(CObject.HOF_FADEIN | CObject.HOF_FADEOUT);

        //un fade
        if (out == false) {
            if (!this.hoPtr.hoCommon.ocFadeIn) {
                return false;
            }
            this.hoPtr.hoFlags |= CObject.HOF_FADEIN;
        } else {
            if (!this.hoPtr.hoCommon.ocFadeOut) {
                return false;
            }
            this.hoPtr.hoFlags |= CObject.HOF_FADEOUT;
        }

        // Demarre le fade
        this.transition = this.hoPtr.hoAdRunHeader.rhApp.getTransitionManager().startObjectTransition(this.hoPtr, out);
        if (!this.transition) {
            this.hoPtr.hoFlags &= ~(CObject.HOF_FADEIN | CObject.HOF_FADEOUT);
            return false;
        }
        return true;
    },

    performFadeIn: function () {
        if ((this.hoPtr.hoFlags & CObject.HOF_FADEIN) != 0) {
            //if the transition is finished then kill it
            if (this.transition.isCompleted()) {

                this.hoPtr.hoFlags &= ~CObject.HOF_FADEIN;

                //release hold on buffer
                if (this.hoPtr.transitionBuffer != null) {
                    this.hoPtr.transitionBuffer.free();
                    this.hoPtr.transitionBuffer = null;
                }

                //release transition
                this.transition.free();
                this.transition = null;

                if (this.hoPtr.hoType >= 32) {
                    hoPtr.ext.continueRunObject();
                }
                return false;
            }

            //update the transition
            this.transition.update(CTrans.TRFLAG_FADEIN);
            return true;
        }
        return false;
    },

    performFadeOut: function () {
        if ((this.hoPtr.hoFlags & CObject.HOF_FADEOUT) != 0) {
            if (this.transition.isCompleted()) {
                //release hold on buffer
                if (this.hoPtr.transitionBuffer != null) {
                    this.hoPtr.transitionBuffer.free();
                    this.hoPtr.transitionBuffer = null;
                }

                //release transition
                this.transition.free();
                this.transition = null;

                //detroy the object (later)
                this.hoPtr.hoAdRunHeader.addToDestroyList(this.hoPtr.hoNumber);
                return false;
            }

            this.transition.update(CTrans.TRFLAG_FADEOUT);
            return true;
        }
        return false;
    },

    initFadeOut: function () {
        if (this.createTransition(true)) {
            this.hoPtr.hoFlags |= CObject.HOF_NOCOLLISION;
            return true;
        }
        return false;
    },

    kill: function (fast) {
        this.hoPtr.removeSceneNode();
    },

    obHide: function () {
        if ((this.rsFlags & CRSpr.RSFLAG_HIDDEN) == 0) {
            this.rsFlags |= CRSpr.RSFLAG_HIDDEN;
            this.hoPtr.roc.rcChanged = true;
            this.hoPtr.hideSprite();
        }
    },

    obShow: function () {
        if ((this.rsFlags & CRSpr.RSFLAG_HIDDEN) != 0) {
            var pLayer = this.hoPtr.hoAdRunHeader.rhFrame.layers[this.hoPtr.hoLayer];
            if ((pLayer.dwOptions & (CLayer.FLOPT_TOHIDE | CLayer.FLOPT_VISIBLE)) == CLayer.FLOPT_VISIBLE) {
                this.rsFlags &= ~CRSpr.RSFLAG_HIDDEN;
                this.hoPtr.hoFlags &= ~CObject.HOF_NOCOLLISION;
                this.hoPtr.roc.rcChanged = true;
                this.hoPtr.showSprite();
            }
        }
    },

    setSemiTransparency: function (trans) {
        if (trans >= 0 && trans <= 128) {
            this.rsTransparency = trans;
            this.hoPtr.setTransparency(trans);
        }
    },

    getSemiTransparency: function () {
        return this.rsTransparency;
    },

    setColFlag: function (flag) {
        if (flag) {
            this.rsFlags |= CRSpr.RSFLAG_RAMBO;
        }
        else {
            this.rsFlags &= ~CRSpr.RSFLAG_RAMBO;
        }
    },

    modifSpriteEffect: function (effect, effectParam) {
        this.rsEffect = effect;
        this.rsEffectParam = effectParam;
    },
}
