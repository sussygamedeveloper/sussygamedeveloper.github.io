// COI object
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

COI.OILF_OCLOADED = 0x0001;
COI.OILF_ELTLOADED = 0x0002;
COI.OILF_TOLOAD = 0x0004;
COI.OILF_TODELETE = 0x0008;
COI.OILF_CURFRAME = 0x0010;
COI.OILF_TORELOAD = 0x0020;
COI.OILF_IGNORELOADONCALL = 0x0040;
COI.OIF_LOADONCALL = 0x0001;
COI.OIF_DISCARDABLE = 0x0002;
COI.OIF_GLOBAL = 0x0004;
COI.NUMBEROF_SYSTEMTYPES = 7;
COI.OBJ_PLAYER = -7;
COI.OBJ_KEYBOARD = -6;
COI.OBJ_CREATE = -5;
COI.OBJ_TIMER = -4;
COI.OBJ_GAME = -3;
COI.OBJ_SPEAKER = -2;
COI.OBJ_SYSTEM = -1;
COI.OBJ_BOX = 0;
COI.OBJ_BKD = 1;
COI.OBJ_SPR = 2;
COI.OBJ_TEXT = 3;
COI.OBJ_QUEST = 4;
COI.OBJ_SCORE = 5;
COI.OBJ_LIVES = 6;
COI.OBJ_COUNTER = 7;
COI.OBJ_RTF = 8;
COI.OBJ_CCA = 9;
COI.NB_SYSOBJ = 10;
COI.OBJ_PASTED = 11;
COI.OBJ_LAST = 10;
COI.KPX_BASE = 32;
COI.OIFLAG_QUALIFIER = 0x8000;

function COI() {
    this.oiHandle = 0;
    this.oiType = 0;
    this.oiFlags = 0;
    this.oiInkEffect = 0;
    this.oiInkEffectParam = 0;
    this.oiName = null;
    this.oiOC = null;
    this.oiFileOffset = 0;
    this.oiLoadFlags = 0;
    this.oiLoadCount = 0;
    this.oiCount = 0;
}

COI.prototype = {
    loadHeader: function (file) {
        this.oiHandle = file.readAShort();
        this.oiType = file.readAShort();
        this.oiFlags = file.readAShort();
        file.skipBytes(2);
        this.oiInkEffect = file.readAInt();
        this.oiInkEffectParam = file.readAInt();
    },

    load: function (file) {
        file.seek(this.oiFileOffset);

        switch (this.oiType) {
            case 0:
                this.oiOC = new COCQBackdrop();
                break;
            case 1:
                this.oiOC = new COCBackground();
                break;
            default:
                this.oiOC = new CObjectCommon();
                break;
        }
        this.oiOC.load(file, this.oiType);
        this.oiLoadFlags = 0;
    },

    unLoad: function () {
        this.oiOC = null;
    },

    enumElements: function (enumImages, enumFonts) {
        this.oiOC.enumElements(enumImages, enumFonts);
    }
}
