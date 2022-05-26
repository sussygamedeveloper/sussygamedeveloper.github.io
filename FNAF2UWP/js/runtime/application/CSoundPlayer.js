// CSoundPlayer object
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

CSoundPlayer.NCHANNELS = 32;

function CSoundPlayer(a) {
    this.app = a;
    this.channels = null;
    this.bMultipleSounds = false;
    this.bOn = true;
    this.volumes = null;
    this.bLocked = null;
    this.pans = null;
    this.mainVolume = 0;
    this.mainPan = 0;
    this.dataToDecode = null;
    this.decoding = false;

    this.channels = new Array(CSoundPlayer.NCHANNELS);
    this.volumes = new Array(CSoundPlayer.NCHANNELS);
    this.bLocked = new Array(CSoundPlayer.NCHANNELS);
    this.bOn = true;
    this.bMultipleSounds = true;

    //create channels
    var n;
    for (n = 0; n < CSoundPlayer.NCHANNELS; n++) {
        this.channels[n] = null;
        this.volumes[n] = 100;
        this.bLocked[n] = false;
    }

    this.mainVolume = 100;
    this.mainPan = 0;

    var sound = new Audio();
    var canPlay = new Array(4);
    canPlay[0] = sound.canPlayType('audio/ogg');
    canPlay[1] = sound.canPlayType('audio/x-m4a');
    canPlay[2] = sound.canPlayType('audio/mpeg');
    canPlay[3] = sound.canPlayType('audio/wav') || sound.canPlayType('audio/wave') || sound.canPlayType('audio/x-wave') || "maybe";

    this.probablePlayableFormats = 0;
    this.maybePlayableFormats = 0;
    for (n = 0; n < 4; n++) {
        if (canPlay[n] == 'probably') {
            this.probablePlayableFormats |= (1 << n);
        }
        if (canPlay[n] == 'maybe') {
            this.maybePlayableFormats |= (1 << n);
        }
    }

    // Use WEB AUDIO?
    this.context = null;
    if (typeof AudioContext !== "undefined") {
        this.context = new AudioContext();
        this.contextType = 1;
    } else if (typeof webkitAudioContext !== "undefined") {
        this.context = new webkitAudioContext();
        this.contextType = 0;
    }
}

