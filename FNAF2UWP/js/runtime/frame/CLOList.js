// CLOList Object
// -------------------------------------------------------------------
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

function CLOList() {
    this.list = null;
    this.handleToIndex = null;
    this.nIndex = 0;
    this.loFranIndex = 0;
}

CLOList.prototype = {
    load: function (app) {
        this.nIndex = app.file.readAInt();
        this.list = new Array(this.nIndex);
        var n;
        var maxHandles = 0;
        for (n = 0; n < this.nIndex; n++) {
            this.list[n] = new CLO();
            this.list[n].load(app.file);
            if (this.list[n].loHandle + 1 > maxHandles) {
                maxHandles = this.list[n].loHandle + 1;
            }
            var pOI = app.OIList.getOIFromHandle(this.list[n].loOiHandle);
            this.list[n].loType = pOI.oiType;
        }
        this.handleToIndex = new Array(maxHandles);
        for (n = 0; n < this.nIndex; n++) {
            this.handleToIndex[this.list[n].loHandle] = n;
        }
    },
    getLOFromIndex: function (index) {
        return this.list[index];
    },
    getLOFromHandle: function (handle) {
        if (handle < this.handleToIndex.length) {
            return this.list[this.handleToIndex[handle]];
        }
        return null;
    },

    next_LevObj: function () {
        var plo;
        if (this.loFranIndex < this.nIndex) {
            do {
                plo = this.list[this.loFranIndex++];
                if (plo.loType >= 2)        // OBJ_SPR
                {
                    return plo;
                }
            } while (this.loFranIndex < this.nIndex);
        }
        return null;
    },

    first_LevObj: function () {
        this.loFranIndex = 0;
        return this.next_LevObj();
    }
}
