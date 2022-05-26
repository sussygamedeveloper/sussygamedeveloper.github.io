// CBackInstance Object
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

function CBackInstance(a, xx, yy, plo, sprImage, colType) {
    //call chain
    CSceneNode.call(this);

    //call self


    this.app = a;
    this.levelObject = plo;
    this.type = 0;
    this.obstacleType = 0;
    this.x = xx;
    this.y = yy;
    this.width = 0;
    this.height = 0;
    this.poi = null;
    this.colBox = false;
    this.imageUsed = null;
    this.borderWidth = 0;
    this.color1 = null;
    this.color2 = null;
    this.borderColor = null;
    this.effect = 0;
    this.effectParam = 0;
    this.body = null;
    this.ho = null;

    if (plo) {
        //not-pasted
        this.poi = this.app.OIList.getOIFromHandle(plo.loOiHandle);
        this.type = this.poi.oiType;
        this.obstacleType = this.poi.oiOC.ocObstacleType;
        this.borderWidth = this.poi.oiOC.ocBorderSize;
        this.gradientFlags = this.poi.oiOC.ocGradientFlags;
        this.width = this.poi.oiOC.ocCx;
        this.height = this.poi.oiOC.ocCy;
        this.colBox = this.poi.oiOC.ocColMode != 0;
        this.color1 = this.poi.oiOC.ocColor1;
        this.color2 = this.poi.oiOC.ocColor2;
        this.borderColor = this.poi.oiOC.ocBorderColor;

        if (this.type == 1) {
            this.imageUsed = this.app.imageBank.getImageFromHandle(this.poi.oiOC.ocImage);
            this.width = this.imageUsed.width;
            this.height = this.imageUsed.height;

        } else if (this.type >= 32) {
            var rhPtr = this.app.run;
            var hoPtr = null;
            var count = 0;
            for (var nObject = 0; nObject < rhPtr.rhNObjects; nObject++) {
                while (rhPtr.rhObjectList[count] == null) {
                    count++;
                }
                hoPtr = rhPtr.rhObjectList[count];
                count++;
                if (hoPtr.lo == plo) {
                    break;
                }
            }
            this.ho = hoPtr;
        }
    } else {
        //pasted
        this.type = COI.OBJ_PASTED;
        this.imageUsed = sprImage;
        this.width = this.imageUsed.width;
        this.height = this.imageUsed.height;
        this.x -= this.imageUsed.xSpot;
        this.y -= this.imageUsed.ySpot;
        switch (colType) {
            case 0:
                this.obstacleType = COC.OBSTACLE_NONE;
                break;
            case 1:
                this.obstacleType = COC.OBSTACLE_SOLID;
                break;
            case 2:
                this.obstacleType = COC.OBSTACLE_PLATFORM;
                break;
            case 3:
                this.obstacleType = COC.OBSTACLE_LADDER;
                break;
        }
        this.colBox = false;
    }
}

