// CTransZigZag object
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

function CTransZigZag() {
    //call chain
    CTrans.call(this);

    //call self
    this.configBlockPercent = 0;
    this.configPoint = 0;
    this.configDirection = 0;

    this.blockSize = 0;

    this.totalRowBlocks = 0;
    this.totalColumnBlocks = 0;
    this.totalBlocks = 0;

    this.startX = 0;
    this.startY = 0;
    this.startDirection = 0;
    this.startPoint = 0;
    this.startLeft = 0;
    this.startTop = 0;
    this.startRight = 0;
    this.startBottom = 0;

    this.currentX = 0;
    this.currentY = 0;
    this.currentStartPoint = 0;
    this.currentDirection = 0;
    this.currentLeft = 0;
    this.currentRight = 0;
    this.currentTop = 0;
    this.currentBottom = 0;
    this.currentBlocks = 0;
}

CTransZigZag.prototype = {
    //events
    onInit: function (data, file, outputBuffer, oldBuffer, newBuffer) {
        this.configBlockPercent = file.readAInt();
        this.configPoint = file.readAShort();
        this.configDirection = file.readAShort();
    },

    onStart: function (flag) {
        var sourceWidth = this.oldBuffer.width;
        var sourceHeight = this.oldBuffer.height;

        // Spot size: voir si ca rend bien
        this.blockSize = Math.floor(((sourceWidth * this.configBlockPercent / 100) + (sourceHeight * this.configBlockPercent / 100)) / 2);
        if (this.blockSize == 0) {
            this.blockSize = 1;
        }

        this.totalRowBlocks = ((sourceWidth + this.blockSize - 1) / this.blockSize);
        this.totalColumnBlocks = ((sourceHeight + this.blockSize - 1) / this.blockSize);

        //start details
        this.startPoint = this.configPoint;
        this.startDirection = this.configDirection;

        switch (this.configPoint) {
            case CTrans.TOP_LEFT:
                this.startX = this.startY = 0;
                break;

            case CTrans.TOP_RIGHT:
                this.startX = sourceWidth - this.blockSize;
                this.startY = 0;
                break;

            case CTrans.BOTTOM_LEFT:
                this.startX = 0;
                this.startY = sourceHeight - this.blockSize;
                break;

            case CTrans.BOTTOM_RIGHT:
                this.startX = sourceWidth - this.blockSize;
                this.startY = sourceHeight - this.blockSize;
                break;

            case CTrans.CENTER:
                this.startX = sourceWidth / 2 - this.blockSize;
                this.startY = sourceHeight / 2 - this.blockSize;

                if (this.configDirection == CTrans.DIR_HORZ) {
                    this.startPoint = CTrans.TOP_LEFT;
                } else {
                    this.startPoint = CTrans.TOP_RIGHT;
                }

                this.startLeft = this.startX - this.blockSize;
                this.startTop = this.startY - this.blockSize;
                this.startBottom = this.startY + this.blockSize * 2;
                this.startRight = this.startX + this.blockSize * 2;

                this.totalRowBlocks = 2 + 2 * (this.startX + this.blockSize - 1) / this.blockSize;
                this.totalColumnBlocks = 2 + 2 * (this.startY + this.blockSize - 1) / this.blockSize;
                break;
        }

        //calculate total blocks
        this.totalBlocks = Math.floor(this.totalRowBlocks * this.totalColumnBlocks);

        //reset current values
        this.currentX = this.startX;
        this.currentY = this.startY;
        this.currentStartPoint = this.startPoint;
        this.currentDirection = this.startDirection;
        this.currentLeft = this.startLeft;
        this.currentRight = this.startRight;
        this.currentTop = this.startTop;
        this.currentBottom = this.startBottom;
        this.currentBlocks = 0;

        //stamp down old buffer to start drawing on top of
        this.pasteOld();
    },

    onUpdate: function (flag) {
        //update the transition
        var sourceWidth = this.oldBuffer.width;
        var sourceHeight = this.oldBuffer.height;

        //check if we can skip rendering teh "spots"
        if (this.blockSize >= sourceWidth || this.blockSize >= sourceHeight) {
            //yup
            this.blit(this.newBuffer);
        } else {
            //need to render spots
            var deltaTime = this.getDeltaTime();
            var newBlocks = (this.totalBlocks / this.duration) * deltaTime;

            var blocksDifference = Math.floor(newBlocks - this.currentBlocks);

            if (blocksDifference > 0) {
                //save current blocks progress so we are ready for next update
                this.currentBlocks += blocksDifference;

                //iterate over progress
                for (var index = 0; index < blocksDifference; index++) {
                    // Blit this.current spot
                    this.blit(this.newBuffer, this.currentX, this.currentY, this.currentX, this.currentY, this.blockSize, this.blockSize);

                    // Increment spot coordinates
                    if (this.configPoint == CTrans.CENTER) {
                        //spiral
                        switch (this.currentStartPoint) {
                            case CTrans.TOP_LEFT:
                                this.currentX += this.blockSize;
                                if (this.currentX >= this.currentRight) {
                                    this.currentX -= this.blockSize;
                                    this.currentY += this.blockSize;
                                    this.currentStartPoint = CTrans.TOP_RIGHT;
                                    this.currentRight += this.blockSize;
                                }
                                break;
                            case CTrans.TOP_RIGHT:
                                this.currentY += this.blockSize;
                                if (this.currentY >= this.currentBottom) {
                                    this.currentY -= this.blockSize;
                                    this.currentX -= this.blockSize;
                                    this.currentStartPoint = CTrans.BOTTOM_RIGHT;
                                    this.currentBottom += this.blockSize;
                                }
                                break;
                            case CTrans.BOTTOM_RIGHT:
                                this.currentX -= this.blockSize;
                                if ((this.currentX + this.blockSize) <= this.currentLeft) {
                                    this.currentX += this.blockSize;
                                    this.currentY -= this.blockSize;
                                    this.currentStartPoint = CTrans.BOTTOM_LEFT;
                                    this.currentLeft -= this.blockSize;
                                }
                                break;
                            case CTrans.BOTTOM_LEFT:
                                this.currentY -= this.blockSize;
                                if ((this.currentY + this.blockSize) <= this.currentTop) {
                                    this.currentY += this.blockSize;
                                    this.currentX += this.blockSize;
                                    this.currentStartPoint = CTrans.TOP_LEFT;
                                    this.currentTop -= this.blockSize;
                                }
                                break;
                        }

                    } else {
                        //linear
                        switch (this.currentDirection) {
                            // Horizontal
                            case CTrans.DIR_HORZ:
                                switch (this.currentStartPoint) {
                                    case CTrans.TOP_LEFT:
                                        this.currentX += this.blockSize;

                                        if (this.currentX >= sourceWidth) {
                                            this.currentX -= this.blockSize;
                                            this.currentY += this.blockSize;
                                            this.currentStartPoint = CTrans.TOP_RIGHT;
                                        }
                                        break;

                                    case CTrans.TOP_RIGHT:
                                        this.currentX -= this.blockSize;

                                        if ((this.currentX + this.blockSize) <= 0) {
                                            this.currentX += this.blockSize;
                                            this.currentY += this.blockSize;
                                            this.currentStartPoint = CTrans.TOP_LEFT;
                                        }
                                        break;

                                    case CTrans.BOTTOM_LEFT:
                                        this.currentX += this.blockSize;

                                        if (this.currentX >= sourceWidth) {
                                            this.currentX -= this.blockSize;
                                            this.currentY -= this.blockSize;
                                            this.currentStartPoint = CTrans.BOTTOM_RIGHT;
                                        }
                                        break;

                                    case CTrans.BOTTOM_RIGHT:
                                        this.currentX -= this.blockSize;

                                        if ((this.currentX + this.blockSize) <= 0) {
                                            this.currentX += this.blockSize;
                                            this.currentY -= this.blockSize;
                                            this.currentStartPoint = CTrans.BOTTOM_LEFT;
                                        }
                                        break;
                                }
                                break;

                            // Vertical
                            case CTrans.DIR_VERT:
                                switch (this.currentStartPoint) {
                                    case CTrans.TOP_LEFT:
                                        this.currentY += this.blockSize;
                                        if (this.currentY >= sourceHeight) {
                                            this.currentY -= this.blockSize;
                                            this.currentX += this.blockSize;
                                            this.currentStartPoint = CTrans.BOTTOM_LEFT;
                                        }
                                        break;
                                    case CTrans.TOP_RIGHT:
                                        this.currentY += this.blockSize;
                                        if (this.currentY >= sourceHeight) {
                                            this.currentY -= this.blockSize;
                                            this.currentX -= this.blockSize;
                                            this.currentStartPoint = CTrans.BOTTOM_RIGHT;
                                        }
                                        break;
                                    case CTrans.BOTTOM_LEFT:
                                        this.currentY -= this.blockSize;
                                        if ((this.currentY + this.blockSize) <= 0) {
                                            this.currentY += this.blockSize;
                                            this.currentX += this.blockSize;
                                            this.currentStartPoint = CTrans.TOP_LEFT;
                                        }
                                        break;
                                    case CTrans.BOTTOM_RIGHT:
                                        this.currentY -= this.blockSize;
                                        if ((this.currentY + this.blockSize) <= 0) {
                                            this.currentY += this.blockSize;
                                            this.currentX -= this.blockSize;
                                            this.currentStartPoint = CTrans.TOP_RIGHT;
                                        }
                                        break;
                                }
                                break;
                        }
                    }
                }
            }
        }
    },
};

//setup inheritance using extend
CServices.extend(CTrans, CTransZigZag);