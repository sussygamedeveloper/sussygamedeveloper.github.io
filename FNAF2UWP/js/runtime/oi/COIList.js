// COIList object
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

function COIList() {
    this.oiMaxIndex = 0;
    this.ois = 0;
    this.oiMaxHandle = 0;
    this.oiHandleToIndex = null;
    this.oiToLoad = null;
    this.oiLoaded = null;
    this.currentOI = 0;
}
COIList.prototype = {
    preLoad: function (file) {
        // Alloue la table de OI
        this.oiMaxIndex = file.readAInt();
        this.ois = new Array(this.oiMaxIndex);

        // Explore les chunks
        var index;
        this.oiMaxHandle = 0;
        for (index = 0; index < this.oiMaxIndex; index++) {
            var chID = 0;
            var chFlags;
            var chSize;
            var posEnd;
            while (chID != 0x7F7F) {
                chID = file.readAShort();
                chFlags = file.readAShort();
                chSize = file.readAInt();
                if (chSize == 0) {
                    continue;
                }
                posEnd = file.getFilePointer() + chSize;

                switch (chID) {
                    case 0x4444:
                        this.ois[index] = new COI();
                        this.ois[index].loadHeader(file);
                        if (this.ois[index].oiHandle >= this.oiMaxHandle) {
                            this.oiMaxHandle = (this.ois[index].oiHandle + 1);
                        }
                        break;
                    case 0x4445:
                        this.ois[index].oiName = file.readAString();
                        break;
                    case 0x4446:
                        this.ois[index].oiFileOffset = file.getFilePointer();
                        break;
                }
                file.seek(posEnd);
            }
        }

        this.oiHandleToIndex = new Array(this.oiMaxHandle);
        for (index = 0; index < this.oiMaxIndex; index++) {
            this.oiHandleToIndex[this.ois[index].oiHandle] = index;
        }

        this.oiToLoad = new Array(this.oiMaxHandle);
        this.oiLoaded = new Array(this.oiMaxHandle);
        var n;
        for (n = 0; n < this.oiMaxHandle; n++) {
            this.oiToLoad[n] = 0;
            this.oiLoaded[n] = 0;
        }
    },

    getOIFromHandle: function (handle) {
        return this.ois[this.oiHandleToIndex[handle]];
    },

    getOIFromIndex: function (index) {
        return this.ois[index];
    },

    resetOICurrent: function () {
        var n;
        for (n = 0; n < this.oiMaxIndex; n++) {
            this.ois[n].oiFlags &= ~COI.OILF_CURFRAME;
        }
    },

    setOICurrent: function (handle) {
        this.ois[this.oiHandleToIndex[handle]].oiFlags |= COI.OILF_CURFRAME;
    },

    getFirstOI: function () {
        var n;
        for (n = 0; n < this.oiMaxIndex; n++) {
            if ((this.ois[n].oiFlags & COI.OILF_CURFRAME) != 0) {
                this.currentOI = n;
                return this.ois[n];
            }
        }
        return null;
    },

    getNextOI: function () {
        if (this.currentOI < this.oiMaxIndex) {
            var n;
            for (n = this.currentOI + 1; n < this.oiMaxIndex; n++) {
                if ((this.ois[n].oiFlags & COI.OILF_CURFRAME) != 0) {
                    this.currentOI = n;
                    return this.ois[n];
                }
            }
        }
        return null;
    },

    resetToLoad: function () {
        var n;
        for (n = 0; n < this.oiMaxHandle; n++) {
            this.oiToLoad[n] = 0;
        }
    },

    setToLoad: function (n) {
        this.oiToLoad[n] = 1;
    },

    load: function (file) {
        var h;
        for (h = 0; h < this.oiMaxHandle; h++) {
            if (this.oiToLoad[h] != 0) {
                if (this.oiLoaded[h] == 0 || (this.oiLoaded[h] != 0 && (this.ois[this.oiHandleToIndex[h]].oiLoadFlags & COI.OILF_TORELOAD) != 0)) {
                    this.ois[this.oiHandleToIndex[h]].load(file);
                    this.oiLoaded[h] = 1;
                }
            }
            else {
                if (this.oiLoaded[h] != 0) {
                    this.ois[this.oiHandleToIndex[h]].unLoad();
                    this.oiLoaded[h] = 0;
                }
            }
        }
        this.resetToLoad();
    },

    enumElements: function (enumImages, enumFonts) {
        var h;
        for (h = 0; h < this.oiMaxHandle; h++) {
            if (this.oiLoaded[h] != 0) {
                this.ois[this.oiHandleToIndex[h]].enumElements(enumImages, enumFonts);
            }
        }
    }
}
