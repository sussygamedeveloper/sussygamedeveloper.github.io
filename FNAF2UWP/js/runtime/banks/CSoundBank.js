// CSoundBank object
// ----------------------------------------------------------
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

function CSoundBank(a) {
    this.app = a;
    this.sounds = null;
    this.nHandlesReel = 0;
    this.nHandlesTotal = 0;
    this.nSounds = 0;
    this.offsetsToSounds = null;
    this.handleToIndex = null;
    this.useCount = null;
    this.file = null;
    //  this.bChrome=navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}

CSoundBank.prototype = {
    preLoad: function (f) {
        this.file = f;

        this.nHandlesReel = this.file.readAShort();
        this.offsetsToSounds = new Array(this.nHandlesReel);
        this.useCount = new Array(this.nHandlesReel);
        this.handleToIndex = new Array(this.nHandlesReel);
        var n;
        for (n = 0; n < this.nHandlesReel; n++) {
            this.useCount[n] = 0;
            this.handleToIndex[n] = -1;
        }

        var nSons = this.file.readAShort();
        var n;
        var sound = new CSound(this.app);
        var offset;
        for (n = 0; n < nSons; n++) {
            offset = this.file.getFilePointer();
            sound.readHandle();
            this.offsetsToSounds[sound.handle] = offset;
        }

        this.nHandlesTotal = this.nHandlesReel;
        this.nSounds = 0;
        this.sounds = null;
    },

    getSoundFromHandle: function (handle) {
        if (handle >= 0 && handle < this.nHandlesTotal && this.handleToIndex[handle] != -1) {
            return this.sounds[this.handleToIndex[handle]];
        }
        return null;
    },

    checkLoad: function () {
        var index;
        for (index = 0; index < this.nSounds; index++) {
            if (this.sounds[index] != null) {
                this.sounds[index].checkLoad();
            }
        }
    },

    getSoundFromIndex: function (index) {
        if (index >= 0 && index < this.nSounds) {
            return this.sounds[index];
        }
        return null;
    },

    resetToLoad: function () {
        if ((this.app.dwOptions & CRunApp.AH2OPT_LOADDATAATSTART) == 0 && (this.app.dwOptions & CRunApp.AH2OPT_KEEPRESOURCESBETWEENFRAMES) == 0) {
            var n;
            for (n = 0; n < this.nHandlesReel; n++) {
                this.useCount[n] = 0;
            }
        }
    },

    setAllToLoad: function () {
        var n;
        for (n = 0; n < this.nHandlesReel; n++) {
            if (this.offsetsToSounds[n]) {
                this.useCount[n] = 1;
            }
        }
    },

    addAllToLoad: function () {
        var n;
        for (n = 0; n < this.nHandlesReel; n++) {
            if (this.offsetsToSounds[n]) {
                this.app.loadingDataTotal++;
            }
        }
    },

    setToLoad: function (handle) {
        this.useCount[handle]++;
    },

    enumerate: function (num) {
        this.setToLoad(num);
        return -1;
    },

    loadFrame: function () {
        //this gets called from CRunFrame.loadFullFrame() so this will get called at teh start of EVERY frame
        var n;

        this.nSounds = 0;
        for (n = 0; n < this.nHandlesReel; n++) {
            if (this.useCount[n] != 0) {
                this.nSounds++;
            }
        }

        var newSounds = new Array(this.nSounds);
        var count = 0;
        var h;
        for (h = 0; h < this.nHandlesReel; h++) {
            if (this.useCount[h] != 0) {
                if (this.sounds != null && this.handleToIndex[h] != -1 && this.sounds[this.handleToIndex[h]] != null) {
                    newSounds[count] = this.sounds[this.handleToIndex[h]];
                    newSounds[count].useCount = this.useCount[h];
                }
                else {
                    newSounds[count] = new CSound(this.app);
                    this.file.seek(this.offsetsToSounds[h]);
                    newSounds[count].queueLoad();
                    newSounds[count].useCount = this.useCount[h];
                }
                count++;
            }
        }
        this.sounds = newSounds;

        this.handleToIndex = new Array(this.nHandlesReel);
        for (n = 0; n < this.nHandlesReel; n++) {
            this.handleToIndex[n] = -1;
        }
        for (n = 0; n < this.nSounds; n++) {
            this.handleToIndex[this.sounds[n].handle] = n;
        }
        this.nHandlesTotal = this.nHandlesReel;

        this.resetToLoad();
    }
}
