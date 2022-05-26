// CTrans object
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

CTrans.LEFT_RIGHT = 0;
CTrans.RIGHT_LEFT = 1;
CTrans.TOP_BOTTOM = 2;
CTrans.BOTTOM_TOP = 3;
CTrans.CENTER_LEFTRIGHT = 0;
CTrans.LEFTRIGHT_CENTER = 1;
CTrans.CENTER_TOPBOTTOM = 2;
CTrans.TOPBOTTOM_CENTER = 3;
CTrans.TOP_LEFT = 0;
CTrans.TOP_RIGHT = 1;
CTrans.BOTTOM_LEFT = 2;
CTrans.BOTTOM_RIGHT = 3;
CTrans.CENTER = 4;
CTrans.DIR_HORZ = 0;
CTrans.DIR_VERT = 1;
CTrans.TRFLAG_FADEIN = 0x0001;
CTrans.TRFLAG_FADEOUT = 0x0002;

function CTrans() {
    this.startTime = 0;
    this.currentTime = 0;
    this.endTime = 0;
    this.pausedTime = 0;

    this.duration = 0;

    this.running = false;
    this.starting = false;


    this.oldBuffer = null;
    this.oldBufferWidth = 0;
    this.oldBufferHeight = 0;

    this.newBuffer = null;
    this.newBufferWidth = 0;
    this.newBufferHeight = 0;

    this.outputBuffer = null;
}

CTrans.prototype = {
    //events
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
    },

    onStart: function (flag) {
    },

    onUpdate: function (flag) {
    },

    onEnd: function () {

    },

    //interal
    _drawImage: function (source, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight) {
        //figure out if source is within bounds
        var offset;

        var oldSourceX = sourceX;
        var oldSourceY = sourceY;
        var oldSourceWidth = sourceWidth;
        var oldSourceHeight = sourceHeight;
        var oldDestinationX = destinationX;
        var oldDestinationY = destinationY;
        var oldDestinationWidth = destinationWidth;
        var oldDestinationHeight = destinationHeight;

        //x
        if (sourceX < 0) {
            offset = Math.abs(sourceX);

            sourceX = 0;
            sourceWidth -= offset;
            destinationX += offset;
            destinationWidth -= offset;
        }

        offset = source.width - (sourceX + sourceWidth);
        if (offset < 0) {
            sourceWidth += offset;
            destinationWidth += offset;
        }

        if (sourceWidth < 0 || destinationWidth < 0) {
            //skip if nothing to draw
            return false;
        }

        //y
        if (sourceY < 0) {
            offset = Math.abs(sourceY);

            sourceY = 0;
            sourceHeight -= offset;
            destinationY += offset;
            destinationHeight -= offset;
        }

        offset = source.height - (sourceY + sourceHeight);
        if (offset < 0) {
            sourceHeight += offset;
            destinationHeight += offset;
        }

        if (sourceHeight < 0 || destinationHeight < 0) {
            //skip if nothing to draw
            return false;
        }

        //ok we can do it now
        this.outputBuffer.drawSubImage(source, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);

        //success
        return true;
    },

    //api
    init: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        //copy the buffers! (we only own source1 and source2)
        this.outputBuffer = outputBuffer.use();
        this.outputBufferWidth = outputBuffer.width;
        this.outputBufferHeight = outputBuffer.height;

        this.oldBuffer = oldBuffer.use();
        this.oldBufferWidth = oldBuffer.width;
        this.oldBufferHeight = oldBuffer.height;

        this.newBuffer = newBuffer.use();
        this.newBufferWidth = newBuffer.width;
        this.newBufferHeight = newBuffer.height;

        //setup other transition details
        this.startTime = Date.now();
        this.duration = data.transDuration;
        if (this.duration == 0) {
            this.duration = 1;
        }
        this.currentTime = this.startTime;
        this.endTime = this.startTime + this.duration;
        this.running = true;
        this.starting = true;

        //internal event
        this.onInit(data, file, outputBuffer, oldBuffer, newBuffer);
    },

    free: function () {
        if (this.outputBuffer != null) {
            this.outputBuffer.free();
            this.outputBuffer = null;
        }

        if (this.oldBuffer != null) {
            this.oldBuffer.free();
            this.oldBuffer = null;
        }

        if (this.newBuffer != null) {
            this.newBuffer.free();
            this.newBuffer = null;
        }
    },

    end: function () {
        //internal event
        this.onEnd();
    },

    update: function (flag) {
        this.startRender();

        //start
        if (this.starting) {
            this.starting = false;
            this.onStart(flag);
        }

        //update
        this.onUpdate(flag);

        this.finishRender();
    },

    pause: function () {
        //allows us to pause execution if a trans, useful if the application pauses eg on blur!
        if (this.pausedTime == 0) {
            this.pausedTime = Date.now();
        }
    },

    resume: function () {
        if (this.pausedTime > 0) {
            //update runtime vars
            var difference = Date.now() - this.pausedTime;
            this.startTime += difference;
            this.endTime += difference;
            this.currentTime += difference;

            //reset paused flag
            this.pausedTime = 0;
        }
    },

    isCompleted: function () {
        if (this.running) {
            return (Date.now() >= this.endTime);
        }
        return true;
    },

    getDeltaTime: function () {
        this.currentTime = Date.now();
        if (this.currentTime > this.endTime) {
            this.currentTime = this.endTime;
        }
        return (this.currentTime - this.startTime);
    },

    getTimePos: function () {
        return this.currentTime - this.startTime;
    },

    setTimePos: function (msTimePos) {
        this.startTime = (this.currentTime - this.msTimePos);
        this.endTime = this.startTime + this.duration;
    },

    //render api
    startRender: function () {

        this.outputBuffer.start();
    },

    finishRender: function () {
        this.outputBuffer.finish();
    },

    alpha: function (alpha) {
        this.outputBuffer.setAlpha(alpha);
    },

    blit: function (source, destinationX, destinationY, sourceX, sourceY, sourceWidth, sourceHeight) {
        //this draws a portion of the source image at exact dimensions on the destination buffer

        //skip if nothing to draw
        if (source == null) {
            return;
        }

        //how many arguements did we call teh method with?
        if (arguments.length == 1) {
            //just the source image, so we can fill in teh blanks
            this.outputBuffer.drawImage(source, 0, 0, 0.0, 1.0, 1.0);

        } else if (arguments.length == 3) {
            //just the source image, so we can fill in teh blanks
            this.outputBuffer.drawImage(source, destinationX, destinationY, 0.0, 1.0, 1.0);


        } else if (sourceWidth > 0 && sourceHeight > 0) {
            //draw sub rect at exact size
            this._drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, sourceWidth, sourceHeight);

        }
    },

    pasteOld: function (source) {
        //paste the old buffer in the correct size
        //skip if nothing to draw
        if (this.oldBuffer == null) {
            return;
        }

        this.blit(this.oldBuffer);
    },

    stretch: function (source, destinationX, destinationY, destinationWidth, destinationHeight, sourceX, sourceY, sourceWidth, sourceHeight) {
        //this draws a portion of the source image at variable/stretched dimensions on the destination buffer

        //skip if nothing to draw
        if (source == null) {
            return;
        }

        //validate that there is actually anything to draw
        if (destinationWidth > 0 && destinationHeight > 0 && sourceWidth > 0 && sourceHeight > 0) {
            this._drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);

        }
    },

    rect: function (x, y, width, height, color) {
        this.outputBuffer.drawRect(x, y, width, height, color, 0, 0);

    },
}
