// CAnimHeader object
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

CAnimHeader.tableApprox = [
    CAnim.ANIMID_APPEAR, CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, 0,        // 0  ANIMID_STOP
    CAnim.ANIMID_RUN, CAnim.ANIMID_STOP, 0, 0,                           // 1  ANIMID_WALK
    CAnim.ANIMID_WALK, CAnim.ANIMID_STOP, 0, 0,                          // 2  ANIMID_RUN
    CAnim.ANIMID_STOP, CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, 0,        // 3  ANIMID_APPEAR
    CAnim.ANIMID_STOP, 0, 0, 0,                                          // 4  ANIMID_DISAPPEAR
    CAnim.ANIMID_STOP, CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, 0,        // 5  ANIMID_BOUNCE
    CAnim.ANIMID_STOP, CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, 0,        // 6  ANIMID_SHOOT
    CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, CAnim.ANIMID_STOP, 0,        // 7  ANIMID_JUMP
    CAnim.ANIMID_STOP, CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, 0,        // 8  ANIMID_FALL
    CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, CAnim.ANIMID_STOP, 0,        // 9  ANIMID_CLIMB
    CAnim.ANIMID_STOP, CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, 0,        // 10 ANIMID_CROUCH
    CAnim.ANIMID_STOP, CAnim.ANIMID_WALK, CAnim.ANIMID_RUN, 0,        // 11 ANIMID_UNCROUCH
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
];

function CAnimHeader() {
    this.ahAnimMax = 0;
    this.ahAnims = null;
    this.ahAnimExists = null;
}

CAnimHeader.prototype = {
    load: function (file) {
        var debut = file.getFilePointer();

        file.skipBytes(2);          // ahSize
        this.ahAnimMax = file.readAShort();

        var offsets = new Array(this.ahAnimMax);
        var n;
        for (n = 0; n < this.ahAnimMax; n++) {
            offsets[n] = file.readAShort();
        }

        this.ahAnims = new Array(this.ahAnimMax);
        this.ahAnimExists = new Array(this.ahAnimMax);
        for (n = 0; n < this.ahAnimMax; n++) {
            this.ahAnims[n] = null;
            this.ahAnimExists[n] = 0;
            if (offsets[n] != 0) {
                this.ahAnims[n] = new CAnim();
                file.seek(debut + offsets[n]);
                this.ahAnims[n].load(file);
                this.ahAnimExists[n] = 1;
            }
        }
        var cptAnim;
        for (cptAnim = 0; cptAnim < this.ahAnimMax; cptAnim++) {
            if (this.ahAnimExists[cptAnim] == 0) {
                var bFlag = false;
                if (cptAnim < 12) {
                    for (n = 0; n < 4; n++) {
                        var a = this.ahAnimExists[CAnimHeader.tableApprox[cptAnim * 4 + n]];
                        if (a != 0) {
                            this.ahAnims[cptAnim] = this.ahAnims[CAnimHeader.tableApprox[cptAnim * 4 + n]];
                            bFlag = true;
                            break;
                        }
                    }
                }
                if (bFlag == false) {
                    for (n = 0; n < this.ahAnimMax; n++) {
                        if (this.ahAnimExists[n] != 0) {
                            this.ahAnims[cptAnim] = this.ahAnims[n];
                            break;
                        }
                    }
                }
            }
            else {
                this.ahAnims[cptAnim].approximate(cptAnim);
            }
        }
    },

    enumElements: function (enumImages) {
        var n;
        for (n = 0; n < this.ahAnimMax; n++) {
            if (this.ahAnimExists[n] != 0) {
                this.ahAnims[n].enumElements(enumImages);
            }
        }
    }
}
