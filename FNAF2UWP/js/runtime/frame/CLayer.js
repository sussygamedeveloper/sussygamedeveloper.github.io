// CLayer Object
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

CLayer.FLOPT_XCOEF = 0x0001;
CLayer.FLOPT_YCOEF = 0x0002;
CLayer.FLOPT_NOSAVEBKD = 0x0004;
CLayer.FLOPT_VISIBLE = 0x0010;
CLayer.FLOPT_WRAP_HORZ = 0x0020;
CLayer.FLOPT_WRAP_VERT = 0x0040;
CLayer.FLOPT_REDRAW = 0x000010000;
CLayer.FLOPT_TOHIDE = 0x000020000;
CLayer.FLOPT_TOSHOW = 0x000040000;

function CLayer(a) {
    this.app = a;
    this.pName = null;
    this.x = 0;//this calculated display position of this layer (includes frame offset and layer coef)
    this.y = 0;
    this.dx = 0;//the amount to change this layers position
    this.dy = 0;
    this.realX = 0;//unmodified position for this layer
    this.realY = 0;
    this.pObstacles = null;
    this.pPlatforms = null;
    this.addedBackdrops = null;
    this.bVisible = false;
    this.pLadders = null;
    this.dwOptions = 0;
    this.xCoef = 0;
    this.yCoef = 0;
    this.nBkdLOs = 0;
    this.nFirstLOIndex = 0;
    this.effect = 0;
    this.effectParam = 0;
    this.backUp_dwOptions = 0;
    this.backUp_xCoef = 0;
    this.backUp_yCoef = 0;
    this.backUp_nBkdLOs = 0;
    this.backUp_nFirstLOIndex = 0;
    this.planeBack = null;
    this.planeQuickDisplay = null;
    this.planeSprites = null;
    this.angle = 0;
    this.scale = this.scaleX = this.scaleY = 1;
    this.xSpot = this.xDest = 320;
    this.ySpot = this.yDest = 240;
}

