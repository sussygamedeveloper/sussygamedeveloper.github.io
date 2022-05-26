// CMask objects
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

//CMask
CMask.SCMF_FULL = 0x0000;
CMask.SCMF_PLATFORM = 0x0001;
CMask.GCMF_OBSTACLE = 0x0000;
CMask.GCMF_PLATFORM = 0x0001;
CMask.lMask = [
    0xFFFF,
    0x7FFF,
    0x3FFF,
    0x1FFF,
    0x0FFF,
    0x07FF,
    0x03FF,
    0x01FF,
    0x00FF,
    0x007F,
    0x003F,
    0x001F,
    0x000F,
    0x0007,
    0x0003,
    0x0001
];
CMask.rMask = [
    0x0000,
    0x8000,
    0xC000,
    0xE000,
    0xF000,
    0xF800,
    0xFC00,
    0xFE00,
    0xFF00,
    0xFF80,
    0xFFC0,
    0xFFE0,
    0xFFF0,
    0xFFF8,
    0xFFFC,
    0xFFFE,
    0xFFFF
];
CMask.topLeft = new CPoint();
CMask.topRight = new CPoint();
CMask.bottomLeft = new CPoint();
CMask.bottomRight = new CPoint();

function CMask() {
    this.mask = null;
    this.lineWidth = 0;
    this.height = 0;
    this.width = 0;
    this.xSpot = 0;
    this.ySpot = 0;
    this.lineWidth = 0;
}

