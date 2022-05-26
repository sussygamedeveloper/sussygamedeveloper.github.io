// CActExtension object
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

function CActExtension() {
}

CActExtension.prototype = {
    execute: function (rhPtr) {
        var pHo = rhPtr.rhEvtProg.get_ActionObjects(this);
        if (pHo == null) {
            return;
        }

        var act = (this.evtCode >>> 16) - CEventProgram.EVENTS_EXTBASE;
        rhPtr.currentPtr = this;
        pHo.action(act, this);
    },

    getParamObject: function (rhPtr, num) {
        return rhPtr.rhEvtProg.get_ParamActionObjects(this.evtParams[num].oiList, this);
    },

    getParamBorder: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamShort: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamAltValue: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamDirection: function (rhPtr, num) {
        return this.evtParams[num].value;
    },

    getParamEffect: function (rhPtr, num) {
        return this.evtParams[num].string;
    },

    getParamCreate: function (rhPtr, num) {
        return this.evtParams[num];
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

    getParamShoot: function (rhPtr, num) {
        return this.evtParams[num];
    },

    getParamZone: function (rhPtr, num) {
        return this.evtParams[num];
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

    getParamFilename: function (rhPtr, num) {
        if (this.evtParams[num].code == 40) {
            return this.evtParams[num].string;
        }
        return rhPtr.get_EventExpressionString(this.evtParams[num]);
    },

    getParamExpDouble: function (rhPtr, num) {
        return rhPtr.get_EventExpressionAny(this.evtParams[num]);
    },

    getParamFilename2: function (rhPtr, num) {
        if (this.evtParams[num].code == 63) {
            return this.evtParams[num].string;
        }
        return rhPtr.get_EventExpressionString(this.evtParams[num]);
    },

    getParamExtension: function (rhPtr, num) {
        var p = this.evtParams[num];
        if (p.data != 0) {
            return rhPtr.rhApp.file.createFromFile(p.data);
        }
        return null;
    },

    getParamTime: function (rhPtr, num) {
        if (this.evtParams[num].code == 2) {
            return this.evtParams[num].timer;
        }
        return rhPtr.get_EventExpressionInt(this.evtParams[num]);
    }
};
