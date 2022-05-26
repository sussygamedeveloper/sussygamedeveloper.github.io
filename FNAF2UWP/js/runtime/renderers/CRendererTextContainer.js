// CRendererTextContainer object
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

CRendererTextContainer.LINEBREAKS = 1;
CRendererTextContainer.WRAP = 2;
CRendererTextContainer.WORDWRAP = 4;
CRendererTextContainer.LEFT = 8;
CRendererTextContainer.RIGHT = 16;
CRendererTextContainer.CENTER = 32;
CRendererTextContainer.TOP = 64;
CRendererTextContainer.MIDDLE = 128;
CRendererTextContainer.BOTTOM = 256;
CRendererTextContainer.CHAR_10 = String.fromCharCode(10);
CRendererTextContainer.CHAR_13 = String.fromCharCode(13);
CRendererTextContainer.CHAR_32 = String.fromCharCode(32);

function CRendererTextContainer(app) {
    this.buffer = true;
    this.bufferGraphicFont = false;

    this.dirtyCanvas = true;
    this.dirtyCalculate = false;
    this.text = '';
    this.width = -1;
    this.height = -1;
    this.realWidth = -1;
    this.realHeight = -1;
    this.font = null;
    this.color = null;
    this.flags = 0;

    this.shadow = false;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.shadowColor = 0x000000;

    this.paddingLeft = 0;
    this.paddingRight = 0;
    this.paddingTop = 0;
    this.paddingBottom = 0;

    this.app = app;
    this.canvas = null;
    this.context = null;

    this.calculateLastWidth = 0;
    this.calculateLastHeight = 0;

    this.lines = [];
    this.linesTotal = 0;
}