CSoundPlayer.prototype = {
    reset: function () {
        var n;
        for (n = 0; n < CSoundPlayer.NCHANNELS; n++) {
            this.bLocked[n] = false;
        }
    },

    lockChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            this.bLocked[channel] = true;
        }
    },

    unlockChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            this.bLocked[channel] = false;
        }
    },

    play: function (handle, nLoops, channel, bPrio) {
        var n;

        if (this.bOn == false) {
            return;
        }

        var sound = this.app.soundBank.getSoundFromHandle(handle);
        if (sound == null) {
            return;
        }

        if (this.bMultipleSounds == false) {
            channel = 0;
        }
        /*          else
         {
         for (n = 0; n < CSoundPlayer.NCHANNELS; n++)
         {
         if (this.channels[n] == sound)
         {
         sound=sound.createFromSound();
         break;
         }
         }
         }
         */
        if (channel < 0) {
            for (n = 0; n < CSoundPlayer.NCHANNELS; n++) {
                if (this.channels[n] == null && this.bLocked[n] == false) {
                    break;
                }
            }
            if (n == CSoundPlayer.NCHANNELS) {
                for (n = 0; n < CSoundPlayer.NCHANNELS; n++) {
                    if (this.bLocked[n] == false) {
                        if (this.channels[n] != null) {
                            if (this.channels[n].bUninterruptible == false) {
                                break;
                            }
                        }
                    }
                }
            }
            channel = n;
            if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
                this.volumes[channel] = this.mainVolume;
            }
        }

        if (channel < 0 || channel >= CSoundPlayer.NCHANNELS) {
            return;
        }

        if (this.channels[channel] != null) {
            if (this.channels[channel].bUninterruptible == true) {
                return;
            }
            if (this.channels[channel] != sound) {
                this.channels[channel].stop();
                this.channels[channel] = null;
            }
        }

        for (n = 0; n < CSoundPlayer.NCHANNELS; n++) {
            if (this.channels[n] == sound) {
                this.channels[n].stop();
                this.channels[n] = null;
            }
        }

        this.channels[channel] = sound;
        sound.play(nLoops, bPrio, this.volumes[channel]);
    },

    setMultipleSounds: function (bMultiple) {
        this.bMultipleSounds = bMultiple;
    },

    keepCurrentSounds: function () {
        var n;
        for (n = 0; n < CSoundPlayer.NCHANNELS; n++) {
            if (this.channels[n] != null) {
                if (this.channels[n].isPlaying()) {
                    this.app.soundBank.setToLoad(this.channels[n].handle);
                }
            }
        }
    },

    setOnOff: function (bState) {
        if (bState != bOn) {
            this.bOn = bState;
            if (this.bOn == false) {
                this.stopAllSounds();
            }
        }
    },

    getOnOff: function () {
        return this.bOn;
    },

    stopAllSounds: function () {
        var n;
        for (n = 0; n < CSoundPlayer.NCHANNELS; n++) {
            if (this.channels[n] != null) {
                this.channels[n].stop();
                this.channels[n] = null;
            }
        }
    },

    stopSample: function (handle) {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].handle == handle) {
                    this.channels[c].stop();
                    this.channels[c] = null;
                }
            }
        }
    },

    stopChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                this.channels[channel].stop();
                this.channels[channel] = null;
            }
        }
    },

    isSamplePaused: function (handle) {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].handle == handle) {
                    return this.channels[c].isPaused();
                }
            }
        }
        return false;
    },

    isSoundPlaying: function () {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].isPlaying()) {
                    return true;
                }
            }
        }
        return false;
    },

    isSamplePlaying: function (handle) {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].handle == handle) {
                    return this.channels[c].isPlaying();
                }
            }
        }
        return false;
    },

    isChannelPlaying: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                return this.channels[channel].isPlaying();
            }
        }
        return false;
    },

    isChannelPaused: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                return this.channels[channel].isPaused();
            }
        }
        return false;
    },

    pause: function () {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                this.channels[c].globalpause();
            }
        }
    },

    pauseChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                this.channels[channel].pause();
            }
        }
    },

    pauseSample: function (handle) {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].handle == handle) {
                    this.channels[c].pause();
                }
            }
        }
    },

    resume: function () {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                this.channels[c].globalresume();
            }
        }
    },

    resumeChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                this.channels[channel].resume();
            }
        }
    },

    resumeSample: function (handle) {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].handle == handle) {
                    this.channels[c].resume();
                }
            }
        }
    },

    setVolumeChannel: function (channel, volume) {
        if (volume < 0) {
            volume = 0;
        }
        if (volume > 100) {
            volume = 100;
        }

        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            this.volumes[channel] = volume;
            if (this.channels[channel] != null) {
                this.channels[channel].setVolume(volume);
            }
        }
    },

    setFrequencyChannel: function (channel, freq) {
        //        if (freq<0) freq=0;
        //        if (freq>100000) freq= 100000;

        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                this.channels[channel].setFrequency(freq);
            }
        }
    },

    setFrequencySample: function (handle, freq) {
        //        if (freq<0) freq=0;
        //        if (freq>100000) freq= 100000;

        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].handle == handle) {
                    this.channels[c].setFrequency(freq);
                }
            }
        }
    },

    setPositionChannel: function (channel, pos) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                this.channels[channel].setPosition(pos);
            }
        }
    },

    setPositionSample: function (handle, pos) {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].handle == handle) {
                    this.channels[c].setPosition(pos);
                }
            }
        }
    },

    getVolumeChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                return this.volumes[channel];
            }
        }
        return 0;
    },

    setVolumeSample: function (handle, volume) {
        if (volume < 0) {
            volume = 0;
        }
        if (volume > 100) {
            volume = 100;
        }

        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].handle == handle) {
                    this.volumes[c] = volume;
                    this.channels[c].setVolume(volume);
                }
            }
        }
    },

    setMainVolume: function (volume) {
        var n;
        this.mainVolume = volume;
        for (n = 0; n < CSoundPlayer.NCHANNELS; n++) {
            this.volumes[n] = volume;
            if (this.channels[n] != null) {
                this.channels[n].setVolume(volume);
            }
        }
    },

    getMainVolume: function () {
        return this.mainVolume;
    },

    getChannel: function (name) {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].name == name) {
                    return c;
                }
            }
        }
        return -1;
    },

    getDurationChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                return this.channels[channel].getDuration();
            }
        }
        return 0;
    },

    getPositionChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                return this.channels[channel].getPosition();
            }
        }
        return 0;
    },

    getFrequencyChannel: function (channel) {
        if (channel >= 0 && channel < CSoundPlayer.NCHANNELS) {
            if (this.channels[channel] != null) {
                return this.channels[channel].getFrequency();
            }
        }
        return 0;
    },

    getVolumeSample: function (name) {
        var channel = this.getChannel(name);
        if (channel >= 0) {
            return this.volumes[channel];
        }
        return 0;
    },

    getDurationSample: function (name) {
        var channel = this.getChannel(name);
        if (channel >= 0) {
            return this.channels[channel].getDuration();
        }
        return 0;
    },

    getPositionSample: function (name) {
        var channel = this.getChannel(name);
        if (channel >= 0) {
            return this.channels[channel].getPosition();
        }
        return 0;
    },

    getFrequencySample: function (name) {
        var channel = this.getChannel(name);
        if (channel >= 0) {
            return this.channels[channel].getFrequency();
        }
        return 0;
    },

    checkSounds: function () {
        var c;
        for (c = 0; c < CSoundPlayer.NCHANNELS; c++) {
            if (this.channels[c] != null) {
                if (this.channels[c].checkSound()) {
                    this.channels[c] = null;
                }
            }
        }
    }
}
