//CND_EXTANIMENDOF Object
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

function CND_EXTANIMENDOF() {
    CCnd.call(this);
}

CND_EXTANIMENDOF.prototype = {
    eva1: function (rhPtr, hoPtr) {
        var ani;
        if (this.evtParams[0].code == 10) {
            ani = this.evtParams[0].value;
        } else {
            ani = rhPtr.get_EventExpressionInt(this.evtParams[0]);
        }

        if (ani != rhPtr.rhEvtProg.rhCurParam0) {
            return false;
        }
        rhPtr.rhEvtProg.evt_AddCurrentObject(hoPtr);
        return true;
    },
    eva2: function (rhPtr) {
        if (this.evtParams[0].code == 10) {
            return this.evaObject(rhPtr, this);
        }
        return this.evaExpObject(rhPtr, this);
    },
    evaObjectRoutine: function (hoPtr) {
        var anim = this.evtParams[0].value;
        if (anim != hoPtr.roa.raAnimOn) {
            return false;
        }
        if (hoPtr.roa.raAnimNumberOfFrame == 0) {
            return true;
        }
        return false;
    },
    evaExpRoutine: function (hoPtr, value, comp) {
        if (value != hoPtr.roa.raAnimOn) {
            return false;
        }
        if (hoPtr.roa.raAnimNumberOfFrame == 0) {
            return true;
        }
        return false;
    }
};

//setup inheritance using extend
CServices.extend(CCnd, CND_EXTANIMENDOF);