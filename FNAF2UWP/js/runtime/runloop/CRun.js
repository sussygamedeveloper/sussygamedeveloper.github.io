// CRun Object
// -----------------------------------------------------------------------
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

CRun.GAMEFLAGS_VBLINDEP = 0x0002;
CRun.GAMEFLAGS_LIMITEDSCROLL = 0x0004;
CRun.GAMEFLAGS_FIRSTLOOPFADEIN = 0x0010;
CRun.GAMEFLAGS_LOADONCALL = 0x0020;
CRun.GAMEFLAGS_REALGAME = 0x0040;
CRun.GAMEFLAGS_PLAY = 0x0080;
CRun.GAMEFLAGS_INITIALISING = 0x0200;
CRun.DLF_DONTUPDATE = 0x0002;
CRun.DLF_DRAWOBJECTS = 0x0004;
CRun.DLF_RESTARTLEVEL = 0x0008;
CRun.DLF_DONTUPDATECOLMASK = 0x0010;
CRun.DLF_COLMASKCLIPPED = 0x0020;
CRun.DLF_SKIPLAYER0 = 0x0040;
CRun.DLF_REDRAWLAYER = 0x0080;
CRun.DLF_STARTLEVEL = 0x0100;
CRun.GAME_XBORDER = 480;
CRun.GAME_YBORDER = 300;
CRun.COLMASK_XMARGIN = 64;
CRun.COLMASK_YMARGIN = 16;
CRun.WRAP_X = 1;
CRun.WRAP_Y = 2;
CRun.WRAP_XY = 4;
CRun.RH3SCROLLING_SCROLL = 0x0001;
CRun.RH3SCROLLING_REDRAWLAYERS = 0x0002;
CRun.RH3SCROLLING_REDRAWALL = 0x0004;
CRun.RH3SCROLLING_REDRAWTOTALCOLMASK = 0x0008;
CRun.OBSTACLE_NONE = 0;
CRun.OBSTACLE_SOLID = 1;
CRun.OBSTACLE_PLATFORM = 2;
CRun.OBSTACLE_LADDER = 3;
CRun.OBSTACLE_TRANSPARENT = 4;
CRun.COF_NOMOVEMENT = 0x0001;
CRun.COF_HIDDEN = 0x0002;
CRun.COF_FIRSTTEXT = 0x0004;
CRun.COF_CREATEDATSTART = 0x0008;
CRun.MAX_FRAMERATE = 10;
CRun.LOOPEXIT_NEXTLEVEL = 1;
CRun.LOOPEXIT_PREVLEVEL = 2;
CRun.LOOPEXIT_GOTOLEVEL = 3;
CRun.LOOPEXIT_NEWGAME = 4;
CRun.LOOPEXIT_PAUSEGAME = 5;
CRun.LOOPEXIT_SAVEAPPLICATION = 6;
CRun.LOOPEXIT_LOADAPPLICATION = 7;
CRun.LOOPEXIT_SAVEFRAME = 8;
CRun.LOOPEXIT_LOADFRAME = 9;
CRun.LOOPEXIT_ENDGAME = -2;
CRun.LOOPEXIT_QUIT = 100;
CRun.LOOPEXIT_RESTART = 101;
CRun.BORDER_LEFT = 1;
CRun.BORDER_RIGHT = 2;
CRun.BORDER_TOP = 4;
CRun.BORDER_BOTTOM = 8;
CRun.BORDER_ALL = 15;
CRun.MAX_INTERMEDIATERESULTS = 128;
CRun.INTBAD = 0x7FFFFFFF;
CRun.FANIDENTIFIER = 0x42324641;
CRun.TREADMILLIDENTIFIER = 0x4232544D;
CRun.PARTICULESIDENTIFIER = 0x42326AF3;
CRun.MAGNETIDENTIFIER = 0x42369856;
CRun.ROPEANDCHAINIDENTIFIER = 0x4232EFFA;
CRun.BASEIDENTIFIER = 0x42324547;

CRun.plMasks = [
    0x00, 0x00, 0x00, 0x00,
    0xFF, 0x00, 0x00, 0x00,
    0xFF, 0xFF, 0x00, 0x00,
    0xFF, 0xFF, 0xFF, 0x00,
    0xFF, 0xFF, 0xFF, 0xFF
];

CRun.Table_InOut = [
    0,
    CRun.BORDER_LEFT,
    CRun.BORDER_RIGHT,
    0,
    CRun.BORDER_TOP,
    CRun.BORDER_TOP + CRun.BORDER_LEFT,
    CRun.BORDER_TOP + CRun.BORDER_RIGHT,
    0,
    CRun.BORDER_BOTTOM,
    CRun.BORDER_BOTTOM + CRun.BORDER_LEFT,
    CRun.BORDER_BOTTOM + CRun.BORDER_RIGHT,
    0,
    0,
    0,
    0,
    0
];

CRun.bMoveChanged = false;

CRun.compareTo = function (pValue1, pValue2, comp) {
    switch (comp) {
        case 0:    // COMPARE_EQ:
            return pValue1 == pValue2;
        case 1:    // COMPARE_NE:
            return pValue1 != pValue2;
        case 2:    // COMPARE_LE:
            return pValue1 <= pValue2;
        case 3:    // COMPARE_LT:
            return pValue1 < pValue2;
        case 4:    // COMPARE_GE:
            return pValue1 >= pValue2;
        case 5:    // COMPARE_GT:
            return pValue1 > pValue2;
    }
    return false;
}

CRun.compareTer = function (value1, value2, comparaison) {
    switch (comparaison) {
        case 0:    // COMPARE_EQ:
            return (value1 == value2);
        case 1:    // COMPARE_NE:
            return (value1 != value2);
        case 2:    // COMPARE_LE:
            return (value1 <= value2);
        case 3:    // COMPARE_LT:
            return (value1 < value2);
        case 4:    // COMPARE_GE:
            return (value1 >= value2);
        case 5:    // COMPARE_GT:
            return (value1 > value2);
    }
    return false;
}

function CRun(app) {
    this.rhApp = app;
    this.rhFrame = null;
    this.rhMaxOI = 0;
    this.rhStopFlag = 0;
    this.rhEvFlag = 0;
    this.rhNPlayers = 0;
    this.rhGameFlags = 0;
    this.rhPlayer = 0;
    this.rhQuit = 0;
    this.rhQuitBis = 0;
    this.rhReturn = 0;
    this.rhQuitParam = 0;
    this.rhNObjects = 0;
    this.rhMaxObjects = 0;
    this.rhOiList = null;
    this.rhEvtProg = null;
    this.rhLevelSx = 0;
    this.rhLevelSy = 0;
    this.rhWindowX = 0;
    this.rhWindowY = 0;
    this.rhVBLDeltaOld = 0;
    this.rhVBLObjet = 0;
    this.rhVBLOld = 0;
    this.rhMT_VBLStep = 0;
    this.rhMT_VBLCount = 0;
    this.rhMT_MoveStep = 0;
    this.rhLoopCount = 0;
    this.rhTimer = 0;
    this.rhTimerOld = 0;
    this.rhTimerDelta = 0;
    this.rhOiListPtr = 0;
    this.rhObListNext = 0;
    this.rhDestroyPos = 0;
    this.rhMouseUsed = 0;
    this.rh2OldPlayer = null;
    this.rh2NewPlayer = null;
    this.rh2InputMask = null;
    this.rh2MouseKeys = 0;
    this.rh2CreationCount = 0;
    this.rh2MouseX = 0;
    this.rh2MouseY = 0;
    this.rh2MouseSaveX = 0;
    this.rh2MouseSaveY = 0;
    this.rh2PauseCompteur = 0;
    this.rh2PauseTimer = 0;
    this.rh2PauseVbl = 0;
    this.rh3DisplayX = 0;
    this.rh3DisplayY = 0;
    this.rh3WindowSx = 0;
    this.rh3WindowSy = 0;
    this.rh3CollisionCount = 0;
    this.rh3Scrolling = 0;
    this.rh3XMinimum = 0;
    this.rh3YMinimum = 0;
    this.rh3XMaximum = 0;
    this.rh3YMaximum = 0;
    this.rh3XMinimumKill = 0;
    this.rh3YMinimumKill = 0;
    this.rh3XMaximumKill = 0;
    this.rh3YMaximumKill = 0;
    this.rh3Graine = 0;
    this.rh4DemoMode = 0;
    //    this.rh4Demo=null;
    this.rh4PauseKey = 0;
    this.rh4PauseJoystickReady = 0;
    this.rh4CurrentFastLoop = null;
    this.rh4EndOfPause = 0;
    this.rh4MouseWheelDelta = 0;
    this.rh4OnMouseWheel = 0;
    this.rh4FastLoops = null;
    this.rh4ExpValue1 = 0;
    this.rh4ExpValue2 = 0;
    this.rh4KpxReturn = 0;
    this.rh4ObjectCurCreate = 0;
    this.rh4ObjectAddCreate = 0;
    this.rh4DoUpdate = 0;
    this.rh4VBLDelta = 0;
    this.rh4LoopTheoric = 0;
    this.rh4EventCount = 0;
    this.rh4BackDrawRoutines = null;
    this.rh4WindowDeltaX = 0;
    this.rh4WindowDeltaY = 0;
    this.rh4TimeOut = 0;
    this.rh4TabCounter = 0;
    this.rh4PosPile = 0;
    this.rh4Results = null;
    this.rh4Operators = null;
    this.rh4OpeNull = null;
    this.rh4CurToken = 0;
    this.rh4Tokens = null;
    this.rh4FrameRateArray = null;
    this.rh4FrameRatePos = 0;
    this.rh4FrameRatePrevious = 0;
    this.rhDestroyList = null;
    this.rh4SaveFrame = 0;
    this.rh4SaveFrameCount = 0;
    this.rh4MvtTimerCoef = 0;
    this.questionObjectOn = null;
    this.bOperande = false;
    this.rhWheelCount = 0;
    this.rhObjectList = null;
    this.currentTabObject = null;
    this.buttonClickCount = -1;
    this.isColArray = new Array(2);
    this.flagFloat = false;
    this.fadeTimerDelta = 0;
    this.rhJoystickMask = 0xFF;
    this.noResume = false;
    this.quitPause = false;
}

CRun.getObjectFont = function (hoPtr) {
    var info = null;

    if (hoPtr.hoType >= COI.KPX_BASE) {
        info = hoPtr.ext.getRunObjectFont();
    }
    else {
        info = hoPtr.getFont();
    }
    if (info == null) {
        info = new CFontInfo();
    }
    return info;
}
CRun.setObjectFont = function (hoPtr, pLf, pNewSize) {
    //pNewSize is not the size of teh font (bad param naming ¬_¬)
    if (hoPtr.hoType >= COI.KPX_BASE) {
        hoPtr.ext.setRunObjectFont(pLf, pNewSize);
    }
    else {
        hoPtr.setFont(pLf, pNewSize);
    }
}
CRun.getObjectTextColor = function (hoPtr) {
    if (hoPtr.hoType >= COI.KPX_BASE) {
        return hoPtr.ext.getRunObjectTextColor();
    }
    return hoPtr.getFontColor();
}
CRun.setObjectTextColor = function (hoPtr, rgb) {
    if (hoPtr.hoType >= COI.KPX_BASE) {
        hoPtr.ext.setRunObjectTextColor(rgb);
    }
    else {
        hoPtr.setFontColor(rgb);
    }
}
CRun.objectShow = function (pHo) {
    if (pHo.ros != null) {
        pHo.ros.obShow();
        pHo.ros.rsFlags |= CRSpr.RSFLAG_VISIBLE;
        pHo.ros.rsFlash = 0;
    }
}
CRun.objectHide = function (pHo) {
    if (pHo.ros != null) {
        pHo.ros.obHide();
        pHo.ros.rsFlags &= ~CRSpr.RSFLAG_VISIBLE;
        pHo.ros.rsFlash = 0;
    }
}
CRun.setXPosition = function (hoPtr, x) {
    if (hoPtr.rom != null) {
        hoPtr.rom.rmMovement.setXPosition(x);
    }
    else {
        if (hoPtr.hoX != x) {
            hoPtr.hoX = x;
            if (hoPtr.roc != null) {
                hoPtr.roc.rcChanged = true;
                hoPtr.roc.rcCheckCollides = true;
            }
        }
    }
}
CRun.setYPosition = function (hoPtr, y) {
    if (hoPtr.rom != null) {
        hoPtr.rom.rmMovement.setYPosition(y);
    }
    else {
        if (hoPtr.hoY != y) {
            hoPtr.hoY = y;
            if (hoPtr.roc != null) {
                hoPtr.roc.rcChanged = true;
                hoPtr.roc.rcCheckCollides = true;
            }
        }
    }
}
CRun.get_DirFromPente = function (x, y) {
    if (x == 0) {
        if (y >= 0) {
            return 24;
        }
        return 8;
    }
    if (y == 0) {
        if (x >= 0) {
            return 0;
        }
        return 16;
    }

    var dir;
    var flagX = false;
    var flagY = false;
    if (x < 0) {
        flagX = true;
        x = -x;
    }
    if (y < 0) {
        flagY = true;
        y = -y;
    }

    var d = (x * 256) / y;
    var index;
    for (index = 0; ; index += 2) {
        if (d >= CMove.CosSurSin32[index]) {
            break;
        }
    }
    dir = CMove.CosSurSin32[index + 1];

    if (flagY) {
        dir = -dir + 32;
        dir &= 31;
    }
    if (flagX) {
        dir -= 8;
        dir &= 31;
        dir = -dir;
        dir &= 31;
        dir += 8;
        dir &= 31;
    }
    return dir;
}

