// CCounter
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

CCounter.CPTDISPFLAG_INTNDIGITS = 0x000F;
CCounter.CPTDISPFLAG_FLOATNDIGITS = 0x00F0;
CCounter.CPTDISPFLAG_FLOATNDIGITS_SHIFT = 4
CCounter.CPTDISPFLAG_FLOATNDECIMALS = 0xF000;
CCounter.CPTDISPFLAG_FLOATNDECIMALS_SHIFT = 12;
CCounter.CPTDISPFLAG_FLOAT_FORMAT = 0x0200;
CCounter.CPTDISPFLAG_FLOAT_USENDECIMALS = 0x0400;
CCounter.CPTDISPFLAG_FLOAT_PADD = 0x0800;

function CCounter() {
    //call chain
    CObject.call(this);

    //call self

    this.type = 0;
    this.rsValue = 0;
    this.rsMini = 0;
    this.rsMaxi = 0;
    this.rsBoxCx = 0;
    this.rsBoxCy = 0;
    this.bShown = false;
    this.bQuickDisplay = false;
    this.rsColor1 = 0;
    this.rsColor2 = 0
    this.rsOldFrame = 0;
    this.nIndex = 0;
    this.displayFlags = 0;
    this.bDeleted = false;
    this.bFloat = false;
    this.pLayer = null;
    this.fontHeight = 0;
    this.font = null;
    this.computed = false;
    this.textContainer = null;
}

