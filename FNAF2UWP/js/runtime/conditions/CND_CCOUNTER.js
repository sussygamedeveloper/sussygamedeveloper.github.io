//CND_CCOUNTER Object
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

function CND_CCOUNTER() {
}
CND_CCOUNTER.prototype = {
    eva1: function (rhPtr, hoPtr) {
        return this.eva2(rhPtr);
    },
    eva2: function (rhPtr) {
        var pHo = rhPtr.rhEvtProg.evt_FirstObject(this.evtOiList);
        var cpt = rhPtr.rhEvtProg.evtNSelectedObjects;
        var value1, value2;
        while (pHo != null) {
            value1 = pHo.cpt_GetValue();
            value2 = rhPtr.get_EventExpressionAny(this.evtParams[0]);
            if (CRun.compareTo(value1, value2, this.evtParams[0].comparaison) == false) {
                cpt--;
                rhPtr.rhEvtProg.evt_DeleteCurrentObject();
            }
            pHo = rhPtr.rhEvtProg.evt_NextObject();
        }
        ;
        return (cpt != 0);
    }
}
