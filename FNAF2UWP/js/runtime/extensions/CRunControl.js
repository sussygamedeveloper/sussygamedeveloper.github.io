// CRunControl object
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

function CRunControl() {
    //call chain
    CRunExtension.call(this);

    //call self
    this.element = null;
    this.controlIgnoreHeight = false;
    this.bnShownOld = false;
}

CRunControl.prototype = {
    forcePosition: function () {
        this.setPosition(this.ho.hoX, this.ho.hoY);
    },

    autoResize: function () {
        this.setPosition(this.ho.hoX, this.ho.hoY);
        this.setSize(this.ho.hoImgWidth, this.ho.hoImgHeight);
    },

    setElement: function (e, visible) {
        var app = this.rh.rhApp;

        //update element
        this.element = e;
        e.style.position = 'absolute';
        this.setSize(this.ho.hoImgWidth, this.ho.hoImgHeight);
        this.setPosition(this.ho.hoX, this.ho.hoY);

        if (this.fontInfo) {
            this.setFont(this.fontInfo);
        }

        this.ho.bShown = visible;
        this.bShownOld = visible;
        if (app.loading) {
            e.style.visibility = 'hidden';
            this.bShownOld = false;
        } else {
            if (visible) {
                e.style.visibility = 'visible';
            } else {
                e.style.visibility = 'hidden';
            }
        }

        //attach to
        app.container.appendChild(e);
    },

    getXOffset: function () {
        return 0;
    },

    getYOffset: function () {
        return 0;
    },

    setX: function (x) {
        this.ctrlLastX = x;

        this.ho.setX(x);

        //update element
        if (this.element) {
            var app = this.rh.rhApp;
            this.element.style.left = (this.getXOffset() + this.ho.hoX * app.scaleX) + 'px';
        }
    },

    setY: function (y) {
        this.ctrlLastY = y;

        this.ho.setY(y);

        //update element
        if (this.element) {
            var app = this.rh.rhApp;
            this.element.style.top = (this.getYOffset() + this.ho.hoY * app.scaleY) + 'px';
        }
    },

    setPosition: function (x, y) {
        this.ctrlLastX = x;
        this.ctrlLastY = y;

        this.ho.setPosition(x, y);

        //update element
        if (this.element) {
            var app = this.rh.rhApp;
            this.element.style.left = this.getXOffset() + /*app.mouseOffsetX +*/ (this.ho.hoX - this.ho.hoAdRunHeader.rhWindowX) * app.scaleX + 'px';
            this.element.style.top = this.getYOffset() + /*app.mouseOffsetY +*/ (this.ho.hoY - this.ho.hoAdRunHeader.rhWindowY) * app.scaleY + 'px';
        }
    },

    setWidth: function (width) {
        this.ctrlLastWidth = width;

        this.ho.setWidth(width);

        //update element
        if (this.element) {
            this.element.style.width = this.ho.hoImgWidth * this.rh.rhApp.scaleX + 'px';
        }
    },

    setHeight: function (height) {
        this.ctrlLastHeight = height;

        this.ho.setHeight(height);

        //update element
        if (this.element && !this.controlIgnoreHeight) {
            this.element.style.height = this.ho.hoImgHeight * this.rh.rhApp.scaleY + 'px';
        }
    },

    setSize: function (width, height) {
        var element = this.element;
        var app = this.rh.rhApp;
        var ho = this.ho;

        this.ctrlLastWidth = width;
        this.ctrlLastHeight = height;

        this.ho.setSize(width, height);

        if (element) {
            element.style.width = (ho.hoImgWidth * app.scaleX) + 'px';

            //ignore height in certain circumstances (TODO: I dont understand why the inheirted class strucutre wasnt used in KcCombo.js instead...)
            if (!this.controlIgnoreHeight) {
                element.style.height = ho.hoImgHeight * app.scaleY + 'px';
            }
        }
    },

    setFont: function (fontInfo) {
        this.fontInfo = fontInfo;

        if (this.element) {
            this.element.style.font = fontInfo.getCSS();
        }
    },

    destroyRunObject: function () {
        if (this.element) {
            this.rh.rhApp.container.removeChild(this.element);
        }
    },

    getRunObjectFont: function () {
        return this.fontInfo;
    },

    setRunObjectFont: function (fontInfo, rc) {
        if (rc != null) {
            this.setSize(rc.right, rc.bottom);
        }
        this.setFont(fontInfo);
    },

    handleRunObject: function () {
        if (!this.rh.rhApp.loading && this.ho.bShown != this.bShownOld) {
            this.bShownOld = this.ho.bShown;

            if (this.element) {
                if (this.ho.bShown) {
                    this.element.style.visibility = 'visible';
                } else {
                    this.element.style.visibility = 'hidden';
                }
            }
        }

        if (this.ho.hoX != this.ctrlLastX || this.ho.hoY != this.ctrlLastY) {
            this.setPosition(this.ho.hoX, this.ho.hoY);
        }

        if (this.ho.hoImgWidth != this.ctrlLastWidth || this.ho.hoImgHeight != this.ctrlLastHeight) {
            this.setSize(this.ho.hoImgWidth, this.ho.hoImgHeight);
        }

        return 0;
    }
};

//setup inheritance using extend
CServices.extend(CRunExtension, CRunControl);