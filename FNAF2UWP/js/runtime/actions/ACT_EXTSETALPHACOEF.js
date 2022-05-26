//ACT_EXTSETALPHACOEF Object
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

function ACT_EXTSETALPHACOEF() {
}
ACT_EXTSETALPHACOEF.prototype = {
    execute: function (rhPtr) {
        var pHo = rhPtr.rhEvtProg.get_ActionObjects(this);
        if (pHo == null) {
            return;
        }

        if (pHo.ros == null) {
            return;
        }

        var alpha = CServices.clamp(255 - rhPtr.get_EventExpressionInt(this.evtParams[0]), 0, 255);
        var wasSemi = ((pHo.ros.rsEffect & CRSpr.BOP_RGBAFILTER) == 0);
        pHo.ros.rsEffect = (pHo.ros.rsEffect & CRSpr.BOP_MASK) | CRSpr.BOP_RGBAFILTER;

        var rgbaCoeff = 0x00FFFFFF;

        if (!wasSemi) {
            rgbaCoeff = pHo.ros.rsEffectParam;
        }

        var alphaPart = alpha << 24;
        var rgbPart = (rgbaCoeff & 0x00FFFFFF);
        pHo.ros.rsEffectParam = alphaPart | rgbPart;

        pHo.ros.modifSpriteEffect(pHo.ros.rsEffect, pHo.ros.rsEffectParam);
    }
}
