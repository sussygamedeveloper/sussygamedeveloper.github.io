// CCndExtension object
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

function CCndExtension() {
}

CCndExtension.prototype = {
    eva1: function (rhPtr, pHo) {
        if (pHo == null) {
            return this.eva2(rhPtr);
        }

        pHo.hoFlags |= CObject.HOF_TRUEEVENT;
        var cond = -(this.evtCode >> 16) - CEventProgram.EVENTS_EXTBASE - 1;
        rhPtr.currentPtr = this;
        if (pHo.condition(cond, this)) {
            rhPtr.rhEvtProg.evt_AddCurrentObject(pHo);
            return true;
        }
        return false;
    },

    eva2: function (rhPtr) {
        var pHo = rhPtr.rhEvtProg.evt_FirstObject(this.evtOiList);
        var cpt = rhPtr.rhEvtProg.evtNSelectedObjects;
        var cond = -(this.evtCode >> 16) - CEventProgram.EVENTS_EXTBASE - 1;

        rhPtr.currentPtr = this;
        while (pHo != null) {
            pHo.hoFlags &= ~CObject.HOF_TRUEEVENT;
            if (pHo.condition(cond, this)) {
                if ((this.evtFlags2 & CEvent.EVFLAG2_NOT) != 0) {
                    cpt--;
                    rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                }
            }
            else {
                if ((this.evtFlags2 & CEvent.EVFLAG2_NOT) == 0) {
                    cpt--;
                    rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                }
            }
            pHo = rhPtr.rhEvtProg.evt_NextObject();
        }
        if (cpt != 0) {
            return true;
        }
        return false;
    },

    getParamObject: function (rhPtr, num) {
        return this.evtParams[num];
    },

    getParamTime: function (rhPtr, num) {
        if (this.evtParams[num].code == 2) {
            return this.evtParams[num].timer;
        }
        return rhPtr.get_EventExpressionInt(this.evtParams[num]);
    },

    getParamBorder: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamAltValue: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamDirection: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamAnimation: function (rhPtr, num) {
        if (this.evtParams[num].code == 10) {
            return this.evtParams[num].value;
        }
        return rhPtr.get_EventExpressionInt(this.evtParams[num]);
    },

    getParamPlayer: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamEvery: function (rhPtr, num) {
        return this.evtParams[num].delay;
    },

    getParamKey: function (rhPtr, num) {
        return this.evtParams[num].key;
    },

    getParamSpeed: function (rhPtr, num) {
        return rhPtr.get_EventExpressionInt(this.evtParams[num]);
    },

    getParamPosition: function (rhPtr, num) {
        //return this.evtParams[num];
        var position = this.evtParams[num];
        var pInfo = new CPositionInfo();
        if (position.read_Position(rhPtr, 0, pInfo)) {
            pInfo.found = true;
        }
        return pInfo;
    },

    getParamJoyDirection: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamExpression: function (rhPtr, num) {
        return rhPtr.get_EventExpressionInt(this.evtParams[num]);
    },

    getParamColour: function (rhPtr, num) {
        if (this.evtParams[num].code == 24) {
            return this.evtParams[num].color;
        }
        return CServices.swapRGB(rhPtr.get_EventExpressionInt(this.evtParams[num]));
    },

    getParamFrame: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamNewDirection: function (rhPtr, num) {
        if (this.evtParams[num].code == 29) {
            return this.evtParams[num].value;
        }
        return rhPtr.get_EventExpressionInt(this.evtParams[num]);
    },

    getParamClick: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamExpString: function (rhPtr, num) {
        return rhPtr.get_EventExpressionString(this.evtParams[num]);
    },

    compareValues: function (rhPtr, num, value) {
        var value2 = rhPtr.get_EventExpressionAny(this.evtParams[num]);
        var comp = this.evtParams[num].comparaison;
        return CRun.compareTo(value, value2, comp);
    },

    compareTime: function (rhPtr, num, t) {
        var p = this.evtParams[num];
        return CRun.compareTo(t, p.timer, p.comparaison);
    }
};
