// CCCA
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

CCCA.CCAF_SHARE_GLOBALVALUES = 0x00000001;
CCCA.CCAF_SHARE_LIVES = 0x00000002;
CCCA.CCAF_SHARE_SCORES = 0x00000004;
CCCA.CCAF_SHARE_WINATTRIB = 0x00000008;
CCCA.CCAF_STRETCH = 0x00000010;
CCCA.CCAF_POPUP = 0x00000020;
CCCA.CCAF_CAPTION = 0x00000040;
CCCA.CCAF_TOOLCAPTION = 0x00000080;
CCCA.CCAF_BORDER = 0x00000100;
CCCA.CCAF_WINRESIZE = 0x00000200;
CCCA.CCAF_SYSMENU = 0x00000400;
CCCA.CCAF_DISABLECLOSE = 0x00000800;
CCCA.CCAF_MODAL = 0x00001000;
CCCA.CCAF_DIALOGFRAME = 0x00002000;
CCCA.CCAF_INTERNAL = 0x00004000;
CCCA.CCAF_HIDEONCLOSE = 0x00008000;
CCCA.CCAF_CUSTOMSIZE = 0x00010000;
CCCA.CCAF_INTERNALABOUTBOX = 0x00020000;
CCCA.CCAF_CLIPSIBLINGS = 0x00040000;
CCCA.CCAF_SHARE_PLAYERCTRLS = 0x00080000;
CCCA.CCAF_MDICHILD = 0x00100000;
CCCA.CCAF_DOCKED = 0x00200000;
CCCA.CCAF_DOCKING_AREA = 0x00C00000;
CCCA.CCAF_DOCKED_LEFT = 0x00000000;
CCCA.CCAF_DOCKED_TOP = 0x00400000;
CCCA.CCAF_DOCKED_RIGHT = 0x00800000;
CCCA.CCAF_DOCKED_BOTTOM = 0x00C00000;
CCCA.CCAF_REOPEN = 0x01000000;
CCCA.CCAF_MDIRUNEVENIFNOTACTIVE = 0x02000000;

function CCCA() {
    //call chain
    CObject.call(this);

    //call self


    this.flags = 0;
    this.odOptions = 0;
    this.appSprite = null;
    this.subApp = null;
    this.oldX = 0;
    this.oldY = 0;
    this.level = -1;
    this.oldLevel = -1;
    this.layer = null;
    this.bVisible = true;
}

