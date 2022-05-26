//CND_EXTCMPVAR Object
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

function CND_EXTCMPVAR() {
}
CND_EXTCMPVAR.prototype = {
    eva1: function (rhPtr, hoPtr) {
        return this.eva2(rhPtr);
    },
    eva2: function (rhPtr) {
        var pHo = rhPtr.rhEvtProg.evt_FirstObject(this.evtOiList);
        if (pHo == null) {
            return false;
        }

        var cpt = rhPtr.rhEvtProg.evtNSelectedObjects;
        var value1;
        var value2;
        var p = this.evtParams[1];
        do
        {
            var num;
            if (this.evtParams[0].code == 53) {
                num = rhPtr.get_EventExpressionInt(this.evtParams[0]);
            } else {
                num = this.evtParams[0].value;
            }

            if (num >= 0 && pHo.rov != null) {
                if (num < pHo.rov.rvValues.length) {
                    value1 = pHo.rov.getValue(num);
                } else {
                    value1 = 0;
                }
                value2 = rhPtr.get_EventExpressionAny(p);

                if (CRun.compareTo(value1, value2, p.comparaison) == false) {
                    cpt--;
                    rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                }
            }
            else {
                cpt--;
                rhPtr.rhEvtProg.evt_DeleteCurrentObject();
            }
            pHo = rhPtr.rhEvtProg.evt_NextObject();
        } while (pHo != null);
        return (cpt != 0);
    }
}