CRun.prototype = {
    setFrame: function (f) {
        this.rhFrame = f;
    },

    allocRunHeader: function () {
        this.rhObjectList = new Array(this.rhFrame.maxObjects);
        this.rhEvtProg = this.rhFrame.evtProg;

        this.rhMaxOI = 0;
        var oi;
        for (oi = this.rhApp.OIList.getFirstOI() ; oi != null; oi = this.rhApp.OIList.getNextOI()) {
            if (oi.oiType >= COI.OBJ_SPR) {
                this.rhMaxOI++;
            }
        }

        if (this.rhFrame.m_wRandomSeed == -1) {
            this.rh3Graine = this.rhApp.timer & 0xFFFF;
        }
        else {
            this.rh3Graine = this.rhFrame.m_wRandomSeed;
        }

        var no = Math.round(this.rhFrame.maxObjects / 32 + 1);
        this.rhDestroyList = new Array(no);

        this.rh4FastLoops = new CArrayList();
        this.rh4CurrentFastLoop = "";

        this.rhMaxObjects = this.rhFrame.maxObjects;

        this.rhNPlayers = this.rhEvtProg.nPlayers;
        this.rhFrame.leX = 0;
        this.rhFrame.leY = 0;
        this.rhWindowX = this.rhFrame.leX;
        this.rhWindowY = this.rhFrame.leY;
        this.rh4WindowDeltaX = 0;
        this.rh4WindowDeltaY = 0;
        this.rhLevelSx = this.rhFrame.leVirtualRect.right;
        if (this.rhLevelSx == -1) {
            this.rhLevelSx = 0x7FFFF000;
        }
        this.rhLevelSy = this.rhFrame.leVirtualRect.bottom;
        if (this.rhLevelSy == -1) {
            this.rhLevelSy = 0x7FFFF000;
        }
        this.rhNObjects = 0;
        this.rhStopFlag = 0;
        this.rhQuit = 0;
        this.rhQuitBis = 0;
        this.rhGameFlags &= (CRun.GAMEFLAGS_PLAY);
        this.rhGameFlags |= CRun.GAMEFLAGS_LIMITEDSCROLL;
        this.rh4FrameRatePos = 0;
        this.rh4FrameRatePrevious = 0;
        this.rh4FrameRateArray = new Array(CRun.MAX_FRAMERATE);
        this.rh4BackDrawRoutines = null;
        this.rh4SaveFrame = 0;
        this.rh4SaveFrameCount = -3;
        this.rhWheelCount = -1;
        this.rh4PosOnLoop = null;

        this.rhGameFlags |= CRun.GAMEFLAGS_REALGAME;

        this.rh4Results = new Array(CRun.MAX_INTERMEDIATERESULTS);
        this.rh4Operators = new Array(CRun.MAX_INTERMEDIATERESULTS);
        this.rh4OpeNull = new EXP_ZERO();
        this.rh4OpeNull.code = 0;

        this.rh2OldPlayer = new Array(4);
        this.rh2NewPlayer = new Array(4);
        this.rh2InputMask = new Array(4);
        this.rhPlayer = new Array(4);
        //        this.rhEvtProg.rh2CurrentClick = -1;
        this.rh4MvtTimerCoef = 0;

        var n;
        for (n = 0; n < CRun.MAX_FRAMERATE; n++) {
            this.rh4FrameRateArray[n] = 50;
        }
        this.quitPause = false;
        this.bodiesCreated = false;
        this.rhFrame.rhOK = true;
    },

    freeRunHeader: function () {
        this.rhFrame.rhOK = false;

        this.rhObjectList = null;
        this.rhOiList = null;
        this.rhDestroyList = null;
        this.rh4CurrentFastLoop = null;
        this.rh4FastLoops = null;
        this.rh4BackDrawRoutines = null;
        this.rh4PosOnLoop = null;

        var n;
        for (n = 0; n < CRun.MAX_INTERMEDIATERESULTS; n++) {
            this.rh4Results[n] = 0;
        }
        this.rh4OpeNull = null;
    },

    initRunLoop: function (transition) {
        this.allocRunHeader();

        //setup joystick
        this.rhApp.virtualJoystickType = CVirtualJoystick.TYPE_NONE;

        if (this.rhApp.parentApp == null) {
            //virtual mouse
            this.rhApp.createVirtualMouse();

            //virtual joystick, what type of joystick are we using?
            switch (this.rhFrame.virtualJoystickType) {
                case CVirtualJoystick.TYPE_TOUCH:
                    //build flags 
                    var flags = CVirtualJoystickTouch.JFLAG_JOYSTICK;

                    if ((this.rhFrame.html5Options & CRunFrame.IPHONEOPT_JOYSTICK_FIRE1) != 0) {
                        flags |= CVirtualJoystickTouch.JFLAG_FIRE1;
                    }

                    if ((this.rhFrame.html5Options & CRunFrame.IPHONEOPT_JOYSTICK_FIRE2) != 0) {
                        flags |= CVirtualJoystickTouch.JFLAG_FIRE2;
                    }

                    if ((this.rhFrame.html5Options & CRunFrame.IPHONEOPT_JOYSTICK_LEFTHAND) != 0) {
                        flags |= CVirtualJoystickTouch.JFLAG_LEFTHANDED;
                    }

                    //start touch
                    if ((flags & (CVirtualJoystickTouch.JFLAG_FIRE1 | CVirtualJoystickTouch.JFLAG_FIRE2 | CVirtualJoystickTouch.JFLAG_JOYSTICK)) != 0) {
                        this.rhApp.startVirtualJoystick(CVirtualJoystick.TYPE_TOUCH, flags);
                    }
                    break;

                case CVirtualJoystick.TYPE_ACCELEROMETER:
                    this.rhApp.startVirtualJoystick(CVirtualJoystick.TYPE_ACCELEROMETER, 0);
                    break;

                case CVirtualJoystick.TYPE_EXT:
                    this.rhApp.startVirtualJoystick(CVirtualJoystick.TYPE_EXT, 0);
                    break;
            }
        }
        this.rhJoystickMask = 0xFF;

        if (transition) {
            this.rhGameFlags |= CRun.GAMEFLAGS_FIRSTLOOPFADEIN;
        }

        this.initAsmLoop();

        this.resetFrameLayers(-1, false);

        this.prepareFrame();

        this.rhLoopCount = 0;
        this.createFrameObjects(transition);

        this.createBackdropInstances();
        this.hideShowLayers();

        this.loadGlobalObjectsData();

        this.rhEvtProg.prepareProgram();
        this.rhEvtProg.assemblePrograms(this);

        this.showMouse();
        this.captureMouse();
        this.rhQuitParam = 0;
        this.f_InitLoop();
        this.bodiesCreated = false;

        //TODO        rhEvtProg.HandleKeyRepeat();
    },

    doRunLoop: function () {
        //get easy handle to app
        var app = this.rhApp;

        if (this.rh2PauseCompteur > 0 && app.modalSubappObject == null) {
            if (this.quitPause) {
                if (this.rh4PauseKey >= 0) {
                    if (app.keyNew == true) {
                        if (app.keyBuffer[this.rh4PauseKey]) {
                            this.resume();
                            this.rhQuit = 0;
                            this.rh4EndOfPause = this.rhLoopCount;
                            this.rhEvtProg.handle_GlobalEvents((-8 << 16) | 0xFFFD);
                        }
                    }
                }
                else {
                    if (app.keyNew) {
                        this.resume();
                        this.rhQuit = 0;
                        this.rh4EndOfPause = this.rhLoopCount;
                        this.rhEvtProg.handle_GlobalEvents((-8 << 16) | 0xFFFD);
                    }
                    else if (this.rh4PauseJoystickReady == 0) {
                        if (!this.isAnyJoystickButtonPressed())
                            this.rh4PauseJoystickReady = 1;     // joystick has been released, can wait for it to be pressed again
                    }
                    else if (this.rh4PauseJoystickReady == 1) {
                        if (this.isAnyJoystickButtonPressed())
                            this.rh4PauseJoystickReady = 2;     // joystick has been pressed again, wait for it to be released
                    }
                    else if (this.rh4PauseJoystickReady == 2) {
                        if (!this.isAnyJoystickButtonPressed())
                            this.rh4PauseJoystickReady = 3;     // joystick has been released again, can resume
                    }
                    else if (this.rh4PauseJoystickReady == 3) {
                        this.rh4IgnoreJoystickButtonsOnce = true;
                        this.resume();
                        this.rhQuit = 0;
                        this.rh4EndOfPause = this.rhLoopCount;
                        this.rhEvtProg.handle_GlobalEvents((-8 << 16) | 0xFFFD);
                    }
                }
                app.keyNew = false;
            }

            //special case for question object (TODO: remove this hack)
            if (this.questionObjectOn != null) {
                this.questionObjectOn.handleQuestion();
            }

            quit = this.rhQuit;
        } else {
            // Calls the game
            app.appRunFlags |= CRunApp.ARF_INGAMELOOP;
            var quit = this.f_GameLoop();
            app.appRunFlags &= ~CRunApp.ARF_INGAMELOOP;

            // Si fin de FADE IN, detruit les sprites
            if ((this.rhGameFlags & CRun.GAMEFLAGS_FIRSTLOOPFADEIN) != 0) {
                this.fadeTimerDelta = Date.now() - this.rhTimerOld;
                // TODO rhFrame.fadeVblDelta = rhApp.newGetCptVbl() - rhVBLOld;
                this.y_KillLevel(true);
                this.rhEvtProg.unBranchPrograms();
            }
        }

        //are we moving frames and need to capture the current graphics... 
        //if (quit == CRun.LOOPEXIT_NEXTLEVEL || quit == CRun.LOOPEXIT_PREVLEVEL || quit == CRun.LOOPEXIT_GOTOLEVEL) {
        //capture the last frame for various purposes
        //app.lastFrameBuffer = app.renderFrameToBuffer();
        //}

        //check for various quit conditions
        if (quit != 0) {
            var frame = 0;
            switch (quit) {
                case 5:
                    this.pause();
                    app.keyNew = false;
                    this.quitPause = true;
                    quit = 0;
                    break;

                case 101:
                    if (this.rhFrame.fade) {
                        break;
                    }
                    this.f_StopSamples();
                    this.killFrameObjects();
                    this.y_KillLevel(false);
                    this.resetFrameLayers(-1, false);
                    this.rhEvtProg.unBranchPrograms();
                    this.freeMouse();
                    this.freeRunHeader();

                    this.rhFrame.leX = this.rhFrame.leLastScrlX = this.rh3DisplayX = 0;
                    this.rhFrame.leY = this.rhFrame.leLastScrlY = this.rh3DisplayY = 0;
                    app.resetLayers();
                    this.allocRunHeader();
                    this.initAsmLoop();
                    this.resetFrameLayers(-1, false);
                    this.prepareFrame();
                    this.createFrameObjects(false);
                    this.createBackdropInstances();
                    this.loadGlobalObjectsData();
                    this.rhEvtProg.prepareProgram();
                    this.rhEvtProg.assemblePrograms(this);
                    this.f_InitLoop();

                    this.showMouse();
                    this.captureMouse();
                    quit = 0;
                    this.rhQuitParam = 0;
                    break;

                case 100:
                case -2:
                    this.rhEvtProg.handle_GlobalEvents(((-4 << 16) | 65533));
                    break;

            }
        }
        this.rhQuit = quit;
        return quit;
    },

    killRunLoop: function (bLeaveSamples) {
        var quitParam;

        // Filtre les codes internes
        if (this.rhQuit > 100) {
            this.rhQuit = CRun.LOOPEXIT_ENDGAME;
        }
        quitParam = this.rhQuitParam;
        this.saveGlobalObjectsData();
        this.killFrameObjects();

        this.y_KillLevel(bLeaveSamples);
        this.rhEvtProg.unBranchPrograms();
        this.freeRunHeader();
        this.freeMouse();
        this.resetFrameLayers(-1, true);
        this.rhApp.endVirtualJoystick();

        return (CServices.MAKELONG(this.rhQuit, quitParam));
    },

    initAsmLoop: function () {
        var i;
        for (i = 0; i < this.rhMaxObjects; i++) {
            this.rhObjectList[i] = null;
        }
    },

    prepareFrame: function () {
        //note: does not get called each frame update
        var oiPtr;
        var ocPtr;
        var n, type;

        this.rhGameFlags |= CRun.GAMEFLAGS_LOADONCALL;
        this.rhGameFlags |= CRun.GAMEFLAGS_INITIALISING;

        this.rh2CreationCount = 0;

        var loPtr;
        var count = 0;
        this.rhOiList = new Array(this.rhMaxOI);
        this.rhMouseUsed = 0;
        for (oiPtr = this.rhApp.OIList.getFirstOI() ; oiPtr != null; oiPtr = this.rhApp.OIList.getNextOI()) {
            type = oiPtr.oiType;
            if (type >= COI.OBJ_SPR) {
                this.rhOiList[count] = new CObjInfo();
                this.rhOiList[count].copyData(oiPtr);

                this.rhOiList[count].oilHFII = -1;
                if (type == COI.OBJ_TEXT || type == COI.OBJ_QUEST) {
                    for (loPtr = this.rhFrame.LOList.first_LevObj() ; loPtr != null; loPtr = this.rhFrame.LOList.next_LevObj()) {
                        if (loPtr.loOiHandle == this.rhOiList[count].oilOi) {
                            this.rhOiList[count].oilHFII = loPtr.loHandle;
                            break;
                        }
                    }
                }
                count++;

                ocPtr = oiPtr.oiOC;
                if ((ocPtr.ocOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) != 0 && ocPtr.ocMovements != null) {
                    for (n = 0; n < ocPtr.ocMovements.nMovements; n++) {
                        var mvPtr = ocPtr.ocMovements.moveList[n];
                        if (mvPtr.mvType == CMoveDef.MVTYPE_MOUSE) {
                            this.rhMouseUsed |= 1 << (mvPtr.mvControl - 1);
                        }
                    }
                }
            }
        }

        var i;
        for (i = 0; i < this.rhFrame.nLayers; i++) {
            this.rhFrame.layers[i].resetZOrder();
        }
        return 0;
    },

    createRemainingFrameObjects: function () {
        var error = 0;
        var num;
        var oiPtr;
        var ocPtr;
        var type;
        var n;
        var creatFlags;
        var loPtr;

        this.rhGameFlags &= ~CRun.GAMEFLAGS_FIRSTLOOPFADEIN;

        for (n = 0, loPtr = this.rhFrame.LOList.first_LevObj() ; loPtr != null; n++, loPtr = this.rhFrame.LOList.next_LevObj()) {
            oiPtr = this.rhApp.OIList.getOIFromHandle(loPtr.loOiHandle);
            ocPtr = oiPtr.oiOC;
            type = oiPtr.oiType;

            if (type < COI.KPX_BASE) {
                continue;
            }
            if ((ocPtr.ocOEFlags & CObjectCommon.OEFLAG_RUNBEFOREFADEIN) != 0) {
                continue;
            }

            creatFlags = CRun.COF_CREATEDATSTART;

            // Objet pas dans le bon mode || cree au milieu du jeu. SKIP
            if (loPtr.loParentType != CLO.PARENT_NONE) {
                continue;
            }

            // Objet iconise non texte . SKIP
            if ((ocPtr.ocFlags2 & CObjectCommon.OCFLAGS2_VISIBLEATSTART) == 0) {
                if (type != COI.OBJ_TEXT) {
                    continue;
                }
                creatFlags |= CRun.COF_HIDDEN;
            }

            // Creation de l'objet                
            if ((ocPtr.ocOEFlags & CObjectCommon.OEFLAG_DONTCREATEATSTART) == 0) {
                this.f_CreateObject(loPtr.loHandle, loPtr.loOiHandle, 0x80000000, 0x80000000, -1, creatFlags, -1, -1);
            }
        }
        this.rhEvtProg.assemblePrograms(this);

        // Remet le timer
        this.rhTimerOld = Date.now() - this.fadeTimerDelta;
        // TODO rhVBLOld = (rhApp.newGetCptVbl() - rhFrame.fadeVblDelta);
    },

    createFrameObjects: function (fade) {
        var oiPtr;
        var ocPtr;
        var type;
        var n;
        var creatFlags;
        var loPtr;

        for (n = 0, loPtr = this.rhFrame.LOList.first_LevObj() ; loPtr != null; n++, loPtr = this.rhFrame.LOList.next_LevObj()) {
            oiPtr = this.rhApp.OIList.getOIFromHandle(loPtr.loOiHandle);
            ocPtr = oiPtr.oiOC;
            type = oiPtr.oiType;

            creatFlags = CRun.COF_CREATEDATSTART;

            if (loPtr.loParentType != CLO.PARENT_NONE) {
                continue;
            }

            if (type == COI.OBJ_TEXT) {
                creatFlags |= CRun.COF_FIRSTTEXT;
            }

            if ((ocPtr.ocFlags2 & CObjectCommon.OCFLAGS2_VISIBLEATSTART) == 0) {
                if (type == COI.OBJ_QUEST) {
                    continue;
                }
                creatFlags |= CRun.COF_HIDDEN;
            }
            if (fade) {
                if (type >= COI.KPX_BASE) {
                    if ((ocPtr.ocOEFlags & CObjectCommon.OEFLAG_RUNBEFOREFADEIN) == 0) {
                        continue;
                    }
                }
            }

            if ((ocPtr.ocOEFlags & CObjectCommon.OEFLAG_DONTCREATEATSTART) == 0) {
                this.f_CreateObject(loPtr.loHandle, loPtr.loOiHandle, 0x80000000, 0x80000000, -1, creatFlags, -1, -1);
            }
        }
        this.rhGameFlags &= ~CRun.GAMEFLAGS_INITIALISING;
    },

    killFrameObjects: function () {
        var n;
        for (n = 0; n < this.rhMaxObjects && this.rhNObjects != 0; n++) {
            if (this.rhObjectList[n] != null) {
                var pHo = this.rhObjectList[n];
                if (pHo.hoType < 32 || pHo.hoCommon.ocIdentifier != CRun.BASEIDENTIFIER) {
                    this.f_KillObject(n, true);
                }
            }
        }

        for (n = 0; n < this.rhMaxObjects && this.rhNObjects != 0; n++) {
            if (this.rhObjectList[n] != null) {
                var pHo = this.rhObjectList[n];
                if (pHo.hoType >= 32 && pHo.hoCommon.ocIdentifier == CRun.BASEIDENTIFIER) {
                    this.f_KillObject(n, true);
                }
            }
        }
    },

    y_KillLevel: function (bLeaveSamples) {
        if (!bLeaveSamples) {
            if ((this.rhApp.gaNewFlags & CRunApp.GANF_SAMPLESOVERFRAMES) == 0) {
                this.rhApp.soundPlayer.stopAllSounds();
            }
            else {
                this.rhApp.soundPlayer.keepCurrentSounds();
            }
        }
    },

    resetFrameLayers: function (nLayer, bDeleteFrame) {
        var i, nLayers;

        if (nLayer == -1) {
            i = 0;
            nLayers = this.rhFrame.nLayers;
        }
        else {
            i = nLayer;
            nLayers = (nLayer + 1);
        }

        for (i = 0; i < nLayers; i++) {
            var pLayer = this.rhFrame.layers[i];

            pLayer.reset();
            pLayer.deleteBackObjects();
            if (bDeleteFrame) {
                pLayer.deletePlanes();
            }
        }
    },

    captureMouse: function () {
        if (this.rhMouseUsed != 0) {
            this.setCursorCount(-1);
        }
    },

    freeMouse: function () {
        if (this.rhMouseUsed != 0) {
            this.setCursorCount(0);
        }
    },

    setCursorCount: function (count) {
        if (count >= 0) {
            this.rhApp.showCursor(1);
        } else {
            this.rhApp.showCursor(-1);
        }
    },

    showMouse: function () {
        this.rhApp.showCursor(1);
    },

    hideMouse: function () {
        this.rhApp.showCursor(-1);
    },

    addFastLoop: function (name) {
        var pLoop;
        var index;
        for (index = 0; index < this.rh4FastLoops.size() ; index++) {
            pLoop = this.rh4FastLoops.get(index);
            if (CServices.compareStringsIgnoreCase(pLoop.name, name)) {
                break;
            }
        }
        if (index == this.rh4FastLoops.size()) {
            var loop = new CLoop();
            this.rh4FastLoops.add(loop);
            index = this.rh4FastLoops.size() - 1;
            loop.name = name;
            loop.flags = 0;
        }
        return index;
    },

    saveGlobalObjectsData: function () {
        var hoPtr;
        var oilPtr;
        var oil, obj;
        var oiPtr;
        var name;
        var o;

        for (oil = 0; oil < this.rhOiList.length; oil++) {
            oilPtr = this.rhOiList[oil];

            o = oilPtr.oilObject;
            if (oilPtr.oilOi != 0x7FFF && (o & 0x80000000) == 0) {
                oiPtr = this.rhApp.OIList.getOIFromHandle(oilPtr.oilOi);

                if ((oiPtr.oiFlags & COI.OIF_GLOBAL) != 0) {
                    hoPtr = this.rhObjectList[o];

                    if (oilPtr.oilType != COI.OBJ_TEXT && oilPtr.oilType != COI.OBJ_COUNTER && hoPtr.rov == null) {
                        continue;
                    }

                    name = oilPtr.oilName + oilPtr.oilType.toString();

                    if (this.rhApp.adGO == null) {
                        this.rhApp.adGO = new CArrayList();
                    }

                    var flag = false;
                    var save = null;
                    for (obj = 0; obj < this.rhApp.adGO.size() ; obj++) {
                        save = this.rhApp.adGO.get(obj);
                        if (name == save.name) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag == false) {
                        save = new CSaveGlobal();
                        save.name = name;
                        save.objects = new CArrayList();
                        this.rhApp.adGO.add(save);
                    }
                    else {
                        save.objects.clear();
                    }

                    var n;
                    while (true) {
                        hoPtr = this.rhObjectList[o];

                        if (oilPtr.oilType == COI.OBJ_TEXT) {
                            var saveText = new CSaveGlobalText();
                            saveText.text = hoPtr.rsTextBuffer;
                            saveText.rsMini = hoPtr.rsMini;
                            save.objects.add(saveText);
                        }
                        else if (oilPtr.oilType == COI.OBJ_COUNTER) {
                            var saveCounter = new CSaveGlobalCounter();
                            saveCounter.value = hoPtr.rsValue;
                            saveCounter.rsMini = hoPtr.rsMini;
                            saveCounter.rsMaxi = hoPtr.rsMaxi;
                            saveCounter.rsMiniDouble = hoPtr.rsMiniDouble;
                            saveCounter.rsMaxiDouble = hoPtr.rsMaxiDouble;
                            save.objects.add(saveCounter);
                        }
                        else {
                            var saveValues = new CSaveGlobalValues();
                            saveValues.flags = hoPtr.rov.rvValueFlags;
                            saveValues.values = new Array(hoPtr.rov.rvValues.length);
                            for (n = 0; n < hoPtr.rov.rvValues.length; n++) {
                                saveValues.values[n] = hoPtr.rov.rvValues[n];
                            }
                            saveValues.strings = new Array(hoPtr.rov.rvStrings.length);
                            for (n = 0; n < hoPtr.rov.rvStrings.length; n++) {
                                saveValues.strings[n] = hoPtr.rov.rvStrings[n];
                            }
                            save.objects.add(saveValues);
                        }

                        o = hoPtr.hoNumNext;
                        if ((o & 0x80000000) != 0) {
                            break;
                        }
                    }
                }
            }
        }
    },

    loadGlobalObjectsData: function () {
        var hoPtr;
        var oilPtr;
        var oil, obj;
        var oiPtr;
        var name;
        var o;

        if (this.rhApp.adGO == null) {
            return;
        }

        for (oil = 0; oil < this.rhOiList.length; oil++) {
            oilPtr = this.rhOiList[oil];

            o = oilPtr.oilObject;
            if (oilPtr.oilOi != 0x7FFF && o >= 0) {
                oiPtr = this.rhApp.OIList.getOIFromHandle(oilPtr.oilOi);

                if ((oiPtr.oiFlags & COI.OIF_GLOBAL) != 0) {
                    name = oilPtr.oilName + oilPtr.oilType.toString();

                    for (obj = 0; obj < this.rhApp.adGO.size() ; obj++) {
                        var save = this.rhApp.adGO.get(obj);
                        if (name == save.name) {
                            var count = 0;
                            while (true) {
                                hoPtr = this.rhObjectList[o];

                                if (oilPtr.oilType == COI.OBJ_TEXT) {
                                    var saveText = save.objects.get(count);
                                    hoPtr.rsTextBuffer = saveText.text;
                                    hoPtr.rsMini = saveText.rsMini;
                                    hoPtr.roc.rcChanged = true;
                                    hoPtr.bTxtChanged = true;
                                }
                                else if (oilPtr.oilType == COI.OBJ_COUNTER) {
                                    var saveCounter = save.objects.get(count);
                                    hoPtr.rsValue = saveCounter.value;
                                    hoPtr.rsMini = saveCounter.rsMini;
                                    hoPtr.rsMaxi = saveCounter.rsMaxi;
                                    hoPtr.rsMiniDouble = saveCounter.rsMiniDouble;
                                    hoPtr.rsMaxiDouble = saveCounter.rsMaxiDouble;
                                    hoPtr.bCounterChanged = true;
                                    hoPtr.roc.rcChanged = true;
                                }
                                else {
                                    var saveValues = save.objects.get(count);
                                    hoPtr.rov.rvValueFlags = saveValues.flags;
                                    hoPtr.rov.growValues(saveValues.values.length);
                                    hoPtr.rov.growStrings(saveValues.strings.length);
                                    var n;
                                    for (n = 0; n < saveValues.values.length; n++) {
                                        hoPtr.rov.rvValues[n] = saveValues.values[n];
                                    }
                                    for (n = 0; n < saveValues.strings.length; n++) {
                                        hoPtr.rov.rvStrings[n] = saveValues.strings[n];
                                    }
                                }

                                o = hoPtr.hoNumNext;
                                if ((o & 0x80000000) != 0) {
                                    break;
                                }

                                count++;
                                if (count >= save.objects.size()) {
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    },

    f_CreateObject: function (hlo, oi, coordX, coordY, initDir, flags, nLayer, numCreation) {
        var cob = CCreateObjectInfo.getFromPool();
        var result = -1;

        while (true) {
            var loPtr = null;
            if (hlo != -1) {
                loPtr = this.rhFrame.LOList.getLOFromHandle(hlo);
            }

            var oiPtr = this.rhApp.OIList.getOIFromHandle(oi);
            var ocPtr = oiPtr.oiOC;

            if ((ocPtr.ocFlags2 & CObjectCommon.OCFLAGS2_VISIBLEATSTART) == 0) {
                flags |= CRun.COF_HIDDEN;
            }

            if (this.rhNObjects >= this.rhMaxObjects) {
                break;
            }

            //create the base type of object
            var hoPtr = null;


            switch (oiPtr.oiType) {
                case 2:
                    
                    hoPtr = new CActive();
                    break;
                case 3:

                    hoPtr = new CText();
                    break;
                case 4:

                    hoPtr = new CQuestion();
                    break;
                case 5:

                    hoPtr = new CScore();
                    break;
                case 6:

                    hoPtr = new CLives();
                    break;
                case 7:

                    hoPtr = new CCounter();
                    break;
                case 8:
                    //                        hoPtr=new CRtf();
                    break;
                case 9:

                    hoPtr = new CCCA();
                    break;
                default:

                    hoPtr = new CExtension(oiPtr.oiType, this);
                    if (hoPtr.ext == null) {
                        hoPtr = null;
                    }
                    break;
            }

            //check if the object type was supported
            if (hoPtr == null) {
                break;
            }

            hoPtr.lo = loPtr;


            //[Removed by SKN3 2016] not sure why this exists as this is defined in the class definitions, e.g. Active.js, Lives.js, etc
            //var proto = new CObject();
            //hoPtr.prototype = proto;

            //TODO: do we need to create our blank objects array here? (TODO: surely this shouldn't be done in this function call)
            if (numCreation < 0) {
                for (numCreation = 0; numCreation < this.rhMaxObjects; numCreation++) {
                    if (this.rhObjectList[numCreation] == null) {
                        break;
                    }
                }
            }

            //check to see if this exceeds the max objects we can create
            if (numCreation >= this.rhMaxObjects) {
                break;
            }

            this.rhObjectList[numCreation] = hoPtr;
            this.rhNObjects++;
            hoPtr.hoIdentifier = ocPtr.ocIdentifier;
            hoPtr.hoOEFlags = ocPtr.ocOEFlags;

            if (numCreation > this.rh4ObjectCurCreate) {
                this.rh4ObjectAddCreate++;
            }

            hoPtr.hoNumber = numCreation;
            this.rh2CreationCount++;
            if (this.rh2CreationCount == 0) {
                this.rh2CreationCount = 1;
            }
            hoPtr.hoCreationId = this.rh2CreationCount;
            hoPtr.hoOi = oi;
            hoPtr.hoHFII = hlo;
            hoPtr.hoType = oiPtr.oiType;
            this.oi_Insert(hoPtr);
            hoPtr.hoAdRunHeader = this;
            hoPtr.hoCallRoutine = true;

            hoPtr.hoCommon = ocPtr;

            // Sprite en mode inbitate?
            if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_MANUALSLEEP) == 0) {
                // On detruit... sauf si...
                hoPtr.hoOEFlags &= ~CObjectCommon.OEFLAG_NEVERSLEEP;

                // On teste des collisions avec le decor?
                if ((hoPtr.hoLimitFlags & CObjInfo.OILIMITFLAGS_QUICKBACK) != 0) {
                    // Si masque des collisions general
                    if ((this.rhFrame.leFlags & CRunFrame.LEF_TOTALCOLMASK) != 0) {
                        hoPtr.hoOEFlags |= CObjectCommon.OEFLAG_NEVERSLEEP;
                    }
                }
                // Ou test des collisions normal
                if ((hoPtr.hoLimitFlags & (CObjInfo.OILIMITFLAGS_QUICKCOL | CObjInfo.OILIMITFLAGS_QUICKBORDER)) != 0) {
                    hoPtr.hoOEFlags |= CObjectCommon.OEFLAG_NEVERSLEEP;
                }
            }

            var x = coordX;                                    // X
            if (x == 0x80000000) {
                x = loPtr.loX;
            }
            cob.cobX = x;
            hoPtr.hoX = x;

            var y = coordY;                                    // Y
            if (y == 0x80000000) {
                y = loPtr.loY;
            }
            cob.cobY = y;
            hoPtr.hoY = y;

            //what layer ?
            if (loPtr != null) {
                if (nLayer == -1) {
                    nLayer = loPtr.loLayer;
                }
            }
            cob.cobLayer = nLayer;
            hoPtr.hoLayer = nLayer;

            //setup the starting zorder for this new object
            var pLayer = this.rhFrame.layers[nLayer];
            hoPtr.zOrder = pLayer.planeSprites.getHighChildZOrder();

            //save more details
            cob.cobFlags = flags;
            cob.cobDir = initDir;
            cob.cobLevObj = loPtr;

            //do some general setup if it has various extras
            hoPtr.roc = null;
            if ((hoPtr.hoOEFlags & (CObjectCommon.OEFLAG_ANIMATIONS | CObjectCommon.OEFLAG_MOVEMENTS | CObjectCommon.OEFLAG_SPRITES)) != 0) {
                hoPtr.roc = new CRCom();
                hoPtr.roc.init();
            }

            //does it have movements?
            hoPtr.rom = null;
            if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) != 0) {
                hoPtr.rom = new CRMvt();
                if ((cob.cobFlags & CRun.COF_NOMOVEMENT) == 0) {
                    hoPtr.rom.init(0, hoPtr, ocPtr, cob, -1);
                }
            }

            //does it have animations
            hoPtr.roa = null;
            if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_ANIMATIONS) != 0) {
                hoPtr.roa = new CRAni();
                hoPtr.roa.init(hoPtr);
            }

            //does the object have a sprite attached to it? (this is the ONLY place in the runtime where a CRSpr is created
            hoPtr.ros = null;
            if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_SPRITES) != 0) {
                //create a new runtime sprite
                hoPtr.ros = new CRSpr();

                //init1 just configures various settings of the sprite, the sprites initial zOrder is also set from the cob object, we call init2 just a few lines belowe...
                hoPtr.ros.init1(hoPtr, ocPtr, cob);
            }

            //does it have values?
            hoPtr.rov = null;
            if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_VALUES) != 0) {
                hoPtr.rov = new CRVal();
                hoPtr.rov.init(hoPtr, ocPtr, cob);
            }

            hoPtr.init(ocPtr, cob);

            //should we finish setting up teh sprite?
            if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_SPRITES) != 0) {
                //this and also starts any transitions for the sprite
                hoPtr.ros.init2(true);
            }

            if (this.rhLoopCount >= 1) {
                hoPtr.callComputeNewDisplay();
            }


            //do the debug tracking code


            result = numCreation;
            break;
        }

        //release the cob (this will actually add it back to a pool)
        cob.free();


        return result;
    },

    f_KillObject: function (nObject, bFast) {
        var hoPtr = this.rhObjectList[nObject];
        if (hoPtr == null) {
            return;
        }

        //let CDebug do stuff to destroying objects


        if (bFast == true && hoPtr.hoCreationId == 0) {
            this.rhObjectList[nObject] = null;
            this.rhNObjects--;
            return;
        }

        this.killShootPtr(hoPtr);

        if (hoPtr.rom != null) {
            hoPtr.rom.kill(bFast);
        }
        if (hoPtr.rov != null) {
            hoPtr.rov.kill(bFast);
        }
        if (hoPtr.ros != null) {
            hoPtr.ros.kill(bFast);
        }
        if (hoPtr.roc != null) {
            hoPtr.roc.kill(bFast);
        }

        hoPtr.kill(bFast);

        this.oi_Delete(hoPtr);

        this.rhObjectList[nObject] = null;

        this.rhNObjects--;

    },

    addToDestroyList: function (hoNumber) {
        var pos = Math.floor(hoNumber / 32);
        var bit = 1 << (hoNumber & 31);
        this.rhDestroyList[pos] |= bit;
        this.rhDestroyPos++;
    },

    destroy_List: function () {
        if (this.rhDestroyPos == 0) {
            return;
        }

        var nob = 0;
        var dw;
        var count;
        while (nob < this.rhMaxObjects) {
            dw = this.rhDestroyList[nob / 32];
            if (dw != 0) {
                this.rhDestroyList[nob / 32] = 0;
                for (count = 0; dw != 0 && count < 32; count++) {
                    if ((dw & 1) != 0) {
                        var pHo = this.rhObjectList[nob + count];
                        if (pHo != null) {
                            if (pHo.hoOiList.oilNObjects == 1) {
                                this.rhEvtProg.handle_Event(pHo, (pHo.hoType | (-33 << 16)));
                            }
                        }
                        this.f_KillObject(nob + count, false);
                        this.rhDestroyPos--;
                    }
                    dw = dw >> 1;
                }
                if (this.rhDestroyPos == 0) {
                    return;
                }
            }
            nob += 32;
        }
    },

    killShootPtr: function (hoSource) {
        var count = 0;
        var nObject;
        var hoPtr;
        for (nObject = 0; nObject < this.rhNObjects; nObject++) {
            while (this.rhObjectList[count] == null) {
                count++;
            }
            hoPtr = this.rhObjectList[count];
            count++;

            if (hoPtr.rom != null) {
                if (hoPtr.roc.rcMovementType == CMoveDef.MVTYPE_BULLET) {
                    var mBullet = hoPtr.rom.rmMovement;
                    if (mBullet.MBul_ShootObject == hoSource && mBullet.MBul_Wait == true) {
                        mBullet.startBullet();
                    }
                }
            }
        }
    },

    callComputeNewDisplay: function () {
        //call for all objects to do stuff
        var nObject;
        var hoPtr;
        var count;

        //create fonts (if need be) (it seems a little strange to have this called here and so speciffic...)
        for (nObject = 0, count = 0; nObject < this.rhNObjects; nObject++) {
            while (this.rhObjectList[count] == null) {
                count++;
            }
            hoPtr = this.rhObjectList[count];
            count++;
            hoPtr.createFont();
        }

        //compute displays! (naturally fonts need to be ready for certain displays being computed)
        for (nObject = 0, count = 0; nObject < this.rhNObjects; nObject++) {
            //this appears to be skipping null objects in the list?????
            while (this.rhObjectList[count] == null) {
                count++;
            }

            hoPtr = this.rhObjectList[count];
            count++;
            hoPtr.callComputeNewDisplay();
        }
    },

    oi_Insert: function (pHo) {
        var oi = pHo.hoOi;

        var num;
        for (num = 0; num < this.rhMaxOI; num++) {
            if (this.rhOiList[num].oilOi == oi) {
                break;
            }
        }
        var poil = this.rhOiList[num];

        if ((poil.oilObject & 0x80000000) != 0) {
            poil.oilObject = pHo.hoNumber;
            pHo.hoNumPrev = (num | 0x80000000);
            pHo.hoNumNext = 0x80000000;
        }
        else {
            var pHo2 = this.rhObjectList[poil.oilObject];
            pHo.hoNumPrev = pHo2.hoNumPrev;
            pHo2.hoNumPrev = pHo.hoNumber;
            pHo.hoNumNext = pHo2.hoNumber;
            poil.oilObject = pHo.hoNumber;
        }

        pHo.hoEvents = poil.oilEvents;
        pHo.hoOiList = poil;
        pHo.hoLimitFlags = poil.oilLimitFlags;
        if (pHo.hoHFII == -1) {
            pHo.hoHFII = poil.oilHFII;
        } else {
            if (poil.oilHFII == -1) {
                poil.oilHFII = pHo.hoHFII;
            }
        }
        poil.oilNObjects += 1;
    },

    oi_Delete: function (pHo) {
        var poil = pHo.hoOiList;
        poil.oilNObjects -= 1;

        var pHo2;
        if ((pHo.hoNumPrev & 0x80000000) == 0) {
            pHo2 = this.rhObjectList[pHo.hoNumPrev];
            if ((pHo.hoNumNext & 0x80000000) == 0) {
                var pHo3 = this.rhObjectList[pHo.hoNumNext];
                if (pHo2 != null) {
                    pHo2.hoNumNext = pHo.hoNumNext;
                }
                if (pHo3 != null) {
                    pHo3.hoNumPrev = pHo.hoNumPrev;
                }
            }
            else {
                if (pHo2 != null) {
                    pHo2.hoNumNext = 0x80000000;
                }
            }
        }
        else {
            if ((pHo.hoNumNext & 0x80000000) == 0) {
                pHo2 = this.rhObjectList[pHo.hoNumNext];
                if (pHo2 != null) {
                    pHo2.hoNumPrev = pHo.hoNumPrev;
                    poil.oilObject = pHo2.hoNumber;
                }
            }
            else {
                poil.oilObject = 0x80000000;
            }
        }
    },

    CreateBodies: function () {
        var pBase = this.GetBase();
        if (pBase == null) {
            return;
        }

        var pOL = 0;
        var nObjects;
        for (nObjects = 0; nObjects < this.rhNObjects; pOL++, nObjects++) {
            while (this.rhObjectList[pOL] == null) {
                pOL++;
            }

            var pHo = this.rhObjectList[pOL];

            if (pHo.hoType >= 32) {
                if (pHo.hoCommon.ocIdentifier == CRun.FANIDENTIFIER || pHo.hoCommon.ocIdentifier == CRun.TREADMILLIDENTIFIER || pHo.hoCommon.ocIdentifier == CRun.PARTICULESIDENTIFIER || pHo.hoCommon.ocIdentifier == CRun.ROPEANDCHAINIDENTIFIER || pHo.hoCommon.ocIdentifier == CRun.MAGNETIDENTIFIER) {
                    pHo.ext.rStartObject();

                } else if (pHo.hoCommon.ocIdentifier == CRun.BASEIDENTIFIER) {
                    pHo.ext.rStartObject();
                }
            }
        }

        pOL = 0;
        for (nObjects = 0; nObjects < this.rhNObjects; pOL++, nObjects++) {
            while (this.rhObjectList[pOL] == null) {
                pOL++;
            }

            var pHo = this.rhObjectList[pOL];

            if ((pHo.hoOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) != 0) {
                var flag = false;
                if (pHo.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
                    var mvPtr = (pHo.hoCommon.ocMovements.moveList[pHo.rom.rmMvtNum]);
                    if (CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2d8directions')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dspring')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dspaceship')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dstatic')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dracecar')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2daxial')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dplatform')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dbouncingball')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dbackground')
                    ) {
                        pHo.rom.rmMovement.movement.CreateBody();
                        flag = true;
                    }
                }
                if (flag == false && pHo.hoType == 2) {
                    pBase.rAddNormalObject(pHo);
                }
            }
        }

        pOL = 0;
        for (nObjects = 0; nObjects < this.rhNObjects; pOL++, nObjects++) {
            while (this.rhObjectList[pOL] == null) {
                pOL++;
            }
            var pHo = this.rhObjectList[pOL];
            if ((pHo.hoOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) != 0) {
                if (pHo.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
                    var mvPtr = (pHo.hoCommon.ocMovements.moveList[pHo.rom.rmMvtNum]);
                    if (CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2d8directions')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dspring')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dspaceship')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dstatic')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dracecar')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2daxial')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dplatform')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dbouncingball')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dbackground')
                    ) {
                        pHo.rom.rmMovement.movement.CreateJoint();
                    }
                }
            }
        }
    },

    GetBase: function () {
        if (this.rh4Box2DSearched == false) {
            this.rh4Box2DSearched = true;
            this.rh4Box2DBase = null;

            var pOL = 0;
            var nObjects;
            for (nObjects = 0; nObjects < this.rhNObjects; pOL++, nObjects++) {
                while (this.rhObjectList[pOL] == null) {
                    pOL++;
                }
                var pHo = this.rhObjectList[pOL];
                if (pHo.hoType >= 32) {
                    if (pHo.hoCommon.ocIdentifier == CRun.BASEIDENTIFIER) {
                        this.rh4Box2DBase = pHo.ext;
                        break;
                    }
                }
            }
        }
        return this.rh4Box2DBase;
    },

    GetMBase: function (pHo) {
        if (pHo && (pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
            if ((pHo.hoOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) != 0) {
                if (pHo.roc.rcMovementType == CMoveDef.MVTYPE_EXT) {
                    var mvPtr = (pHo.hoCommon.ocMovements.moveList[pHo.rom.rmMvtNum]);
                    if (CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2d8directions')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dspring')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dspaceship')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dstatic')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dracecar')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2daxial')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dplatform')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dbouncingball')
                        || CServices.compareStringsIgnoreCase(mvPtr.moduleName, 'box2dbackground')
                    ) {
                        return pHo.rom.rmMovement.movement;
                    }
                }
            }
        }
        return null;
    },

    addPhysicsAttractor: function (pObject) {
        if (pObject.hoCommon.ocIdentifier == CRun.FANIDENTIFIER || pObject.hoCommon.ocIdentifier == CRun.TREADMILLIDENTIFIER || pObject.hoCommon.ocIdentifier == CRun.MAGNETIDENTIFIER || pObject.hoCommon.ocIdentifier == CRun.ROPEANDCHAINIDENTIFIER) {
            var pOL = 0;
            var nObjects;
            for (nObjects = 0; nObjects < this.rhNObjects; pOL++, nObjects++) {
                while (this.rhObjectList[pOL] == null) {
                    pOL++;
                }
                var pBase = this.rhObjectList[pOL];
                if (pBase.hoType >= 32 && pBase.hoCommon.ocIdentifier == CRun.BASEIDENTIFIER) {
                    if (pObject.hoCommon.ocIdentifier == CRun.FANIDENTIFIER) {
                        if (pObject.ext.identifier == pBase.ext.identifier) {
                            pBase.ext.fans.add(pObject.ext);
                        }
                    }
                    else if (pObject.hoCommon.ocIdentifier == CRun.TREADMILLIDENTIFIER) {
                        if (pObject.ext.identifier == pBase.ext.identifier) {
                            pBase.ext.treadmills.add(pObject.ext);
                        }
                    }
                    else if (pObject.hoCommon.ocIdentifier == CRun.MAGNETIDENTIFIER) {
                        if (pObject.ext.identifier == pBase.ext.identifier) {
                            pBase.ext.magnets.add(pObject.ext);
                        }
                    }
                    else if (pObject.hoCommon.ocIdentifier == CRun.ROPEANDCHAINIDENTIFIER) {
                        if (pObject.ext.identifier == pBase.ext.identifier)
                            pBase.ext.ropes.add(pObject.ext);
                    }
                }
            }

            // Object added to base list, now add the physical objects to the fan/treadmill/magnet list
            if (pObject.hoCommon.ocIdentifier != CRun.ROPEANDCHAINIDENTIFIER) {
                pOL = 0;
                for (nObjects = 0; nObjects < this.rhNObjects; pOL++, nObjects++) {
                    while (this.rhObjectList[pOL] == null) {
                        pOL++;
                    }
                    var pActive = this.rhObjectList[pOL];
                    if (pActive.hoType == COI.OBJ_SPR) {
                        var pMBase = this.GetMBase(pActive);
                        if (pMBase) {
                            pObject.ext.rAddObject(pMBase);
                        }
                    }
                }
            }
        }
    },

    getDir: function (hoPtr) {
        if (hoPtr.rom != null) {
            if (hoPtr.rom.rmMovement != null) {
                return hoPtr.rom.rmMovement.getDir();
            }
        }
        return hoPtr.roc.rcDir;
    },

    pause: function (bKeepSounds) {
        //only pause if NOT CURRENTLY PAUSED
        if (this.rh2PauseCompteur == 0) {
            //update values
            this.rh2PauseCompteur = 1;
            this.rh2PauseTimer = this.rhApp.timer;

            //pause any active transitions
            this.rhApp.pauseTransition();

            //pause objects
            var count = 0;
            var no;
            for (no = 0; no < this.rhNObjects; no++) {
                while (this.rhObjectList[count] == null) {
                    count++;
                }
                var hoPtr = this.rhObjectList[count];
                count++;
                if (hoPtr.hoType >= COI.KPX_BASE) {
                    hoPtr.ext.pauseRunObject();
                }
            }

            //pause sounds
            if (!bKeepSounds) {
                this.rhApp.soundPlayer.pause();
            }

            // TODO           Mouse.show();           
            //               this.rhApp.keyNew=false;
        }
    },

    resume: function () {
        if (!this.noResume && this.rh2PauseCompteur != 0) {
            //update values
            this.rh2PauseCompteur = 0;

            //capture mouse again...
            this.captureMouse();

            //resume objects
            var count = 0;
            var no;
            for (no = 0; no < this.rhNObjects; no++) {
                while (this.rhObjectList[count] == null) {
                    count++;
                }

                var hoPtr = this.rhObjectList[count];
                count++;
                if (hoPtr.hoType >= COI.KPX_BASE) {
                    hoPtr.ext.continueRunObject();
                }
            }

            //resume sounds
            this.rhApp.soundPlayer.resume();

            // TODO     this.rhApp.flushKeyboard();

            //update more values
            var tick = this.rhApp.timer;
            tick -= this.rh2PauseTimer;
            this.rhTimerOld += tick;
            this.rh4PauseKey = 0;
            this.quitPause = false;

            //resume any active transitions
            this.rhApp.resumeTransition();
        }
    },

    f_StopSamples: function () {
        this.rhApp.soundPlayer.stopAllSounds();
    },

    autoResize: function () {
        var count = 0;
        var no;
        for (no = 0; no < this.rhNObjects; no++) {
            while (this.rhObjectList[count] == null) {
                count++;
            }
            var hoPtr = this.rhObjectList[count];
            count++;
            hoPtr.autoResize();
        }
    },

    find_HeaderObject: function (hlo) {
        var count = 0;
        var nObjects;
        for (nObjects = 0; nObjects < this.rhNObjects; nObjects++) {
            while (this.rhObjectList[count] == null) {
                count++;
            }
            if (hlo == this.rhObjectList[count].hoHFII) {
                return rhObjectList[count];
            }
            count++;
        }
        return null;
    },

    check_Ladder: function (nLayer, x, y) {
        var prc = this.y_GetLadderAt(nLayer, x, y);
        if (prc != null) {
            return prc.top;
        }
        return CRun.INTBAD;
    },

    y_GetLadderAt: function (nLayer, x, y) {
        x -= this.rhWindowX;
        y -= this.rhWindowY;

        var nl;
        var nLayers;
        if (nLayer == -1) {
            nl = 0;
            nLayers = this.rhFrame.nLayers;
        }
        else {
            nl = nLayer;
            nLayers = (nLayer + 1);
        }
        for (; nl < nLayers; nl++) {
            var pLayer = this.rhFrame.layers[nl];
            var rc = pLayer.getLadderAt(x, y);
            if (rc != null) {
                return rc;
            }
        }
        return null;
    },

    f_InitLoop: function () {
        var tick = this.rhApp.timer;
        this.rhTimerOld = tick;
        this.rhTimer = 0;

        this.rhLoopCount = 0;
        this.rh4LoopTheoric = 0;
        //    rh2PushedEvents=0;

        this.rhQuit = 0;
        this.rhQuitBis = 0;
        this.rhDestroyPos = 0;

        var n;
        for (n = 0; n < (this.rhMaxObjects + 31) / 32; n++) {
            this.rhDestroyList[n] = 0;
        }

        this.rh3WindowSx = this.rhFrame.leEditWinWidth;
        this.rh3WindowSy = this.rhFrame.leEditWinHeight;

        this.rh3XMinimumKill = -CRun.GAME_XBORDER;
        this.rh3YMinimumKill = -CRun.GAME_YBORDER;
        this.rh3XMaximumKill = this.rhLevelSx + CRun.GAME_XBORDER;
        this.rh3YMaximumKill = this.rhLevelSy + CRun.GAME_YBORDER;

        var dx = this.rhWindowX;
        this.rh3DisplayX = dx;
        dx -= CRun.COLMASK_XMARGIN;
        if (dx < 0) {
            dx = this.rh3XMinimumKill;
        }
        this.rh3XMinimum = dx;

        var dy = this.rhWindowY;
        this.rh3DisplayY = dy;
        dy -= CRun.COLMASK_YMARGIN;
        if (dy < 0) {
            dy = this.rh3YMinimumKill;
        }
        this.rh3YMinimum = dy;

        var wx = this.rhWindowX;
        wx += this.rh3WindowSx + CRun.COLMASK_XMARGIN;
        if (wx > this.rhLevelSx) {
            wx = this.rh3XMaximumKill;
        }
        this.rh3XMaximum = wx;

        var wy = this.rhWindowY;
        wy += this.rh3WindowSy + CRun.COLMASK_YMARGIN;
        if (wy > this.rhLevelSy) {
            wy = this.rh3YMaximumKill;
        }
        this.rh3YMaximum = wy;

        this.rh3Scrolling = 0;
        this.rh4DoUpdate = 0;
        this.rh4EventCount = 0;
        this.rh4TimeOut = 0;

        this.rh2PauseCompteur = 0;

        this.rh4FakeKey = 0;
        for (n = 0; n < 4; n++) {
            this.rhPlayer[n] = 0;
            this.rh2OldPlayer[n] = 0;
            this.rh2InputMask[n] = 0xFF;
        }
        this.rh2MouseKeys = 0;

        this.rhEvtProg.callEndForEach = false;
        this.rh4EndOfPause = -1;
        this.rh4OnMouseWheel = -1;
        this.rh4LoadCount = -1;
        this.rhEvtProg.rh4CheckDoneInstart = false;
        this.rh4PauseKey = 0;
        this.rh4Box2DBase = null;
        this.rh4Box2DSearched = false;
        this.rh4ForEachs = null;
        this.rh4CurrentForEach = null;
        this.rh4CurrentForEach2 = null;
        this.rh4TimerEvents = null;

        // TODO rh4DemoMode=CDemoRecord.DEMONOTHING;
        //      rh4Demo=null;

        for (n = 0; n < CRun.MAX_FRAMERATE; n++) {
            this.rh4FrameRateArray[n] = 20;
        }
        this.rh4FrameRatePos = 0;
    },

    f_GameLoop: function () {
        this.rhApp.soundPlayer.checkSounds();

        // For some reason the event loop of subapps is called while the images are still loading O_o

        // Wait for all the data to be loaded
        if (this.rhApp.parentApp != null && this.rhApp.loading) {
            this.rhTimerOld = this.rhApp.timer;
            this.rhTimer = 0;
            return this.rhQuit;
        }

        if (this.rhApp.modalSubappObject != null) {
            this.rhApp.modalSubappObject.handle();
            return 0;
        }

        //create box2D bodies
        if (!this.bodiesCreated) {
            this.CreateBodies();
            this.bodiesCreated = true;
        }

        var timerBase = this.rhApp.timer;
        var delta = timerBase - this.rhTimerOld;
        var oldtimer = this.rhTimer;
        this.rhTimer = delta;
        delta -= oldtimer;
        this.rhTimerDelta = delta;
        this.rh4TimeOut += delta;
        this.rhLoopCount += 1;
        this.rh4MvtTimerCoef = (this.rhTimerDelta * this.rhFrame.m_dwMvtTimerBase) / 1000.0;

        this.rh4FrameRateArray[this.rh4FrameRatePos] = delta;
        this.rh4FrameRatePos++;
        if (this.rh4FrameRatePos >= CRun.MAX_FRAMERATE) {
            this.rh4FrameRatePos = 0;
        }

        //prepare
        var n;
        for (n = 0; n < CRunApp.MAX_PLAYER; n++) {
            //store old
            this.rh2OldPlayer[n] = this.rhPlayer[n];

            //reset
            this.rhPlayer[n] = 0;
        }

        //update virtual joystick
        this.rhApp.updateVirtualJoystick();

        //do joy test routines
        this.joyTest();

        //mouse coords
        this.getMouseCoords();

        //mouse buttons
        if (this.rhMouseUsed != 0) {
            this.rh2MouseKeys = 0;

            //left mouse
            if (this.rhApp.keyBuffer[CRunApp.VK_LBUTTON]) {
                this.rh2MouseKeys |= 0x10;                //00010000B;
            }

            //right mouse
            if (this.rhApp.keyBuffer[CRunApp.VK_RBUTTON]) {
                this.rh2MouseKeys |= 0x20;                //00100000B;
            }

            var mouseUsed = this.rhMouseUsed;
            for (n = 0; n < this.rhNPlayers; n++) {
                if ((this.mouseUsed & 1) != 0) {
                    var key = (this.rhPlayer[n] & 0xCF);        //11001111B;
                    key |= this.rh2MouseKeys;
                    this.rhPlayer[n] = key;
                }
                mouseUsed >>= 1;
            }
        }

        //computer all events
        var b;
        for (n = 0; n < 4; n++) {
            b = (this.rhPlayer[n] & CRun.plMasks[this.rhNPlayers * 4 + n]);
            b &= this.rh2InputMask[n];
            this.rhPlayer[n] = b;
            b ^= this.rh2OldPlayer[n];
            this.rh2NewPlayer[n] = b;
            if (b != 0) {
                b &= this.rhPlayer[n];
                if ((b & 0xF0) != 0) {
                    this.rhEvtProg.rhCurOi = n;
                    b = this.rh2NewPlayer[n];
                    if ((b & 0xF0) != 0) {
                        this.rhEvtProg.rhCurParam0 = b;
                        this.rhEvtProg.handle_GlobalEvents(((-4 << 16) | 0xFFF9));    // CNDL_JOYPRESSED);
                    }
                    if ((b & 0x0F) != 0) {
                        this.rhEvtProg.rhCurParam0 = b;
                        this.rhEvtProg.handle_GlobalEvents(((-4 << 16) | 0xFFF9));    // CNDL_JOYPRESSED);
                    }
                } else {
                    var num = this.rhEvtProg.listPointers[this.rhEvtProg.rhEvents[-COI.OBJ_PLAYER] + 4];        // -NUM_JOYPRESSEZD
                    if (num != 0) {
                        this.rhEvtProg.rhCurParam0 = b;
                        this.rhEvtProg.computeEventList(num, null);
                    }
                }
            }
        }

        //loop through all objects

        if (this.rhNObjects != 0) {
            var cptObject = this.rhNObjects;
            var count = 0;
            do {
                this.rh4ObjectAddCreate = 0;

                //skip null objects
                while (this.rhObjectList[count] == null) {
                    count++;
                }
                var pObject = this.rhObjectList[count];

                //call teh handle routine for this object
                pObject.hoPrevNoRepeat = pObject.hoBaseNoRepeat;
                pObject.hoBaseNoRepeat = null;
                if (pObject.hoCallRoutine) {
                    this.rh4ObjectCurCreate = count;
                    pObject.handle();
                }

                //(i think???) increase count of objects to process incase any objects were created during handle
                cptObject += this.rh4ObjectAddCreate;

                //we are done with this object
                cptObject--;

                //increase array offset
                count++;
            } while (cptObject != 0);
        }
        this.rh3CollisionCount++;

        //handle timer events
        this.rhEvtProg.compute_TimerEvents();
        this.rhEvtProg.handle_TimerEvents();

        if (this.rhEvtProg.rhEventAlways && (this.rhGameFlags & CRun.GAMEFLAGS_FIRSTLOOPFADEIN) == 0) {
            this.rhEvtProg.computeEventList(0, null);
        }

        //handle any pushed events
        this.rhEvtProg.handle_PushedEvents();

        //destroy any objects that have been queued for destruction
        this.destroy_List();

        //handle scrolling
        this.doScroll();
        //        this.modif_ChangedObjects();

        //update some pointers
        this.rhEvtProg.rh2CurrentClick = -1;
        this.rh4EventCount++;
        this.rh4FakeKey = 0;

        //exit the function as we are NOT quitting
        if (this.rhQuit == 0) {
            return this.rhQuitBis;
        }

        //handle quitting
        if (this.rhQuit == CRun.LOOPEXIT_NEXTLEVEL || this.rhQuit == CRun.LOOPEXIT_PREVLEVEL || this.rhQuit == CRun.LOOPEXIT_ENDGAME || this.rhQuit == CRun.LOOPEXIT_GOTOLEVEL || this.rhQuit == CRun.LOOPEXIT_QUIT || this.rhQuit == CRun.LOOPEXIT_NEWGAME) {
            this.rhEvtProg.handle_GlobalEvents((-2 << 16) | 0xFFFD);
        }
        return this.rhQuit;
    },

    isAnyJoystickButtonPressed: function() {
        var gamepad;
        for (player = 0; player < CRunApp.MAX_PLAYER; player++) {
            gamepad = this.rhApp.getGamepad(player);
            if (gamepad && gamepad.connected) {
                if (gamepad.anyButtonPressed()) {
                    return true;
                }
            }
        }
    },

    joyTest: function () {
        //check keyboard for joystick
        var player;
        var key;
        var gamepad;
        var suppress = false;

        //get the "joystick" configuration
        var ctrlKeys = this.rhApp.getCtrlKeys();
        //var ctrlType = this.rhApp.getCtrlType();

        //iterate over players. We have opted to just allow keyboard and gamepad input ALWAYS due to limitation of not having player menu.
        for (player = 0; player < CRunApp.MAX_PLAYER; player++) {
            //type = ctrlType[player];//1=joystick1, 2=joystick2, 3=joystick3, 4=joystick4, 5=keyboard
            suppress = false;

            //check gamepad
            gamepad = this.rhApp.getGamepad(player);

            //only if connected ... obviously!
            if (gamepad && gamepad.connected) {
                //up
                if (gamepad.directionPressed(CGamepad.UP)) {
                    this.rhPlayer[player] |= 1;
                }

                //down
                if (gamepad.directionPressed(CGamepad.DOWN)) {
                    this.rhPlayer[player] |= 2;
                }

                //left
                if (gamepad.directionPressed(CGamepad.LEFT)) {
                    this.rhPlayer[player] |= 4;
                }

                //right
                if (gamepad.directionPressed(CGamepad.RIGHT)) {
                    this.rhPlayer[player] |= 8;
                }

                //button1
                if (gamepad.buttonPressed(CGamepad.A)) {
                    this.rhPlayer[player] |= 16;
                }

                //button2
                if (gamepad.buttonPressed(CGamepad.B)) {
                    this.rhPlayer[player] |= 32;
                }

                //button3
                if (gamepad.buttonPressed(CGamepad.X)) {
                    this.rhPlayer[player] |= 64;
                }

                //button4
                if (gamepad.buttonPressed(CGamepad.Y)) {
                    this.rhPlayer[player] |= 128;
                }
            }

            //check keyboard input
            for (key = 0; key < CRunApp.MAX_KEY; key++) {
                //check if the keybuffer is valid, and if so we add that to the player state
                if (this.rhApp.keyBuffer[ctrlKeys[player * CRunApp.MAX_KEY + key]]) {
                    this.rhPlayer[player] |= 1 << key;
                }
            }

            //process virtual mouse
            suppress = suppress || this.rhApp.handleVirtualMouseJoystick(player, (this.rhPlayer[player] & 1) != 0, (this.rhPlayer[player] & 2) != 0, (this.rhPlayer[player] & 4) != 0, (this.rhPlayer[player] & 8) != 0, (this.rhPlayer[player] & 16) != 0, (this.rhPlayer[player] & 32) != 0, (this.rhPlayer[player] & 64) != 0, (this.rhPlayer[player] & 128) != 0);

            //handle virtual joystick only for player 1
            if (!suppress && player == 0) {
                this.rhPlayer[player] |= this.rhApp.getVirtualJoystickState() & this.rhJoystickMask;
            }

            //if supressed we should wipe the player so that it does not trigger any conditions
            if (suppress) {
                this.rhPlayer[player] = 0;
            }
        }
    },

    getMouseCoords: function () {

        this.rh2MouseX = this.rhApp.mouseX + this.rhWindowX - this.rhApp.xOffset;
        this.rh2MouseY = this.rhApp.mouseY + this.rhWindowY - this.rhApp.yOffset;
    },

    newHandle_Collisions: function (pHo) {
        pHo.rom.rmMoveFlag = false;
        CRun.bMoveChanged = false;
        pHo.rom.rmEventFlags = 0;

        var cadran, cadran1, cadran2;
        var chgDir;
        if ((pHo.hoLimitFlags & CObjInfo.OILIMITFLAGS_QUICKBORDER) != 0) {
            cadran1 = this.quadran_In(pHo.roc.rcOldX1, pHo.roc.rcOldY1, pHo.roc.rcOldX2, pHo.roc.rcOldY2);
            if (cadran1 != 0) {
                cadran2 = this.quadran_In(pHo.hoX - pHo.hoImgXSpot, pHo.hoY - pHo.hoImgYSpot, pHo.hoX - pHo.hoImgXSpot + pHo.hoImgWidth, pHo.hoY - pHo.hoImgYSpot + pHo.hoImgHeight);
                if (cadran2 == 0) {
                    chgDir = (cadran1 ^ cadran2);
                    if (chgDir != 0) {
                        pHo.rom.rmEventFlags |= CRMvt.EF_GOESINPLAYFIELD;
                        this.rhEvtProg.rhCurParam0 = chgDir;
                        this.rhEvtProg.handle_Event(pHo, (-11 << 16) | (pHo.hoType & 0xFFFF));
                    }
                }
            }

            cadran = this.quadran_In(pHo.hoX - pHo.hoImgXSpot, pHo.hoY - pHo.hoImgYSpot, pHo.hoX - pHo.hoImgXSpot + pHo.hoImgWidth, pHo.hoY - pHo.hoImgYSpot + pHo.hoImgHeight);
            if ((cadran & pHo.rom.rmWrapping) != 0) {
                var oldMoveFlag = pHo.rom.rmMoveFlag;

                if ((cadran & CRun.BORDER_LEFT) != 0) {
                    pHo.rom.rmMovement.setXPosition(pHo.hoX + this.rhLevelSx);
                } else if ((cadran & CRun.BORDER_RIGHT) != 0) {
                    pHo.rom.rmMovement.setXPosition(pHo.hoX - this.rhLevelSx);
                }

                if ((cadran & CRun.BORDER_TOP) != 0) {
                    pHo.rom.rmMovement.setYPosition(pHo.hoY + this.rhLevelSy);
                } else if ((cadran & CRun.BORDER_BOTTOM) != 0) {
                    pHo.rom.rmMovement.setYPosition(pHo.hoY - this.rhLevelSy);
                }

                // Fix for bug 3468: rmMoveFlag must not be forced when wrapping (see specific SetXPos / SetYPos in Windows runtime)
                if (pHo.roc.rcMovementType != CMoveDef.MVTYPE_PLATFORM && pHo.roc.rcMovementType != CMoveDef.MVTYPE_EXT) {
                    pHo.rom.rmMoveFlag = oldMoveFlag;
                }
            }

            cadran1 = this.quadran_Out(pHo.roc.rcOldX1, pHo.roc.rcOldY1, pHo.roc.rcOldX2, pHo.roc.rcOldY2);
            if (cadran1 != CRun.BORDER_ALL) {        // Si deja completement dehors, on ne teste pas
                cadran2 = this.quadran_Out(pHo.hoX - pHo.hoImgXSpot, pHo.hoY - pHo.hoImgYSpot, pHo.hoX - pHo.hoImgXSpot + pHo.hoImgWidth, pHo.hoY - pHo.hoImgYSpot + pHo.hoImgHeight);

                chgDir = (~cadran1 & cadran2);
                if (chgDir != 0) {
                    pHo.rom.rmEventFlags |= CRMvt.EF_GOESOUTPLAYFIELD;
                    this.rhEvtProg.rhCurParam0 = chgDir;        // ou LOWORD?
                    this.rhEvtProg.handle_Event(pHo, (-12 << 16) | (pHo.hoType & 0xFFFF));  // CNDL_EXTOUTPLAYFIELD 
                }
            }
        }

        if ((pHo.hoLimitFlags & CObjInfo.OILIMITFLAGS_QUICKBACK) != 0) {
            if (pHo.roc.rcMovementType == CMoveDef.MVTYPE_PLATFORM) {
                pHo.rom.rmMovement.mpHandle_Background();
            } else {
                if (this.colMask_TestObject_IXY(pHo, pHo.roc.rcImage, pHo.roc.rcAngle, pHo.roc.rcScaleX, pHo.roc.rcScaleY, pHo.hoX, pHo.hoY, 0, CRunFrame.CM_TEST_PLATFORM)) {
                    this.rhEvtProg.handle_Event(pHo, ((-13 << 16) | (pHo.hoType & 0xFFFF)));
                }
            }
        }

        if ((pHo.hoLimitFlags & CObjInfo.OILIMITFLAGS_ONCOLLIDE) != 0) {
            var cnt = this.objectAllCol_IXY(pHo, pHo.roc.rcImage, pHo.roc.rcAngle, pHo.roc.rcScaleX, pHo.roc.rcScaleY, pHo.hoX, pHo.hoY, pHo.hoOiList.oilColList);
            if (cnt != null) {
                var obj;
                for (obj = 0; obj < cnt.size() ; obj++) {
                    var pHox = cnt.get(obj);
                    if ((pHox.hoFlags & CObject.HOF_DESTROYED) == 0) {
                        var type = pHo.hoType;
                        var pHo_esi = pHo;
                        var pHo_ebx = pHox;

                        if (pHo_esi.hoType > pHo_ebx.hoType) {
                            pHo_esi = pHox;
                            pHo_ebx = pHo;
                            type = pHo_esi.hoType;
                        }

                        this.rhEvtProg.rhCurParam0 = pHo_ebx.hoOi;
                        this.rhEvtProg.rh1stObjectNumber = pHo_ebx.hoNumber;
                        this.rhEvtProg.handle_Event(pHo_esi, (-14 << 16) | (type & 0xFFFF));
                    }
                }
            }
        }
        return CRun.bMoveChanged;
    },

    objectAllCol_IXY: function (pHo, newImg, newAngle, newScaleX, newScaleY, newX, newY, pOiColList) {
        var list = null;

        var rectX1 = newX - pHo.hoImgXSpot;
        var rectX2 = rectX1 + pHo.hoImgWidth;
        var rectY1 = newY - pHo.hoImgYSpot;
        var rectY2 = rectY1 + pHo.hoImgHeight;

        var image1;
        var pMask2;
        var image2;
        if ((pHo.hoFlags & CObject.HOF_NOCOLLISION) != 0 || (pHo.hoFlags & CObject.HOF_DESTROYED) != 0) {
            return list;
        }
        var bMask1 = false;
        var pMask1 = null;
        var image;
        var nLayer = -1;
        if (pHo.hoType == COI.OBJ_SPR && (pHo.ros.rsFlags & CRSpr.RSFLAG_COLBOX) == 0) {
            bMask1 = true;
        }
        if (pHo.hoType == COI.OBJ_SPR) {
            nLayer = pHo.ros.rsLayer;
        }

        var oldHoFlags = pHo.hoFlags;
        pHo.hoFlags |= CObject.HOF_NOCOLLISION;
        var count = 0;
        var i;
        var pHox;
        var xHox, yHox;

        if (pOiColList != null) {
            var nOi = 0;
            for (nOi = 0; nOi < pOiColList.length; nOi += 2) {
                var pOil = this.rhOiList[pOiColList[nOi + 1]];
                var object = pOil.oilObject;
                while ((object & 0x80000000) == 0) {
                    pHox = this.rhObjectList[object];
                    object = pHox.hoNumNext;

                    if ((pHox.hoFlags & CObject.HOF_NOCOLLISION) == 0 && (pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                        //adjust for hotspot
                        xHox = pHox.hoX - pHox.hoImgXSpot;
                        yHox = pHox.hoY - pHox.hoImgYSpot;

                        //check collision with bounds, this is teh entire bounds of the rotated object (this is the quickest at this stage)
                        if (xHox < rectX2 && xHox + pHox.hoImgWidth > rectX1 && yHox < rectY2 && yHox + pHox.hoImgHeight > rectY1) {
                            //what type of object is this?
                            switch (pHox.hoType) {
                                case COI.OBJ_SPR:
                                    //sprite, of course! (eg active object)
                                    if (nLayer < 0 || (nLayer >= 0 && nLayer == pHox.ros.rsLayer)) {
                                        if ((pHox.ros.rsFlags & CRSpr.RSFLAG_RAMBO) != 0) {
                                            //if we dont have mask for the object then add to the list
                                            if (bMask1 == false || (pHox.ros.rsFlags & CRSpr.RSFLAG_COLBOX) != 0) {
                                                if (list == null) {
                                                    list = new CArrayList();
                                                }
                                                list.add(pHox);
                                                break;
                                            }

                                            //get the mask1
                                            if (pMask1 == null) {
                                                image = this.rhApp.imageBank.getImageFromHandle(newImg);
                                                if (image != null) {
                                                    pMask1 = image.getMask(0, newAngle, newScaleX, newScaleY);
                                                }
                                            }

                                            //get mask2
                                            image2 = this.rhApp.imageBank.getImageFromHandle(pHox.roc.rcImage);
                                            if (image2 != null) {
                                                pMask2 = image2.getMask(0, pHox.roc.rcAngle, pHox.roc.rcScaleX, pHox.roc.rcScaleY);
                                            }

                                            //now test teh masks
                                            if (pMask1 != null && pMask2 != null) {
                                                if (pMask1.testMask(rectX1, rectY1, 0, pMask2, xHox, yHox, 0)) {
                                                    if (list == null) {
                                                        list = new CArrayList();
                                                    }
                                                    list.add(pHox);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    break;

                                case COI.OBJ_TEXT:
                                case COI.OBJ_COUNTER:
                                case COI.OBJ_LIVES:
                                case COI.OBJ_SCORE:
                                case COI.OBJ_CCA:
                                    if (list == null) {
                                        list = new CArrayList();
                                    }
                                    list.add(pHox);
                                    break;

                                default:
                                    if (list == null) {
                                        list = new CArrayList();
                                    }
                                    list.add(pHox);
                                    break;
                            }
                        }
                    }
                }
            }
        } else {
            for (i = 0; i < this.rhNObjects; i++) {
                while (this.rhObjectList[count] == null) {
                    count++;
                }
                pHox = this.rhObjectList[count];
                count++;

                if ((pHox.hoFlags & CObject.HOF_NOCOLLISION) == 0) {
                    xHox = pHox.hoX - pHox.hoImgXSpot;
                    yHox = pHox.hoY - pHox.hoImgYSpot;
                    if (xHox < rectX2 && xHox + pHox.hoImgWidth > rectX1 && yHox < rectY2 && yHox + pHox.hoImgHeight > rectY1) {
                        switch (pHox.hoType) {
                            case COI.OBJ_SPR:
                                if (nLayer < 0 || (nLayer >= 0 && nLayer == pHox.ros.rsLayer)) {
                                    if ((pHox.ros.rsFlags & CRSpr.RSFLAG_RAMBO) != 0) {
                                        if (bMask1 == false || (pHox.ros.rsFlags & CRSpr.RSFLAG_COLBOX) != 0) {
                                            if (list == null) {
                                                list = new CArrayList();
                                            }
                                            list.add(pHox);
                                            break;
                                        }
                                        if (pMask1 == null) {
                                            image = this.rhApp.imageBank.getImageFromHandle(newImg);
                                            if (image != null) {
                                                pMask1 = image.getMask(0, newAngle, newScaleX, newScaleY);
                                            }
                                        }
                                        image2 = this.rhApp.imageBank.getImageFromHandle(pHox.roc.rcImage);
                                        if (image2 != null) {
                                            pMask2 = image2.getMask(0, pHox.roc.rcAngle, pHox.roc.rcScaleX, pHox.roc.rcScaleY);
                                        }
                                        if (pMask1 != null && pMask2 != null) {
                                            if (pMask1.testMask(rectX1, rectY1, 0, pMask2, xHox, yHox, 0)) {
                                                if (list == null) {
                                                    list = new CArrayList();
                                                }
                                                list.add(pHox);
                                                break;
                                            }
                                        }
                                    }
                                }
                                break;
                            case COI.OBJ_TEXT:
                            case COI.OBJ_COUNTER:
                            case COI.OBJ_LIVES:
                            case COI.OBJ_SCORE:
                            case COI.OBJ_CCA:
                                if (list == null) {
                                    list = new CArrayList();
                                }
                                list.add(pHox);
                                break;
                            default:
                                if (list == null) {
                                    list = new CArrayList();
                                }
                                list.add(pHox);
                                break;
                        }
                    }
                }
            }
        }

        // Remettre anciens flags
        pHo.hoFlags = oldHoFlags;
        return list;
    },

    colMask_TestObject_IXY: function (pHo, newImg, newAngle, newScaleX, newScaleY, newX, newY, htFoot, plan) {
        var image;
        var mask;
        var x1;
        var y1;
        var x2;
        var y2;

        var pLayer = this.rhFrame.layers[pHo.hoLayer];
        switch (pHo.hoType) {
            case COI.OBJ_SPR:
                if ((pHo.ros.rsFlags & CRSpr.RSFLAG_COLBOX) == 0) {
                    image = this.rhApp.imageBank.getImageFromHandle(pHo.roc.rcImage);
                    if (image != null) {
                        mask = image.getMask(CMask.GCMF_OBSTACLE, newAngle, newScaleX, newScaleY);
                        return pLayer.testMask(mask, newX - this.rhWindowX, newY - this.rhWindowY, htFoot, plan) != null;
                    }
                } else {
                    x1 = newX - pHo.hoImgXSpot - this.rhWindowX;
                    y1 = newY - pHo.hoImgYSpot - this.rhWindowY;
                    x2 = x1 + pHo.hoImgWidth;
                    y2 = y1 + pHo.hoImgHeight;
                    var ret = pLayer.testRect(x1, y1, x2, y2, htFoot, plan) != null;
                    return ret;
                }
                return false;
                //            case COI.OBJ_TEXT:
                //            case COI.OBJ_SCORE:
                //            case COI.OBJ_LIVES:
                //            case COI.OBJ_CCA:
            default:
                x1 = newX - pHo.hoImgXSpot - this.rhWindowX;
                y1 = newY - pHo.hoImgYSpot - this.rhWindowY;
                x2 = x1 + pHo.hoImgWidth;
                y2 = y1 + pHo.hoImgHeight;
                var ret = pLayer.testRect(x1, y1, x2, y2, htFoot, plan) != null;
                return ret;
        }
    },

    colMask_Test_Rect: function (x1, y1, sx, sy, layer, plan) {
        var pLayer;
        var nLayerMax = layer;
        if (layer == -1) {
            layer = 0;
            nLayerMax = this.rhFrame.nLayers;
        }

        var n;
        var x2 = x1 + sx;
        var y2 = y1 + sy;
        for (n = layer; n < nLayerMax; n++) {
            pLayer = this.rhFrame.layers[n];
            if (pLayer.testRect(x1 - this.rhWindowX + pLayer.x, y1 - this.rhWindowY + pLayer.y, x2 - this.rhWindowX + pLayer.x, y2 - this.rhWindowY + pLayer.y, 0, plan) != null) {
                return true;
            }
        }
        return false;
    },

    colMask_Test_XY: function (newX, newY, layer, plan) {
        var pLayer;
        var nLayerMax = layer;
        if (layer == -1) {
            layer = 0;
            nLayerMax = this.rhFrame.nLayers;
        }

        var n;
        for (n = layer; n < nLayerMax; n++) {
            pLayer = this.rhFrame.layers[n];
            if (pLayer.testPoint(newX - this.rhWindowX + pLayer.x, newY - this.rhWindowY + pLayer.y, plan)) {
                return true;
            }
        }
        return false;
    },

    getObjectAtXY: function (x, y) {
        // Explore les sprites en collision
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var count = 0;
        var i;
        var pHox;
        var x1, y1, x2, y2;
        var currentHo = null;
        var currentIndex = -1;
        var index;

        for (i = 0; i < this.rhNObjects; i++) {
            while (this.rhObjectList[count] == null) {
                count++;
            }
            pHox = this.rhObjectList[count];
            count++;

            x1 = pHox.hoX - pHox.hoImgXSpot;
            y1 = pHox.hoY - pHox.hoImgYSpot;
            x2 = x1 + pHox.hoImgWidth;
            y2 = y1 + pHox.hoImgHeight;

            //check bounds
            if (x >= x1 && x < x2 && y >= y1 && y < y2 && (pHox.hoFlags & CObject.HOF_DESTROYED) == 0 && pHox.hoType == COI.OBJ_SPR) {
                //are we colliding with fine?
                if ((pHox.ros.rsFlags & CRSpr.RSFLAG_COLBOX) == 0) {
                    //yup, so test point
                    var image = this.rhApp.imageBank.getImageFromHandle(pHox.roc.rcImage);
                    var mask = image.getMask(CMask.GCMF_OBSTACLE, 0, 1.0, 1.0);
                    if (mask.testPointEx(x - pHox.hoX, y - pHox.hoY, pHox.roc.rcAngle, pHox.roc.rcScaleX, pHox.roc.rcScaleY)) {
                        index = pHox.getZOrder();
                        if (index > currentIndex) {
                            currentIndex = index;
                            currentHo = pHox;
                        }
                    }
                } else {
                    //nope so we have already collided with bounds
                    index = pHox.getZOrder();
                    if (index > currentIndex) {
                        currentIndex = index;
                        currentHo = pHox;
                    }
                }
            }
        }

        return currentHo;
    },

    quadran_Out: function (x1, y1, x2, y2) {
        var cadran = 0;
        if (x1 < 0) {
            cadran |= CRun.BORDER_LEFT;
        }
        if (y1 < 0) {
            cadran |= CRun.BORDER_TOP;
        }
        if (x2 > this.rhLevelSx) {
            cadran |= CRun.BORDER_RIGHT;
        }
        if (y2 > this.rhLevelSy) {
            cadran |= CRun.BORDER_BOTTOM;
        }
        return CRun.Table_InOut[cadran];
    },

    quadran_In: function (x1, y1, x2, y2) {
        var cadran = 15;
        if (x1 < this.rhLevelSx) {
            cadran &= ~CRun.BORDER_RIGHT;
        }
        if (y1 < this.rhLevelSy) {
            cadran &= ~CRun.BORDER_BOTTOM;
        }
        if (x2 > 0) {
            cadran &= ~CRun.BORDER_LEFT;
        }
        if (y2 > 0) {
            cadran &= ~CRun.BORDER_TOP;
        }
        return CRun.Table_InOut[cadran];
    },

    random: function (wMax) {
        var calcul = this.rh3Graine * 31415 + 1;
        calcul &= 0x0000FFFF;
        this.rh3Graine = calcul;
        return ((calcul * wMax) >>> 16);
    },

    get_Direction: function (dir) {
        if (dir == 0 || dir == -1) {
            return this.random(32);
        }

        var loop;
        var found = 0;
        var count = 0;
        var dirShift = dir;
        for (loop = 0; loop < 32; loop++) {
            if ((dirShift & 1) != 0) {
                count++;
                found = loop;
            }
            dirShift >>>= 1;
        }

        if (count == 1) {
            return found;
        }

        count = this.random(count);
        dirShift = dir;
        for (loop = 0; loop < 32; loop++) {
            if ((dirShift & 1) != 0) {
                count--;
                if (count < 0) {
                    return loop;
                }
            }
            dirShift >>>= 1;
        }
        return 0;
    },

    get_EventExpressionAny: function (pExp) {
        this.rh4Tokens = pExp.tokens;
        this.rh4CurToken = 0;
        this.flagFloat = false;
        return this.getExpression();

    },

    get_EventExpressionInt: function (pExp) {
        this.rh4Tokens = pExp.tokens;
        this.rh4CurToken = 0;
        this.flagFloat = false;
        return this.getExpression();
    },

    get_EventExpressionDouble: function (pExp) {
        this.rh4Tokens = pExp.tokens;
        this.rh4CurToken = 0;
        this.flagFloat = false;
        return this.getExpression();
    },

    get_EventExpressionString: function (pExp) {
        this.rh4Tokens = pExp.tokens;
        this.rh4CurToken = 0;
        this.flagFloat = false;
        var result = this.getExpression();
        if (typeof result == "string") {
            return result;
        }
        return "" + result;
    },

    get_ExpressionInt: function () {
        this.flagFloat = false;
        var value = this.getExpression();
        if (value < 0) {
            return Math.ceil(value);
        } else {
            return Math.floor(value);
        }
    },

    getExpression: function () {
        var ope;
        var pileStart = this.rh4PosPile;
        this.rh4Operators[this.rh4PosPile] = this.rh4OpeNull;
        do {
            this.rh4PosPile++;
            this.bOperande = true;
            this.rh4Tokens[this.rh4CurToken].evaluate(this);
            this.bOperande = false;
            this.rh4CurToken++;

            do {
                ope = this.rh4Tokens[this.rh4CurToken];
                if (ope && ope.code > 0 && ope.code < 0x00140000) {
                    if (ope.code > this.rh4Operators[this.rh4PosPile - 1].code) {
                        this.rh4Operators[this.rh4PosPile] = ope;
                        this.rh4CurToken++;

                        this.rh4PosPile++;
                        this.bOperande = true;
                        this.rh4Tokens[this.rh4CurToken].evaluate(this);
                        this.bOperande = false;
                        this.rh4CurToken++;
                    }
                    else {
                        this.rh4PosPile--;
                        this.rh4Operators[this.rh4PosPile].evaluate(this);
                    }
                }
                else {
                    this.rh4PosPile--;
                    if (this.rh4PosPile == pileStart) {
                        break;
                    }
                    this.rh4Operators[this.rh4PosPile].evaluate(this);
                }
            } while (true);
        } while (this.rh4PosPile > pileStart + 1);
        return this.rh4Results[pileStart + 1];
    },

    getCurrentResult: function () {
        return this.rh4Results[this.rh4PosPile];
    },

    getPreviousResult: function () {
        return this.rh4Results[this.rh4PosPile - 1];
    },

    getNextResult: function () {
        return this.rh4Results[this.rh4PosPile + 1];
    },

    update_PlayerObjects: function (joueur, type, value) {
        joueur++;

        var count = 0;
        var no;
        for (no = 0; no < this.rhNObjects; no++) {
            while (this.rhObjectList[count] == null) {
                count++;
            }
            var pHo = this.rhObjectList[count];
            if (pHo.hoType == type) {
                switch (type) {
                    case 5:
                        if (pHo.rsPlayer == joueur) {
                            pHo.setValue(value);
                        }
                        break;
                    case 6:
                        if (pHo.rsPlayer == joueur) {
                            pHo.setValue(value);
                        }
                        break;
                }
            }
            count++;
        }
    },

    actPla_FinishLives: function (joueur, live) {
        var lives = this.rhApp.getLives();
        if (live == lives[joueur]) {
            return;
        }

        if (live == 0) {
            if (lives[joueur] != 0) {
                this.rhEvtProg.push_Event(0, ((-5 << 16) | 0xFFF9), 0, null, joueur);
            }
        }

        lives[joueur] = live;
        this.update_PlayerObjects(joueur, COI.OBJ_LIVES, live);
    },

    getMouseOnObjectsEDX: function (oiList, nega) {
        var pHo = this.rhEvtProg.evt_FirstObject(oiList);
        if (pHo == null) {
            if (nega) {
                return true;
            }
            return false;
        }
        var cpt = this.rhEvtProg.evtNSelectedObjects;

        var count = 0;
        var i;
        var pHox;
        var x1, y1, x2, y2;
        var list = new CArrayList();
        for (i = 0; i < this.rhNObjects; i++) {
            while (this.rhObjectList[count] == null) {
                count++;
            }
            pHox = this.rhObjectList[count];
            count++;

            x1 = pHox.hoX - pHox.hoImgXSpot;
            y1 = pHox.hoY - pHox.hoImgYSpot;
            x2 = x1 + pHox.hoImgWidth;
            y2 = y1 + pHox.hoImgHeight;
            if (this.rh2MouseX >= x1 && this.rh2MouseX < x2 && this.rh2MouseY >= y1 && this.rh2MouseY < y2) {
                if ((pHox.hoFlags & CObject.HOF_DESTROYED) == 0) {
                    if (pHox.hoType == COI.OBJ_SPR) {
                        if ((pHox.ros.rsFlags & CRSpr.RSFLAG_COLBOX) == 0) {
                            var image = this.rhApp.imageBank.getImageFromHandle(pHox.roc.rcImage);
                            var mask = image.getMask(CMask.GCMF_OBSTACLE, 0, 1.0, 1.0);
                            if (mask.testPointEx(this.rh2MouseX - pHox.hoX, this.rh2MouseY - pHox.hoY, pHox.roc.rcAngle, pHox.roc.rcScaleX, pHox.roc.rcScaleY)) {
                                list.add(pHox);
                            }
                        }
                        else {
                            list.add(pHox);
                        }
                    }
                    else {
                        list.add(pHox);
                    }
                }
            }
        }

        if (list.size() == 0) {
            if (nega) {
                return true;
            }
            return false;
        }

        if (nega == false) {
            do {
                for (count = 0; count < list.size() ; count++) {
                    pHox = list.get(count);
                    if (pHox == pHo) {
                        break;
                    }
                }
                if (count == list.size()) {
                    cpt--;                        //; Pas trouve dans la liste. on le vire
                    this.rhEvtProg.evt_DeleteCurrentObject();
                }
                pHo = this.rhEvtProg.evt_NextObject();
            } while (pHo != null);
            return cpt != 0;
        }
        else {
            do {
                for (count = 0; count < list.size() ; count++) {
                    pHox = list.get(count);
                    if (pHox == pHo) {
                        return false;
                    }
                }
                pHo = this.rhEvtProg.evt_NextObject();
            } while (pHo != null);
            return true;
        }
    },

    txtDisplay: function (pe, oi, txtNumber) {
        var pEvp = pe.evtParams[0];
        var pInfo = new CPositionInfo();
        if (pEvp.read_Position(this, 0x10, pInfo)) {
            var count = 0;
            var no;
            for (no = 0; no < this.rhNObjects; no++) {
                while (this.rhObjectList[count] == null) {
                    count++;
                }
                var pHo = this.rhObjectList[count];
                count++;

                if (pHo.hoType == COI.OBJ_TEXT && pHo.hoOi == oi && pHo.hoX == pInfo.x && pHo.hoY == pInfo.y) {
                    pHo.ros.obShow();
                    pHo.hoFlags &= ~CObject.HOF_NOCOLLISION;
                    pHo.rsMini = -2;
                    pHo.txtChange(txtNumber);
                    pHo.ros.rsFlash = 0;
                    pHo.ros.rsFlags |= CRSpr.RSFLAG_VISIBLE;
                    return pHo.hoNumber;
                }
            }
            var num = this.f_CreateObject(-1, oi, pInfo.x, pInfo.y, 0, 0, this.rhFrame.nLayers - 1, -1);
            if (num >= 0) {
                this.rhObjectList[num].txtChange(txtNumber);
                return num;
            }
        }
        return -1;
    },

    txtDoDisplay: function (pe, txtNumber) {
        if ((pe.evtOiList & 0x8000) == 0) {
            return this.txtDisplay(pe, pe.evtOi, txtNumber);
        }

        if ((pe.evtOiList & 0x7FFF) == 0x7FFF) {
            return -1;
        }
        var qoi = pe.evtOiList & 0x7FFF;
        var qoil = this.rhEvtProg.qualToOiList[qoi];
        var count = 0;
        while (count < qoil.qoiList.length) {
            this.txtDisplay(pe, qoil.qoiList[count], txtNumber);
            count += 2;
        }
        ;
        return -1;
    },

    init_Disappear: function (hoPtr) {
        var bFlag = false;
        var dw = 0;

        if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_ANIMATIONS) != 0) {
            if (hoPtr.ros != null) {
                if (hoPtr.ros.initFadeOut()) {
                    return;
                }
            }
            if (hoPtr.roa != null) {
                if (hoPtr.roa.anim_Exist(CAnim.ANIMID_DISAPPEAR)) {
                    dw = 1;
                }
            }
        }
        if (dw == 0) {
            bFlag = true;
        }

        if (bFlag) {
            hoPtr.hoCallRoutine = false;
            this.addToDestroyList(hoPtr.hoNumber);
            return;
        }

        if (hoPtr.ros != null) {
            hoPtr.ros.setColFlag(false);
            hoPtr.hoFlags |= CObject.HOF_NOCOLLISION;
        }
        if (hoPtr.rom != null) {
            hoPtr.rom.kill(false);
            hoPtr.rom.initSimple(hoPtr, CMoveDef.MVTYPE_DISAPPEAR, false);
            hoPtr.roc.rcSpeed = 0;
        }
        if ((dw & 1) != 0) {
            hoPtr.roa.animation_Force(CAnim.ANIMID_DISAPPEAR);
            hoPtr.roa.animation_OneLoop();
        }
    },

    isMouseOn: function () {
        if (this.rhApp.cursorCount > 0) {
            return true;
        }
        return false;
    },

    getRGBAt: function (hoPtr, x, y) {
        var rgb = 0;
        if (hoPtr.roc.rcImage != -1) {
            var image = this.rhApp.imageBank.getImageFromHandle(hoPtr.roc.rcImage);
            rgb = image.getPixel(x, y);
            rgb = swapRGB(rgb);
        }
        return rgb;
    },

    createBackdropInstances: function () {
        var plo;
        var rc = new CRect();
        var nLayer;

        for (nLayer = 0; nLayer < this.rhFrame.nLayers; nLayer++) {
            var pLayer = this.rhFrame.layers[nLayer];

            var bWrapHorz = ((pLayer.dwOptions & CLayer.FLOPT_WRAP_HORZ) != 0);
            var bWrapVert = ((pLayer.dwOptions & CLayer.FLOPT_WRAP_VERT) != 0);

            if (nLayer == 0) {
                var sx = this.rhFrame.leWidth;
                if (bWrapHorz) {
                    sx *= 2;
                }
                var sy = this.rhFrame.leHeight;
                if (bWrapVert) {
                    sy *= 2;
                }
            }

            //this looks like we are constructing the backdrop instances
            var nLOs = pLayer.nBkdLOs;
            var i;
            for (i = 0; i < nLOs; i++) {
                plo = this.rhFrame.LOList.getLOFromIndex(pLayer.nFirstLOIndex + i);
                var typeObj = plo.loType;

                if (typeObj < COI.OBJ_SPR) {
                    rc.left = plo.loX;
                    rc.top = plo.loY;
                }

                //TODO: so I am not sure what happens to "bi"
                var bi;
                bi = new CBackInstance(this.rhApp, rc.left, rc.top, plo, null, 0);
                bi.addInstance(0, pLayer);

                if (bWrapHorz) {
                    bi = new CBackInstance(this.rhApp, this.rhFrame.leWidth + rc.left, rc.top, plo, null, 0);
                    bi.addInstance(1, pLayer);
                    if (rc.left + bi.width > this.rhFrame.leWidth) {
                        bi = new CBackInstance(this.rhApp, rc.left - this.rhFrame.leWidth, rc.top, plo, null, 0);
                        bi.addInstance(4, pLayer);
                    }
                    if (bWrapVert) {
                        bi = new CBackInstance(this.rhApp, rc.left, this.rhFrame.leHeight + rc.top, plo, null, 0);
                        bi.addInstance(2, pLayer);
                        bi = new CBackInstance(this.rhApp, this.rhFrame.leWidth + rc.left, this.rhFrame.leHeight + rc.top, plo, null, 0);
                        bi.addInstance(3, pLayer);
                        if (rc.top + bi.height > this.rhFrame.leHeight) {
                            bi = new CBackInstance(this.rhApp, rc.left, rc.top - this.rhFrame.leHeight, plo, null, 0);
                            bi.addInstance(5, pLayer);
                        }
                    }
                } else if (bWrapVert) {
                    bi = new CBackInstance(this.rhApp, rc.left, this.rhFrame.leHeight + rc.top, plo, null, 0);
                    bi.addInstance(2, pLayer);
                    if (rc.top + bi.height > this.rhFrame.leHeight) {
                        bi = new CBackInstance(this.rhApp, rc.left, rc.top - this.rhFrame.leHeight, plo, null, 0);
                        bi.addInstance(5, pLayer);
                    }
                }
            }
        }
    },

    scrollLayers: function () {
        //this is only called from the Layer controller object. It is used to update the layer offsets!
        var layer;

        //get current scroll of frame
        var frameX = this.rh3DisplayX;
        var frameY = this.rh3DisplayY;

        var newLayerX, newLayerY;
        for (var index = 0; index < this.rhFrame.nLayers; index++) {
            //get layer
            layer = this.rhFrame.layers[index];

            newLayerX = frameX;
            newLayerY = frameY;

            if ((layer.dwOptions & (CLayer.FLOPT_XCOEF | CLayer.FLOPT_YCOEF)) != 0) {
                if ((layer.dwOptions & CLayer.FLOPT_XCOEF) != 0) {
                    newLayerX *= layer.xCoef;
                }

                if ((layer.dwOptions & CLayer.FLOPT_YCOEF) != 0) {
                    newLayerY *= layer.yCoef;
                }
            }

            //add old layer position
            newLayerX += layer.realX;
            newLayerY += layer.realY;

            //add layer change value
            newLayerX += layer.dx;
            newLayerY += layer.dy;

            //do wrapping
            var bWrapHorz = ((layer.dwOptions & CLayer.FLOPT_WRAP_HORZ) != 0);
            var bWrapVert = ((layer.dwOptions & CLayer.FLOPT_WRAP_VERT) != 0);

            if (bWrapHorz) {
                newLayerX %= this.rhFrame.leWidth;
            }

            if (bWrapVert) {
                newLayerY %= this.rhFrame.leHeight;
            }

            /*
            if (bWrapHorz) {
                if (newLayerX < 0) {
                    newLayerX = newLayerX % this.rhFrame.leWidth + this.rhFrame.leWidth;
                }

                if (newLayerX > this.rhFrame.leWidth) {
                    newLayerX = newLayerX % this.rhFrame.leWidth;
                }
            }

            if (bWrapVert) {
                if (newLayerY < 0) {
                    newLayerY = newLayerY % this.rhFrame.leHeight + this.rhFrame.leHeight;
                }

                if (newLayerY > this.rhFrame.leHeight) {
                    newLayerY = newLayerY % this.rhFrame.leHeight;
                }
            }
            */

            //update layer
            layer.x = newLayerX;
            layer.y = newLayerY;
            layer.realX += layer.dx;
            layer.realY += layer.dy;

            //we also need to update the scene nodes as they are rendered seperate
            layer.planeBack.x = -newLayerX + this.rhApp.xOffset;//xOffset and yOffset are not used (try searching for .xOffset in all files in android runtime too)
            layer.planeBack.y = -newLayerY + this.rhApp.yOffset;
            layer.planeQuickDisplay.x = -newLayerX + this.rhApp.xOffset;
            layer.planeQuickDisplay.y = -newLayerY + this.rhApp.yOffset;
            layer.planeSprites.x = -newLayerX + this.rhApp.xOffset;
            layer.planeSprites.y = -newLayerY + this.rhApp.yOffset;
        }

        //update frame position
        this.rhFrame.leX = frameX;
        this.rhFrame.leY = frameY;
    },

    hideLayer: function (nLayer) {
        if (nLayer >= 0 && nLayer < this.rhFrame.nLayers) {
            var layer = this.rhFrame.layers[nLayer];
            layer.hide();
        }
    },

    showLayer: function (nLayer) {
        if (nLayer >= 0 && nLayer < this.rhFrame.nLayers) {
            var layer = this.rhFrame.layers[nLayer];
            layer.show();
        }
    },

    hideShowLayers: function () {
        var n;
        for (n = 0; n < this.rhFrame.nLayers; n++) {
            var layer = this.rhFrame.layers[n];
            if (layer.dwOptions & CLayer.FLOPT_TOHIDE) {
                layer.hide();
            }
        }
    },

    setDisplay: function (x, y, nLayer, flags) {
        x -= Math.floor(this.rh3WindowSx / 2);
        y -= Math.floor(this.rh3WindowSy / 2);

        var xf = x;
        var yf = y;

        if (nLayer != -1 && nLayer < this.rhFrame.nLayers) {
            var pLayer = this.rhFrame.layers[nLayer];
            if (pLayer.xCoef > 1.0) {
                var dxf = (xf - this.rhWindowX);
                dxf /= pLayer.xCoef;
                xf = CServices.floatToInt(this.rhWindowX + dxf);
            }
            if (pLayer.yCoef > 1.0) {
                var dyf = (yf - this.rhWindowY);
                dyf /= pLayer.yCoef;
                yf = CServices.floatToInt(this.rhWindowY + dyf);
            }
        }

        x = xf;
        y = yf;

        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }
        var x2 = x + this.rh3WindowSx;
        var y2 = y + this.rh3WindowSy;
        if (x2 > this.rhLevelSx) {
            x2 = this.rhLevelSx - this.rh3WindowSx;
            if (x2 < 0) {
                x2 = 0;
            }
            x = x2;
        }
        if (y2 > this.rhLevelSy) {
            y2 = this.rhLevelSy - this.rh3WindowSy;
            if (y2 < 0) {
                y2 = 0;
            }
            y = y2;
        }

        if ((flags & 1) != 0) {
            if (x != this.rhWindowX) {
                this.rh3DisplayX = x;
                this.rh3Scrolling |= CRun.RH3SCROLLING_SCROLL;
            }
        }
        if ((flags & 2) != 0) {
            if (y != this.rhWindowY) {
                this.rh3DisplayY = y;
                this.rh3Scrolling |= CRun.RH3SCROLLING_SCROLL;
            }
        }
    },

    updateWindowPos: function (newX, newY) {
        var hasMoved = false;

        this.rh4WindowDeltaX = newX - this.rhWindowX;
        this.rh4WindowDeltaY = newY - this.rhWindowY;

        //check if the main frame is moving
        if (this.rh4WindowDeltaX != 0 || this.rh4WindowDeltaY != 0) {
            hasMoved = true;
        }

        //check if any layers are moving
        var pLayer;
        if (!hasMoved) {
            for (var i = 0; i < this.rhFrame.nLayers; i++) {
                pLayer = this.rhFrame.layers[i];

                if (pLayer.dx != 0 || pLayer.dy != 0) {
                    hasMoved = true;
                    break;
                }
            }
        }

        var nOldX = this.rhWindowX;
        var nOldY = this.rhWindowY;
        var nNewX = newX;
        var nNewY = newY;
        var nDeltaX = this.rh4WindowDeltaX;
        var nDeltaY = this.rh4WindowDeltaY;

        this.rhWindowX = newX;
        this.rh3XMinimum = newX - CRun.COLMASK_XMARGIN;
        if (this.rh3XMinimum < 0) {
            this.rh3XMinimum = this.rh3XMinimumKill;
        }

        this.rhWindowY = newY;
        this.rh3YMinimum = newY - CRun.COLMASK_YMARGIN;
        if (this.rh3YMinimum < 0) {
            this.rh3YMinimum = this.rh3YMinimumKill;
        }

        this.rh3XMaximum = newX + this.rh3WindowSx + CRun.COLMASK_XMARGIN;
        if (this.rh3XMaximum > this.rhLevelSx) {
            this.rh3XMaximum = this.rh3XMaximumKill;
        }

        this.rh3YMaximum = newY + this.rh3WindowSy + CRun.COLMASK_YMARGIN;
        if (this.rh3YMaximum > this.rhLevelSy) {
            this.rh3YMaximum = this.rh3YMaximumKill;
        }

        //need to update the objects (only if something has moved above) (todo: do we actually have to do this, as we now have CSceneNode?)
        if (hasMoved) {
            var count = 0;
            for (var index = 0; index < this.rhNObjects; index++) {
                //find next valid object
                while (this.rhObjectList[count] == null) {
                    count++;
                }
                var pHo = this.rhObjectList[count];
                count++;

                //do something
                if ((pHo.hoOEFlags & CObjectCommon.OEFLAG_SCROLLINGINDEPENDANT) != 0) {
                    //so this is a "dont follow the frame" positioning.
                    if (pHo.rom == null) {
                        pHo.hoX += nDeltaX;
                        pHo.hoY += nDeltaY;

                    } else {
                        pHo.rom.rmMovement.setXPosition(pHo.hoX + nDeltaX);
                        pHo.rom.rmMovement.setYPosition(pHo.hoY + nDeltaY);
                    }
                } else {
                    //DOES follow the frame
                    var layerIndex = pHo.hoLayer;
                    if (layerIndex < this.rhFrame.nLayers) {
                        var oldLayerDx = nOldX;
                        var oldLayerDy = nOldY;
                        var newLayerDx = nNewX;
                        var newLayerDy = nNewY;

                        pLayer = this.rhFrame.layers[layerIndex];
                        if ((pLayer.dwOptions & CLayer.FLOPT_XCOEF) != 0) {
                            oldLayerDx = (pLayer.xCoef * oldLayerDx);
                            newLayerDx = (pLayer.xCoef * newLayerDx);
                        }

                        if ((pLayer.dwOptions & CLayer.FLOPT_YCOEF) != 0) {
                            oldLayerDy = (pLayer.yCoef * oldLayerDy);
                            newLayerDy = (pLayer.yCoef * newLayerDy);
                        }

                        var nX = (pHo.hoX + oldLayerDx) - newLayerDx + nDeltaX - pLayer.dx;
                        var nY = (pHo.hoY + oldLayerDy) - newLayerDy + nDeltaY - pLayer.dy;

                        if ((pHo.hoOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) == 0) {
                            pHo.hoX = nX;
                            pHo.hoY = nY;
                        } else {
                            pHo.rom.rmMovement.setXPosition(nX);
                            pHo.rom.rmMovement.setYPosition(nY);
                        }

                        //this allows objects to do weird stuff with their positions. seems to be only used in CRunControl (as those fake stuff with html gadgets)
                        pHo.forcePosition();
                    }
                }
            }
        }
    },

    doScroll: function () {
        if ((this.rh3Scrolling & CRun.RH3SCROLLING_SCROLL) != 0) {
            this.rh3Scrolling = 0;

            //check for update
            var update = this.rhFrame.leX != this.rh3DisplayX || this.rhFrame.leY != this.rh3DisplayY;
            if (!update) {
                //are there any layers that trigger an update?
                for (var index = 0; index < this.rhFrame.nLayers; index++) {
                    if (this.rhFrame.layers[index].dx != 0.0 || this.rhFrame.layers[index].dy != 0.0) {
                        update = true;
                        break;
                    }
                }
            }

            if (update) {
                this.scrollLayers();
                this.updateWindowPos(this.rhFrame.leX, this.rhFrame.leY);

                //reset all layer dx/dy
                for (var index = 0; index < this.rhFrame.nLayers; index++) {
                    this.rhFrame.layers[index].dx = 0.0;
                    this.rhFrame.layers[index].dy = 0.0;
                }
            }

            this.rh3DisplayX = this.rhWindowX;
            this.rh3DisplayY = this.rhWindowY;
        }
    },

    activeToBackdrop: function (pHo, colType) {
        var pLayer = this.rhFrame.layers[pHo.hoLayer];
        var image = this.rhApp.imageBank.getImageFromHandle(pHo.roc.rcImage);

        var bi = new CBackInstance(this.rhApp, pHo.hoX - this.rhWindowX + pLayer.x, pHo.hoY - this.rhWindowY + pLayer.y, null, image, colType);
        bi.setEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
        bi.addInstance(0, pLayer);

        if (colType == COC.OBSTACLE_SOLID || colType == COC.OBSTACLE_PLATFORM) {
            if (this.rh4Box2DBase != null) {
                bi.body = this.rh4Box2DBase.rAddABackdrop(pHo.hoX - this.rhWindowX + pLayer.x, pHo.hoY - this.rhWindowY + pLayer.y, pHo.roc.rcImage, colType);
            }
        }

        var bWrapHorz = ((pLayer.dwOptions & CLayer.FLOPT_WRAP_HORZ) != 0);
        var bWrapVert = ((pLayer.dwOptions & CLayer.FLOPT_WRAP_VERT) != 0);
        if (bWrapHorz) {
            bi = new CBackInstance(this.rhApp, this.rhFrame.leWidth + pHo.hoX - this.rhWindowX + pLayer.x, pHo.hoY - this.rhWindowY + pLayer.y, null, image, colType);
            bi.setEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
            bi.addInstance(1, pLayer);
            if (pHo.hoX + bi.width > this.rhFrame.leWidth) {
                bi = new CBackInstance(this.rhApp, pHo.hoX - this.rhWindowX + pLayer.x - this.rhFrame.leWidth, pHo.hoY - this.rhWindowY + pLayer.y, null, image, colType);
                bi.setEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
                bi.addInstance(4, pLayer);
            }
            if (bWrapVert) {
                bi = new CBackInstance(this.rhApp, pHo.hoX - this.rhWindowX + pLayer.x, this.rhFrame.leHeight + pHo.hoY - this.rhWindowY + pLayer.y, null, image, colType);
                bi.setEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
                bi.addInstance(2, pLayer);
                bi = new CBackInstance(this.rhApp, this.rhFrame.leWidth + pHo.hoX - this.rhWindowX + pLayer.x, this.rhFrame.leHeight + pHo.hoY - this.rhWindowY + pLayer.y, null, image, colType);
                bi.setEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
                bi.addInstance(3, pLayer);
                if (pHo.hoY + bi.height > this.rhFrame.leHeight) {
                    bi = new CBackInstance(this.rhApp, pHo.hoX - this.rhWindowX + pLayer.x, pHo.hoY - this.rhWindowY + pLayer.y - this.rhFrame.leHeight, null, image, colType);
                    bi.setEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
                    bi.addInstance(5, pLayer);
                }
            }
        }
        else if (bWrapVert) {
            bi = new CBackInstance(this.rhApp, pHo.hoX - this.rhWindowX + pLayer.x, this.rhFrame.leHeight + pHo.hoY - this.rhWindowY + pLayer.y, null, image, colType);
            bi.setEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
            bi.addInstance(2, pLayer);
            if (pHo.hoY + bi.height > this.rhFrame.leHeight) {
                bi = new CBackInstance(this.rhApp, pHo.hoX - this.rhWindowX + pLayer.x, pHo.hoY - this.rhWindowY + pLayer.y - this.rhFrame.leHeight, null, image, colType);
                bi.setEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
                bi.addInstance(5, pLayer);
            }
        }
    },

    addBackdrop: function (srceImage, x, y, layer, colType, addToWorld) {
        var pLayer = this.rhFrame.layers[layer];
        var bi = new CBackInstance(this.rhApp, x - this.rhWindowX + pLayer.x, y - this.rhWindowX + pLayer.y, null, srceImage, colType);
        bi.addInstance(0, pLayer);
        if (addToWorld) {
            if (colType == COC.OBSTACLE_SOLID || colType == COC.OBSTACLE_PLATFORM) {
                if (this.rh4Box2DBase != null) {
                    bi.body = this.rh4Box2DBase.rAddABackdrop(pHo.hoX - this.rhWindowX + pLayer.x, pHo.hoY - this.rhWindowY + pLayer.y, pHo.roc.rcImage, colType);
                }
            }
        }

        var bWrapHorz = ((pLayer.dwOptions & CLayer.FLOPT_WRAP_HORZ) != 0);
        var bWrapVert = ((pLayer.dwOptions & CLayer.FLOPT_WRAP_VERT) != 0);

        // Wrap
        if (bWrapHorz) {
            bi = new CBackInstance(this.rhApp, this.rhFrame.leWidth + x - this.rhWindowX + pLayer.x, y - this.rhWindowY + pLayer.y, null, srceImage, colType);
            bi.addInstance(1, pLayer);
            if (x + bi.width > this.rhFrame.leWidth) {
                bi = new CBackInstance(this.rhApp, x - this.rhWindowX + pLayer.x - this.rhFrame.leWidth, y - this.rhWindowY + pLayer.y, null, srceImage, colType);
                bi.addInstance(4, pLayer);
            }
            if (bWrapVert) {
                bi = new CBackInstance(this.rhApp, x - this.rhWindowX + pLayer.x, this.rhFrame.leHeight + y - this.rhWindowY + pLayer.y, null, srceImage, colType);
                bi.addInstance(2, pLayer);
                bi = new CBackInstance(this.rhApp, this.rhFrame.leWidth + x - this.rhWindowX + pLayer.x, this.rhFrame.leHeight + y - this.rhWindowY + pLayer.y, null, srceImage, colType);
                bi.addInstance(3, pLayer);
                if (y + bi.height > this.rhFrame.leHeight) {
                    bi = new CBackInstance(this.rhApp, x - this.rhWindowX + pLayer.x, y - this.rhWindowY + pLayer.y - this.rhFrame.leHeight, null, srceImage, colType);
                    bi.addInstance(5, pLayer);
                }
            }
        }
        else if (bWrapVert) {
            bi = new CBackInstance(this.rhApp, x - this.rhWindowX + pLayer.x, this.rhFrame.leHeight + y - this.rhWindowY + pLayer.y, null, srceImage, colType);
            bi.addInstance(2, pLayer);
            if (y + bi.height > this.rhFrame.leHeight) {
                bi = new CBackInstance(this.rhApp, x - this.rhWindowX + pLayer.x, y - this.rhWindowY + pLayer.y - this.rhFrame.leHeight, null, srceImage, colType);
                bi.addInstance(5, pLayer);
            }
        }

    },

    deleteAllBackdrop2: function (layer) {
        if (layer < 0 || layer >= this.rhFrame.nLayers) {
            return;
        }
        var pLayer = this.rhFrame.layers[layer];
        pLayer.deleteAddedBackdrops();
    },

    deleteBackdropAt: function (layer, xx, yy, fine) {
        if (layer < 0 || layer >= this.rhFrame.nLayers) {
            return;
        }
        var pLayer = this.rhFrame.layers[layer];
        pLayer.deleteAddedBackdropsAt(xx - this.rhWindowX, yy - this.rhWindowY, fine);
    },

    getStorage: function (id) {
        if (this.rhApp.extensionStorage != null) {
            var n;
            for (n = 0; n < this.rhApp.extensionStorage.size() ; n++) {
                var e = this.rhApp.extensionStorage.get(n);
                if (e.id == id) {
                    return e;
                }
            }
        }
        return null;
    },

    delStorage: function (id) {
        if (this.rhApp.extensionStorage != null) {
            for (var n = 0; n < this.rhApp.extensionStorage.size() ; n++) {
                var e = this.rhApp.extensionStorage.get(n);
                if (e.id == id) {
                    this.rhApp.extensionStorage.removeIndex(n);
                }
            }
        }
    },

    addStorage: function (data, id) {
        var e = this.getStorage(id);
        if (e == null) {
            if (this.rhApp.extensionStorage == null) {
                this.rhApp.extensionStorage = new CArrayList();
            }
            data.id = id;
            this.rhApp.extensionStorage.add(data);
        }
    },

    getXMouse: function () {
        if (this.rhMouseUsed != 0) {
            return 0;
        }
        return this.rh2MouseX;
    },

    getYMouse: function () {
        if (this.rhMouseUsed != 0) {
            return 0;
        }
        return this.rh2MouseY;
    },

    onMouseWheel: function (delta) {
        this.rhWheelCount = this.rh4EventCount;
        if (delta < 0) {
            this.rhEvtProg.handle_GlobalEvents(((-12 << 16) | 0xFFFA));
        }// CNDL_ONMOUSEHWEELDOWN
        else {
            this.rhEvtProg.handle_GlobalEvents(((-11 << 16) | 0xFFFA));
        }        // CNDL_ONMOUSEHWEELUP
    },

    findFirstObject: function (name) {
        var n, explore;
        if (this.rhNObjects != 0) {
            for (n = 0; n < this.rhMaxObjects; n++) {
                explore = this.rhObjectList[n];
                if (explore && explore.hoOiList.oilName == name) {
                    this.findObjectCount = explore.hoOiList.oilNObjects - 1;
                    return explore;
                }
            }
        }
        return null;
    },

    findNextObject: function (object) {
        if (object && this.findObjectCount) {
            var n = object.hoNumber + 1;
            var name = object.hoOiList.oilName;
            var explore;
            while (true) {
                explore = this.rhObjectList[n];
                if (explore != null && explore.hoOiList.oilName == name) {
                    this.findObjectCount--;
                    return explore;
                }
                n++;
            }
        }
        this.findObjectCount = 0;
        return null;
    }
}
