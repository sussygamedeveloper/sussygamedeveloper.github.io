// CRunPerspective object
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

CRunPerspective.CND_LAST = 0;

CRunPerspective.ACT_ACTSETZOOMVALUE = 0;
CRunPerspective.ACT_ACTSETPANORAMA = 1;
CRunPerspective.ACT_ACTSETPERSPECTIVE = 2;
CRunPerspective.ACT_ACTSETSINEWAVE = 3;
CRunPerspective.ACT_ACTSETCUSTOM = 4;
CRunPerspective.ACT_ACTSETNUMWAVES = 5;
CRunPerspective.ACT_ACTSETOFFSET = 6;
CRunPerspective.ACT_ACTSETHORIZONTAL = 7;
CRunPerspective.ACT_ACTSETVERTICAL = 8;
CRunPerspective.ACT_ACTSETLEFTTOP = 9;
CRunPerspective.ACT_ACTSETRIGHTBOTTOM = 10;
CRunPerspective.ACT_ACTSETCUSTOMVALUE = 11;
CRunPerspective.ACT_ACTSETWIDTH = 12;
CRunPerspective.ACT_ACTSETHEIGHT = 13;
CRunPerspective.ACT_ACTSETRESAMPLEON = 14;
CRunPerspective.ACT_ACTSETRESAMPLEOFF = 15;
CRunPerspective.ACT_ACTSETSINEOFFSET = 16;
CRunPerspective.ACT_ACTSETCUSTOMOFFSET = 17;

CRunPerspective.EXP_GETZOOMVALUE = 0;
CRunPerspective.EXP_GETOFFSET = 1;
CRunPerspective.EXP_NUMWAVES = 2;
CRunPerspective.EXP_GETCUSTOM = 3;
CRunPerspective.EXP_GETWIDTH = 4;
CRunPerspective.EXP_GETHEIGHT = 5;

CRunPerspective.HORIZONTAL = 0;
CRunPerspective.VERTICAL = 1;

CRunPerspective.PANORAMA = 0;
CRunPerspective.PERSPECTIVE = 1;
CRunPerspective.SINEWAVE = 2;
CRunPerspective.SINEOFFSET = 3;
CRunPerspective.CUSTOM = 4;
CRunPerspective.CUSTOMOFFSET = 5;

CRunPerspective.RIGHTTOP = 0;
CRunPerspective.LEFTBOTTOM = 1;

CRunPerspective.zoomRange = [0, 32767];
CRunPerspective.offsetRange = [-16383, 16383];
CRunPerspective.waveRange = [0, 32767];
CRunPerspective.delta = 3.141592 / 180.0;

this.Perspective = CRunPerspective;

//constructor
function CRunPerspective() {
    //call chain
    CRunExtension.call(this);

    //call self
    this.buffer = null;
    this.effect = null;
    this.direction = null;
    this.zoom = null;
    this.offset = null;
    this.sineWaveWaves = null;
    this.perspectiveDir = null;
    this.customArray = null;
    this.resample = null;
}

