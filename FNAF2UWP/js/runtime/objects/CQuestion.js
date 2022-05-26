// CQuestion
// ----------------------------------------------------------------
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

function CQuestion() {
    //call chain
    CObject.call(this);

    //call self


    this.rsBoxCx = 0;
    this.rsBoxCy = 0;
    this.rcA = null;
    this.currentDown = 0;
    this.xMouse = 0;
    this.yMouse = 0;
    this.textContainers = new Array();
}

CQuestion.prototype = {
    init: function (ocPtr, cob) {
        this.computeTexts();
    },

    kill: function () {
    },

    handle: function () {
        this.hoAdRunHeader.pause();
        this.hoAdRunHeader.questionObjectOn = this;
        var layer = this.hoAdRunHeader.rhFrame.layers[this.hoAdRunHeader.rhFrame.nLayers - 1];
        layer.planeSprites.addChild(this);
    },

    destroyObject: function () {
        var layer = this.hoAdRunHeader.rhFrame.layers[this.hoAdRunHeader.rhFrame.nLayers - 1];
        layer.planeSprites.removeChild(this);

        if (this.textContainers) {
            for (var index = 0; index < this.textContainers.length; index++) {
                this.textBufffers[index].free();
                this.textBufffers[index] = null;
            }
        }
    },

    handleQuestion: function () {
        //this is such a hack!

        //this gets called during paused app state
        var current;
        var xMouse = this.hoAdRunHeader.rhApp.mouseX - this.hoAdRunHeader.rhApp.xOffset;
        var yMouse = this.hoAdRunHeader.rhApp.mouseY - this.hoAdRunHeader.rhApp.yOffset;

        if (this.currentDown == 0) {
            if (this.hoAdRunHeader.rhApp.keyBuffer[CRunApp.VK_LBUTTON]) {
                current = this.getQuestion(xMouse, yMouse);
                if (current != 0) {
                    this.currentDown = current;
                }
            }

        } else {
            if (!this.hoAdRunHeader.rhApp.keyBuffer[CRunApp.VK_LBUTTON]) {
                if (this.getQuestion(xMouse, yMouse) == this.currentDown) {
                    this.hoAdRunHeader.rhEvtProg.rhCurParam0 = this.currentDown;
                    this.hoAdRunHeader.rhEvtProg.handle_Event(this, (((-80 - 3) << 16) | 4));

                    var defTexts = this.hoCommon.ocObject;
                    var ptts = defTexts.otTexts[this.currentDown];
                    var bCorrect = (ptts.tsFlags & CDefText.TSF_CORRECT) != 0;
                    if (bCorrect) {
                        this.hoAdRunHeader.rhEvtProg.handle_Event(this, (((-80 - 1) << 16) | 4));
                    } else {
                        this.hoAdRunHeader.rhEvtProg.handle_Event(this, (((-80 - 2) << 16) | 4));
                    }
                    this.destroyObject();
                    this.hoAdRunHeader.questionObjectOn = null;
                    this.hoAdRunHeader.resume();
                    this.hoAdRunHeader.f_KillObject(this.hoNumber, true);
                    return;
                }
                this.currentDown = 0;
            }
        }
    },

    computeTexts: function () {
        //why no comments :( -skn3 2016
        var prh = this.hoAdRunHeader;
        var app = prh.rhApp;
        var defTexts = this.hoCommon.ocObject;

        //create question buffer so we can use it for other purposes
        if (this.textContainers[0] == null) {
            this.textContainers[0] = app.createTextContainer();

            if (addRelief) {
                this.textContainers[0].setShadow(1, 1, 0xFFFFFF);
            }
        }

        //calculate some bits
        var ptta = defTexts.otTexts[1];
        var colorA = ptta.tsColor;
        var addRelief = (ptta.tsFlags & CDefText.TSF_RELIEF) != 0;
        var fontAnswers = app.fontBank.getFontFromHandle(ptta.tsFont);

        this.xa_margin = Math.floor((this.textContainers[0].getTextWidth("X", fontAnswers) * 3) / 2);
        this.hta = 4;
        this.lgBox = 64;
        var i, tm;
        for (i = 1; i < defTexts.otTexts.length; i++) {
            ptta = defTexts.otTexts[i];
            if (ptta.tsText.length > 0) {
                tm = this.textContainers[0].getTextWidth(ptta.tsText, fontAnswers);
                this.lgBox = Math.max(this.lgBox, tm + this.xa_margin * 2 + 4);
                this.hta = Math.max(this.hta, Math.floor((fontAnswers.getHeight() * 3) / 2));
            }
        }
        this.hte = Math.max(Math.floor(this.hta / 4), 2);
        this.lgBox += this.xa_margin * 2 + 4;

        for (i = 1; i < defTexts.otTexts.length; i++) {
            ptta = defTexts.otTexts[i];

            //create text buffer (with shadow relief)
            if (this.textContainers[i] == null) {
                this.textContainers[i] = app.createTextContainer();

                if (addRelief) {
                    this.textContainers[i].setShadow(1, 1, 0xFFFFFF);
                }
            }

            //update text buffer
            this.textContainers[i].set(ptta.tsText, fontAnswers, colorA, CRendererTextContainer.CENTER | CRendererTextContainer.MIDDLE | CRendererTextContainer.WORDWRAP, this.lgBox, this.hta)
        }

        //compute question
        var ptts = defTexts.otTexts[0];
        var addRelief = (ptts.tsFlags & CDefText.TSF_RELIEF) != 0;
        var fontQuestion = app.fontBank.getFontFromHandle(ptts.tsFont);
        var xq_margin = Math.floor((this.textContainers[0].getTextWidth("X", fontQuestion) * 3) / 2);
        tm = this.textContainers[0].getTextWidth(ptts.tsText, fontQuestion);
        this.htq = Math.floor(fontQuestion.getHeight() * 3 / 2);
        this.lgBox = Math.max(this.lgBox, tm + xq_margin * 2 + 4);

        if (this.lgBox > app.gaCxWin) {
            this.lgBox = app.gaCxWin;
        } else if (this.lgBox > prh.rhFrame.leWidth) {
            this.lgBox = prh.rhFrame.leWidth;
        }

        //update text buffer
        this.textContainers[0].set(ptts.tsText, fontAnswers, colorA, CRendererTextContainer.CENTER | CRendererTextContainer.MIDDLE | CRendererTextContainer.WORDWRAP, this.lgBox, this.hta)
    },

    getQuestion: function (xMouse, yMouse) {
        var i;
        if (this.rcA != null) {
            for (i = 1; i < this.rcA.length; i++) {
                if (xMouse >= this.rcA[i].left && xMouse < this.rcA[i].right) {
                    if (yMouse > this.rcA[i].top && yMouse < this.rcA[i].bottom) {
                        return i;
                    }
                }
            }
        }
        return 0;
    },

    drawBorder3D: function (context, rc, state) {
        var color1, color2;

        if (state) {
            color1 = 0x808080;
            color2 = 0xFFFFFF;
        }
        else {
            color2 = 0x808080;
            color1 = 0xFFFFFF;
        }

        context.renderOutlineRect(rc.left, rc.top, rc.right - rc.left,
            rc.bottom - rc.top, 0x000000, 1);

        var pt = new Array(3);
        var n;
        for (n = 0; n < 3; n++) {
            pt[n] = new CPoint();
        }
        pt[0].x = rc.right - 1;
        if (state == false) {
            pt[0].x -= 1;
        }
        pt[0].y = rc.top + 1;
        pt[1].y = rc.top + 1;
        pt[1].x = rc.left + 1;
        pt[2].x = rc.left + 1;
        pt[2].y = rc.bottom;
        if (state == false) {
            pt[2].y -= 1;
        }
        context.renderLine(pt[0].x, pt[0].y, pt[1].x, pt[1].y, color1, 1);
        context.renderLine(pt[1].x, pt[1].y, pt[2].x, pt[2].y, color1, 1);

        if (state == false) {
            pt[0].x -= 1;
        }
        pt[0].y += 1;
        pt[1].x += 1;
        pt[1].y += 1;
        pt[2].x += 1;
        if (state == false) {
            pt[2].y -= 1;
        }
        context.renderLine(pt[0].x, pt[0].y, pt[1].x, pt[1].y, color1, 1);
        context.renderLine(pt[1].x, pt[1].y, pt[2].x, pt[2].y, color1, 1);

        if (state == false) {
            pt[0].x += 2;
            pt[1].x = rc.right - 1;
            pt[1].y = rc.bottom - 1;
            pt[2].y = rc.bottom - 1;
            pt[2].x -= 1;
            context.renderLine(pt[0].x, pt[0].y, pt[1].x, pt[1].y, color2, 1);
            context.renderLine(pt[1].x, pt[1].y, pt[2].x, pt[2].y, color2, 1);

            pt[0].x -= 1;
            pt[0].y += 1;
            pt[1].x -= 1;
            pt[1].y -= 1;
            pt[2].x += 1;
            pt[2].y -= 1;
            context.renderLine(pt[0].x, pt[0].y, pt[1].x, pt[1].y, color2, 1);
            context.renderLine(pt[1].x, pt[1].y, pt[2].x, pt[2].y, color2, 1);
        }
    },

    drawAnswer: function (context, number, state) {
        var rc = new CRect();

        rc.copyRect(this.rcA[number]);
        this.drawBorder3D(context, this.rcA[number], state);
        rc.left += 2;
        rc.top += 2;
        rc.right -= 4;
        rc.bottom -= 4;
        if (state) {
            rc.left += 2;
            rc.top += 2;
        }

        this.textContainers[number].draw(context, (rc.left + rc.right) / 2 - this.textContainers[number].width / 2, (rc.top + rc.bottom) / 2 - this.textContainers[number].height / 2, 0, 0);
    },

    draw: function (context, xDraw, yDraw) {
        var defTexts = this.hoCommon.ocObject;
        var prh = this.hoAdRunHeader;
        var x = this.hoX - prh.rhWindowX;
        var y = this.hoY - prh.rhWindowY;

        var rcQ = new CRect();
        rcQ.left = x;
        rcQ.top = y;
        var boxCx = this.lgBox;
        var boxCy = this.htq + 1 + (this.hta + this.hte) * (defTexts.otTexts.length - 1) + this.hte + 4;
        rcQ.right = x + boxCx;
        rcQ.bottom = y + boxCy;

        context.renderFilledRect(rcQ.left, rcQ.top, rcQ.right - rcQ.left, rcQ.bottom - rcQ.top, 0xC0C0C0, 0, 0);
        this.drawBorder3D(context, rcQ, false);

        rcQ.left += 2;
        rcQ.top += 2;
        rcQ.right -= 2;
        rcQ.bottom = rcQ.top + this.htq;

        this.textContainers[0].draw(context, (rcQ.left + rcQ.right) / 2 - this.textContainers[0].width / 2, (rcQ.top + rcQ.bottom) / 2 - this.textContainers[0].height / 2, 0, 0);

        rcQ.top = rcQ.bottom;
        context.renderLine(rcQ.left, rcQ.top, rcQ.right, rcQ.bottom, 0x808080, 1, 0, 0);
        rcQ.top += 1;
        rcQ.bottom += 1;
        context.renderLine(rcQ.left, rcQ.top, rcQ.right, rcQ.bottom, 0xFFFFFF, 1, 0, 0);

        if (this.rcA == null) {
            this.rcA = Array(defTexts.otTexts.length);
            for (i = 1; i < defTexts.otTexts.length; i++) {
                this.rcA[i] = new CRect();
                this.rcA[i].left = x + 2 + this.xa_margin;
                this.rcA[i].right = x + this.lgBox - 2 - this.xa_margin;
                this.rcA[i].top = y + 2 + this.htq + 1 + this.hte + (this.hta + this.hte) * (i - 1);
                this.rcA[i].bottom = this.rcA[i].top + this.hta;
            }
        }

        for (i = 1; i < defTexts.otTexts.length; i++) {
            var bFlag = (this.currentDown == i);
            this.drawAnswer(context, i, bFlag);
        }
    }
};

//setup inheritance using extend
CServices.extend(CObject, CQuestion);