CCCA.prototype = {
    startCCA: function (ocPtr, bInit, nStartFrame) {
        var app = this.hoAdRunHeader.rhApp;
        var defCCA = ocPtr.ocObject;

        this.hoImgWidth = defCCA.odCx;
        this.hoImgHeight = defCCA.odCy;
        this.odOptions = defCCA.odOptions;

        //does the sub-app stretch to fill its size? (this isnt actually used anywhere though...)
        if ((this.odOptions & CCCA.CCAF_STRETCH) != 0) {
            this.odOptions |= CCCA.CCAF_CUSTOMSIZE;
        }

        //get teh start frame
        if (nStartFrame == -1) {
            nStartFrame = 0;
            if ((this.odOptions & CCCA.CCAF_INTERNAL) != 0) {
                nStartFrame = defCCA.odNStartFrame;
            }
        }

        // Change l'extension
        if (defCCA.odName == null || defCCA.odName.length != 0) {
            return;
        }
        if ((this.odOptions & CCCA.CCAF_INTERNAL) == 0) {
            return;
        }
        if (nStartFrame >= app.gaNbFrames) {
            return;
        }
        if (nStartFrame == app.currentFrame) {
            return;
        }

        if ((ocPtr.ocFlags2 & CObjectCommon.OCFLAGS2_VISIBLEATSTART) != 0) {
            this.bVisible = true;
        } else {
            this.bVisible = false;
        }

        //create app sprite for the sub app.
        this.appSprite = new CSceneNode();

        //this.hoX / Y are always in the parent coordinate system. They ignore coordinate system any more then 1 level of nested sub apps.
        this.appSprite.x = this.hoX - this.hoAdRunHeader.rhWindowX;//rhWindowX should be 0
        this.appSprite.y = this.hoY - this.hoAdRunHeader.rhWindowY;//rhWindowY should be 0
        app.mainSprite.addChild(this);
        this.oldX = this.hoX;
        this.oldY = this.hoY;

        //create the sub-app Application object
        var subApp = Runtime.createApp();
        this.subApp = subApp;
        subApp.onInit(true);
        subApp.onSetupFile(app.file, app.path);
        subApp.onSetupElements(app.root, app.canvas, app.container);

        //scale always 1 to 1
        subApp.scaleX = 1.0;
        subApp.scaleY = 1.0;
        this.appSprite.scaleX = 1.0;
        this.appSprite.scaleY = 1.0;

        //set the parent link (this also called onUpdateLayout())
        subApp.onSetupParentApp(app, nStartFrame, this.odOptions, this.appSprite, this.hoImgWidth, this.hoImgHeight);

        //prepare app
        subApp.digest();

        //override the view mode?
        subApp.viewMode = (this.odOptions & CCCA.CCAF_STRETCH) != 0 ? CRunApp.DISPLAY_STRETCHTOFILL : CRunApp.DISPLAY_TOP_LEFT;

        //Register itself as the modal subapp
        if ((this.odOptions & CCCA.CCAF_MODAL) != 0) {
            if (app.modalSubappObject == null) {
                app.modalSubappObject = this;
                app.run.pause();
            }
        }

        //start app
        subApp.startApplication();
        subApp.updateApplication();

        //add it to list of sub apps in parent
        app.subApps.push(subApp);
    },

    autoResize: function () {
        //need to resize teh sub app
        if (this.subApp) {
            this.subApp.resizeApplication();
        }
    },

    init: function (ocPtr, cob) {
        this.startCCA(ocPtr, true, -1);
    },

    handle: function () {
        this.rom.move();

        if (this.subApp != null) {
            //anything changed?

            //check if the position has changed
            if (this.oldX != this.hoX || this.oldY != this.hoY) {
                //it has so we need to update the layout
                this.appSprite.x = this.hoX - this.hoAdRunHeader.rhWindowX;
                this.appSprite.y = this.hoY - this.hoAdRunHeader.rhWindowY;
                this.oldX = this.hoX;
                this.oldY = this.hoY;

                //update layout (this also updates mouse offset)
                this.subApp.updateLayout();
            }

            //update the sub application runtime
            if (this.subApp.updateApplication() == false) {
                this.destroyObject();
                if ((this.odOptions & CCCA.CCAF_MODAL) != 0 && this.subApp.parentApp != null) {
                    if (this.subApp.parentApp.modalSubappObject == this) {
                        this.subApp.parentApp.modalSubappObject = null;
                        this.subApp.parentApp.run.resume();
                    }
                }
                this.subApp = null;
                return;
            }

            this.oldLevel = this.level;
            this.level = this.subApp.currentFrame;
        }
    },

    draw: function (context, xx, yy) {

        //dont bother drawing if not visible
        if (this.bVisible && this.subApp != null) {
            if (xx != 0.0 || yy != 0.0) {
                //need to change matrix
                this.subApp.renderer.pushMatrix();
                this.subApp.renderer.translateMatrix(xx, yy);
                this.subApp.drawSubApplication(context);
                this.subApp.renderer.popMatrix();
            } else {
                //dont need to change matrix
                this.subApp.drawSubApplication(context);
            }
        }

    },

    kill: function (bFast) {
        if (this.subApp != null) {
            switch (this.subApp.appRunningState) {
                case CRunApp.SL_FRAMELOOPFIRST:        // SL_FRAMELOOP:
                case CRunApp.SL_FRAMELOOP:
                    this.subApp.endFrame();
                    break;
            }
            this.destroyObject();
            this.subApp.endApplication();
            if ((this.odOptions & CCCA.CCAF_MODAL) != 0 && this.subApp.parentApp != null) {
                if (this.subApp.parentApp.modalSubappObject == this) {
                    this.subApp.parentApp.modalSubappObject = null;
                    this.subApp.parentApp.run.resume();
                }
            }
            this.subApp = null;
        }
    },

    destroyObject: function () {
        var n;
        for (n = 0; n < this.hoAdRunHeader.rhApp.subApps.length; n++) {
            if (this.hoAdRunHeader.rhApp.subApps[n] == this.subApp) {
                this.hoAdRunHeader.rhApp.subApps.splice(n, 1);
                break;
            }
        }

        this.appSprite.removeFromParent();
    },

    restartApp: function () {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                this.subApp.run.rhQuit = CRun.LOOPEXIT_NEWGAME;
                return;
            }
            this.kill(true);
        }
        this.startCCA(this.hoCommon, false, -1);
    },

    endApp: function () {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                this.subApp.run.rhQuit = CRun.LOOPEXIT_ENDGAME;
            }
            if ((this.odOptions & CCCA.CCAF_MODAL) != 0 && this.subApp.parentApp != null) {
                if (this.subApp.parentApp.modalSubappObject == this) {
                    this.subApp.parentApp.modalSubappObject = null;
                    this.subApp.parentApp.run.resume();
                }
            }
        }
    },

    hide: function () {
        this.bVisible = false;
    },

    show: function () {
        this.bVisible = true;
    },

    jumpFrame: function (frame) {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                if (frame >= 0 && frame < 4096) {
                    this.subApp.run.rhQuit = CRun.LOOPEXIT_GOTOLEVEL;
                    this.subApp.run.rhQuitParam = 0x8000 | frame;
                }
            }
        }
    },

    nextFrame: function () {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                this.subApp.run.rhQuit = CRun.LOOPEXIT_NEXTLEVEL;
            }
        }
    },

    previousFrame: function () {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                this.subApp.run.rhQuit = CRun.LOOPEXIT_PREVLEVEL;
            }
        }
    },

    restartFrame: function () {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                this.subApp.run.rhQuit = CRun.LOOPEXIT_RESTART;
            }
        }
    },

    pause: function () {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                this.subApp.run.pause();
            }
        }
    },

    resume: function () {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                this.subApp.run.resume();
            }
        }
    },

    setGlobalValue: function (number, value) {
        if (this.subApp != null) {
            this.subApp.setGlobalValueAt(number, value);
        }
    },

    setGlobalString: function (number, value) {
        if (this.subApp != null) {
            this.subApp.setGlobalStringAt(number, value);
        }
    },

    isPaused: function () {
        if (this.subApp != null) {
            if (this.subApp.run != null) {
                return this.subApp.run.rh2PauseCompteur != 0;
            }
        }
        return false;
    },

    appFinished: function () {
        return this.subApp == null;
    },

    isVisible: function () {
        return this.bVisible;
    },

    frameChanged: function () {
        return this.level != this.oldLevel;
    },

    getGlobalString: function (num) {
        if (this.subApp != null) {
            return this.subApp.getGlobalStringAt(num);
        }
        return "";
    },

    getGlobalValue: function (num) {
        if (this.subApp != null) {
            return this.subApp.getGlobalValueAt(num);
        }
        return 0;
    },

    getFrameNumber: function () {
        return this.level + 1;
    },

    bringToFront: function () {
        if (this.subApp != null) {
            if (this.bVisible) {
                hoAdRunHeader.rhApp.planeControls.removeChild(this);
                hoAdRunHeader.rhApp.planeControls.addChild(this);
            }
        }
    },

    //dimensions internal api (needs to be handled so we update teh sub app to be rendered correctly
    setWidth: function (width) {
        //call chain
        CObject.prototype.setWidth(width);

        //call self
        this.subApp.containerWidth = width;
        this.subApp.resizeApplication();
    },

    setHeight: function (height) {
        //call chain
        CObject.prototype.setHeight(height);

        //call self
        this.subApp.containerHeight = height;
        this.subApp.resizeApplication();
    },

};

//setup inheritance using extend
CServices.extend(CObject, CCCA);