CMask.prototype = {
    createMask: function (app, image, nFlags) {
        var x, y, s;

        this.width = image.width;
        this.height = image.height;
        this.xSpot = image.xSpot;
        this.ySpot = image.ySpot;

        //create mask data array
        var maskWidth = Math.floor(((this.width + 15) & 0xFFFFFFF0) / 16);
        this.lineWidth = maskWidth;
        var length = maskWidth * this.height + 1;
        if (typeof ArrayBuffer != 'undefined') {
            this.mask = new Uint16Array(new ArrayBuffer(length * 2));
        } else {
            this.mask = new Array(length);
            for (x = 0; x < length; x++) {
                this.mask[x] = 0;
            }
        }

        //get teh mask pixel data from the image
        var imageData = image.getData();

        //process the pixel data
        if ((nFlags & CMask.GCMF_PLATFORM) == 0) {
            //new loop
            for (y = 0; y < this.height; y++) {
                var bitmapoffset = y * image.width * 4 + 3;
                var maskoffset = y * maskWidth;
                var bitmask = 0x8000;
                for (x = 0; x < this.width; x++) {
                    if (imageData[bitmapoffset] != 0) {
                        this.mask[maskoffset] |= bitmask;
                    }

                    bitmapoffset += 4;
                    bitmask >>>= 1;

                    if (bitmask == 0) {
                        bitmask = 0x8000;
                        maskoffset++;
                    }
                }
            }
        } else {
            var endY, bm;
            for (x = 0; x < this.width; x++) {
                for (y = 0; y < this.height; y++) {
                    if (imageData[(y * image.width + x) * 4 + 3] != 0) {
                        break;
                    }
                }
                if (y < this.height) {
                    endY = Math.min(this.height, y + CColMask.HEIGHT_PLATFORM);
                    bm = (0x8000 >> (x & 15));
                    for (; y < endY; y++) {
                        if (imageData[(y * image.width + x) * 4 + 3] != 0) {
                            s = Math.floor((y * maskWidth) + (x & 0xFFFFFFF0) / 16);
                            this.mask[s] |= bm;
                        }
                    }
                }
            }
        }
    },

    rotateRect: function (prc, pHotSpot, fAngle) {
        var x, y;
        var cosa, sina;

        if (fAngle == 90.0) {
            cosa = 0.0;
            sina = 1.0;
        }
        else if (fAngle == 180.0) {
            cosa = -1.0;
            sina = 0.0;
        }
        else if (fAngle == 270.0) {
            cosa = 0.0;
            sina = -1.0;
        }
        else {
            var arad = fAngle * Math.PI / 180.0;
            cosa = Math.cos(arad);
            sina = Math.sin(arad);
        }

        var nhxcos;
        var nhxsin;
        var nhycos;
        var nhysin;
        if (pHotSpot == null) {
            nhxcos = nhxsin = nhycos = nhysin = 0.0;
            CMask.topLeft.x = CMask.topLeft.y = 0;
        }
        else {
            nhxcos = -pHotSpot.x * cosa;
            nhxsin = -pHotSpot.x * sina;
            nhycos = -pHotSpot.y * cosa;
            nhysin = -pHotSpot.y * sina;
            CMask.topLeft.x = Math.floor(nhxcos + nhysin);
            CMask.topLeft.y = Math.floor(nhycos - nhxsin);
        }

        if (pHotSpot == null) {
            x = prc.right;
        } else {
            x = prc.right - pHotSpot.x;
        }
        nhxcos = x * cosa;
        nhxsin = x * sina;
        CMask.topRight.x = Math.floor(nhxcos + nhysin);
        CMask.topRight.y = Math.floor(nhycos - nhxsin);

        if (pHotSpot == null) {
            y = prc.bottom;
        } else {
            y = prc.bottom - pHotSpot.y;
        }
        nhycos = y * cosa;
        nhysin = y * sina;
        CMask.bottomRight.x = Math.floor(nhxcos + nhysin);
        CMask.bottomRight.y = Math.floor(nhycos - nhxsin);

        CMask.bottomLeft.x = CMask.topLeft.x + CMask.bottomRight.x - CMask.topRight.x;
        CMask.bottomLeft.y = CMask.topLeft.y + CMask.bottomRight.y - CMask.topRight.y;

        var xmin = Math.min(CMask.topLeft.x, Math.min(CMask.topRight.x, Math.min(CMask.bottomRight.x, CMask.bottomLeft.x)));
        var ymin = Math.min(CMask.topLeft.y, Math.min(CMask.topRight.y, Math.min(CMask.bottomRight.y, CMask.bottomLeft.y)));
        var xmax = Math.max(CMask.topLeft.x, Math.max(CMask.topRight.x, Math.max(CMask.bottomRight.x, CMask.bottomLeft.x)));
        var ymax = Math.max(CMask.topLeft.y, Math.max(CMask.topRight.y, Math.max(CMask.bottomRight.y, CMask.bottomLeft.y)));

        if (pHotSpot != null) {
            pHotSpot.x = -xmin;
            pHotSpot.y = -ymin;
        }

        prc.right = xmax - xmin;
        prc.bottom = ymax - ymin;
    },

    createRotatedMask: function (pMask, fAngle, fScaleX, fScaleY) {
        var x, y;

        var cx = pMask.width;
        var cy = pMask.height;

        var rc = new CRect();
        rc.right = Math.floor(pMask.width * fScaleX);
        rc.bottom = Math.floor(pMask.height * fScaleY);

        var hs = new CPoint();
        hs.x = Math.floor(pMask.xSpot * fScaleX);
        hs.y = Math.floor(pMask.ySpot * fScaleY);
        this.rotateRect(rc, hs, fAngle);
        var newCx = rc.right;
        var newCy = rc.bottom;
        if (newCx <= 0 || newCy <= 0) {
            return false;
        }

        var sMaskWidthWords = pMask.lineWidth;
        var dMaskWidthShorts = ((newCx + 15) & 0x7FFFFFF0) / 16;
        if (typeof ArrayBuffer != 'undefined') {
            this.mask = new Uint16Array(new ArrayBuffer((dMaskWidthShorts * newCy + 1) * 2));
        } else {
            this.mask = new Array(dMaskWidthShorts * newCy + 1);
        }
        var n;
        for (n = dMaskWidthShorts * newCy; n >= 0; n--) {
            this.mask[n] = 0;
        }

        this.lineWidth = dMaskWidthShorts;
        this.width = newCx;
        this.height = newCy;
        this.xSpot = hs.x;
        this.ySpot = hs.y;

        var alpha = (fAngle * 0.017453292);
        var cosa = Math.cos(alpha);
        var sina = Math.sin(alpha);

        var fxs = cx / 2 - ((newCx / 2) * cosa - (newCy / 2) * sina) / fScaleX;
        var fys = cy / 2 - ((newCx / 2) * sina + (newCy / 2) * cosa) / fScaleY;

        var pbd0 = 0;
        var pbd1 = pbd0;

        var nxs = Math.floor(fxs * 65536);
        var nys = Math.floor(fys * 65536);
        var ncosa = Math.floor((cosa * 65536) / fScaleX);
        var nsina = Math.floor((sina * 65536) / fScaleY);

        var newCxMul16 = newCx / 16;
        var newCxMod16 = newCx % 16;

        var ncosa2 = Math.floor((cosa * 65536) / fScaleY);
        var nsina2 = Math.floor((sina * 65536) / fScaleX);

        var cxs = cx * 65536;
        var cys = cy * 65536;

        var bMask;
        var b;
        for (y = 0; y < newCy; y++) {
            var txs = nxs;
            var tys = nys;
            var pbd2 = pbd1;
            var xs, ys;

            for (x = 0; x < newCxMul16; x++) {
                var bd = 0;

                // 1
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x8000;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 2
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x4000;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 3
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x2000;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 4
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x1000;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 5
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0800;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 6
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0400;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 7
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0200;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 8
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0100;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 9
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0080;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 10
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0040;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 11
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0020;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 12
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0010;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 13
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0008;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 14
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0004;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 15
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0002;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                // 16
                if (txs >= 0 && txs < cxs) {
                    if (tys >= 0 && tys < cys) {
                        xs = Math.floor(txs / 65536);
                        ys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (xs % 16));
                        b = pMask.mask[Math.floor(ys * sMaskWidthWords + xs / 16)];
                        if ((b & bMask) != 0) {
                            bd |= 0x0001;
                        }
                    }
                }
                txs += ncosa;
                tys += nsina;

                this.mask[pbd2++] = bd;
            }

            if (newCxMod16 != 0) {
                var bdMask = 0x8000;
                var bdbd = 0;
                for (x = 0; x < newCxMod16; x++, bdMask = ((bdMask >> 1) & 0x7FFF)) {
                    if (txs >= 0 && txs < cxs && tys >= 0 && tys < cys) {
                        var bdxs = Math.floor(txs / 65536);
                        var bdys = Math.floor(tys / 65536);
                        bMask = (0x8000 >>> (bdxs % 16));
                        b = pMask.mask[Math.floor(bdys * sMaskWidthWords + bdxs / 16)];
                        if ((b & bMask) != 0) {
                            bdbd |= bdMask;
                        }
                    }
                    txs += ncosa;
                    tys += nsina;
                }
                this.mask[pbd2] = bdbd;
            }

            pbd1 += dMaskWidthShorts;

            nxs -= nsina2;
            nys += ncosa2;

        }
        return true;
    },

    testMask: function (x1, y1, yBase1, pMask2, x2, y2, yBase2) {
        var pLeft;
        var pRight;
        var x1Left, y1Left, x1Right, y1Right;
        var syLeft, syRight;
        var yBaseLeft, yBaseRight;

        if (x1 <= x2) {
            pLeft = this;
            pRight = pMask2;
            yBaseLeft = Math.floor(yBase1);
            yBaseRight = Math.floor(yBase2);
            x1Left = Math.floor(x1);
            y1Left = Math.floor(y1);
            x1Right = Math.floor(x2);
            y1Right = Math.floor(y2);
        }
        else {
            pLeft = pMask2;
            pRight = this;
            yBaseLeft = Math.floor(yBase2);
            yBaseRight = Math.floor(yBase1);
            x1Left = Math.floor(x2);
            y1Left = Math.floor(y2);
            x1Right = Math.floor(x1);
            y1Right = Math.floor(y1);
        }

        syLeft = pLeft.height;
        var startYLeft = 0;
        if (yBaseLeft != 0) {
            syLeft = yBaseLeft;
            y1Left += pLeft.height - yBaseLeft;
            startYLeft = pLeft.height - yBaseLeft;
        }
        syRight = pRight.height;
        var startYRight = 0;
        if (yBaseRight != 0) {
            syRight = yBaseRight;
            y1Right += pRight.height - yBaseRight;
            startYRight = pRight.height - yBaseRight;
        }
        //        syLeft = pLeft.height - yBaseLeft;
        //        syRight = pRight.height - yBaseRight;

        if (x1Left >= x1Right + pRight.width || x1Left + pLeft.width <= x1Right) {
            return false;
        }
        if (y1Left >= y1Right + syRight || y1Left + syLeft < y1Right) {
            return false;
        }

        var deltaX = x1Right - x1Left;
        var offsetX = Math.floor(deltaX / 16);
        var shiftX = deltaX % 16;
        var countX = Math.min(x1Left + pLeft.width - x1Right, pRight.width);
        countX = Math.floor((countX + 15) / 16);

        var deltaYLeft, deltaYRight, countY;
        if (y1Left <= y1Right) {
            deltaYLeft = y1Right - y1Left + startYLeft;
            deltaYRight = startYRight;
            countY = Math.min(y1Left + syLeft, y1Right + syRight) - y1Right;
        }
        else {
            deltaYLeft = startYLeft;
            deltaYRight = y1Left - y1Right + startYRight;
            countY = Math.min(y1Left + syLeft, y1Right + syRight) - y1Left;
        }
        var x, y;

        var offsetYLeft, offsetYRight;
        var leftX, middleX;
        var shortX;
        offsetYLeft = deltaYLeft * pLeft.lineWidth;
        offsetYRight = deltaYRight * pRight.lineWidth;
        if (shiftX != 0) {
            switch (countX) {
                case 1:
                    for (y = 0; y < countY; y++) {
                        // Premier mot
                        leftX = pLeft.mask[offsetYLeft + offsetX] << shiftX;
                        if ((leftX & pRight.mask[offsetYRight]) != 0) {
                            return true;
                        }

                        if (offsetX + 1 < pLeft.lineWidth) {
                            middleX = pLeft.mask[offsetYLeft + offsetX + 1] << shiftX;
                            middleX >>>= 16;
                            if ((middleX & pRight.mask[offsetYRight]) != 0) {
                                return true;
                            }
                        }
                        offsetYLeft += pLeft.lineWidth;
                        offsetYRight += pRight.lineWidth;
                    }
                    break;
                case 2:
                    for (y = 0; y < countY; y++) {
                        // Premier mot
                        leftX = pLeft.mask[offsetYLeft + offsetX] << shiftX;
                        if ((leftX & pRight.mask[offsetYRight]) != 0) {
                            return true;
                        }
                        middleX = pLeft.mask[offsetYLeft + offsetX + 1] << shiftX;
                        shortX = (middleX >>> 16);
                        if ((shortX & pRight.mask[offsetYRight]) != 0) {
                            return true;
                        }

                        // Milieu
                        if ((middleX & pRight.mask[offsetYRight + 1]) != 0) {
                            return true;
                        }

                        if (offsetX + 2 < pLeft.lineWidth) {
                            middleX = pLeft.mask[offsetYLeft + offsetX + 2] << shiftX;
                            middleX >>>= 16;
                            if ((middleX & pRight.mask[offsetYRight + 1]) != 0) {
                                return true;
                            }
                        }
                        offsetYLeft += pLeft.lineWidth;
                        offsetYRight += pRight.lineWidth;
                    }
                    break;
                default:
                    for (y = 0; y < countY; y++) {
                        // Premier mot
                        leftX = pLeft.mask[offsetYLeft + offsetX] << shiftX;
                        if ((leftX & pRight.mask[offsetYRight]) != 0) {
                            return true;
                        }

                        for (x = 0; x < countX - 1; x++) {
                            middleX = pLeft.mask[offsetYLeft + offsetX + x + 1] << shiftX;
                            shortX = (middleX >>> 16);
                            if ((shortX & pRight.mask[offsetYRight + x]) != 0) {
                                return true;
                            }

                            // Milieu
                            if ((middleX & pRight.mask[offsetYRight + x + 1]) != 0) {
                                return true;
                            }
                        }

                        if (offsetX + x + 1 < pLeft.lineWidth) {
                            middleX = pLeft.mask[offsetYLeft + offsetX + x + 1] << shiftX;
                            middleX >>>= 16;
                            if ((middleX & pRight.mask[offsetYRight + x]) != 0) {
                                return true;
                            }
                        }
                        offsetYLeft += pLeft.lineWidth;
                        offsetYRight += pRight.lineWidth;
                    }
                    break;
            }
        }
        else {
            for (y = 0; y < countY; y++) {
                for (x = 0; x < countX; x++) {
                    leftX = pLeft.mask[offsetYLeft + offsetX + x];
                    if ((pRight.mask[offsetYRight + x] & leftX) != 0) {
                        return true;
                    }
                }
                offsetYLeft += pLeft.lineWidth;
                offsetYRight += pRight.lineWidth;
            }
        }
        return false;
    },

    testRect2: function (x1Mask, y1Mask, htFoot1, x1Rect, y1Rect, rWidth, rHeight, htFoot2) {
        x1Mask = Math.floor(x1Mask);
        y1Mask = Math.floor(y1Mask);
        x1Rect = Math.floor(x1Rect);
        y1Rect = Math.floor(y1Rect);

        var startYMask = 0;
        var syMask = this.height;
        if (htFoot1 > 0) {
            startYMask = this.height - htFoot1;
            y1Mask += startYMask;
            syMask = htFoot1;
        }
        var startYRect = 0;
        var syRect = rHeight;
        if (htFoot2 > 0) {
            startYRect = rHeight - htFoot2;
            y1Rect += startYRect;
            syRect = htFoot2;
        }
        if (x1Mask >= x1Rect + rWidth || x1Mask + this.width <= x1Rect) {
            return false;
        }
        if (y1Mask >= y1Rect + syRect || y1Mask + syMask < y1Rect) {
            return false;
        }

        var startX, countX;
        var startY, countY;
        if (x1Mask <= x1Rect) {
            startX = x1Rect - x1Mask;
            countX = Math.min(this.width - startX, rWidth);
        }
        else {
            startX = 0;
            countX = Math.min(x1Rect + rWidth - x1Mask, this.width);
        }
        if (y1Mask <= y1Rect) {
            startY = y1Rect - y1Mask + startYMask;
            countY = Math.min(y1Mask + syMask, y1Rect + syRect) - y1Rect;
        }
        else {
            startY = startYMask;
            countY = Math.min(y1Mask + syMask, y1Rect + syRect) - y1Mask;
        }

        var xOffset = Math.floor(startX / 8);
        var nBytes = Math.floor((startX + countX + 15) / 16) - Math.floor(startX / 16);

        var m;
        var yOffset;
        var y, x;
        for (y = 0; y < countY; y++) {
            yOffset = (y + startY) * this.lineWidth;

            switch (nBytes) {
                case 1:
                    m = (CMask.lMask[startX & 15] & CMask.rMask[((startX + countX - 1) & 15) + 1]);
                    if ((this.mask[yOffset + xOffset] & m) != 0) {
                        return true;
                    }
                    break;
                case 2:
                    m = CMask.lMask[startX & 15];
                    if ((this.mask[yOffset + xOffset] & m) != 0) {
                        return true;
                    }
                    m = CMask.rMask[((startX + countX - 1) & 15) + 1];
                    if ((this.mask[yOffset + xOffset + 1] & m) != 0) {
                        return true;
                    }
                    break;
                default:
                    m = CMask.lMask[startX & 15];
                    if ((this.mask[yOffset + xOffset] & m) != 0) {
                        return true;
                    }
                    for (x = 1; x < nBytes - 1; x++) {
                        if (this.mask[yOffset + xOffset + x] != 0) {
                            return true;
                        }
                    }
                    m = CMask.rMask[((startX + countX - 1) & 15) + 1];
                    if ((this.mask[yOffset + xOffset + x] & m) != 0) {
                        return true;
                    }
                    break;
            }
        }
        return false;
    },

    /*
     testRect:function(yBase1, xx, yy, w, h)
     {
     var x1 = xx;
     if (x1 < 0)
     {
     w += x1;
     x1 = 0;
     }
     var y1 = yy;
     if (yBase1 != 0 && y1 >= 0)
     {
     y1 = yBase1 + y1;
     h = height - y1;
     }
     if (y1 < 0)
     {
     h += y1;
     y1 = 0;
     }
     var x2 = x1 + w;
     if (x2 > this.width)
     {
     x2 = this.width;
     }
     var y2 = y1 + h;
     if (y2 > this.height)
     {
     y2 = this.height;
     }

     var offset = (y1) * this.lineWidth;
     var yCount = y2 - y1;
     var xCount = Math.floor((x2 - x1) / 16) + 1;
     var xOffset = Math.floor(x1 / 16);
     var x, y;

     var m;
     var yOffset;
     for (y = 0; y < yCount; y++)
     {
     yOffset = y * this.lineWidth + offset;

     switch (xCount)
     {
     case 1:
     m = (CMask.lMask[x1 & 15] & rMask[(x2 - 1) & 15]);
     if ((this.mask[yOffset + xOffset] & m) != 0)
     {
     return true;
     }
     break;
     case 2:
     m = CMask.lMask[x1 & 15];
     if ((this.mask[yOffset + xOffset] & m) != 0)
     {
     return true;
     }
     m = CMask.rMask[(x2 - 1) & 15];
     if ((mask[yOffset + xOffset + 1] & m) != 0)
     {
     return true;
     }
     break;
     default:
     m = CMask.lMask[x1 & 15];
     if ((this.mask[yOffset + xOffset] & m) != 0)
     {
     return true;
     }
     for (x = 1; x < xCount - 1; x++)
     {
     if (this.mask[yOffset + xOffset + 1] != 0)
     {
     return true;
     }
     }
     m = CMask.rMask[(x2 - 1) & 15];
     if ((this.mask[yOffset + xOffset + x] & m) != 0)
     {
     return true;
     }
     break;
     }
     }
     return false;
     },
     */

    testPoint: function (x1Mask, y1Mask, x1, y1) {
        var xx = Math.floor(x1 - x1Mask);
        var yy = Math.floor(y1 - y1Mask);
        if (xx < 0 || xx >= this.width || yy < 0 || yy >= this.height) {
            return false;
        }

        var offset = (yy * this.lineWidth) + Math.floor(xx / 16);
        var m = ((0x8000) >>> (xx & 15));
        var data = this.mask[offset];
        if ((this.mask[offset] & m) != 0) {
            return true;
        }
        return false;
    },

    // Test a point in the mask
    // DeltaX/Y = screen coordinates relative to the mask's hot spot

    testPointEx: function (deltaX, deltaY, angle, xScale, yScale) {
        var xx = Math.floor(deltaX);
        var yy = Math.floor(deltaY);
        var xo = xx;
        var yo = yy;

        // Convert screen coordinates to mask coordinates
        if (angle == 0) {
            // Scaling?
            if (xScale != 1.0 || yScale != 1.0) {
                xo = Math.floor(xo / xScale);
                yo = Math.floor(yo / yScale);
            }

            xo += this.xSpot;
            yo += this.ySpot;
        } else {
            // Rotate position
            var alpha = angle * 3.141592653589 / 180.0;
            var cosa = Math.cos(alpha);
            var sina = Math.sin(alpha);

            xo = xx * cosa - yy * sina;
            yo = yy * cosa + xx * sina;

            // Scaling?
            if (xScale != 1.0 || yScale != 1.0) {
                xo /= xScale;
                yo /= yScale;
            }

            // Get position relative to top-left corner of rectangle
            xo += this.xSpot;
            yo += this.ySpot;
        }

        // Test pixel at mask coordinates
        xx = Math.floor(xo);
        yy = Math.floor(yo);
        if (xx < 0 || xx >= this.width || yy < 0 || yy >= this.height) {
            return false;
        }

        var offset = (yy * this.lineWidth) + Math.floor(xx / 16);
        var m = ((0x8000) >>> (xx & 15));
        var data = this.mask[offset];
        if ((this.mask[offset] & m) != 0) {
            return true;
        }
        return false;
    }
}