CBackInstance.prototype = {
    draw: function (context, xx, yy) {
        if (this.levelObject != null) {
            if (this.type == COI.OBJ_BOX) {
                var pCOCQB = this.poi.oiOC;
                var image;

                switch (pCOCQB.ocFillType) {
                    case 0: /* no fill */
                        break;

                    case 1: /* solid */

                        switch (pCOCQB.ocShape) {
                            case 1: /* line */
                                context.renderLine(xx + this.x, yy + this.y, xx + this.x + this.width, yy + this.y + this.height, this.color1, this.poi.oiInkEffect, this.poi.oiInkEffectParam);
                                break;

                            case 2: /* rectangle */
                                context.renderFilledRect(xx + this.x, yy + this.y, this.width, this.height, this.color1, this.poi.oiInkEffect, this.poi.oiInkEffectParam);
                                break;

                            case 3: /* ellipse */
                                context.renderFilledEllipse(xx + this.x, yy + this.y, this.width, this.height, this.color1, this.poi.oiInkEffect, this.poi.oiInkEffectParam);
                                break;
                        }

                        break;

                    case 2: /* gradient */

                        switch (pCOCQB.ocShape) {
                            case 1: /* line */
                                context.renderLine(xx + this.x, yy + this.y, xx + this.x + this.width, yy + this.y+this.height, this.color1, this.poi.oiInkEffect, this.poi.oiInkEffectParam);

                                break;

                            case 2: /* rectangle */
                                context.renderGradientRect(xx + this.x, yy + this.y, this.width, this.height, this.color1, this.color2, this.gradientFlags != 0, this.poi.oiInkEffect, this.poi.oiInkEffectParam);

                                break;

                            case 3: /* ellipse */
                                context.renderGradientEllipse(xx + this.x, yy + this.y, this.width, this.height, this.color1, this.color2, this.gradientFlags != 0, this.poi.oiInkEffect, this.poi.oiInkEffectParam);

                                break;
                        }

                        break;

                    case 3: /* motif */
                        switch (pCOCQB.ocShape) {
                            case 1: /* line */
                                break;

                            case 2: /* rectangle */
                                image = this.app.imageBank.getImageFromHandle(pCOCQB.ocImage);
                                context.renderPatternRect(image, xx + this.x, yy + this.y, this.width, this.height, this.poi.oiInkEffect, this.poi.oiInkEffectParam);
                                break;

                            case 3: /* ellipse */
                                image = this.app.imageBank.getImageFromHandle(pCOCQB.ocImage);
                                context.renderPatternEllipse(image, xx + this.x, yy + this.y, this.width, this.height, this.poi.oiInkEffect, this.poi.oiInkEffectParam);
                                break;
                        }
                        break;
                }

                //render border/line
                if (this.borderWidth > 0) {
                    switch (pCOCQB.ocShape) {
                        case 1: /* line */
                            var x1, y1, x2, y2;

                            if ((pCOCQB.ocLineFlags & COCQBackdrop.LINEF_INVX) != 0) {
                                x1 = this.width;
                                x2 = 0;
                            } else {
                                x1 = 0;
                                x2 = this.width;
                            }

                            if ((pCOCQB.ocLineFlags & COCQBackdrop.LINEF_INVY) != 0) {
                                y1 = this.height;
                                y2 = 0;
                            } else {
                                y1 = 0;
                                y2 = this.height;
                            }

                            context.renderLine(xx + this.x + x1, yy + this.y + y1, xx + this.x + x2, yy + this.y + y2, this.borderColor, this.borderWidth);

                            break;

                        case 2: /* rectangle */
                            context.renderOutlineRect(xx + this.x, yy + this.y, this.width, this.height, this.borderColor, this.borderWidth);

                            break;

                        case 3: /* ellipse */
                            context.renderOutlineEllipse(xx + this.x, yy + this.y, this.width, this.height, 1, this.borderColor, this.borderWidth);

                            break;
                    }
                }

            } else if (this.type == COI.OBJ_BKD) {
                context.renderImageWithSubPixelCorrection(this.imageUsed, xx + this.x + this.imageUsed.xSpot, yy + this.y + this.imageUsed.ySpot, 0, 1.0, 1.0, this.poi.oiInkEffect, this.poi.oiInkEffectParam, this);

            } else {
                if (this.ho != null) {
                    this.ho.draw(context, xx, yy);
                }
            }
        } else {
            context.renderImage(this.imageUsed, xx + this.x + this.imageUsed.xSpot, yy + this.y + this.imageUsed.ySpot, 0, 1.0, 1.0, this.effect, this.effectParam, this);
        }
    },

    setEffect: function (e, ep) {
        this.effect = e;
        this.effectParam = ep;
    },

    addInstance: function (num, pLayer) {
        pLayer.planeBack.addChild(this);
        if (this.type == COI.OBJ_PASTED) {
            pLayer.addBackdrop(this);
        }

        switch (this.obstacleType) {
            case COC.OBSTACLE_SOLID:
                pLayer.addObstacle(this);
                pLayer.addPlatform(this);
                break;
            case COC.OBSTACLE_PLATFORM:
                pLayer.addPlatform(this);
                break;
            case COC.OBSTACLE_LADDER:
                pLayer.addLadder(this.x, this.y, this.x + this.width, this.y + this.height);
                break;
        }
    },

    delInstance: function (pLayer) {
        pLayer.planeBack.removeChild(this);
        switch (this.obstacleType) {
            case COC.OBSTACLE_SOLID:
                pLayer.delObstacle(this);
                pLayer.delPlatform(this);
                break;
            case COC.OBSTACLE_PLATFORM:
                pLayer.delPlatform(this);
                break;
            case COC.OBSTACLE_LADDER:
                pLayer.ladderSub(x, y, x + width, y + height);
                break;
        }
    },

    testMask: function (mask, xx, yy, htFoot) {
        var flags;
        var mask2;

        switch (this.type) {
            case 0:
                var h = this.height;
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    h = CRunFrame.HEIGHT_PLATFORM;
                }
                return mask.testRect2(xx, yy, htFoot, this.x, this.y, this.width, h, 0);
            case 1:
                if (this.colBox != 0) {
                    return true;
                }
                flags = CMask.GCMF_OBSTACLE;
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    flags = CMask.GCMF_PLATFORM;
                }
                mask2 = this.imageUsed.getMask(flags, 0, 1.0, 1.0);
                return mask.testMask(xx, yy, htFoot, mask2, this.x, this.y, 0);
            case 11:
                if (this.colBox != 0) {
                    return true;
                }
                flags = CMask.GCMF_OBSTACLE;
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    flags = CMask.GCMF_PLATFORM;
                }
                mask2 = this.imageUsed.getMask(flags, 0, 1.0, 1.0);
                return mask.testMask(xx, yy, htFoot, mask2, this.x, this.y, 0);
        }
        return false;
    },

    testRect: function (x1, y1, x2, y2) {
        var flags;
        var mask;

        switch (this.type) {
            case 0:
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    var yTop = this.y;
                    var yBottom = this.y + Math.min(this.height, CRunFrame.HEIGHT_PLATFORM);
                    if (yTop < y2 && yBottom > y1) {
                        return true;
                    }
                    return false;
                }
                return true;
            case 1:
                if (this.colBox != 0) {
                    return true;
                }
                flags = CMask.GCMF_OBSTACLE;
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    flags = CMask.GCMF_PLATFORM;
                }
                mask = this.imageUsed.getMask(flags, 0, 1.0, 1.0);
                return mask.testRect2(this.x, this.y, 0, x1, y1, x2, y2, 0);
            case 11:
                if (this.colBox != 0) {
                    return true;
                }
                flags = CMask.GCMF_OBSTACLE;
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    flags = CMask.GCMF_PLATFORM;
                }
                mask = this.imageUsed.getMask(flags, 0, 1.0, 1.0);
                return mask.testRect2(this.x, this.y, 0, x1, y1, x2, y2, 0);
        }
        return false;
    },

    testPoint: function (x1, y1) {
        var flags;
        var mask;

        switch (this.type) {
            case 0:
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    var yTop = y + this.height - CRunFrame.HEIGHT_PLATFORM;
                    var yBottom = this.y + this.height;
                    if (y1 >= yTop && y1 < yBottom) {
                        return true;
                    }
                    return false;
                }
                return true;
            case 1:
                if (this.colBox != 0) {
                    return true;
                }
                flags = CMask.GCMF_OBSTACLE;
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    flags = CMask.GCMF_PLATFORM;
                }
                mask = this.imageUsed.getMask(flags, 0, 1.0, 1.0);
                return mask.testPoint(this.x, this.y, x1, y1);
            case 11:
                if (this.colBox != 0) {
                    return true;
                }
                flags = CMask.GCMF_OBSTACLE;
                if (this.obstacleType == COC.OBSTACLE_PLATFORM) {
                    flags = CMask.GCMF_PLATFORM;
                }
                mask = this.imageUsed.getMask(flags, 0, 1.0, 1.0);
                return mask.testPoint(this.x, this.y, x1, y1);
        }
        return false;
    }
};

//setup inheritance using extend
CServices.extend(CSceneNode, CBackInstance);