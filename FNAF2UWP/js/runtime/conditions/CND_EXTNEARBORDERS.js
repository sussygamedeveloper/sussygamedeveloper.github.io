//CND_EXTNEARBORDERS Object
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

function CND_EXTNEARBORDERS() {
    CCnd.call(this);
}

CND_EXTNEARBORDERS.prototype = {
    eva1: function (rhPtr, hoPtr) {
        return this.evaExpObject(rhPtr, this);
    },
    eva2: function (rhPtr) {
        return this.evaExpObject(rhPtr, this);
    },
    evaExpRoutine: function (hoPtr, bord, comp) {
        var xw = hoPtr.hoAdRunHeader.rhWindowX + bord;
        var x = hoPtr.hoX - hoPtr.hoImgXSpot;
        if (x <= xw) {
            return CCnd.negaTRUE(this);
        }

        xw = hoPtr.hoAdRunHeader.rhWindowX + hoPtr.hoAdRunHeader.rh3WindowSx - bord;
        x += hoPtr.hoImgWidth;
        if (x >= xw) {
            return CCnd.negaTRUE(this);
        }

        var yw = hoPtr.hoAdRunHeader.rhWindowY + bord;
        var y = hoPtr.hoY - hoPtr.hoImgYSpot;
        if (y <= yw) {
            return CCnd.negaTRUE(this);
        }

        yw = hoPtr.hoAdRunHeader.rhWindowY + hoPtr.hoAdRunHeader.rh3WindowSy - bord;
        y += hoPtr.hoImgHeight;
        if (y >= yw) {
            return CCnd.negaTRUE(this);
        }

        return CCnd.negaFALSE(this);
    }
};

//setup inheritance using extend
CServices.extend(CCnd, CND_EXTNEARBORDERS);