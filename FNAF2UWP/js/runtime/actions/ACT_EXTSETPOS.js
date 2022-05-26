//ACT_EXTSETPOS Object
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

function ACT_EXTSETPOS() {
}
ACT_EXTSETPOS.prototype = {
    execute: function (rhPtr) {
        var pHo = rhPtr.rhEvtProg.get_ActionObjects(this);
        if (pHo == null) {
            return;
        }

        var position = this.evtParams[0];
        var pInfo = new CPositionInfo();
        if (position.read_Position(rhPtr, 1, pInfo)) {
            CRun.setXPosition(pHo, pInfo.x);
            CRun.setYPosition(pHo, pInfo.y);
            if (pInfo.dir != -1) {
                var dir = pInfo.dir &= 31;
                if (rhPtr.getDir(pHo) != dir) {
                    pHo.roc.rcDir = dir;
                    pHo.roc.rcChanged = true;
                    pHo.rom.rmMovement.setDir(dir);

                    if (pHo.hoType == 2) {
                        pHo.roa.animIn(0);
                    }
                }
            }
        }
    }
}
