// CRunFrame object
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

CRunFrame.LEF_DISPLAYNAME = 0x0001;
CRunFrame.LEF_GRABDESKTOP = 0x0002;
CRunFrame.LEF_KEEPDISPLAY = 0x0004;
CRunFrame.LEF_TOTALCOLMASK = 0x0020;
CRunFrame.LEF_RESIZEATSTART = 0x0100;
CRunFrame.LEF_NOSURFACE = 0x0800;
CRunFrame.LEF_TIMEDMVTS = 0x8000;
CRunFrame.LEF_TRANSPARENTBKD = 0x20000;
CRunFrame.CM_TEST_OBSTACLE = 0;
CRunFrame.CM_TEST_PLATFORM = 1;
CRunFrame.CM_OBSTACLE = 0x0001;
CRunFrame.CM_PLATFORM = 0x0002;
CRunFrame.HEIGHT_PLATFORM = 6;
CRunFrame.HTML5FOPT_DISPLAYPRELOADER = 0x0100;
CRunFrame.IPHONEOPT_JOYSTICK_FIRE1 = 0x0001;
CRunFrame.IPHONEOPT_JOYSTICK_FIRE2 = 0x0002;
CRunFrame.IPHONEOPT_JOYSTICK_LEFTHAND = 0x0004;

function CRunFrame(a) {
    this.app = a;
    this.rhPtr = null;

    this.leWidth = 0;
    this.leHeight = 0;
    this.leBackground = 0;
    this.leClearBackground = false;
    this.leFlags = 0;

    this.leVirtualRect = null;
    this.leEditWinWidth = 0;
    this.leEditWinHeight = 0;
    this.frameName = null;
    this.nLayers = 0;
    this.layers = null;
    this.LOList = null;
    this.evtProg = null;
    this.maxObjects = 0;

    this.leX = 0;
    this.leY = 0;
    this.leLastScrlX = 0;
    this.leLastScrlY = 0;

    this.startLeX = 0;
    this.startLeY = 0;
    this.m_wRandomSeed = 0;
    this.m_dwMvtTimerBase = 0;
    this.fadeIn = null;
    this.fadeOut = null;
    this.mosaicHandles = null;
    this.mosaicX = null;
    this.mosaicY = null;
    this.mosaicMaxHandle = 0;
    this.virtualJoystickType = CVirtualJoystick.TYPE_NONE;
    this.html5Options = 0;

    this.virtualMouseOptionEnabled = CVirtualMouse.INHERIT;
    this.virtualMouseOptionVisible = CVirtualMouse.INHERIT;
}

