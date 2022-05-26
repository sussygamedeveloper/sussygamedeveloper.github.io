// CPosition object
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


CPosition.CPF_DIRECTION = 0x0001;
CPosition.CPF_ACTION = 0x0002;
CPosition.CPF_INITIALDIR = 0x0004;
CPosition.CPF_DEFAULTDIR = 0x0008;
function CPosition() {
}
CPosition.prototype =
{
    read_Position: function (rhPtr, getDir, pInfo) {
        pInfo.layer = -1;

        if (this.posOINUMParent == -1) {
            if (getDir != 0) {
                pInfo.dir = -1;
                if ((this.posFlags & CPosition.CPF_DEFAULTDIR) == 0) {
                    pInfo.dir = rhPtr.get_Direction(this.posDir);
                }
            }
            pInfo.x = this.posX;
            pInfo.y = this.posY;
            var nLayer = this.posLayer;
            if (nLayer > rhPtr.rhFrame.nLayers - 1) {
                nLayer = rhPtr.rhFrame.nLayers - 1;
            }
            pInfo.layer = nLayer;
            pInfo.bRepeat = false;
        }
        else {
            rhPtr.rhEvtProg.rh2EnablePick = false;
            var pHo;
            pHo = rhPtr.rhEvtProg.get_CurrentObjects(this.posOiList);
            pInfo.bRepeat = rhPtr.rhEvtProg.repeatFlag;
            if (pHo == null) {
                return false;
            }
            pInfo.x = pHo.hoX;
            pInfo.y = pHo.hoY;
            pInfo.layer = pHo.hoLayer;

            if ((this.posFlags & CPosition.CPF_ACTION) != 0) {
                if ((pHo.hoOEFlags & CObjectCommon.OEFLAG_ANIMATIONS) != 0) {
                    if (pHo.roc.rcImage >= 0) {
                        var ifo;
                        var angle = pHo.roc.rcAngle;
                        var pMBase = rhPtr.GetMBase(pHo);
                        if (pMBase != null) {
                            angle = pMBase.getAngle();
                        }
                        ifo = rhPtr.rhApp.imageBank.getImageInfoEx(pHo.roc.rcImage, angle, pHo.roc.rcScaleX, pHo.roc.rcScaleY);
                        pInfo.x += ifo.xAP - ifo.xSpot;
                        pInfo.y += ifo.yAP - ifo.ySpot;
                    }
                }
            }

            if ((this.posFlags & CPosition.CPF_DIRECTION) != 0) {
                var dir = this.posAngle + pHo.hoAdRunHeader.getDir(pHo) & 0x1F;
                var px = CMove.getDeltaX(this.posSlope, dir);
                var py = CMove.getDeltaY(this.posSlope, dir);
                pInfo.x += px;
                pInfo.y += py;
            }
            else {
                pInfo.x += this.posX;
                pInfo.y += this.posY;
            }

            if ((getDir & 0x01) != 0) {
                if ((this.posFlags & CPosition.CPF_DEFAULTDIR) != 0) {
                    pInfo.dir = -1;
                } else if ((this.posFlags & CPosition.CPF_INITIALDIR) != 0) {
                    pInfo.dir = pHo.hoAdRunHeader.getDir(pHo);
                } else {
                    pInfo.dir = rhPtr.get_Direction(this.posDir);
                }
            }
        }

        if ((getDir & 0x02) != 0) {
            if (pInfo.x < rhPtr.rh3XMinimumKill || pInfo.x > rhPtr.rh3XMaximumKill) {
                return false;
            }
            if (pInfo.y < rhPtr.rh3YMinimumKill || pInfo.y > rhPtr.rh3YMaximumKill) {
                return false;
            }
        }
        return true;
    }
}