CRendererTextContainer.prototype = {
    //events
    onUpdate: function () {
        //renderer speciffic update
    },

    onRenderBuffer: function (context, x, y, inkEffect, inkEffectParam, boundingCache) {
        //renderer speciffic render
    },

    //internal
    _getContext: function (resize) {
        //do we need to create the canvas?
        if (this.context == null) {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
        }

        //do we need to resize the canvas
        if (resize && (this.width != this.canvas.width || this.height != this.canvas.height)) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        //dont
        return this.context;
    },

    _addLine: function (text, x, y, width, height) {
        //create or fetch new object
        var line;

        //do we have any to reuse?
        if (this.linesTotal == this.lines.length) {
            //create new
            line = new CRendererTextBufferLine();
            this.lines.push(line);
        } else {
            //reuse old
            line = this.lines[this.linesTotal];
        }

        this.linesTotal += 1;

        //change details
        line.text = text;
        line.x = x;
        line.y = y;
        line.width = width;
        line.height = height;

        //excellent!
        return line;
    },

    _calculate: function (text, font, flags, width, height, force) {
        //calculate the liens of text using a localspace (0,0) based bounding rect!
        if (force || this.dirtyCalculate) {
            this.dirtyCalculate = false;

            //reset
            this.linesTotal = 0;
            this.calculateLastWidth = 0;
            this.calculateLastHeight = 0;

            //check for no text
            if (text.length == 0) {
                return 0;
            }

            //get context
            var context = this._getContext(false);

            //get font dimensions
            var fontHeight = font.getHeight();

            //setup the font in context
            if (!font.isGraphic) {
                context.font = font.getCSS();
            }

            //setup some vars to save time
            var singleLine = false;
            var lineBreaks = (flags & CRendererTextContainer.LINEBREAKS) != 0;
            var wrapWords = (flags & CRendererTextContainer.WORDWRAP) != 0;
            var wrap = wrapWords || (flags & CRendererTextContainer.WRAP) != 0;
            var char10, char13;

            //get horizontal alignmoent
            var horizontalAlign = CRendererTextContainer.LEFT;
            if ((flags & CRendererTextContainer.CENTER) != 0) {
                var horizontalAlign = CRendererTextContainer.CENTER;
            } else if ((flags & CRendererTextContainer.RIGHT) != 0) {
                var horizontalAlign = CRendererTextContainer.RIGHT;
            }

            //get vertical alignmoent
            var verticalAlign = CRendererTextContainer.TOP;
            if ((flags & CRendererTextContainer.MIDDLE) != 0) {
                var verticalAlign = CRendererTextContainer.MIDDLE;
            } else if ((flags & CRendererTextContainer.BOTTOM) != 0) {
                var verticalAlign = CRendererTextContainer.BOTTOM;
            }

            //check if we have multiple line processing
            if (!lineBreaks) {
                //dont process line breaks
                singleLine = true;
            } else {
                //look to see if there are any line breaks
                char10 = text.indexOf(CRendererTextContainer.CHAR_10);

                if (char10 == -1) {
                    singleLine = true;
                }
            }

            //calculate the first line
            var lineStart = 0;
            var lineEnd = 0;
            var lineNext = 0;

            if (singleLine) {
                //process entire string as one
                lineEnd = text.length;
                lineNext = lineEnd;

            } else {
                //find first EOL
                char13 = text.indexOf(CRendererTextContainer.CHAR_13);

                if (char13 != -1 && char13 == char10 - 1) {
                    lineEnd = char13;
                } else {
                    lineEnd = char10;
                }

                lineNext = char10 + 1;
            }

            //process until we have no more lines (calculate lineX,Y as zero based)
            var textWidth = 0;
            var line;
            var lineText;
            var lineWidth;
            var wrapStart;
            var wrapEnd;
            var wrapNext;
            var wrapWidth;
            var wrapText;
            var wrapChunk = 20;
            var rollback;
            var rollbackSpace;
            var rollbackLastSpace;
            var rollbackWords;
            var rollbackTrim;
            var trimOffset;

            while (lineStart < text.length) {
                //check for empty line
                if (lineStart == lineEnd) {
                    //add blank line!
                    this._addLine("", 0, 0, 0, fontHeight);

                } else {
                    //get the text for this line
                    if (singleLine) {
                        //just use entire string to save creating garbage
                        lineText = text;
                    } else {
                        //sub string
                        lineText = text.substring(lineStart, lineEnd);
                    }

                    //calculate this line
                    if (!wrap) {
                        //dont need to wrap this line
                        if (font.isGraphic) {
                            lineWidth = font.measureText(lineText);
                        } else {
                            lineWidth = context.measureText(lineText).width;
                        }

                        //add line
                        line = this._addLine(lineText, 0, 0, lineWidth, fontHeight);
                        textWidth = Math.max(textWidth, lineWidth);

                    } else {
                        //we need to wrap this line 
                        wrapStart = 0;

                        while (wrapStart < lineText.length) {
                            //measure text in chunks of X and when we then exceed the width, we roll back. This will avoid many calls to measure text routine!
                            if (lineText.length - wrapStart <= wrapChunk) {
                                //the chunk size is too big so we dont need to measure multiple chunks
                                wrapEnd = lineText.length;
                                wrapText = lineText.substring(wrapStart, wrapEnd);

                                //measure the width of text
                                if (font.isGraphic) {
                                    wrapWidth = font.measureText(wrapText);
                                } else {
                                    wrapWidth = context.measureText(wrapText).width;
                                }

                            } else {
                                //measure multiple chunks
                                for (wrapEnd = wrapStart + wrapChunk; wrapEnd < lineText.length; wrapEnd += wrapChunk) {
                                    //get wrap text
                                    wrapText = lineText.substring(wrapStart, wrapEnd);

                                    //measure the width of text
                                    if (font.isGraphic) {
                                        wrapWidth = font.measureText(wrapText);
                                    } else {
                                        wrapWidth = context.measureText(wrapText).width;
                                    }

                                    //exit loop if too big! if we have word wrap mode, we can only split if there was a space
                                    if (wrapWidth >= width && (!wrapWords || wrapText.lastIndexOf(CRendererTextContainer.CHAR_32) != -1)) {
                                        break;
                                    }
                                }

                                //check if we reached the end
                                if (wrapEnd > lineText.length - 1) {
                                    wrapEnd = lineText.length;

                                    //get wrap text
                                    wrapText = lineText.substring(wrapStart, wrapEnd);

                                    //measure the width of text
                                    if (font.isGraphic) {
                                        wrapWidth = font.measureText(wrapText);
                                    } else {
                                        wrapWidth = context.measureText(wrapText).width;
                                    }
                                }
                            }

                            //decide if we need to rollback
                            if (wrapEnd - wrapStart == 1) {
                                //can never rollback if there is only <= 1 character to deal with!
                                rollback = false;
                            } else {
                                //are we too large for the size?
                                if (wrapWidth > width) {
                                    //maybe, rollback!
                                    
                                    //rollback words?
                                    if (wrapWords) {
                                        rollbackSpace = lineText.lastIndexOf(CRendererTextContainer.CHAR_32, wrapEnd-1);

                                        if (rollbackSpace != -1 && rollbackSpace != wrapEnd && rollbackSpace >= wrapStart) {
                                            //has space so rollback
                                            rollback = true;
                                            rollbackWords = true;
                                            rollbackTrim = false;
                                        } else {
                                            //no space no rollback because words only
                                            rollback = false
                                            rollbackWords = false;
                                            rollbackTrim = false;
                                        }
                                    } else {
                                        rollback = true;
                                        rollbackWords = false;
                                        rollbackTrim = true;
                                    }
                                } else {
                                    //its not larger but have to check for word wrap
                                    if (wrapWords && wrapEnd < lineText.length - 1) {
                                        //check to see if we need to trim word
                                        rollbackSpace = lineText.lastIndexOf(CRendererTextContainer.CHAR_32, wrapEnd);

                                        if (rollbackSpace == -1 || rollbackSpace == wrapEnd || rollbackSpace < wrapStart) {
                                            //dont need to rollback
                                            rollback = false;
                                        } else {
                                            //words
                                            rollback = true;
                                            rollbackWords = true;
                                            rollbackTrim = false;
                                        }

                                    } else {
                                        //dont need to rollback
                                        rollback = false;
                                    }
                                }
                            }

                            //so do we need to rollback
                            if (!rollback) {
                                //update next
                                wrapNext = wrapEnd;
                            } else {
                                //need to rollback, first roll back words if we need
                                if (rollbackWords) {
                                    //keep trimming whole words until it fits. rollbackSpace should already be set
                                    while (rollbackSpace != -1) {
                                        //get wrap text
                                        wrapText = lineText.substring(wrapStart, rollbackSpace)

                                        //measure the width of text
                                        if (font.isGraphic) {
                                            wrapWidth = font.measureText(wrapText);
                                        } else {
                                            wrapWidth = context.measureText(wrapText).width;
                                        }

                                        //exit loop if we are small enough
                                        if (wrapWidth <= width) {
                                            break;
                                        }

                                        //previous space
                                        rollbackLastSpace = rollbackSpace;
                                        rollbackSpace = lineText.lastIndexOf(CRendererTextContainer.CHAR_32, rollbackSpace - 1);

                                        //check to see if we have gone out of bounds
                                        if (rollbackSpace < wrapStart) {
                                            rollbackSpace = -1;
                                        }
                                    }

                                    //check success of word rollback
                                    if (rollbackSpace == -1) {
                                        //so there are no more spaces and it is still too wide so lets use the last found space
                                        wrapEnd = rollbackLastSpace;
                                    } else {
                                        //found suitable word rollback
                                        wrapEnd = rollbackSpace;
                                    }

                                    //update next
                                    wrapNext = wrapEnd;
                                }

                                //do we need to trim (no if wrapStart -> wrapEnd is 1 character)
                                if (rollbackTrim && wrapEnd > wrapStart + 1) {
                                    for (wrapEnd = wrapEnd; wrapEnd > wrapStart; wrapEnd--) {
                                        //get wrap text
                                        wrapText = lineText.substring(wrapStart, wrapEnd)

                                        //measure the width of text
                                        if (font.isGraphic) {
                                            wrapWidth = font.measureText(wrapText);
                                        } else {
                                            wrapWidth = context.measureText(wrapText).width;
                                        }

                                        //exit loop if we are small enough
                                        if (wrapWidth <= width) {
                                            break;
                                        }
                                    }

                                    //check for single char
                                    if (wrapEnd == wrapStart) {
                                        wrapEnd = wrapStart + 1;
                                    }

                                    //update next
                                    wrapNext = wrapEnd;

                                    //remove trailing space
                                    trimOffset = 0;
                                    for (wrapEnd = wrapEnd; wrapEnd > wrapStart; wrapEnd--) {
                                        if (lineText.charCodeAt(wrapEnd - 1) != 32) {
                                            break;
                                        }
                                        trimOffset++;
                                    }

                                    //check if anything to trim. The trim will not affect the next piece of teh wrap because we have wrapNext to indicate that for next loop
                                    if (trimOffset > 0) {
                                        //get wrap text
                                        wrapText = lineText.substring(wrapStart, wrapEnd)

                                        //measure the width of text
                                        if (font.isGraphic) {
                                            wrapWidth = font.measureText(wrapText);
                                        } else {
                                            wrapWidth = context.measureText(wrapText).width;
                                        }
                                    }
                                }
                            }

                            //add the portion of line
                            line = this._addLine(wrapText, 0, 0, wrapWidth, fontHeight);
                            textWidth = Math.max(textWidth, wrapWidth);

                            //next part of wrap
                            wrapStart = wrapNext;

                            //trim leading spaces
                            for (wrapStart = wrapStart; wrapStart < lineText.length; wrapStart++) {
                                if (lineText.charCodeAt(wrapStart) != 32) {
                                    break;
                                }
                            }
                        }
                    }
                }

                //next line
                if (singleLine) {
                    if (!wrap) {
                        //nothing else to process!
                        break;
                    } else {
                        lineStart = lineNext;
                    }

                } else {
                    //only need to calculate this if we have more then one line
                    lineStart = lineNext;

                    //find end of next line
                    char10 = text.indexOf(CRendererTextContainer.CHAR_10, lineStart)

                    if (char10 == -1) {
                        //no more lines
                        lineEnd = text.length;
                        lineNext = lineEnd;

                    } else {
                        //check for carriage retur trim
                        char13 = text.indexOf(CRendererTextContainer.CHAR_13, lineStart)

                        if (char13 != -1 && char13 == char10 - 1) {
                            lineEnd = char13;
                        } else {
                            lineEnd = char10;
                        }

                        lineNext = char10 + 1;
                    }
                }
            }

            //we now have all of the lines available, we should calculate their real positions based on flags
            var lineIndex;
            var textHeight = this.linesTotal * fontHeight;
            var lineY;

            //figure out the root y
            switch (verticalAlign) {
                case CRendererTextContainer.TOP:
                    lineY = 0;
                    break;
                case CRendererTextContainer.MIDDLE:
                    lineY = height / 2 - textHeight / 2;
                    break;
                case CRendererTextContainer.BOTTOM:
                    lineY = height - textHeight;
            }

            for (lineIndex = 0; lineIndex < this.linesTotal; lineIndex++) {
                line = this.lines[lineIndex];

                switch (horizontalAlign) {
                    case CRendererTextContainer.LEFT:
                        line.x = 0;
                        break;
                    case CRendererTextContainer.CENTER:
                        line.x = width / 2 - line.width / 2;
                        break;
                    case CRendererTextContainer.RIGHT:
                        line.x = width - line.width;
                }

                line.y = lineY;

                lineY += fontHeight;
            }

            //save details
            this.calculateLastWidth = textWidth;
            this.calculateLastHeight = textHeight;
        }
    },

    _renderLinesToBuffer: function (x, y, font, color) {
        var index, line;
        var lines = this.lines;
        var context = this.context;

        //what type of font
        if (!font.isGraphic) {
            //css font

            //setup the context for rendering to it
            context.font = font.getCSS();
            context.fillStyle = CServices.getColorString(color);
            context.textAlign = "left";
            context.textBaseline = "top";

            //iterate over each display item and render it!
            for (index = 0; index < this.linesTotal; index++) {
                line = lines[index];
                context.fillText(line.text, x + line.x, y + line.y);
            }
        } else {
            //graphic font
            for (index = 0; index < this.linesTotal; index++) {
                line = lines[index];
                font.drawToCanvas(context, line.text, x + line.x, y + line.y);
            }
        }
    },

    _renderLinesToRenderer: function (renderer, x, y, font, color) {
        //graphic font only!
        if (font.isGraphic) {
            var index, line;
            var lines = this.lines;

            for (index = 0; index < this.linesTotal; index++) {
                line = lines[index];
                font.drawToRenderer(renderer, line.text, x + line.x, y + line.y);
            }
        }
    },

    //api
    free: function () {
        this.app = null;
        this.canvas = null;
        this.context = null;
    },

    setSize: function (width, height) {
        if (width + this.paddingLeft + this.paddingRight != this.width || height + this.paddingTop + this.paddingBottom != this.height) {
            this.dirtyCanvas = true;
            this.dirtyCalculate = true;

            this.realWidth = width;
            this.realHeight = height;
            this.width = this.realWidth + this.paddingLeft + this.paddingRight;
            this.height = this.realHeight + this.paddingTop + this.paddingBottom;
        }
    },

    setFont: function (font) {
        font = this.app.getGraphicFont(font);

        if (font != this.font) {
            this.dirtyCanvas = true;
            this.dirtyCalculate = true;
            this.font = font;
        }
    },

    setColor: function (color) {
        if (color != this.color) {
            this.dirtyCanvas = true;
            this.color = color;
        }
    },

    setText: function (text) {
        if (text != this.text) {
            this.dirtyCanvas = true;
            this.dirtyCalculate = true;
            this.text = text;
        }
    },

    setFlags: function (flags) {
        if (flags != this.flags) {
            this.dirtyCanvas = true;
            this.dirtyCalculate = true;
            this.flags = flags;
        }
    },

    setShadow: function (offsetX, offsetY, color) {
        //apply shadow to the text
        if (offsetX == null) {
            offsetX = 0;
            offsetY = 0;
        }

        if (offsetX != this.shadowOffsetX || offsetY != this.shadowOffsetY || color != this.shadowColor) {
            this.dirtyCanvas = true;
            this.dirtyCalculate = true;

            this.shadow = offsetX != 0 || offsetY != 0;
            this.shadowOffsetX = offsetX;
            this.shadowOffsetY = offsetY;
            this.shadowColor = color;

            //set padding
            this.paddingLeft = offsetX < 0 ? Math.abs(offsetX) : 0;
            this.paddingRight = offsetX > 0 ? offsetX : 0;
            this.paddingTop = offsetY < 0 ? Math.abs(offsetY) : 0;
            this.paddingBottom = offsetY > 0 ? offsetY : 0;

            //push through size change
            this.setSize(this.realWidth, this.realHeight);
        }
    },

    set: function (text, font, color, flags, width, height) {
        this.setText(text);
        this.setFlags(flags);
        this.setFont(font);
        this.setColor(color);
        this.setSize(width, height);
    },

    update: function (force) {
        if (force || this.dirtyCanvas) {
            //unflag the dirtyCanvas flag
            this.dirtyCanvas = false;

            //calculate the text first
            this._calculate(this.text, this.font, this.flags, this.realWidth, this.realHeight);

            //render to buffer?
            if (this.width > 0 && this.height > 0) {
                if (this.buffer && (this.bufferGraphicFont || !this.font.isGraphic)) {
                    //grab the context (it may need resizing from _calculate)
                    var context = this._getContext(true);

                    if (this.calculateLastWidth != 0 && this.calculateLastHeight != 0) {
                        //clear the canvas
                        context.clearRect(0, 0, this.width, this.height);

                        //figure out the vertical height within vounds
                        var x = this.paddingLeft;
                        var y = this.paddingTop;

                        //render shadow
                        if (this.shadow) {
                            this._renderLinesToBuffer(x + this.shadowOffsetX, y + this.shadowOffsetY, this.font, this.shadowColor);
                        }

                        //render actual text
                        this._renderLinesToBuffer(x, y, this.font, this.color);
                    }
                }

                //let extended versions do their stuff (generally transfer the canvas into something renderable)
                this.onUpdate();
            }
        }
    },

    draw: function (context, x, y, inkEffect, inkEffectParam, boundingCache) {
        if (this.width > 0 && this.height > 0) {
            //update before drawing
            this.update();

            //what are we drawing and where?
            if (this.bufferGraphicFont || !this.font.isGraphic) {
                //draw the internal buffer using extended functionality
                if (this.buffer) {
                    this.onRenderBuffer(context, x, y, inkEffect, inkEffectParam, boundingCache);
                }
            } else {
                //we are rendering a grahpic font on the fly to the provided renderer

                //get position
                x += this.paddingLeft;
                y += this.paddingTop;

                //setup renderer
                context.pushClip();
                context.addClip(x, y, this.width, this.height, true);//pass the world flag so the clip takes into account the current world position

                //render shadow
                if (this.shadow) {
                    this._renderLinesToRenderer(context, x + this.shadowOffsetX, y + this.shadowOffsetY, this.font, this.shadowColor);
                }

                //render actual text
                this._renderLinesToRenderer(context, x, y, this.font, this.color);

                //restore renderer
                context.popClip();
            }
        }
    },

    getTextHeight: function (text, font) {
        return font.getHeight();
    },

    getTextWidth: function (text, font) {
        //graphic font?
        if (font.isGraphic) {
            return font.measureText(text);
        }

        //css font
        var context = this._getContext(false);
        context.font = font.getCSS();
        return context.measureText(text).width;
    },

    measure: function (out) {
        this._calculate(this.text, this.font, this.flags, this.realWidth, this.realHeight);

        if (out == null) {
            //return garbage
            return {
                width: this.calculateLastWidth,
                height: this.calculateLastHeight,
            };
        } else {
            //efffficccieeeenttt!
            out.width = this.calculateLastWidth;
            out.height = this.calculateLastHeight;
            return out;
        }
    },

    measureWidth: function () {
        this._calculate(this.text, this.font, this.flags, this.realWidth, this.realHeight);
        return this.calculateLastWidth;
    },

    measureHeight: function () {
        this._calculate(this.text, this.font, this.flags, this.realWidth, this.realHeight);
        return this.calculateLastHeight;
    },

    convertFlags: function (oldFlags) {
        //convert CService flags to textbuffer flags

        /*
         CServices.DT_LEFT = 0x0000;
         CServices.DT_TOP = 0x0000;
         CServices.DT_CENTER = 0x0001;
         CServices.DT_RIGHT = 0x0002;
         CServices.DT_BOTTOM = 0x0008;
         CServices.DT_VCENTER = 0x0004;
         CServices.DT_SINGLELINE = 0x0020;
         CServices.DT_CALCRECT = 0x0400;
         CServices.DT_VALIGN = 0x0800;
         */

        var newFlags;

        //horizontal align
        if ((oldFlags & 0x0002) != 0) {
            newFlags |= CRendererTextContainer.RIGHT;
        } else if ((oldFlags & 0x0001) != 0) {
            newFlags |= CRendererTextContainer.CENTER;
        } else {
            newFlags |= CRendererTextContainer.LEFT;
        }

        //vertical align
        if ((oldFlags & 0x0008) != 0) {
            newFlags |= CRendererTextContainer.BOTTOM;
        } else if ((oldFlags & 0x0004) != 0) {
            newFlags |= CRendererTextContainer.MIDDLE;
        } else {
            newFlags |= CRendererTextContainer.TOP;
        }

        //others
        if ((oldFlags & 0x0020) == 0) {
            newFlags |= CRendererTextContainer.LINEBREAKS;
        }

        return newFlags;
    },
}

function CRendererTextBufferLine() {
    this.text = '';
    this.x = 0;
    this.y = 0
    this.width = 0;
    this.height = 0;
}