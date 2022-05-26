// CSound object
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

function CSound(a) {
    this.application = a;
    this.context = a.soundPlayer.context;
    this.contextType = a.soundPlayer.contextType;
    this.gainNode = a.soundPlayer.gainNode;
    this.type = 0;
    this.file = a.file;
    this.handle = -1;
    this.source = null;
    this.sound = null;
    this.useCount = 0;
    this.bUninterruptible = false;
    this.nLoops = 0;
    this.numSound = 0;
    this.name = null;
    this.bPaused = false;
    this.bAllowGlobalResume = false;
    this.bPlaying = false;
    this.frequency = 0;
    this.response = null;
    this.gain = null;
}

CSound.prototype = {
    readHandle: function () {
        this.handle = this.file.readAShort();
        this.file.skipBytes(5);
        var l = this.file.readAShort();
        if (this.file.unicode == false) {
            this.file.skipBytes(l);
        } else {
            this.file.skipBytes(l * 2);
        }
    },

    createFromSound: function () {
        if (HTMLMediaElement.mozLoadFrom) {
            var snd = new CSound(this.application);
            snd.handle = this.handle;
            snd.sound = HTMLMediaElement.mozLoadFrom(this.sound);
            snd.name = this.name;
            snd.type = this.type;
            snd.song = this.song;
            snd.type = this.type;
            return snd;
        }
        return this;
    },

    onLoadStart: function () {
        var that = this;
        var format;
        var playableFormats = this.application.soundPlayer.probablePlayableFormats & this.type;
        if (playableFormats == 0) {
            playableFormats = this.application.soundPlayer.maybePlayableFormats & this.type;
        }

        for (format = 0; format < 4; format++) {
            if (playableFormats & (1 << format)) {
                break;
            }
        }

        //get src
        var ext;
        switch (format) {
            case 0:
                ext = "ogg";
                break;
            case 1:
                ext = "m4a";
                break;
            case 2:
                ext = "mp3";
                break;
            case 3:
                ext = "wav"
                break;
            default:
                ext = "unsupported";
        }

        var loadSrc = this.application.resourcesPath + CServices.formatDiscName(this.handle, ext);
        //add cache blocking??



        //is the format supported?
        if (format >= 4) {
            //nope the format is not supported
            this.application.onDataLoadError(this, loadSrc);
            return;
        }

        //how should we load the sound?
        if (this.context) {
            //via XMLHttpRequest!
            var context = this.context;

            //load new audio
            var request = new XMLHttpRequest();
            request.open('GET', loadSrc, true);
            request.responseType = 'arraybuffer';

            //load event
            request.addEventListener('load', function (event) {
                var audioData = request.response;

                //tell the soundplayer context to now decode this data
                context.decodeAudioData(audioData, function (buffer) {
                    //success
                    that.buffer = buffer;

                    //inform app of finished
                    that.application.onDataLoaded(that, loadSrc);

                }, function (e) {
                    //failed
                    that.application.onDataLoadError(that, loadSrc);
                    that.sound = null;
                });
            });

            //error event
            request.addEventListener('error', function (event) {
                that.application.onDataLoadError(that, loadSrc);
                that.sound = null;
            });

            //start the load
            request.send();

        } else {
            //via Audio object
            this.sound = new Audio();
            this.sound.preload = "auto";
            this.sound.autoplay = false;

            //this.sound = document.createElement('audio');
            //this.sound.preload = 'meta';
            //this.sound.autoplay = false;
            //document.body.appendChild(this.sound);

            //load event
            this.sound.addEventListener("canplaythrough", function (e) {
                this.play();
                this.pause();
                this.currentTime = 0;
                that.application.onDataLoaded(that, loadSrc);
                that.sound.removeEventListener('canplaythrough', arguments.callee, false);
            }, false);

            //error event
            this.sound.addEventListener("error", function (e) {
                that.application.onDataLoadError(that, loadSrc);
                that.sound = null;
            }, false);

            //start the load
            this.sound.src = loadSrc;

            //TODO: do we need this any more?
            this.sound.queueLoad();
        }
    },

    load: function () {
    },

    queueLoad: function () {
        this.handle = this.file.readAShort();
        this.type = this.file.readAByte();
        this.frequency = this.file.readAInt();
        this.currentFrequency = this.frequency;
        var l = this.file.readAShort();
        this.name = this.file.readAString(l);
        this.sound = null;
        this.application.addDataToLoad(this);
    },

    queueLoadSilentSample: function () {
        this.handle = 9999;
        this.type = 0x04;
        this.frequency = 40000;
        this.currentFrequency = this.frequency;
        this.name = "";
        this.sound = null;
        this.application.addDataToLoad(this);
    },

    playIt: function (time, frequency) {
        //fix parameters missing
        if (!time) {
            time = 0;
        }
        if (!frequency) {
            frequency = this.frequency;
        }

        //playing sound or buffer?
        if (this.sound) {
            //audo object
            this.sound.volume = (this.volume / 100.0);
            this.currentFrequency = frequency;
            this.sound.playbackRate = frequency / this.frequency;
            if (this.sound.duration) {
                this.sound.currentTime = 0;
            }
            this.sound.play();

        } else if (this.buffer) {
            //buffer
            this.source = this.context["createBufferSource"]();
            this.source["buffer"] = this.buffer;
            if (this.contextType == 0) {
                this.source["gain"]["value"] = (this.volume / 100.0);
                this.source["connect"](this.context["destination"]);
            }
            else {
                this.gain = this.context["createGain"]();
                this.source["connect"](this.gain);
                this.gain["connect"](this.context["destination"]);
                this.gain["gain"]["value"] = (this.volume / 100.0);
            }
            if (!time) {
                time = 0;
            }
            if (!frequency) {
                frequency = this.frequency;
            }
            this.currentFrequency = frequency;
            this.source["playbackRate"]["value"] = frequency / this.frequency;

            this.startTime = Date.now() - time;
            if (typeof this.source["start"] !== "undefined") {
                this.source["start"](0, time / 1000);
            } else {
                this.source["noteOn"](time);
            }
            var that = this;
            this.source["onended"] = function (e) {
                that.bEnded = true;
            }
        }

        this.bPaused = false;
        this.bPlaying = true;
        this.bEnded = false;
    },

    play: function (nl, bPrio, v) {
        this.nLoops = nl;
        if (this.nLoops == 0) {
            this.nLoops = 10000000;
        }
        this.volume = v;

        this.playIt();
    },

    stop: function () {
        if (this.sound) {
            this.sound.pause();
        } else if (this.source && this.bPlaying) {
            if (typeof this.source["stop"] !== "undefined") {
                this.source["stop"](0);
            } else {
                this.source["noteOff"](0);
            }
            this.source["onended"] = null;
        }
        this.bUninterruptible = false;
        this.bPlaying = false;
    },

    setVolume: function (v) {
        this.volume = v;
        if (this.sound) {
            this.sound.volume = (v / 100.0);
        } else if (this.source) {
            if (this.gain) {
                this.gain["gain"]["value"] = (v / 100.0);
            } else {
                this.source["gain"]["value"] = (v / 100.0);
            }
        }
    },

    pause: function () {
        if (this.sound) {
            this.sound.pause();
        } else if (this.source) {
            this.source["onended"] = null;
            if (typeof this.source["stop"] !== "undefined") {
                this.source["stop"](0);
            } else {
                this.source["noteOff"](0);
            }
            this.pauseTime = Date.now() - this.startTime;
        }
        this.bPaused = true;
    },

    globalpause: function () {
        if (!this.bPaused) {
            this.pause();
            this.bAllowGlobalResume = true;
        } else {
            this.bAllowGlobalResume = false;
        }
    },

    resume: function () {
        if (this.sound) {
            this.sound.play();
        } else if (this.source) {
            this.playIt(this.pauseTime);
        }
        this.bPaused = false;
    },

    globalresume: function () {
        if (this.bAllowGlobalResume) {
            this.resume();
            this.bAllowGlobalResume = false;
        }
    },

    isPaused: function () {
        return this.bPaused;
    },

    isPlaying: function () {
        if ((this.sound || this.source) && this.bPlaying) {
            return !this.bPaused;
        }
        return false;
    },

    getDuration: function () {
        if (this.sound && this.sound.duration != undefined && isNaN(this.sound.duration) == false && this.sound.duration != Infinity) {
            return Math.floor(this.sound.duration * 1000);
        }
        else if (this.source) {
            return this.buffer["duration"] * 1000;
        }
        return 0;
    },

    getPosition: function () {
        if (this.sound) {
            return Math.floor(this.sound.currentTime * 1000);
        } else if (this.source) {
            var t;
            if (this.bPaused)
                t = this.pauseTime;
            else
                t = Date.now() - this.startTime;
            return Math.min(this.buffer["duration"] * 1000, t);
        }
        return 0;
    },

    setPosition: function (t) {
        if (this.sound) {
            this.sound.currentTime = t / 1000;
        } else if (this.source) {
            if (this.bPlaying) {
                this.source["onended"] = null;
                if (typeof this.source["stop"] !== "undefined") {
                    this.source["stop"](0);
                } else {
                    this.source["noteOff"](0);
                }
            }
            this.playIt(t);
        }
    },

    setFrequency: function (t) {
        var pitch = t / this.frequency;
        this.currentFrequency = t;
        if (this.sound) {
            this.sound.playbackRate = pitch;
        } else if (this.source) {
            this.source["playbackRate"]["value"] = pitch;
        }
    },

    getFrequency: function (t) {
        return this.currentFrequency;
    },

    checkSound: function () {
        if (this.bPlaying == true && this.bPaused == false) {
            if (this.sound) {
                if (this.sound.ended) {
                    if (this.nLoops > 0) {
                        this.nLoops--;
                        if (this.nLoops > 0) {
                            this.playIt(0, this.currentFrequency);
                            return false;
                        }
                    }
                    this.bUninterruptible = false;
                    this.bPlaying = false;
                    return true;
                }
            }
            else if (this.source) {
                if (this.source["playbackState"] == 3 || this.bEnded) {
                    if (this.nLoops > 0) {
                        this.nLoops--;
                        if (this.nLoops > 0) {
                            this.playIt(0, this.currentFrequency);
                            return false;
                        }
                    }
                    this.bUninterruptible = false;
                    this.bPlaying = false;
                    return true;
                }
            }
        }
        return false;
    }

}
