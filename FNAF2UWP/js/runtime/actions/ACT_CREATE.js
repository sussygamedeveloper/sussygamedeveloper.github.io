//ACT_CREATE Object
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

function ACT_CREATE() {
}
ACT_CREATE.prototype = {
    execute: function (rhPtr) {
        var pEvp = this.evtParams[0];
        var pInfo = new CPositionInfo();
        if (pEvp.read_Position(rhPtr, 0x11, pInfo)) {
            if (pInfo.bRepeat) {
                this.evtFlags |= CAct.ACTFLAGS_REPEAT;
                rhPtr.rhEvtProg.rh2ActionLoop = true;
            }
            else {
                this.evtFlags &= ~CAct.ACTFLAGS_REPEAT;
            }
            var number = rhPtr.f_CreateObject(pEvp.cdpHFII, pEvp.cdpOi, pInfo.x, pInfo.y, pInfo.dir, 0, pInfo.layer, -1);
            if (number >= 0) {
                var pHo = rhPtr.rhObjectList[number];
                rhPtr.rhEvtProg.evt_AddCurrentObject(pHo);

                // Build 283.2: add physics attractor
                if (pHo && pHo.hoType >= 32) {
                    rhPtr.addPhysicsAttractor(pHo);
                }

                var mBase = rhPtr.GetMBase(pHo);
                if (mBase) {
                    mBase.CreateBody();
                } else {
                    if (rhPtr.rhBox2DBase != null) {
                        rhPtr.rh4Box2DBase.rAddNormalObject(pHo);
                    }
                }
            }
        }
    }
}