CRunFrame.prototype = {
    loadFullFrame: function (index) {
        // Positionne le fichier
        this.app.file.seek(this.app.frameOffsets[index]);

        // Charge la frame
        this.evtProg = new CEventProgram(this.app);
        this.LOList = new CLOList();
        this.leVirtualRect = new CRect();

        //process frame chunks
        var chID = 0, chFlags, chSize;
        var posEnd;
        var nOldFrameWidth = 0;
        var nOldFrameHeight = 0;
        this.m_wRandomSeed = -1;
        while (chID != 0x7F7F) {
            chID = this.app.file.readAShort();
            chFlags = this.app.file.readAShort();
            chSize = this.app.file.readAInt();

            if (chSize == 0) {
                continue;
            }

            this.posEnd = this.app.file.getFilePointer() + chSize;

            switch (chID) {
                case 0x3334:
                    this.loadHeader();
                    if (this.app.parentApp != null && (this.app.parentOptions & CCCA.CCAF_DOCKED) != 0) {
                        this.leEditWinWidth = this.app.cx;
                        this.leEditWinHeight = this.app.cy;
                    }
                    else {
                        this.leEditWinWidth = Math.min(this.app.gaCxWin, this.leWidth);
                        this.leEditWinHeight = Math.min(this.app.gaCyWin, this.leHeight);
                    }
                    break;

                // CHUNK_MOSAICIMAGETABLE
                case 0x3348:
                    var number = chSize / (3 * 2);
                    this.mosaicHandles = new Array(number);
                    this.mosaicX = new Array(number);
                    this.mosaicY = new Array(number);
                    this.mosaicMaxHandle = 0;
                    var n;
                    for (n = 0; n < number; n++) {
                        this.mosaicHandles[n] = this.app.file.readAShort();
                        this.mosaicMaxHandle = Math.max(this.mosaicMaxHandle, this.mosaicHandles[n]);
                        this.mosaicX[n] = this.app.file.readAShort();
                        this.mosaicY[n] = this.app.file.readAShort();
                    }
                    this.mosaicMaxHandle++;
                    break;

                // CHUNK_FRAME_HTML5_OPTIONS
                case 0x334A:
                    this.virtualJoystickType = this.app.file.readAShort();
                    this.html5Options = this.app.file.readAShort();
                    break;

                case 0x3342:
                    this.leVirtualRect.load(this.app.file);
                    break;

                case 0x3344:
                    this.m_wRandomSeed = this.app.file.readAShort();
                    break;

                case 0x3347:
                    this.m_dwMvtTimerBase = this.app.file.readAInt();
                    break;

                case 0x3335:
                    this.frameName = this.app.file.readAString();
                    break;

                // CHUNK_FRAMEFADEIN
                case 0x333B:
                    this.fadeIn = new CTransitionData();
                    this.fadeIn.load(this.app.file);
                    break;

                // CHUNK_FRAMEFADEOUT
                case 0x333C:
                    this.fadeOut = new CTransitionData();
                    this.fadeOut.load(this.app.file);
                    break;

                //CHUNK_FRAME_WUA_OPTIONS (this might also contain flags universal to all html5 runtimes)
                case 0x334B:
                    this.virtualMouseOptionEnabled = this.app.file.readShort();
                    this.virtualMouseOptionVisible = this.app.file.readShort();
                    break;

                case 0x3341:
                    this.loadLayers();
                    break;

                case 0x3345:
                    this.loadLayerEffects();
                    break;

                case 0x3338:
                    this.LOList.load(this.app);
                    break;

                case 0x333D:
                    this.evtProg.load(this.app);
                    this.maxObjects = this.evtProg.maxObjects;
                    break;
            }
            // Positionne a la fin du chunk
            this.app.file.seek(this.posEnd);
        }

        this.app.OIList.resetToLoad();
        var n;
        for (n = 0; n < this.LOList.nIndex; n++) {
            var loTemp = this.LOList.getLOFromIndex(n);
            this.app.OIList.setToLoad(loTemp.loOiHandle);
        }

        this.app.imageBank.resetToLoad();
        this.app.soundBank.resetToLoad();
        this.app.fontBank.resetToLoad();
        this.app.OIList.load(this.app.file);
        this.app.OIList.enumElements(this.app.imageBank, this.app.fontBank);
        if ((this.app.dwOptions & CRunApp.AH2OPT_LOADDATAATSTART) != 0) {
            this.app.fontBank.setAllToLoad();
            this.app.soundBank.setAllToLoad();
            //this.app.imageBank.setAllToLoad();
        }
        this.app.imageBank.loadFrame(this.app.file);
        this.app.fontBank.loadFrame(this.app.file);
        this.evtProg.enumSounds(this.app.soundBank);
        this.app.soundBank.loadFrame();

        this.app.OIList.resetOICurrent();
        for (n = 0; n < this.LOList.nIndex; n++) {
            var lo = this.LOList.list[n];
            if (lo.loType >= COI.OBJ_SPR) {
                this.app.OIList.setOICurrent(lo.loOiHandle);
            }
        }
    },

    loadLayers: function () {
        this.nLayers = this.app.file.readAInt();
        this.layers = new Array(this.nLayers);

        var n;
        for (n = 0; n < this.nLayers; n++) {
            this.layers[n] = new CLayer(this.app);
            this.layers[n].load(this.app.file);
        }
    },

    loadLayerEffects: function () {
        var l;
        for (l = 0; l < this.nLayers; l++) {
            this.layers[l].effect = this.app.file.readAInt();
            this.layers[l].effectParam = this.app.file.readAInt();
            this.app.file.skipBytes(12);
        }
    },

    loadHeader: function () {
        this.leWidth = this.app.file.readAInt();
        this.leHeight = this.app.file.readAInt();
        this.leBackground = this.app.file.readAColor();
        this.leFlags = this.app.file.readAInt();
    }
}
