// CActive
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

function CActive() {
    //call chain
    CObject.call(this);

    //call self

    this.smoothing = false;
    this.image = null;
    this.bShown = false;
    this.nLayer = 0;
    this.pLayer = null;
    this.startFade = 0;
    this.bHandCursor = false;
    this.rcRotate = null;
    this.ptRotate = null;
    this.bVisible = true;
    this.transitionBuffer = null;
}

CActive.prototype = {
    handle: function () {
        this.ros.handle();
        if (this.roc.rcChanged) {
            this.roc.rcChanged = false;
        }
    },

    draw: function (context, xx, yy) {
        if (this.bShown) {
            if ((this.hoFlags & CObject.HOF_FADEIN) != 0 && !this.ros.transition) {
                return;
            }

            var image = this.hoAdRunHeader.rhApp.imageBank.getImageFromHandle(this.roc.rcImage);

            if (image) {
                //add smoothing
                var effect = this.ros.rsEffect;
                if (this.ros.rsFlags & CRSpr.RSFLAG_ROTATE_ANTIA) {
                    effect |= CRSpr.BOP_SMOOTHING;
                }

                //layer position already applied in render chain
                if (this.transitionBuffer == null) {
                    //render the image of CActive

                    //reference:

                    //this.hoX & this.hoY - object position in frame local coordinates
                    //this.rhWindowX & this.rhWindowY - scroll position... ( i think.. search for "rhWindowX =" to see where it is modified from leFrameX )
                    //this.pLayer.x & this.pLayer.y - layer offset

                    context.renderImage(image, xx + this.hoX - this.hoAdRunHeader.rhWindowX + this.pLayer.x, yy + this.hoY - this.hoAdRunHeader.rhWindowY + this.pLayer.y, this.roc.rcAngle, this.roc.rcScaleX, this.roc.rcScaleY, effect, this.ros.rsEffectParam, this);
                } else {
                    //render the transition
                    context.renderSimpleImage(this.transitionBuffer, xx + this.hoX - this.hoAdRunHeader.rhWindowX + this.pLayer.x - image.xSpot, yy + this.hoY - this.hoAdRunHeader.rhWindowY + this.pLayer.y - image.ySpot, this.transitionBuffer.width * this.roc.rcScaleX, this.transitionBuffer.height * this.roc.rcScaleY, effect, this.ros.rsEffectParam);
                }
            }
        }
    },

    addSceneNode: function (xx, yy, ii, layer, bShow) {
        //this is ONLY called by CRunSprite.createSprite()
        this.nLayer = layer;
        this.pLayer = this.hoAdRunHeader.rhFrame.layers[layer];
        this.bShown = bShow;

        //add self to the apropriate layer CSceneNode (but this is added at the end of the list of children)
        this.pLayer.planeSprites.addChild(this);
    },

    removeSceneNode: function () {
        this.removeFromParent();
    },

    showSprite: function () {
        this.bShown = true;
    },

    hideSprite: function () {
        this.bShown = false;
    },

    setTransparency: function (t) {
        this.ros.rsEffect = CRSpr.BOP_BLEND;
        this.ros.rsEffectParam = t;
    }
};

//setup inheritance using extend
CServices.extend(CObject, CActive);