// CObjectCommon object
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

CObjectCommon.OEFLAG_DISPLAYINFRONT = 0x0001;
CObjectCommon.OEFLAG_BACKGROUND = 0x0002;
CObjectCommon.OEFLAG_BACKSAVE = 0x0004;
CObjectCommon.OEFLAG_RUNBEFOREFADEIN = 0x0008;
CObjectCommon.OEFLAG_MOVEMENTS = 0x0010;
CObjectCommon.OEFLAG_ANIMATIONS = 0x0020;
CObjectCommon.OEFLAG_TABSTOP = 0x0040;
CObjectCommon.OEFLAG_WINDOWPROC = 0x0080;
CObjectCommon.OEFLAG_VALUES = 0x0100;
CObjectCommon.OEFLAG_SPRITES = 0x0200;
CObjectCommon.OEFLAG_INTERNALBACKSAVE = 0x0400;
CObjectCommon.OEFLAG_SCROLLINGINDEPENDANT = 0x0800;
CObjectCommon.OEFLAG_QUICKDISPLAY = 0x1000;
CObjectCommon.OEFLAG_NEVERKILL = 0x2000;
CObjectCommon.OEFLAG_NEVERSLEEP = 0x4000;
CObjectCommon.OEFLAG_MANUALSLEEP = 0x8000;
CObjectCommon.OEFLAG_TEXT = 0x10000;
CObjectCommon.OEFLAG_DONTCREATEATSTART = 0x20000;
CObjectCommon.OEFLAG_DONTRESETANIMCOUNTER = 0x100000;
CObjectCommon.OCFLAGS2_DONTSAVEBKD = 0x0001;
CObjectCommon.OCFLAGS2_SOLIDBKD = 0x0002;
CObjectCommon.OCFLAGS2_COLBOX = 0x0004;
CObjectCommon.OCFLAGS2_VISIBLEATSTART = 0x0008;
CObjectCommon.OCFLAGS2_OBSTACLESHIFT = 4;
CObjectCommon.OCFLAGS2_OBSTACLEMASK = 0x0030;
CObjectCommon.OCFLAGS2_OBSTACLE_SOLID = 0x0010;
CObjectCommon.OCFLAGS2_OBSTACLE_PLATFORM = 0x0020;
CObjectCommon.OCFLAGS2_OBSTACLE_LADDER = 0x0030;
CObjectCommon.OCFLAGS2_AUTOMATICROTATION = 0x0040;
CObjectCommon.OCFLAGS2_INITFLAGS = 0x0080;
CObjectCommon.OEPREFS_BACKSAVE = 0x0001;
CObjectCommon.OEPREFS_SCROLLINGINDEPENDANT = 0x0002;
CObjectCommon.OEPREFS_QUICKDISPLAY = 0x0004;
CObjectCommon.OEPREFS_SLEEP = 0x0008;
CObjectCommon.OEPREFS_LOADONCALL = 0x0010;
CObjectCommon.OEPREFS_GLOBAL = 0x0020;
CObjectCommon.OEPREFS_BACKEFFECTS = 0x0040;
CObjectCommon.OEPREFS_KILL = 0x0080;
CObjectCommon.OEPREFS_INKEFFECTS = 0x0100;
CObjectCommon.OEPREFS_TRANSITIONS = 0x0200;
CObjectCommon.OEPREFS_FINECOLLISIONS = 0x0400;
CObjectCommon.prototype = COC;

function CObjectCommon() {
    this.ocOEFlags = 0;
    this.ocQualifiers = null;
    this.ocFlags2 = 0;
    this.ocOEPrefs = 0;
    this.ocIdentifier = 0;
    this.ocBackColor = 0;
    this.ocMovements = null;
    this.ocValues = null;
    this.ocStrings = null;
    this.ocAnimations = null;
    this.ocCounters = null;
    this.ocObject = null;
    this.ocExtension = 0;
    this.ocVersion = 0;
    this.ocID = 0;
    this.ocPrivate = 0;
    this.ocFadeIn = null;
    this.ocFadeOut = null;
}

