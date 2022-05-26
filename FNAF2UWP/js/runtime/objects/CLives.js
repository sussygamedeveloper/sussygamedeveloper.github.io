// CLives
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

function CLives() {
    //call chain
    CObject.call(this);

    //call self


    this.rsPlayer = 0;
    this.rsValue = 0;
    this.rsBoxCx = 0;
    this.rsBoxCy = 0;
    this.rsFont = 0;
    this.rsColor1 = 0;
    this.type = 0;
    this.bShown = true;
    this.nLayer = 0;
    this.nIndex = 0;
    this.displayFlags = 0;
    this.pLayer = null;
    this.bAddedToFrame = false;
    this.fontHeight = 0;
    this.alpha = 1.0;
    this.composite = "source-over";
    this.computed = false;
    this.textContainer = null;
}

CLives.prototype = {
    init: function (ocPtr, cob) {
        this.rsFont = -1;
        this.rsColor1 = 0;
        this.hoImgWidth = this.hoImgHeight = 1;

        var adCta = this.hoCommon.ocCounters;
        this.hoImgWidth = this.rsBoxCx = adCta.odCx;
        this.hoImgHeight = this.rsBoxCy = adCta.odCy;
        this.type = adCta.odDisplayType;
        this.rsColor1 = adCta.ocColor1;
        this.rsPlayer = adCta.odPlayer;
        this.rsValue = this.hoAdRunHeader.rhApp.getLives()[this.rsPlayer - 1];
        this.displayFlags = adCta.odDisplayFlags;

        if (this.type == 5) {
            var nFont = this.rsFont;
            if (nFont == -1) {
                nFont = adCta.odFont;
            }
            this.font = this.hoAdRunHeader.rhApp.fontBank.getFontFromHandle(nFont);
            this.fontHeight = this.font.getHeight();
        }
    },

    kill: function () {
        if (this.textContainer != null) {
            this.textContainer.free();
            this.textContainer = null;
        }
    },

    handle: function () {
        var value = this.hoAdRunHeader.rhApp.getLives()[this.rsPlayer - 1];
        if (value != this.rsValue) {
            this.rsValue = value;
            this.computeNewDisplay();
        }
        this.ros.handle();
        if (this.roc.rcChanged) {
            this.roc.rcChanged = false;
        }
    },

    getFont: function () {
        var adCta = this.hoCommon.ocCounters;
        if (adCta.odDisplayType == 5) {
            var nFont = this.rsFont;
            if (nFont == -1) {
                nFont = adCta.odFont;
            }
            return this.hoAdRunHeader.rhApp.fontBank.getFontInfoFromHandle(nFont);
        }
        return null;
    },

    setFont: function (font, size) {
        if (type == 5) {
            this.rsFont = hoAdRunHeader.rhApp.fontBank.addFont(font);
            var font = this.hoAdRunHeader.rhApp.fontBank.getFontFromHandle(this.rsFont);
            this.fontHeight = font.getHeight();
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

    addOwnerDrawSceneNode: function (xx, yy, layer, quickDisplay, show) {
        if (this.hoCommon.ocCounters == null || this.parent != null) {
            return;
        }

        this.bShown = show;
        this.pLayer = this.hoAdRunHeader.rhFrame.layers[layer];

        if (quickDisplay) {
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

    setValue: function (value) {
        if (value != this.rsValue) {
            this.rsValue = value;
            this.computeNewDisplay();
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
        this.computed = true;
        this.hoImgWidth = this.hoImgHeight = 1;
        if (this.hoCommon.ocCounters == null) {
            return;
        }
        var adCta = this.hoCommon.ocCounters;

        switch (adCta.odDisplayType) {
            case 4:
                if (this.rsValue != 0) {
                    ifo = app.imageBank.getImageFromHandle(adCta.frames[0]);
                    var lg = this.rsValue * ifo.width;
                    if (lg <= this.rsBoxCx) {
                        this.hoImgWidth = lg;
                        this.hoImgHeight = ifo.height;
                    }
                    else {
                        this.hoImgWidth = this.rsBoxCx;
                        this.hoImgHeight = ((this.rsBoxCx / ifo.width) + this.rsValue - 1) * ifo.height;
                    }
                    break;
                }
                this.hoImgWidth = this.hoImgHeight = 1;
                break;
            case 1:
                var i;
                var c;
                var img;
                var ifo;
                var dx = 0, dy = 0;
                var s = CServices.intToString(this.rsValue, this.displayFlags);
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
                    }
                    if (img >= 0) {
                        ifo = app.imageBank.getImageFromHandle(img);
                        dx += ifo.width;
                        dy = Math.max(dy, ifo.height);
                    }
                }
                this.hoImgXSpot = dx;
                this.hoImgYSpot = dy;
                this.hoImgWidth = dx;
                this.hoImgHeight = dy;
                break;

            case 5:
                var s = CServices.intToString(this.rsValue, this.displayFlags);

                if (this.textContainer == null) {
                    this.textContainer = app.createTextContainer();
                }

                var w = this.textContainer.getTextWidth(s, this.font);

                this.hoImgXSpot = w;
                this.hoImgYSpot = this.rsBoxCy / 2 + this.fontHeight / 2;
                this.hoImgWidth = w;
                this.hoImgHeight = this.fontHeight;

                //update text buffer
                this.textContainer.set(s, this.font, this.rsColor1, CRendererTextContainer.LEFT | CRendererTextContainer.TOP, this.hoImgWidth, this.hoImgHeight);
                break;
        }
    },

    draw: function (context, xx, yy) {
        if (!this.bShown || !this.computed) {
            return;
        }

        this.globalAlpha = this.alpha;
        this.globalCompositeOperation = this.composite;

        var image;
        var color1, color2;
        var s;

        var adCta = this.hoCommon.ocCounters;
        var x = xx + this.hoX - this.hoImgXSpot - this.hoAdRunHeader.rhWindowX + this.pLayer.x;
        var y = yy + this.hoY - this.hoImgYSpot - this.hoAdRunHeader.rhWindowY + this.pLayer.y;

        switch (this.type) {
            case 1:
                var i, img, ifo;
                s = CServices.intToString(this.rsValue, this.displayFlags);
                for (i = 0; i < s.length; i++) {
                    var c = s.charCodeAt(i);
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
                    ifo = this.hoAdRunHeader.rhApp.imageBank.getImageFromHandle(img);
                    context.renderImage(ifo, x + ifo.xSpot, y + ifo.ySpot, 0, 1.0, 1.0, this.ros.rsEffect, this.ros.rsEffectParam, null);

                    x += ifo.width;
                }
                break;
            case 4:
                if (this.rsValue != 0) {
                    var x2 = x + this.hoImgWidth;
                    var y2 = y + this.hoImgHeight;
                    var x1 = x;
                    var y1 = y;
                    var vInt = this.rsValue;
                    var ifo = this.hoAdRunHeader.rhApp.imageBank.getImageFromHandle(adCta.frames[0]);
                    for (y = y1; y < y2 && vInt > 0; y += ifo.height) {
                        for (x = x1; x < x2 && vInt > 0; x += ifo.width, vInt -= 1) {
                            context.renderImage(ifo, x + ifo.xSpot, y + ifo.ySpot, 0, 1.0, 1.0, this.ros.rsEffect, this.ros.rsEffectParam, null);
                        }
                    }
                }
                break;
            case 5:
                this.textContainer.draw(context, x, y, this.ros.rsEffect, this.ros.rsEffectParam);
                break;
        }
    },
    setTransparency: function (t) {
        this.ros.rsEffect = CRSpr.BOP_BLEND;
        this.ros.rsEffectParam = t;
    }
};

//setup inheritance using extend
CServices.extend(CObject, CLives);