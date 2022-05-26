// CPreloaderImage objects
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

function CPreloaderImage(a) {
    this.app = a;
    this.isLoaded = false;
    this.subApp = null;
    this.renderer = this.app.renderer;
    this.radius = this.app.preloaderCircleRadius;   // * (this.app.scaleX + this.app.scaleY) / 2;
    this.color = this.app.preloaderCircleColor;
    this.xCenter = this.app.preloaderCircleCenterX;
    if (this.xCenter < 0) {
        this.xCenter = this.app.gaCxWin / 2;
    }
    this.yCenter = this.app.preloaderCircleCenterY;
    if (this.yCenter < 0) {
        this.yCenter = this.app.gaCyWin / 2;
    }
    this.currentAngle = 0;
    this.size = this.app.preloaderCircleThickness;  // * (this.app.scaleX + this.app.scaleY) / 2;
    this.oldAngle = 0;
    this.counter = 25;
    this.phase = 0;

    this.image = new Image();
    var that = this;
    this.image.onload = function () {
        that.isLoaded = true;
    }
    this.image.src = this.app.resourcesPath + "Preloader.png";
}

CPreloaderImage.prototype = {
    load: function () {
        return this.isLoaded;
    },

    reset: function () {
        this.phase = 0;
        this.oldAngle = 0;
        this.counter = 25;
    },

    update: function () {
        switch (this.phase) {
            case 0:
                this.phase++;
                break;
            case 1:
                this.drawIt(this.angle);

                break;
            case 2:
                if (this.counter > 0) {
                    this.counter--;
                }
                if (this.counter == 0) {
                    this.phase++;
                }
                break;
            case 3:
                if (this.app.updateContinue(this)) {
                    this.phase++;
                }
                break;
            default:
                break;
        }
    },

    render: function () {
        switch (this.phase) {
            case 0:
                if (this.app.preloaderBackColor != -1) {
                    this.renderer.renderFilledRect(0, 0, this.app.gaCxWin, this.app.gaCyWin, this.app.preloaderBackColor);
                } else {
                    this.renderer.clearBackground(0, 0, this.app.gaCxWin, this.app.gaCyWin);
                }

                this.renderer.renderSimpleImage(this.image, this.xCenter - this.image.width / 2, this.yCenter - this.image.height / 2, this.image.width, this.image.height, 0, 0);
                break;
            case 1:
                this.drawIt(this.angle);

                break;
            case 3:
                this.app.drawContinue(this);
                break;
            default:
                break;
        }
    },

    isComplete: function () {
        return this.phase == 4;
    },

    drawIt: function (angle) {
        var a;
        var x1, y1, x2, y2;
        for (a = this.oldAngle; a <= angle; a += 0.005) {
            x1 = this.xCenter + Math.cos(a) * (this.radius - this.size);
            y1 = this.yCenter - Math.sin(a) * (this.radius - this.size);
            x2 = this.xCenter + Math.cos(a) * this.radius;
            y2 = this.yCenter - Math.sin(a) * this.radius;
            this.renderer.renderLine(x1, y1, x2, y2, this.color, 1, 0, 0);

            var n;
            for (n = 0; n < 3; n++) {
                x1 = this.xCenter + Math.cos(a) * (this.radius - this.size - n);
                y1 = this.yCenter - Math.sin(a) * (this.radius - this.size - n);
                x2 = this.xCenter + Math.cos(a) * (this.radius - this.size - n - 1);
                y2 = this.yCenter - Math.sin(a) * (this.radius - this.size - n - 1);
                this.renderer.renderLine(x1, y1, x2, y2, this.color, 1, 0, 0);

                x1 = this.xCenter + Math.cos(a) * (this.radius + n);
                y1 = this.yCenter - Math.sin(a) * (this.radius + n);
                x2 = this.xCenter + Math.cos(a) * (this.radius + n + 1);
                y2 = this.yCenter - Math.sin(a) * (this.radius + n + 1);
                this.renderer.renderLine(x1, y1, x2, y2, this.color, 1, 0, 0);
            }
        }
        this.oldAngle = angle;
    }
}