CLayer.prototype = {
    load: function (file) {
        this.dwOptions = file.readAInt();
        this.xCoef = file.readAFloat();
        this.yCoef = file.readAFloat();
        this.nBkdLOs = file.readAInt();
        this.nFirstLOIndex = file.readAInt();
        this.pName = file.readAString();

        this.backUp_dwOptions = this.dwOptions;
        this.backUp_xCoef = this.xCoef;
        this.backUp_yCoef = this.yCoef;
        this.backUp_nBkdLOs = this.nBkdLOs;
        this.backUp_nFirstLOIndex = this.nFirstLOIndex;
    },

    reset: function () {
        this.dwOptions = this.backUp_dwOptions;
        this.xCoef = this.backUp_xCoef;
        this.yCoef = this.backUp_yCoef;
        this.nBkdLOs = this.backUp_nBkdLOs;
        this.nFirstLOIndex = this.backUp_nFirstLOIndex;
        this.x = this.y = this.dx = this.dy = this.realX = this.realY = 0;

        this.pObstacles = null;
        this.pPlatforms = null;
        this.pLadders = null;
        this.addedBackdrops = null;

        this.setAngle(0);
        this.scale = 1;
        this.setScaleX(1);
        this.setScaleY(1);
        this.setXSpot(this.app.gaCxWin / 2);
        this.setYSpot(this.app.gaCyWin / 2);
        this.setXDest(this.app.gaCxWin / 2);
        this.setYDest(this.app.gaCyWin / 2);
        this.setZoom(false);

        if (this.dwOptions & CLayer.FLOPT_TOHIDE) {
            this.bVisible = true;
            this.hide();
        }
        else {
            this.bVisible = false;
            this.show();
        }
    },

    resetZOrder: function () {
        if (this.planeBack != null) {
            this.planeBack.resetChildrenZOrderCounters();
        }

        if (this.planeQuickDisplay != null) {
            this.planeQuickDisplay.resetChildrenZOrderCounters();
        }

        if (this.planeSprites != null) {
            this.planeSprites.resetChildrenZOrderCounters();
        }
    },

    lockOrder: function() {
        this.planeSprites.lock();
    },

    unlockOrder: function () {
        this.planeSprites.unlock();
    },

    deleteBackObjects: function () {
        this.planeBack.clearChildren();
    },

    addObstacle: function (bi) {
        if (this.pObstacles == null) {
            this.pObstacles = new CArrayList();
        }
        this.pObstacles.add(bi);
    },

    delObstacle: function (bi) {
        if (this.pObstacles != null) {
            this.pObstacles.removeObject(bi);
        }
    },

    addPlatform: function (bi) {
        if (this.pPlatforms == null) {
            this.pPlatforms = new CArrayList();
        }
        this.pPlatforms.add(bi);
    },

    delPlatform: function (bi) {
        if (this.pPlatforms != null) {
            this.pPlatforms.removeObject(bi);
        }
    },

    addBackdrop: function (bi) {
        if (this.addedBackdrops == null) {
            this.addedBackdrops = new CArrayList();
        }
        this.addedBackdrops.add(bi);
    },

    resetLevelBackground: function () {
        this.pPlatforms = null;
        this.pObstacles = null;
        this.pLadders = null;
        this.addedBackdrops = null;
        this.planeBack.clearChildren();
    },

    createPlanes: function (xOffset, yOffset) {
        this.planeBack = new CLayerPlane(this);
        this.planeBack.sortable = true;
        this.planeBack.x = xOffset;
        this.planeBack.y = yOffset;

        this.planeQuickDisplay = new CLayerPlane(this);
        this.planeQuickDisplay.sortable = true;
        this.planeQuickDisplay.x = xOffset;
        this.planeQuickDisplay.y = yOffset;

        this.planeSprites = new CLayerPlane(this);
        this.planeSprites.sortable = true;
        this.planeSprites.x = xOffset;
        this.planeSprites.y = yOffset;

        this.setAngle(0);
        this.scale = 1;
        this.setScaleX(1);
        this.setScaleY(1);
        this.setXSpot(this.app.gaCxWin / 2);
        this.setYSpot(this.app.gaCyWin / 2);
        this.setXDest(this.app.gaCxWin / 2);
        this.setYDest(this.app.gaCyWin / 2);
        this.setZoom(false);

        this.app.mainSprite.addChild(this.planeBack);
        this.app.mainSprite.addChild(this.planeQuickDisplay);
        this.app.mainSprite.addChild(this.planeSprites);
        this.showHide();
    },

    setAngle: function (angle) {
        this.angle = angle;
        this.planeBack.angle = angle;
        this.planeQuickDisplay.angle = angle;
        this.planeSprites.angle = angle;
    },

    setScaleX: function (scale) {
        this.scaleX = scale;
        this.planeBack.scaleX = scale;
        this.planeQuickDisplay.scaleX = scale;
        this.planeSprites.scaleX = scale;
    },

    setScaleY: function (scale) {
        this.scaleY = scale;
        this.planeBack.scaleY = scale;
        this.planeQuickDisplay.scaleY = scale;
        this.planeSprites.scaleY = scale;
    },

    setXSpot: function (spot) {
        this.xSpot = spot;
        this.planeBack.xSpot = spot;
        this.planeQuickDisplay.xSpot = spot;
        this.planeSprites.xSpot = spot;
    },

    setYSpot: function (spot) {
        this.ySpot = spot;
        this.planeBack.ySpot = spot;
        this.planeQuickDisplay.ySpot = spot;
        this.planeSprites.ySpot = spot;
    },

    setXDest: function (spot) {
        spot = this.app.gaCxWin - spot;
        this.xDest = spot;
        this.planeBack.xDest = spot;
        this.planeQuickDisplay.xDest = spot;
        this.planeSprites.xDest = spot;
    },

    setYDest: function (spot) {
        spot = this.app.gaCyWin - spot;
        this.yDest = spot;
        this.planeBack.yDest = spot;
        this.planeQuickDisplay.yDest = spot;
        this.planeSprites.yDest = spot;
    },

    setZoom: function (zoom) {
        this.zoom = zoom;
        this.planeBack.zoom = zoom;
        this.planeQuickDisplay.zoom = zoom;
        this.planeSprites.zoom = zoom;
    },

    resetPlanes: function (xOffset, yOffset) {
        this.planeBack.x = xOffset;
        this.planeBack.y = yOffset;
        this.planeQuickDisplay.x = xOffset;
        this.planeQuickDisplay.y = yOffset;
        this.planeSprites.x = xOffset;
        this.planeSprites.y = yOffset;
        this.show();
    },

    fillBack: function (sx, sy, color) {
        // TODO!
    },

    showHide: function () {
        if (this.dwOptions & CLayer.FLOPT_VISIBLE) {
            this.show();
        } else {
            this.hide();
        }
    },

    hide: function () {
        this.dwOptions &= ~CLayer.FLOPT_TOHIDE;
        if (this.bVisible) {
            this.planeBack.visible = false;
            this.planeQuickDisplay.visible = false;
            this.planeSprites.visible = false;
            this.bVisible = false;
        }
    },

    show: function () {
        if (this.bVisible == false) {
            this.planeBack.visible = true;
            this.planeQuickDisplay.visible = true;
            this.planeSprites.visible = true;
            this.bVisible = true;
        }
    },

    deletePlanes: function () {
        if (this.planeBack != null) {
            this.app.mainSprite.removeChild(this.planeBack);
            this.planeBack = null;
        }
        if (this.planeQuickDisplay != null) {
            this.app.mainSprite.removeChild(this.planeQuickDisplay);
            this.planeQuickDisplay = null;
        }
        if (this.planeSprites != null) {
            this.app.mainSprite.removeChild(this.planeSprites);
            this.planeSprites = null;
        }
    },

    deleteAddedBackdrops: function () {
        var n;
        if (this.addedBackdrops != null) {
            for (n = 0; n < this.addedBackdrops.size(); n++) {
                var bi = this.addedBackdrops.get(n);
                bi.delInstance(this);
                if (bi.body != null) {
                    this.app.run.rh4Box2DBase.rSubABackdrop(bi.body);
                }
            }
        }
        this.addedBackdrops = null;
    },

    deleteAddedBackdropsAt: function (xx, yy, fine) {
        xx += this.x;
        yy += this.y;

        var n;
        if (this.addedBackdrops != null) {
            for (n = 0; n < this.addedBackdrops.size(); n++) {
                var bi = this.addedBackdrops.get(n);
                if (xx >= bi.x && xx < bi.x + bi.width) {
                    if (yy >= bi.y && yy < bi.y + bi.height) {
                        var flag = true;
                        if (fine) {
                            flag = bi.testPoint(xx, yy);
                        }
                        if (flag) {
                            bi.delInstance(this);
                            this.addedBackdrops.removeObject(bi);
                            if (bi.body != null) {
                                this.app.run.rh4Box2DBase.rSubABackdrop(bi.body);
                            }
                            return;
                        }
                    }
                }
            }
        }
    },

    addLadder: function (x1, y1, x2, y2) {
        var rc = new CRect();
        rc.left = x1;
        rc.top = y1;
        rc.right = x2;
        rc.bottom = y2;
        if (this.pLadders == null) {
            this.pLadders = new CArrayList();
        }
        this.pLadders.add(rc);
    },

    ladderSub: function (x1, y1, x2, y2) {
        if (pLadders != null) {
            var rc = new CRect();
            rc.left = Math.min(x1, x2);
            rc.top = Math.min(y1, y2);
            rc.right = Math.max(x1, x2);
            rc.bottom = Math.max(y1, y2);

            var i;
            var rcDst;
            for (i = 0; i < pLadders.size(); i++) {
                rcDst = this.pLadders.get(i);
                if (rcDst.intersectRect(rc) == true) {
                    this.pLadders.removeIndex(i);
                    i--;
                }
            }
        }
    },

    getLadderAt: function (xx, yy) {
        var nl, nLayers;
        xx += this.x;
        yy += this.y;

        if (this.pLadders != null) {
            var i;
            var rc;
            for (i = 0; i < this.pLadders.size(); i++) {
                rc = this.pLadders.get(i);
                if (xx >= rc.left) {
                    if (yy >= rc.top) {
                        if (xx < rc.right) {
                            if (yy < rc.bottom) {
                                return rc;
                            }
                        }
                    }
                }
            }
        }
        return null;
    },

    testMask: function (mask, xx, yy, htFoot, plan) {
        var xLeft = xx + this.x - mask.xSpot;
        var yTop = yy + this.y - mask.ySpot;
        var xRight = xLeft + mask.width;
        var yBottom = yTop + mask.height;
        var yFoot = yTop;
        if (htFoot != 0) {
            yFoot = yBottom - htFoot;
        }

        var o;
        var bi;
        var list;
        if (plan == CColMask.CM_TEST_OBSTACLE) {
            list = this.pObstacles;
        } else {
            list = this.pPlatforms;
        }
        if (list == null) {
            return null;
        }

        for (o = 0; o < list.size(); o++) {
            bi = list.get(o);
            if (bi.x < xRight && bi.x + bi.width > xLeft) {
                if (bi.y < yBottom && bi.y + bi.height > yFoot) {
                    if (bi.testMask(mask, xLeft, yTop, htFoot)) {
                        return bi;
                    }
                }
            }
        }
        return null;
    },

    testRect: function (x1, y1, x2, y2, htFoot, plan) {
        var list;
        if (plan == CColMask.CM_TEST_OBSTACLE) {
            list = this.pObstacles;
        } else {
            list = this.pPlatforms;
        }
        if (list == null) {
            return null;
        }

        x1 += this.x;
        y1 += this.y;
        x2 += this.x;
        y2 += this.y;
        if (htFoot != 0) {
            y1 = y2 - htFoot;
        }

        var o;
        for (o = 0; o < list.size(); o++) {
            var bi = list.get(o);
            if (bi.x < x2 && bi.x + bi.width > x1) {
                if (bi.y < y2 && bi.y + bi.height > y1) {
                    if (bi.testRect(x1, y1, x2, y2)) {
                        return bi;
                    }
                }
            }
        }
        return null;
    },

    testPoint: function (x1, y1, plan) {
        var list;
        if (plan == CColMask.CM_TEST_OBSTACLE) {
            list = this.pObstacles;
        } else {
            list = this.pPlatforms;
        }
        if (list == null) {
            return null;
        }

        x1 += this.x;
        y1 += this.y;

        var o;
        for (o = 0; o < list.size(); o++) {
            var bi = list.get(o);
            if (x1 >= bi.x && x1 < bi.x + bi.width) {
                if (y1 >= bi.y && y1 < bi.y + bi.height) {
                    if (bi.testPoint(x1, y1)) {
                        return bi;
                    }
                }
            }
        }
        return null;
    }
};
