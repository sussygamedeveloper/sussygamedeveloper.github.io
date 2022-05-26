//CND_MCLICKONOBJECT Object
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

function CND_MCLICKONOBJECT() {
}
CND_MCLICKONOBJECT.prototype = {
    eva1: function (rhPtr, hoPtr) {
        var p = this.evtParams[0];
        if (rhPtr.rhEvtProg.rhCurParam0 != p.value) {
            return false;
        }

        var oi = rhPtr.rhEvtProg.rhCurParam1;
        var po = this.evtParams[1];
        if (oi == po.oi) {
            rhPtr.rhEvtProg.evt_AddCurrentObject(rhPtr.rhEvtProg.rh4_2ndObject);
            return true;
        }

        var oil = po.oiList;
        if ((oil & 0x8000) == 0) {
            return false;
        }
        var qoil = rhPtr.rhEvtProg.qualToOiList[oil & 0x7FFF];
        var qoi;
        for (qoi = 0; qoi < qoil.qoiList.length; qoi += 2) {
            if (qoil.qoiList[qoi] == oi) {
                rhPtr.rhEvtProg.evt_AddCurrentQualifier(oil);
                rhPtr.rhEvtProg.evt_AddCurrentObject(rhPtr.rhEvtProg.rh4_2ndObject);
                return true;
            }
        }
        return false;
    },
    eva2: function (rhPtr) {
        var p = this.evtParams[0];
        if (rhPtr.rhEvtProg.rh2CurrentClick != p.value) {
            return false;
        }

        var po = this.evtParams[1];
        return rhPtr.getMouseOnObjectsEDX(po.oiList, false);
    }
}
