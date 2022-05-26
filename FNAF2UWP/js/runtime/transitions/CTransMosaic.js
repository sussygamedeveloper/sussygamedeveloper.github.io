// CTransMosaic object
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

function CTransMosaic() {
    //call chain
    CTrans.call(this);

    //call self
    this.blockPercent;
    this.blockSize = 0;
    this.blocksPerRow = 0;
    this.blocksPerColumn = 0;
    this.totalBlocks = 0;
    this.lastBlocksCount = 0;
    this.bitBuffer = null;
}

CTransMosaic.prototype = {
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.blockPercent = file.readAInt();
    },

    onStart: function (flag) {
        // Spot size: voir si ca rend bien
        this.blockSize = Math.floor(((this.oldBufferWidth * this.blockPercent / 100) + (this.oldBufferHeight * this.blockPercent / 100)) / 2);
        if (this.blockSize == 0) {
            this.blockSize = 1;
        }

        // Calcul buffer bits
        var bufSize;
        this.blocksPerRow = ((this.oldBufferWidth + this.blockSize - 1) / this.blockSize);
        this.blocksPerColumn = ((this.oldBufferHeight + this.blockSize - 1) / this.blockSize);
        this.totalBlocks = this.blocksPerRow * this.blocksPerColumn;
        bufSize = Math.floor((this.totalBlocks + 7) / 8 + 2);    // 2 = security
        this.lastBlocksCount = 0;
        this.bitBuffer = new Array(bufSize);
        var n;
        for (n = 0; n < bufSize; n++) {
            this.bitBuffer[n] = 0;
        }

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        if (this.bitBuffer == null || this.blocksPerRow < 2 || this.blocksPerColumn < 2 || this.duration == 0) {
            this.blit(this.newBuffer);
        } else {
            var NB_TRIES = 1;
            var i;
            var l, xb = 0, yb = 0;
            var nbBlocks = Math.floor(this.totalBlocks * this.getDeltaTime() / this.duration);
            var nbCurrentBlocks = nbBlocks - this.lastBlocksCount;
            if (nbCurrentBlocks != 0) {
                this.lastBlocksCount = nbBlocks;
                for (l = 0; l < nbCurrentBlocks; l++) {
                    // Get random block coordinates
                    for (i = 0; i < NB_TRIES; i++) {
                        xb = Math.floor(this.blocksPerRow * Math.random());
                        yb = Math.floor(this.blocksPerColumn * Math.random());

                        var nb, off;
                        var mask;

                        nb = yb * this.blocksPerRow + xb;
                        off = Math.floor(nb / 8);
                        mask = (1 << (nb & 7));
                        if ((this.bitBuffer[off] & mask) == 0) {
                            this.bitBuffer[off] |= mask;
                            break;
                        }

                        var pBuf = off;
                        var nbb = (this.totalBlocks + 7) / 8;
                        var b;
                        var r = false;
                        for (b = off; b < nbb; b++, pBuf++) {
                            if (this.bitBuffer[pBuf] != -1) {
                                yb = Math.floor((b * 8) / this.blocksPerRow);
                                xb = Math.floor((b * 8) % this.blocksPerRow);
                                for (mask = 1; mask != 0; mask <<= 1) {
                                    if ((this.bitBuffer[pBuf] & mask) == 0) {
                                        this.bitBuffer[pBuf] |= mask;
                                        r = true;
                                        break;
                                    }
                                    if (++xb >= this.blocksPerRow) {
                                        xb = 0;
                                        if (++yb >= this.blocksPerColumn) {
                                            break;
                                        }
                                    }
                                }
                                if (r) {
                                    break;
                                }
                            }
                        }
                        if (r) {
                            break;
                        }

                        pBuf = 0;
                        for (b = 0; b < off; b++, pBuf++) {
                            if (this.bitBuffer[pBuf] != 255) {
                                yb = Math.floor((b * 8) / this.blocksPerRow);
                                xb = Math.floor((b * 8) % this.blocksPerRow);
                                for (mask = 1; mask != 0; mask <<= 1) {
                                    if ((this.bitBuffer[pBuf] & mask) == 0) {
                                        this.bitBuffer[pBuf] |= mask;
                                        r = true;
                                        break;
                                    }
                                    if (++xb >= this.blocksPerRow) {
                                        xb = 0;
                                        if (++yb >= this.blocksPerColumn) {
                                            break;
                                        }
                                    }
                                }
                                if (r) {
                                    break;
                                }
                            }
                            if (r) {
                                break;
                            }

                            r = false;
                        }
                    }
                    if (i < NB_TRIES) {
                        this.blit(this.newBuffer, Math.floor(xb * this.blockSize), Math.floor(yb * this.blockSize), Math.floor(xb * this.blockSize), Math.floor(yb * this.blockSize), this.blockSize, this.blockSize);
                    }
                }
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransMosaic);