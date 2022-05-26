// CObjInfo Object
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

CObjInfo.OILIMITFLAGS_BORDERS = 0x000F;
CObjInfo.OILIMITFLAGS_BACKDROPS = 0x0010;
CObjInfo.OILIMITFLAGS_ONCOLLIDE = 0x0080;
CObjInfo.OILIMITFLAGS_QUICKCOL = 0x0100;
CObjInfo.OILIMITFLAGS_QUICKBACK = 0x0200;
CObjInfo.OILIMITFLAGS_QUICKBORDER = 0x0400;
CObjInfo.OILIMITFLAGS_QUICKSPR = 0x0800;
CObjInfo.OILIMITFLAGS_QUICKEXT = 0x1000;
CObjInfo.OILIMITFLAGS_ALL = 0xFFFF;

function CObjInfo() {
    this.oilOi = 0;
    this.oilListSelected = 0;
    this.oilType = 0;
    this.oilObject = 0;
    this.oilEvents = 0;
    this.oilWrap = 0;
    this.oilNextFlag = false;
    this.oilNObjects = 0;
    this.oilActionCount = 0;
    this.oilActionLoopCount = 0;
    this.oilCurrentRoutine = 0;
    this.oilCurrentOi = 0;
    this.oilNext = 0;
    this.oilEventCount = 0;
    this.oilNumOfSelected = 0;
    this.oilOEFlags = 0;
    this.oilLimitFlags = 0;
    this.oilLimitList = 0;
    this.oilOIFlags = 0;
    this.oilOCFlags2 = 0;
    this.oilInkEffect = 0;
    this.oilEffectParam = 0;
    this.oilHFII = 0;
    this.oilBackColor = 0;
    this.oilQualifiers = null;
    this.oilName = null;
    this.oilEventCountOR = 0;
    this.oilColList = null;
}

CObjInfo.prototype = {
    copyData: function (oiPtr) {
        this.oilOi = oiPtr.oiHandle;
        this.oilType = oiPtr.oiType;

        this.oilOIFlags = oiPtr.oiFlags;
        var ocPtr = oiPtr.oiOC;
        this.oilOCFlags2 = ocPtr.ocFlags2;
        this.oilInkEffect = oiPtr.oiInkEffect;
        this.oilEffectParam = oiPtr.oiInkEffectParam;
        this.oilOEFlags = ocPtr.ocOEFlags;
        this.oilBackColor = ocPtr.ocBackColor;
        this.oilEventCount = 0;
        this.oilObject = -1;
        this.oilLimitFlags = CObjInfo.OILIMITFLAGS_ALL;
        if (oiPtr.oiName != null) {
            this.oilName = oiPtr.oiName;
        }
        var q;
        this.oilQualifiers = new Array(8);
        for (q = 0; q < 8; q++) {
            this.oilQualifiers[q] = ocPtr.ocQualifiers[q];
        }
    }
}
