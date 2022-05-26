// CPreloaderProgress objects
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

function CPreloaderProgress(a) {
    this.app = a;
    this.renderer = this.app.renderer;
    this.currentPosition = 0;
    this.width = 100;
    this.height = 12;
    this.position = 0;
    this.backColor = 0xA0A0A0;
    this.borderColor = 0x808080;
    this.barColor = 0x000000;
    this.borderWidth = 1;
    this.rect = new CRect();
    this.rect.left = this.app.gaCxWin / 2 - this.width / 2;
    this.rect.top = this.app.gaCyWin / 2 - this.height / 2;
    this.rect.right = this.rect.left + this.width;
    this.rect.bottom = this.rect.top + this.height;
    this.reset();

    this.quit = false;
    this.phase = 0;
    this.alpha = 0.0;
}

CPreloaderProgress.prototype = {
    load: function () {
        return true;
    },

    reset: function () {
        this.quit = false;
        this.phase = 0;
        this.alpha = 0.0;
        this.position = 0;
    },

    update: function () {
        //do phase step
        if (this.app.loadingDataCurrent < this.app.loadingDataTotal) {
            //still loading stuff
            switch (this.phase) {
                case 0:
                    //fade in
                    if (this.alpha < 1.0) {
                        this.alpha += 0.015625;

                        //check for finished
                        if (this.alpha >= 1.0) {
                            this.alpha = 1.0;
                            this.phase = 1;
                        }
                    }
                    break;
                case 1:
                    //we have faded in so just continue
                    break;
            }
        } else {
            //finished loading stuff
            switch (this.phase) {
                case 0:
                case 1:
                    this.phase = 2;
                    break;
                case 2:
                    //fade out
                    if (this.alpha > 0.0) {
                        this.alpha -= 0.03125;
                    }

                    if (this.alpha <= 0.0) {
                        this.alpha = 0.0;
                        if (this.app.silentSound == null) {
                            this.quit = true;
                        } else {
                            this.phase++;
                        }
                    }
                    break;
                case 3:
                    this.quit = this.app.updateContinue(this);
                    return;
            }
        }

        //update the bar position
        this.position = (this.app.loadingDataCurrent / this.app.loadingDataTotal);
    },

    render: function () {
        switch (this.phase) {
            case 0:
            case 1:
            case 2:
                this.renderer.setAlpha(this.alpha);

                //background
                this.renderer.renderFilledRect(this.rect.left, this.rect.top, this.width, this.height, this.backColor);//, CRSpr.BOP_BLEND, this.alpha);

                //border
                this.renderer.renderOutlineRect(this.rect.left - this.borderWidth, this.rect.top - this.borderWidth, this.width + this.borderWidth + this.borderWidth, this.height + this.borderWidth + this.borderWidth, this.borderColor, this.borderWidth);//, CRSpr.BOP_BLEND, this.alpha);

                //progress bar
                this.renderer.renderFilledRect(this.rect.left, this.rect.top, this.width * this.position, this.height, this.barColor);//, CRSpr.BOP_BLEND, this.alpha);
                break;
            case 3:
                this.app.drawContinue(this);
        }
    },

    isComplete: function () {
        return this.quit && (this.app.loadingDataCurrent == this.app.loadingDataTotal);
    }
}
