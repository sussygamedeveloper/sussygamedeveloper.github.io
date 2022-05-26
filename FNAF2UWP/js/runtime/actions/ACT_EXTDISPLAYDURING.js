//ACT_EXTDISPLAYDURING Object
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

function ACT_EXTDISPLAYDURING() {
}
ACT_EXTDISPLAYDURING.prototype = {
    execute: function (rhPtr) {
        var pHo = rhPtr.rhEvtProg.get_ActionObjects(this);
        if (pHo == null) {
            return;
        }

        if (pHo.ros != null) {
            pHo.ros.obHide();
            pHo.ros.rsFlags &= ~CRSpr.RSFLAG_VISIBLE;

            if (this.evtParams[0].code == 2)        // PARAM_TIME
            {
                pHo.ros.rsFlash = this.evtParams[0].timer;
                pHo.ros.rsFlashCpt = this.evtParams[0].timer;
            }
            else {
                pHo.ros.rsFlash = rhPtr.get_EventExpressionInt(this.evtParams[0]);
                pHo.ros.rsFlashCpt = pHo.ros.rsFlash;
            }
        }
    }
}
