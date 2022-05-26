// CText
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

function CText() {
    //call chain
    CObject.call(this);

    //call self


    this.rsTextBuffer = null;
    this.currentText = null;
    this.rsMaxi = 0;
    this.rsMini = 0;
    this.rsFont = 0;
    this.rsTextColor = 0;
    this.nLayer = 0;
    this.font = null;
    this.bShown = true;
    this.flags = 0;
    this.rsHidden = 0;
    this.pLayer = null;
    this.deltaY = 0;
    this.rsBoxCx = 0;
    this.rsBoxCy = 0;
    this.textContainer = null;
    this.rendererImage = null;
    this.computed = false;
}

CText.prototype = {
    init: function (ocPtr, cob) {
        var app = this.hoAdRunHeader.rhApp;
        var txt = ocPtr.ocObject;
        this.hoImgWidth = txt.otCx;
        this.hoImgHeight = txt.otCy;
        this.rsBoxCx = txt.otCx;
        this.rsBoxCy = txt.otCy;

        this.rsMaxi = txt.otNumberOfText;
        this.rsTextColor = 0;
        if (txt.otTexts.length > 0) {
            this.rsTextColor = txt.otTexts[0].tsColor;
        }

        this.rsTextBuffer = null;
        this.rsFont = -1;
        this.rsMini = 0;
        this.bShown = true;
        this.rsHidden = cob.cobFlags;
        if ((cob.cobFlags & CRun.COF_FIRSTTEXT) != 0) {
            if (txt.otTexts.length > 0) {
                this.rsTextBuffer = txt.otTexts[0].tsText;
            }
        }
        var nFont = this.rsFont;
        if (nFont == -1) {
            if (txt.otTexts.length > 0) {
                nFont = txt.otTexts[0].tsFont;
            }
        }
        this.font = app.fontBank.getFontFromHandle(nFont);
    },

    kill: function () {
        //free the renderer image
        if (this.textContainer) {
            this.textContainer.free();
            this.textContainer = null;
        }
    },

    handle: function () {
        this.ros.handle();
        if (this.roc.rcChanged) {
            this.roc.rcChanged = false;
        }
    },

    getFont: function () {
        var nFont = this.rsFont;
        if (nFont == -1) {
            var txt = this.hoCommon.ocObject;
            nFont = txt.otTexts[0].tsFont;
        }
        return this.hoAdRunHeader.rhApp.fontBank.getFontInfoFromHandle(nFont);
    },

    setFont: function (f, size) {
        this.rsFont = this.hoAdRunHeader.rhApp.fontBank.addFont(f);
        this.font = this.hoAdRunHeader.rhApp.fontBank.getFontFromHandle(this.rsFont);
        if (size != null) {
            this.hoImgWidth = size.right - size.left;
            this.hoImgHeight = size.bottom - size.top;
        }
        this.roc.rcChanged = true;
        this.computeNewDisplay();
    },

    getFontColor: function () {
        return this.rsTextColor;
    },

    setFontColor: function (rgb) {
        this.rsTextColor = rgb;
        this.computeNewDisplay();
    },

    addOwnerDrawSceneNode: function (xx, yy, layer, quickDisplay, show) {
        if (this.parent != null) {
            return;
        }

        this.bShown = show;
        this.pLayer = this.hoAdRunHeader.rhFrame.layers[layer];

        if (quickDisplay) {
            this.pLayer.planeQuickDisplay.addChild(this);
        } else {
            this.pLayer.planeSprites.addChild(this);
        }
    },

    removeSceneNode: function () {
        if (this.parent == null) {
            return;
        }

        this.removeFromParent();
    },

    showSprite: function () {
        if (this.bShown == false) {
            this.bShown = true;
        }
    },

    hideSprite: function () {
        if (this.bShown == true) {
            this.bShown = false;
        }
    },

    txtChange: function (num) {
        if (num < -1) {
            num = -1;
        }
        if (num >= this.rsMaxi) {
            num = this.rsMaxi - 1;
        }
        if (num == this.rsMini) {
            return false;
        }

        this.rsMini = num;

        if (num >= 0) {
            var txt = this.hoCommon.ocObject;
            this.txtSetString(txt.otTexts[this.rsMini].tsText);
        }
        this.computeNewDisplay();

        if ((this.ros.rsFlags & CRSpr.RSFLAG_HIDDEN) != 0) {
            return false;
        }

        return true;
    },

    txtSetString: function (s) {
        this.rsTextBuffer = s;
        this.computeNewDisplay();
    },

    callComputeNewDisplay: function () {
        if (!this.computed) {
            this.computeNewDisplay();
        }
    },

    onGraphicFontChange: function () {
        this.computeNewDisplay();
    },

    computeNewDisplay: function () {
        this.computed = true;

        var app = this.hoAdRunHeader.rhApp;
        var txt = this.hoCommon.ocObject;

        this.hoImgXSpot = 0;
        this.hoImgYSpot = 0;

        //get the text
        var s;
        if (this.rsMini >= 0) {
            s = txt.otTexts[this.rsMini].tsText;
        } else {
            s = this.rsTextBuffer;
            if (s == null) {
                s = "";
            }
        }

        //create text buffer
        if (this.textContainer == null) {
            this.textContainer = app.createTextContainer();
        }

        //convert flags
        var flags = this.textContainer.convertFlags(txt.otTexts[0].tsFlags) | CRendererTextContainer.WORDWRAP;

        //update textbuffer
        this.textContainer.set(s, this.font, this.rsTextColor, flags, this.hoImgWidth, this.hoImgHeight);

        //update height, only if vertical aligment is top
        var ht = this.textContainer.measureHeight();
        if (ht != 0 && (flags & (CRendererTextContainer.BOTTOM | CRendererTextContainer.MIDDLE)) == 0)
            this.hoImgHeight = ht + 2;  // 2 = safety margin as sometimes the last pixels are truncated (can't find simple better fix for this)
    },

    setTransparency: function (t) {
        this.ros.rsEffect = CRSpr.BOP_BLEND;
        this.ros.rsEffectParam = t;
    },

    draw: function (context, xx, yy) {

        if (!this.bShown || !this.computed) {
            return;
        }

        this.textContainer.draw(context, xx + this.hoX - this.hoAdRunHeader.rhWindowX + this.pLayer.x, yy + this.hoY - this.hoAdRunHeader.rhWindowY + this.pLayer.y, this.ros.rsEffect, this.ros.rsEffectParam, this);

    }
};

//setup inheritance using extend
CServices.extend(CObject, CText);