// CExtension
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

function CExtension(type, rhPtr) {
    //call chain
    CObject.call(this);

    //call self


    this.ext = rhPtr.rhApp.extLoader.loadRunObject(type);

    this.noHandle = false;
    this.privateData = 0;
    this.objectCount = 0;
    this.objectNumber = 0;
    this.bShown = true;
    this.nLayer = 0;
    this.pLayer = null;
}

CExtension.prototype = {
    init: function (ocPtr, cob) {
        this.ext.init(this);

        var file = this.hoAdRunHeader.rhApp.file.createFromFile(ocPtr.ocExtension);
        this.privateData = ocPtr.ocPrivate;
        this.ext.createRunObject(file, cob, ocPtr.ocVersion);
    },

    addSceneNode: function (xx, yy, image, layer, bShown) {
        this.nLayer = layer;
        this.pLayer = this.hoAdRunHeader.rhFrame.layers[layer];
        this.bShown = bShown;

        //TODO: this is a bit suspect...
        if (this.parent == null) {
            return;
        }

        this.pLayer.planeSprites.addChild(this);
    },

    addOwnerDrawSceneNode: function (xx, yy, layer, quickDisplay, show) {
        if (this.parent != null) {
            return;
        }

        this.nLayer = layer;
        this.pLayer = this.hoAdRunHeader.rhFrame.layers[layer];
        this.bShown = show;

        //which plane in the layer to add to
        if (quickDisplay) {
            this.pLayer.planeQuickDisplay.addChild(this);
        } else {
            this.pLayer.planeSprites.addChild(this);
        }
    },

    removeSceneNode: function () {
        var zOrder = this.zOrder;
        this.removeFromParent();
        return zOrder;
    },

    handle: function () {
        if ((this.hoOEFlags & 0x0200) != 0) {
            this.ros.handle();
        } else if ((this.hoOEFlags & 0x0030) == 0x0010 || (this.hoOEFlags & 0x0030) == 0x0030) {
            this.rom.move();
        } else if ((this.hoOEFlags & 0x0030) == 0x0020) {
            this.roa.animate();
        }

        var ret = 0;
        if (this.noHandle == false) {
            ret = this.ext.handleRunObject();
        }

        if ((ret & CRunExtension.REFLAG_ONESHOT) != 0) {
            this.noHandle = true;
        }
        if (this.roc != null) {
            if (this.roc.rcChanged) {
                ret |= CRunExtension.REFLAG_DISPLAY;
                this.roc.rcChanged = false;
            }
        }
    },

    autoResize: function () {
        this.ext.autoResize();
    },

    createFont: function () {
        this.ext.createFont();
    },

    draw: function (context, xDraw, yDraw) {
        if (this.bShown) {
            this.ext.displayRunObject(context, xDraw, yDraw);
        }
    },

    kill: function (bFast) {
        this.ext.destroyRunObject(bFast);
    },

    getCollisionMask: function (flags) {
        return this.ext.getRunObjectCollisionMask(flags);
    },

    condition: function (num, cnd) {
        return this.ext.condition(num, cnd);
    },

    action: function (num, act) {
        this.ext.action(num, act);
    },

    expression: function (num) {
        return this.ext.expression(num);
    },

    setTransparency: function (t) {
        this.ros.rsEffect = CRSpr.BOP_BLEND;
        this.ros.rsEffectParam = t;
    },

    setFocus: function (bFlag) {
        this.ext.setFocus(bFlag);
    },

    showSprite: function () {
        this.bShown = true;
    },

    hideSprite: function () {
        this.bShown = false;
    },

    pauseRunObject: function () {
        this.ext.pauseRunObject();
    },

    continueRunObject: function () {
        this.ext.continueRunObject();
    },

    forcePosition: function () {
        this.ext.forcePosition();
    },

    loadImageList: function (list) {
        //load the image list using the apps imagebank
        this.hoAdRunHeader.rhApp.imageBank.loadImageList(list);
    },

    getImage: function (handle) {
        return this.hoAdRunHeader.rhApp.imageBank.getImageFromHandle(handle);
    },

    getApplication: function () {
        return this.hoAdRunHeader.rhApp;
    },

    getX: function () {
        return this.hoX;
    },

    getY: function () {
        return this.hoY;
    },

    getWidth: function () {
        return this.hoImgWidth;
    },

    getHeight: function () {
        return this.hoImgHeight;
    },

    setX: function (x) {
        if (this.rom != null) {
            this.rom.rmMovement.setXPosition(x);
        } else {
            this.hoX = x;
            if (this.roc != null) {
                this.roc.rcChanged = true;
                this.roc.rcCheckCollides = true;
            }
        }
    },

    setY: function (y) {
        if (this.rom != null) {
            this.rom.rmMovement.setYPosition(y);
        } else {
            this.hoY = y;
            if (this.roc != null) {
                this.roc.rcChanged = true;
                this.roc.rcCheckCollides = true;
            }
        }
    },

    setWidth: function (width) {
        this.hoImgWidth = width;
    },

    setHeight: function (height) {
        this.hoImgHeight = height;
    },

    setSize: function (width, height) {
        this.hoImgWidth = width;
        this.hoImgHeight = height;
    },

    reHandle: function () {
        this.noHandle = false;
    },

    generateEvent: function (code, param) {
        if (this.hoAdRunHeader.rh2PauseCompteur == 0) {
            var p0 = this.hoAdRunHeader.rhEvtProg.rhCurParam0;
            this.hoAdRunHeader.rhEvtProg.rhCurParam0 = param;

            code = (-(code + CEventProgram.EVENTS_EXTBASE + 1) << 16);
            code |= (this.hoType & 0xFFFF);
            this.hoAdRunHeader.rhEvtProg.handle_Event(this, code);

            this.hoAdRunHeader.rhEvtProg.rhCurParam0 = p0;
        }
    },

    pushEvent: function (code, param) {
        if (this.hoAdRunHeader.rh2PauseCompteur == 0) {
            code = (-(code + CEventProgram.EVENTS_EXTBASE + 1) << 16);
            code |= (this.hoType & 0xFFFF);
            this.hoAdRunHeader.rhEvtProg.push_Event(1, code, param, this, this.hoOi);
        }
    },

    pause: function () {
        this.hoAdRunHeader.pause();
    },

    resume: function () {
        this.hoAdRunHeader.resume();
    },

    redraw: function () {
    },

    destroy: function () {
        this.hoAdRunHeader.addToDestroyList(this.hoNumber);
    },

    setPosition: function (x, y) {
        if (this.rom != null) {
            this.rom.rmMovement.setXPosition(x);
            this.rom.rmMovement.setYPosition(y);
        }
        else {
            this.hoX = x;
            this.hoY = y;
            if (this.roc != null) {
                this.roc.rcChanged = true;
                this.roc.rcCheckCollides = true;
            }
        }
    },

    getExtUserData: function () {
        return this.privateData;
    },

    setExtUserData: function (data) {
        this.privateData = data;
    },

    addBackdrop: function (img, x, y, typeObst, nLayer) {
        this.hoAdRunHeader.addBackdrop(img, x, y, nLayer, typeObst, true);
    },

    getEventCount: function () {
        return this.hoAdRunHeader.rh4EventCount;
    },

    getExpParam: function () {
        this.hoAdRunHeader.rh4CurToken++;
        return this.hoAdRunHeader.getExpression();
    },

    getEventParam: function () {
        return this.hoAdRunHeader.rhEvtProg.rhCurParam0;
    },

    callMovement: function (hoPtr, action, param) {
        if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) != 0) {
            if (hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
                var mvPtr = hoPtr.rom.rmMovement;
                return mvPtr.callMovement(action, param);
            }
        }
        return 0;
    },

    getFirstObject: function () {
        this.objectCount = 0;
        this.objectNumber = 0;
        return this.getNextObject();
    },

    getNextObject: function () {
        if (this.objectNumber < this.hoAdRunHeader.rhNObjects) {
            while (this.hoAdRunHeader.rhObjectList[this.objectCount] == null) {
                this.objectCount++;
            }
            var hoPtr = this.hoAdRunHeader.rhObjectList[this.objectCount];
            this.objectNumber++;
            this.objectCount++;
            return hoPtr;
        }
        return null;
    },

    getObjectFromFixed: function (fixed) {
        var count = 0;
        var number;
        for (number = 0; number < this.hoAdRunHeader.rhNObjects; number++) {
            while (this.hoAdRunHeader.rhObjectList[count] == null) {
                count++;
            }
            var hoPtr = this.hoAdRunHeader.rhObjectList[count];
            count++;
            var id = (hoPtr.hoCreationId << 16) | (hoPtr.hoNumber & 0xFFFF);
            if (id == fixed) {
                return hoPtr;
            }
        }
        return null;
    },

    findFirstObject: function (name) {
        return this.hoAdRunHeader.findFirstObject(name);
    },

    findNextObject: function (object) {
        return this.hoAdRunHeader.findNextObject(object);
    },

    openHFile: function (path) {
        return hoAdRunHeader.rhApp.openHFile(path);
    },

    closeHFile: function (path) {
        hoAdRunHeader.rhApp.closeHFile(path);
    }
};

//setup inheritance using extend
CServices.extend(CObject, CExtension);