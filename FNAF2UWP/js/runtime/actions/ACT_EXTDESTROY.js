//ACT_EXTDESTROY Object
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

function ACT_EXTDESTROY() {
}
ACT_EXTDESTROY.prototype = {
    execute: function (rhPtr) {
        var pHo = rhPtr.rhEvtProg.get_ActionObjects(this);
        if (pHo == null) {
            return;
        }

        if (pHo.hoType == 3) {
            var pText = pHo;
            if ((pText.rsHidden & CRun.COF_FIRSTTEXT) != 0) {
                pHo.ros.obHide();
                pHo.ros.rsFlags &= ~CRSpr.RSFLAG_VISIBLE;
                pHo.hoFlags |= CObject.HOF_NOCOLLISION;
            }
            else {
                pHo.hoFlags |= CObject.HOF_DESTROYED;
                rhPtr.addToDestroyList(pHo.hoNumber);
            }
            return;
        }
        if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
            pHo.hoFlags |= CObject.HOF_DESTROYED;
            if ((pHo.hoOEFlags & CObjectCommon.OEFLAG_ANIMATIONS) != 0 || (pHo.hoOEFlags & CObjectCommon.OEFLAG_SPRITES) != 0) {
                rhPtr.init_Disappear(pHo);
            }
            else {
                pHo.hoCallRoutine = false;
                rhPtr.addToDestroyList(pHo.hoNumber);
            }
        }
    }
}