CObjectCommon.prototype = {
    load: function (file, type) {
        // Position de debut
        var debut = file.getFilePointer();
        this.ocQualifiers = new Array(8);

        // Lis le header
        var n;
        file.skipBytes(4);
        file.skipBytes(2);      // var oMovements = file.readAShort();
        var oData = file.readAShort();  // var oAnimations = file.readAShort();
        file.skipBytes(2);
        var oCounter = file.readAShort();
        var oAnimations = file.readAShort(); // var oData = file.readAShort();
        var oMovements = file.readAShort();    // file.skipBytes(2);
        this.ocOEFlags = file.readAInt();
        for (n = 0; n < 8; n++) {
            this.ocQualifiers[n] = file.readShort();
        }
        this.ocOEPrefs = file.readAShort(); // var oExtension = file.readAShort();
        var oValues = file.readAShort();
        var oStrings = file.readAShort();
        this.ocFlags2 = file.readAShort();
        var oExtension = file.readAShort(); // this.ocOEPrefs = file.readAShort();
        this.ocIdentifier = file.readAInt();
        this.ocBackColor = file.readAColor();
        var oFadeIn = file.readAInt();
        var oFadeOut = file.readAInt();
        this.ocFadeIn = null;
        this.ocFadeOut = null;

        if (oMovements != 0) {
            file.seek(debut + oMovements);
            this.ocMovements = new CMoveDefList();
            this.ocMovements.load(file);
        }
        if (oValues != 0) {
            file.seek(debut + oValues);
            this.ocValues = new CDefValues();
            this.ocValues.load(file, (this.ocFlags2 & CObjectCommon.OCFLAGS2_INITFLAGS) != 0);
        }
        if (oStrings != 0) {
            file.seek(debut + oStrings);
            this.ocStrings = new CDefStrings();
            this.ocStrings.load(file);
        }
        if (oAnimations != 0) {
            file.seek(debut + oAnimations);
            this.ocAnimations = new CAnimHeader();
            this.ocAnimations.load(file);
        }
        if (oCounter != 0) {
            file.seek(debut + oCounter);
            this.ocObject = new CDefCounter();
            this.ocObject.load(file);
        }
        if (oExtension != 0) {
            file.seek(debut + oExtension);
            var size = file.readAInt();
            file.skipBytes(4);
            this.ocVersion = file.readAInt();
            this.ocID = file.readAInt();
            this.ocPrivate = file.readAInt();
            size -= 20;
            if (size != 0) {
                this.ocExtension = file.getFilePointer();
            }
        }
        if (oFadeIn != 0) {
            file.seek(debut + oFadeIn);
            this.ocFadeIn = new CTransitionData();
            this.ocFadeIn.load(file);
        }
        if (oFadeOut != 0) {
            file.seek(debut + oFadeOut);
            this.ocFadeOut = new CTransitionData();
            this.ocFadeOut.load(file);
        }

        if (oData != 0) {
            file.seek(debut + oData);
            switch (type) {
                case 3:
                case 4:
                    this.ocObject = new CDefTexts();
                    this.ocObject.load(file);
                    break;

                case 5:
                case 6:
                case 7:
                    this.ocCounters = new CDefCounters();
                    this.ocCounters.load(file);
                    break;

                case 8:
                    this.ocObject = new CDefRtf();
                    this.ocObject.load(file);
                    this.ocOEFlags &= ~(CObjectCommon.OEFLAG_SPRITES | CObjectCommon.OEFLAG_QUICKDISPLAY | CObjectCommon.OEFLAG_BACKSAVE);
                    break;
                case 9:         // OBJ_CCA
                    this.ocObject = new CDefCCA();
                    this.ocObject.load(file);
                    break;
            }
        }
    },

    enumElements: function (enumImages, enumFonts) {
        if (this.ocAnimations != null) {
            this.ocAnimations.enumElements(enumImages);
        }
        if (this.ocObject != null) {
            this.ocObject.enumElements(enumImages, enumFonts);
        }
        if (this.ocCounters != null) {
            this.ocCounters.enumElements(enumImages, enumFonts);
        }
    }
}