CCounter.prototype = {
    init: function (ocPtr, cob) {
        this.rsFont = -1;
        this.rsColor1 = 0;
        this.rsColor2 = 0;
        this.hoImgWidth = this.hoImgHeight = 1;

        if (this.hoCommon.ocCounters == null) {
            this.hoImgWidth = this.rsBoxCx = 1;
            this.hoImgHeight = this.rsBoxCy = 1;
        } else {
            var ctPtr = this.hoCommon.ocCounters;
            this.hoImgWidth = this.rsBoxCx = ctPtr.odCx;
            this.hoImgHeight = this.rsBoxCy = ctPtr.odCy;
            this.displayFlags = ctPtr.odDisplayFlags;
            this.type = ctPtr.odDisplayType;

            //what type of display this counter have?
            switch (this.type) {
                case 5:
                    //renderes text
                    var nFont = this.rsFont;
                    if (nFont == -1) {
                        nFont = ctPtr.odFont;
                    }
                    this.font = this.hoAdRunHeader.rhApp.fontBank.getFontFromHandle(nFont);
                    this.fontHeight = this.font.getHeight();
                    this.rsColor1 = ctPtr.ocColor1;


                    break;
                case 2:
                case 3:
                    this.rsColor1 = ctPtr.ocColor1;
                    this.rsColor2 = ctPtr.ocColor2;
                    break;
                case 1:
                    break;
                case 4:
                    break;
            }
        }

        var cPtr = this.hoCommon.ocObject;
        this.rsMini = cPtr.ctMini;
        this.rsMaxi = cPtr.ctMaxi;
        this.rsValue = cPtr.ctInit;
        this.bFloat = false;
    },

    kill: function () {
        if (this.textContainer != null) {
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
        var adCta = this.hoCommon.ocCounters;
        if (this.type == 5) {
            var nFont = rsFont;
            if (nFont == -1) {
                nFont = adCta.odFont;
            }
            return this.hoAdRunHeader.rhApp.fontBank.getFontInfoFromHandle(nFont);
        }
        return null;
    },

    setFont: function (font, size) {
        if (this.type == 5) {
            this.rsFont = this.hoAdRunHeader.rhApp.fontBank.addFont(font);
            this.font = this.hoAdRunHeader.rhApp.fontBank.getFontFromHandle(this.rsFont);
            this.fontHeight = this.font.getHeight();
            if (size != null) {
                this.hoImgWidth = this.rsBoxCx = size.right - size.left;
                this.hoImgHeight = this.rsBoxCy = size.bottom - size.top;
            }
            this.computeNewDisplay();
        }
    },

    getFontColor: function () {
        return this.rsColor1;
    },

    setFontColor: function (rgb) {
        this.rsColor1 = rgb;
        this.computeNewDisplay();
    },

    cpt_ToFloat: function (pValue) {
        if (this.bFloat == false) {
            if (CServices.isInt(pValue)) {
                return;
            }
            this.bFloat = true;
        }
    },

    cpt_Change: function (pValue) {
        if (this.bFloat == false) {
            var value = CServices.floatToInt(pValue);
            if (value < this.rsMini) {
                value = this.rsMini;
            }
            if (value > this.rsMaxi) {
                value = this.rsMaxi;
            }
            if (value != Math.round(this.rsValue)) {
                this.rsValue = value;
                this.roc.rcChanged = true;
                this.computeNewDisplay();
            }
        }
        else {
            if (pValue < this.rsMini) {
                pValue = this.rsMini;
            }
            if (pValue > this.rsMaxi) {
                pValue = this.rsMaxi;
            }
            if (pValue != this.rsValue) {
                this.rsValue = pValue;
                this.roc.rcChanged = true;
                this.computeNewDisplay();
            }
        }
    },

    cpt_Add: function (pValue) {
        this.cpt_ToFloat(pValue);
        this.cpt_Change(this.rsValue + pValue);
    },

    cpt_Sub: function (pValue) {
        this.cpt_ToFloat(pValue);
        this.cpt_Change(this.rsValue - pValue);
    },

    cpt_SetMin: function (value) {
        this.rsMini = value;
        this.cpt_Change(this.rsValue);
    },

    cpt_SetMax: function (value) {
        this.rsMaxi = value;
        this.cpt_Change(this.rsValue);
    },

    cpt_SetColor1: function (rgb) {
        this.rsColor1 = rgb;
        this.computeNewDisplay();
    },

    cpt_SetColor2: function (rgb) {
        this.rsColor2 = rgb;
        this.computeNewDisplay();
    },

    cpt_GetValue: function () {
        return this.rsValue;
    },

    cpt_GetMin: function () {
        return this.rsMini;
    },

    cpt_GetMax: function () {
        return this.rsMaxi;
    },

    cpt_GetColor1: function () {
        return this.rsColor1;
    },

    cpt_GetColor2: function () {
        return this.rsColor2;
    },

    addOwnerDrawSceneNode: function (xx, yy, layer, quickDisplay, show) {
        if (this.hoCommon.ocCounters == null || this.parent != null) {
            return;
        }

        this.bQuickDisplay = quickDisplay;
        this.bShown = show;
        this.pLayer = this.hoAdRunHeader.rhFrame.layers[layer];

        //what layer node?
        if (this.bQuickDisplay) {
            this.pLayer.planeQuickDisplay.addChild(this);
        } else {
            this.pLayer.planeSprites.addChild(this);
        }

        if (this.type != 5) {
            this.computeNewDisplay();
        }
    },

    removeSceneNode: function () {
        if (this.hoCommon.ocCounters == null || this.parent == null) {
            return;
        }

        this.removeFromParent();
    },

    showSprite: function () {
        if (this.hoCommon.ocCounters == null) {
            return;
        }

        if (this.bShown == false) {
            this.bShown = true;
            this.computeNewDisplay();
        }
    },

    hideSprite: function () {
        if (this.hoCommon.ocCounters == null) {
            return;
        }

        if (this.bShown == true) {
            this.bShown = false;
        }
    },

    callComputeNewDisplay: function () {
        if (!this.computed) {
            this.computeNewDisplay();
        }
    },

    onGraphicFontChange: function () {
        if (this.type == 5) {
            this.computeNewDisplay();
        }
    },

    computeNewDisplay: function () {
        var app = this.hoAdRunHeader.rhApp;
        var adCta = this.hoCommon.ocCounters;

        switch (this.type) {
            case 1:
            case 1:
                if (this.bFloat == false) {
                    s = CServices.intToString(this.rsValue, this.displayFlags);
                } else {
                    s = CServices.doubleToString(this.rsValue, this.displayFlags);
                }

                var i;
                var c;
                var img;
                var ifo;
                var dx = 0, dy = 0;

                for (i = s.length - 1; i >= 0; i--) {
                    c = s.charCodeAt(i);
                    img = 0;
                    if (c == 45) {
                        img = adCta.frames[10];
                    } else if (c == 46) {
                        img = adCta.frames[12];
                    } else if (c == 43) {
                        img = adCta.frames[11];
                    } else if (c == 101 || c == 69) {
                        img = adCta.frames[13];
                    } else if (c >= 48 && c <= 57) {
                        img = adCta.frames[c - 48];
                        if (img >= 0) {
                            ifo = this.hoAdRunHeader.rhApp.imageBank.getImageFromHandle(img);
                            if (ifo != null) {
                                dx += ifo.width;
                                dy = Math.max(dy, ifo.height);
                            }
                            else {
                                toto = 2;
                            }
                        }
                    }
                }

                this.hoImgXSpot = dx;
                this.hoImgYSpot = dy;
                this.hoImgWidth = dx;
                this.hoImgHeight = dy;
                break;

            case 2:
            case 3:
                var nbl = this.rsBoxCx;
                if (adCta.odDisplayType == CDefCounters.CTA_VBAR) {
                    nbl = this.rsBoxCy;
                }
                if (this.rsMaxi <= this.rsMini) {
                    this.rsOldFrame = 0;
                } else {
                    this.rsOldFrame = (((this.rsValue - this.rsMini) * nbl) / (this.rsMaxi - this.rsMini));
                }
                if (adCta.odDisplayType == CDefCounters.CTA_HBAR) {
                    this.hoImgYSpot = 0;
                    this.hoImgHeight = this.rsBoxCy;
                    this.hoImgWidth = this.rsOldFrame;
                    if ((adCta.odDisplayFlags & CDefCounters.BARFLAG_INVERSE) != 0) {
                        this.hoImgXSpot = this.rsOldFrame - this.rsBoxCx;
                    } else {
                        this.hoImgXSpot = 0;
                    }
                } else {
                    this.hoImgXSpot = 0;
                    this.hoImgWidth = this.rsBoxCx;
                    this.hoImgHeight = this.rsOldFrame;
                    if ((adCta.odDisplayFlags & CDefCounters.BARFLAG_INVERSE) != 0) {
                        this.hoImgYSpot = this.rsOldFrame - this.rsBoxCy;
                    } else {
                        this.hoImgYSpot = 0;
                    }
                }
                break;

            case 4:
                if (this.rsMaxi <= this.rsMini) {
                    this.rsOldFrame = 0;
                } else {
                    this.rsOldFrame = Math.floor(((this.rsValue - this.rsMini) * adCta.nFrames) / (this.rsMaxi - this.rsMini));
                }
                this.rsOldFrame = Math.min(this.rsOldFrame, adCta.nFrames - 1);
                var image = app.imageBank.getImageFromHandle(adCta.frames[Math.max(this.rsOldFrame, 0)]);
                this.hoImgWidth = image.width;
                this.hoImgHeight = image.height;
                this.hoImgXSpot = image.xSpot;
                this.hoImgYSpot = image.ySpot;
                break;

            case 5:
                //do text conversion
                var text;
                if (this.bFloat == false) {
                    text = CServices.intToString(this.rsValue, this.displayFlags);
                } else {
                    text = CServices.doubleToString(this.rsValue, this.displayFlags);
                }

                //create/update the text buffer
                if (this.textContainer == null) {
                    this.textContainer = app.createTextContainer();
                }

                //get size of the text
                var textWidth = this.textContainer.getTextWidth(text, this.font);

                //update hotspot and dimensions of object
                this.hoImgXSpot = textWidth;
                this.hoImgYSpot = this.rsBoxCy / 2 + this.fontHeight / 2;
                this.hoImgWidth = textWidth;
                this.hoImgHeight = this.fontHeight;

                this.textContainer.set(text, this.font, this.rsColor1, CRendererTextContainer.LEFT | CRendererTextContainer.TOP, this.hoImgWidth, this.hoImgHeight)

                break;
        }
        this.computed = true;
    },

    draw: function (context, xx, yy) {

        if (!this.bShown || !this.computed) {
            return;
        }


        var image;
        var color1, color2;
        var s;

        //figure out starting position
        var x = xx + this.hoX - this.hoImgXSpot - this.hoAdRunHeader.rhWindowX + this.pLayer.x;
        var y = yy + this.hoY - this.hoImgYSpot - this.hoAdRunHeader.rhWindowY + this.pLayer.y;

        var adCta = this.hoCommon.ocCounters;
        switch (this.type) {
            case 1:
                //image based counter

                //convert number to string
                if (this.bFloat == false) {
                    s = CServices.intToString(this.rsValue, this.displayFlags);
                } else {

                    s = CServices.doubleToString(this.rsValue, this.displayFlags);
                }

                //iterate over characters
                var imageBank = this.hoAdRunHeader.rhApp.imageBank;
                var i, img, ifo;

                for (i = 0; i < s.length; i++) {
                    //get the char
                    var c = s.charCodeAt(i);

                    //convert char to image based on ascii values
                    img = 0;
                    if (c == 45) {
                        img = adCta.frames[10];
                    } else if (c == 46 || c == 44) {
                        img = adCta.frames[12];
                    } else if (c == 43) {
                        img = adCta.frames[11];
                    } else if (c == 69 || c == 101) {
                        img = adCta.frames[13];
                    } else if (c >= 48 && c <= 57) {
                        img = adCta.frames[c - 48];
                    }

                    //locate the correct image
                    ifo = imageBank.getImageFromHandle(img);
                    if (ifo != null) {
                        context.renderImage(ifo, x + ifo.xSpot, y + ifo.ySpot, 0, 1.0, 1.0, this.ros.rsEffect, this.ros.rsEffectParam, null);
                        x += ifo.width;
                    }
                }
                break;

            case 2:
            case 3:
                var color1 = this.rsColor1;
                var color2 = this.rsColor2;
                var cx = this.hoImgWidth;
                var cy = this.hoImgHeight;

                switch (adCta.ocFillType) {
                    case 1:
                        context.renderFilledRect(x, y, cx, cy, color1, this.ros.rsEffect, this.ros.rsEffectParam);
                        break;
                    case 2:
                        if ((adCta.odDisplayFlags & CDefCounters.BARFLAG_INVERSE) != 0) {
                            dl = color1;
                            color1 = color2;
                            color2 = dl;
                        }
                        var bVertical = adCta.ocGradientFlags != 0;
                        context.renderGradientRect(x, y, cx, cy, color1, color2, bVertical, this.ros.rsEffect, this.ros.rsEffectParam);
                        break;
                }
                break;

            case 4:
                var imageBank = this.hoAdRunHeader.rhApp.imageBank;
                image = imageBank.getImageFromHandle(adCta.frames[Math.max(this.rsOldFrame, 0)]);
                context.renderImage(image, x + image.xSpot, y + image.ySpot, 0, 1.0, 1.0, this.ros.rsEffect, this.ros.rsEffectParam, null);
                break;

            case 5:
                //text counter
                if (this.textContainer) {
                    this.textContainer.draw(context, x, y, this.ros.rsEffect, this.ros.rsEffectParam)
                }
                break;
        }

    },

    setTransparency: function (t) {
        this.ros.rsEffect = CRSpr.BOP_BLEND;
        this.ros.rsEffectParam = t;
    }
};

//setup inheritance using extend
CServices.extend(CObject, CCounter);