//methods
CRunPerspective.prototype = {
    //runtime
    getNumberOfConditions: function () {
        return CRunPerspective.CND_LAST;
    },

    createRunObject: function (file, cob, version) {
        //get some pointers
        var rhPtr = this.ho.hoAdRunHeader;
        var app = rhPtr.rhApp;

        //skip sx/sy
        file.skipBytes(4);

        //set dimensions
        var width = file.readAShort();
        var height = file.readAShort();
        this.ho.setX(cob.cobX);
        this.ho.setY(cob.cobY);
        this.ho.setWidth(width);
        this.ho.setHeight(height);

        //create image buffer and set it to non render target (eg we dont want to give it a framebuffer)
        this.buffer = app.createImageBuffer(width, height, false);

        //read properties
        this.effect = file.readAByte();//stored as char but id imagine that is not unicode!
        this.direction = file.readAByte() ? CRunPerspective.VERTICAL : CRunPerspective.HORIZONTAL;
        file.skipBytes(2);//data alignment
        this.zoom = file.readAInt();
        this.offset = file.readAInt();
        this.sineWaveWaves = file.readAInt();
        this.perspectiveDir = file.readAByte() ? CRunPerspective.LEFTBOTTOM : CRunPerspective.RIGHTTOP;
        this.resample = file.readAByte();

        //flag changed
        this.ho.roc.rcChanged = true;

        //create custom array
        var size = (this.direction == CRunPerspective.HORIZONTAL) ? this.ho.hoImgWidth : this.ho.hoImgHeight;
        this.customArray = [];
        for (var i = 0; i < size; i++) {
            this.customArray[i] = this.zoom;
        }

        return true;
    },

    handleRunObject: function () {
        var ret = 0;

        if (this.ho.roc.rcChanged) {
            ret = CRunExtension.REFLAG_DISPLAY;
        }

        return ret;
    },

    displayRunObject: function (context, xDraw, yDraw) {
        //get some pointers
        var rhPtr = this.ho.hoAdRunHeader;
        var app = rhPtr.rhApp;

        //get dimensions of the extension
        var x = xDraw + this.ho.hoX;
        var y = yDraw + this.ho.hoY;
        var width = this.ho.hoImgWidth;
        var height = this.ho.hoImgHeight;

        //do we need 

        //copy the current framebuffer
        this.buffer.start();
        this.buffer.captureGameCanvas(x, y, width, height);
        this.buffer.finish();

        //draw to the context
        context.start();
        context.pushClip();
        context.clip(x, y, width, height, true);

        //legacy mode
        switch (this.effect) {
            case CRunPerspective.PANORAMA:
                var calcSin = 0.0;
                var calcSize = 0;

                if (this.direction == CRunPerspective.HORIZONTAL) {
                    //horizontal
                    for (var i = 0; i <= width; i++) {
                        calcSin = (i - width / 2) / (width / 3.1415) + (3.1415 / 2);
                        calcSize = Math.max(1.0, height + (Math.sin(calcSin)) * this.zoom - this.zoom);

                        context.renderSubImage(this.buffer, i, (height / 2) - (calcSize / 2), 1, calcSize, x + i, y, 1, height);
                    }
                } else {
                    //vertical
                    for (var i = 0; i <= height; i++) {
                        calcSin = (i - height / 2) / (height / 3.1415) + (3.1415 / 2);
                        calcSize = Math.max(1.0, height + (Math.sin(calcSin)) * this.zoom - this.zoom);

                        context.renderSubImage(this.buffer, (width / 2) - (calcSize / 2), i, calcSize, 1, x, y + i, width, 1);
                    }
                }
                break;

            case CRunPerspective.PERSPECTIVE:
                var calcZoom;
                var calcFactor;
                var calcSize;

                if (this.direction == CRunPerspective.HORIZONTAL) {
                    //horizontal
                    if (this.perspectiveDir == CRunPerspective.RIGHTTOP) {
                        //larger height on right
                        for (var i = 0; i <= width; i++) {
                            calcZoom = (i * this.zoom) / width;
                            calcFactor = (height + calcZoom) / height;
                            calcSize = (height / calcFactor + 0.5);
                            context.renderSubImage(this.buffer, i, height / 2 - calcSize / 2, 1, calcSize, x + i, y, 1, height);
                        }
                    } else {
                        //larger height on left
                        for (var i = 0; i <= width; i++) {
                            calcZoom = ((width - i - 1) * this.zoom) / width;
                            calcFactor = (height + calcZoom) / height;
                            calcSize = (height / calcFactor + 0.5);
                            context.renderSubImage(this.buffer, i, height / 2 - calcSize / 2, 1, calcSize, x + i, y, 1, height);
                        }
                    }
                } else {
                    //vertical
                    if (this.perspectiveDir == CRunPerspective.RIGHTTOP) {
                        //larger width on bottom
                        for (var i = 0; i <= height; i++) {
                            calcZoom = (i * this.zoom) / height;
                            calcFactor = (width + calcZoom) / width;
                            calcSize = (width / calcFactor + 0.5);
                            context.renderSubImage(this.buffer, width / 2 - calcSize / 2, i, calcSize, 1, x, y + i, width, 1)
                        }
                    } else {
                        //larger width on top
                        for (var i = 0; i <= height; i++) {
                            calcZoom = ((height - i - 1) * this.zoom) / height;
                            calcFactor = (width + calcZoom) / width;
                            calcSize = (width / calcFactor + 0.5);
                            context.renderSubImage(this.buffer, width / 2 - calcSize / 2, i, calcSize, 1, x, y + i, width, 1)
                        }
                    }
                }
                break;

            case CRunPerspective.SINEWAVE:
                var calcSize;
                var waveIncrement;

                if (this.direction == CRunPerspective.HORIZONTAL) {
                    //horizontal
                    waveIncrement = (this.sineWaveWaves * 360) / height;

                    for (var i = 0; i <= width; i++) {
                        calcSize = Math.max(1, (height + Math.sin((i * waveIncrement + this.offset) * CRunPerspective.delta) * this.zoom - this.zoom));
                        context.renderSubImage(this.buffer, i, height / 2 - calcSize / 2, 1, calcSize, x + i, y, 1, height);
                    }
                } else {
                    //vertical
                    waveIncrement = (this.sineWaveWaves * 360) / width;

                    for (var i = 0; i <= height; i++) {
                        calcSize = Math.max(1, (width + Math.sin((i * waveIncrement + this.offset) * CRunPerspective.delta) * this.zoom - this.zoom));
                        context.renderSubImage(this.buffer, width / 2 - calcSize / 2, i, calcSize, 1, x, y + i, width, 1);
                    }
                }
                break;

            case CRunPerspective.SINEOFFSET:
                var calcOffset;
                var waveIncrement;

                //black out the background
                context.renderFilledRect(x, y, width, height, CServices.RGBFlash(0, 0, 0));

                //render wave
                if (this.direction == CRunPerspective.HORIZONTAL) {
                    //horizontal
                    waveIncrement = (this.sineWaveWaves * 360) / height;

                    for (var i = 0; i <= width; i++) {
                        calcOffset = Math.sin((i * waveIncrement + this.offset) * CRunPerspective.delta) * this.zoom;
                        context.renderSubImage(this.buffer, i, 0, 1, height, x + i, y + calcOffset, 1, height);
                    }
                } else {
                    //vertical
                    waveIncrement = (this.sineWaveWaves * 360) / width;

                    for (var i = 0; i <= height; i++) {
                        calcOffset = Math.sin((i * waveIncrement + this.offset) * CRunPerspective.delta) * this.zoom;
                        context.renderSubImage(this.buffer, 0, i, width, 1, x + calcOffset, y + i, width, 1);
                    }
                }
                break;

            case CRunPerspective.CUSTOM:
                var calcSize;

                if (this.direction == CRunPerspective.HORIZONTAL) {
                    //horizontal
                    for (var i = 0; i <= width; i++) {
                        calcSize = height / ((this.customArray[i] * (this.zoom / 100.0) + 100) / 100.0);
                        context.renderSubImage(this.buffer, i, height / 2 - calcSize / 2 + this.offset, 1, calcSize, x + i, y, 1, height);
                    }
                } else {
                    //vertical
                    for (var i = 0; i <= height; i++) {
                        calcSize = width / ((this.customArray[i] * (this.zoom / 100.0) + 100) / 100.0);
                        context.renderSubImage(this.buffer, width / 2 - calcSize / 2 + this.offset, i, calcSize, 1, x, y + i, width, 1);
                    }
                }
                break;

            case CRunPerspective.CUSTOMOFFSET:
                var calcOffset;

                //black out the background
                context.renderFilledRect(x, y, width, height, CServices.RGBFlash(0, 0, 0));

                if (this.direction == CRunPerspective.HORIZONTAL) {
                    //horizontal
                    for (var i = 0; i <= width; i++) {
                        calcOffset = (this.customArray[i] * (this.zoom / 100.0)) + this.offset;
                        context.renderSubImage(this.buffer, i, 0, 1, height, x + i, y + calcOffset, 1, height);
                    }
                } else {
                    //vertical
                    for (var i = 0; i <= height; i++) {
                        calcOffset = (this.customArray[i] * (this.zoom / 100.0)) + this.offset;
                        context.renderSubImage(this.buffer, 0, i, width, 1, x + calcOffset, y + i, width, 1);
                    }
                }
                break;
        }

        context.popClip();
        context.finish();
    },

    //actions
    action: function (num, act) {
        //action router
        switch (num) {
            case CRunPerspective.ACT_ACTSETZOOMVALUE:
                return this.actionSetZoomValue(act);

            case CRunPerspective.ACT_ACTSETPANORAMA:
                return this.actionSetPanorama(act);

            case CRunPerspective.ACT_ACTSETPERSPECTIVE:
                return this.actionSetPerspective(act);

            case CRunPerspective.ACT_ACTSETSINEWAVE:
                return this.actionSetSineWave(act);

            case CRunPerspective.ACT_ACTSETCUSTOM:
                return this.actionSetCustom(act);

            case CRunPerspective.ACT_ACTSETNUMWAVES:
                return this.actionSetNumWaves(act);

            case CRunPerspective.ACT_ACTSETOFFSET:
                return this.actionSetOffset(act);

            case CRunPerspective.ACT_ACTSETHORIZONTAL:
                return this.actionSetHorizontal(act);

            case CRunPerspective.ACT_ACTSETVERTICAL:
                return this.actionSetVertical(act);

            case CRunPerspective.ACT_ACTSETLEFTTOP:
                return this.actionSetLeftTop(act);

            case CRunPerspective.ACT_ACTSETRIGHTBOTTOM:
                return this.actionSetRightBottom(act);

            case CRunPerspective.ACT_ACTSETCUSTOMVALUE:
                return this.actionSetCustomValue(act);

            case CRunPerspective.ACT_ACTSETWIDTH:
                return this.actionSetWidth(act);

            case CRunPerspective.ACT_ACTSETHEIGHT:
                return this.actionSetHeight(act);

            case CRunPerspective.ACT_ACTSETRESAMPLEON:
                return this.actionSetResampleOn(act);

            case CRunPerspective.ACT_ACTSETRESAMPLEOFF:
                return this.actionSetResampleOff(act);

            case CRunPerspective.ACT_ACTSETSINEOFFSET:
                return this.actionSetSineOffect(act);

            case CRunPerspective.ACT_ACTSETCUSTOMOFFSET:
                return this.actionSetCustomOffset(act);
        }
    },

    actionSetZoomValue: function (act) {
        this.zoom = act.getParamExpression(this.rh, 0);
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetPanorama: function (act) {
        this.effect = PANORAMA;
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetPerspective: function (act) {
        this.effect = PERSPECTIVE;
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetSineWave: function (act) {
        this.effect = SINEWAVE;
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetCustom: function (act) {
        this.effect = CUSTOM;
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetSineOffset: function (act) {
        this.effect = SINEOFFSET;
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetCustomOffset: function (act) {
        this.effect = CUSTOMOFFSET;
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetNumWaves: function (act) {
        this.sineWaves = act.getParamExpression(this.rh, 0);
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetOffset: function (act) {
        this.offset = act.getParamExpression(this.rh, 0);
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetHorizontal: function (act) {
        var oldSize = (this.direction == CRunPerspective.HORIZONTAL) ? this.ho.hoImgWidth : this.ho.hoImgHeight;
        var newSize = this.ho.hoImgWidth;

        this.direction = CRunPerspective.HORIZONTAL;
        this.ho.roc.rcChanged = true;

        var minSize = Math.min(oldSize, newSize);
        var newCustom = [];

        for (var i = 0; i < minSize; i++) {
            newCustom[i] = this.customArray[i];
        }

        this.customArray = newCustom;

        return 0;
    },

    actionSetVertical: function (act) {
        var oldSize = (this.direction == CRunPerspective.HORIZONTAL) ? this.ho.hoImgWidth : this.ho.hoImgHeight;
        var newSize = this.ho.hoImgWidth;

        this.direction = CRunPerspective.VERTICAL;
        this.ho.roc.rcChanged = true;

        var minSize = Math.min(oldSize, newSize);
        var newCustom = [];

        for (var i = 0; i < minSize; i++) {
            newCustom[i] = this.customArray[i];
        }

        this.customArray = newCustom;

        return 0;
    },

    actionSetLeftTop: function (act) {
        this.perspectiveDir = 0;
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetRightBottom: function (act) {
        this.perspectiveDir = 1;
        this.ho.roc.rcChanged = true;
        return 0;
    },

    actionSetCustomValue: function (act) {
        var size = (this.direction == CRunPerspective.HORIZONTAL) ? this.ho.hoImgWidth : this.ho.hoImgHeight;

        var param1 = act.getParamExpression(this.rh, 0);
        var param2 = act.getParamExpression(this.rh, 1);

        if (param1 >= 0 && param1 < size) {
            this.customArray[param1] = param2;
        }

        this.ho.roc.rcChanged = true;

        return 0;
    },

    actionSetWidth: function (act) {
        var oldSize = (this.direction == CRunPerspective.HORIZONTAL) ? this.ho.hoImgWidth : this.ho.hoImgHeight;
        this.ho.setWidth(act.getParamExpression(this.rh, 0));
        this.resizePerspective(oldSize);
        return 0;
    },

    actionSetHeight: function (act) {
        var oldSize = (this.direction == CRunPerspective.HORIZONTAL) ? this.ho.hoImgWidth : this.ho.hoImgHeight;
        this.ho.setHeight(act.getParamExpression(this.rh, 0));
        this.resizePerspective(oldSize);
        return 0;
    },

    //conditions
    condition: function (num, cnd) {
        //condition router
        return false;
    },

    //expressions
    expression: function (num) {
        switch (num) {
            case CRunPerspective.EXP_GETZOOMVALUE:
                return this.expressionGetZoomValue();

            case CRunPerspective.EXP_GETOFFSET:
                return this.expressionGetOffset();

            case CRunPerspective.EXP_NUMWAVES:
                return this.expressionNumWaves();

            case CRunPerspective.EXP_GETCUSTOM:
                return this.expressionGetCustom();

            case CRunPerspective.EXP_GETWIDTH:
                return this.expressionGetWidth();

            case CRunPerspective.EXP_GETHEIGHT:
                return this.expressionGetHeight();
        }
        return 0;
    },

    expressionGetZoomValue: function () {
        return this.zoom;
    },

    expressionGetOffset: function () {
        return this.offset;
    },

    expressionNumWaves: function () {
        return this.sineWaveWaves;
    },

    expressionGetCustom: function () {
        var p1 = this.ho.getExpParam();
        var size = (this.direction == HORIZONTAL) ? this.ho.hoImgWidth : this.ho.hoImgHeight;

        return this.customArray[Math.min(Math.max(0, p1), size - 1)];
    },

    expressionGetWidth: function () {
        return this.ho.hoImgWidth;
    },

    expressionGetHeight: function () {
        return this.ho.hoImgHeight;
    },

    //internal
    resizePerspective(oldSize) {
        var size = (this.irection == CRunPerspective.HORIZONTAL) ? this.ho.hoImgWidth : this.ho.hoImgHeight;

        //has teh size changed?
        if (size != oldSize) {
            //resize the buffer
            this.buffer.resize(this.ho.hoImgWidth, this.ho.hoImgHeight);

            //recreate custom array
            var newArray = new Array(size);
            var numNewInts = Math.min(size, oldSize);

            for (var i = 0; i < size; i++) {
                if (i < numNewInts) {
                    newArray[i] = this.customArray[i];
                } else {
                    newArray[i] = 0;
                }
            }

            //save array
            this.customArray = newArray;

            //flag changed
            this.ho.roc.rcChanged = true;
        }
    },
};

//setup inheritance using extend
CServices.extend(CRunExtension, CRunPerspective);