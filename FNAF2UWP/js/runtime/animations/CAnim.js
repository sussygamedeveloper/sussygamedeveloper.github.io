// CAnim object
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

CAnim.ANIMID_STOP = 0;
CAnim.ANIMID_WALK = 1;
CAnim.ANIMID_RUN = 2;
CAnim.ANIMID_APPEAR = 3;
CAnim.ANIMID_DISAPPEAR = 4;
CAnim.ANIMID_BOUNCE = 5;
CAnim.ANIMID_SHOOT = 6;
CAnim.ANIMID_JUMP = 7;
CAnim.ANIMID_FALL = 8;
CAnim.ANIMID_CLIMB = 9;
CAnim.ANIMID_CROUCH = 10;
CAnim.ANIMID_UNCROUCH = 11;
CAnim.ANIMID_USER1 = 12;
CAnim.tableAnimTwoSpeeds = [
    0,
    1,
    1,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1
];

function CAnim() {
    this.anDirs = null;
    this.anTrigo = null;
    this.anAntiTrigo = null;
}

CAnim.prototype = {
    load: function (file) {
        var debut = file.getFilePointer();

        var offsets = new Array(32);
        var n;
        for (n = 0; n < 32; n++) {
            offsets[n] = file.readAShort();
        }

        this.anDirs = new Array(32);
        this.anTrigo = new Array(32);
        this.anAntiTrigo = new Array(32);
        for (n = 0; n < 32; n++) {
            this.anDirs[n] = null;
            this.anTrigo[n] = 0;
            this.anAntiTrigo[n] = 0;
            if (offsets[n] != 0) {
                this.anDirs[n] = new CAnimDir();
                file.seek(debut + offsets[n]);
                this.anDirs[n].load(file);
            }
        }
    },

    enumElements: function (enumImages) {
        var n;
        for (n = 0; n < 32; n++) {
            if (this.anDirs[n] != null) {
                this.anDirs[n].enumElements(enumImages);
            }
        }
    },

    approximate: function (nAnim) {
        var d, d2, d3;
        var cpt1, cpt2;

        for (d = 0; d < 32; d++) {
            if (this.anDirs[d] == null) {
                for (d2 = 0, cpt1 = d + 1; d2 < 32; d2++, cpt1++) {
                    cpt1 = cpt1 & 0x1F;
                    if (this.anDirs[cpt1] != null) {
                        this.anTrigo[d] = cpt1;
                        break;
                    }
                }
                for (d3 = 0, cpt2 = d - 1; d3 < 32; d3++, cpt2--) {
                    cpt2 = cpt2 & 0x1F;
                    if (this.anDirs[cpt2] != null) {
                        this.anAntiTrigo[d] = cpt2;
                        break;
                    }
                }
                if (cpt1 == cpt2 || d2 < d3) {
                    this.anTrigo[d] |= 0x40;
                }
                else if (d3 < d2) {
                    this.anAntiTrigo[d] |= 0x40;
                }
            }
            else {
                if (nAnim < 16) {
                    if (CAnim.tableAnimTwoSpeeds[nAnim] == 0) {
                        this.anDirs[d].adMinSpeed = this.anDirs[d].adMaxSpeed;
                    }
                }
            }
        }
    }
}
