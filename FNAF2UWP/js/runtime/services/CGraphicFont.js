// CGraphicFont object
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

CGraphicFont.FONTFLAG_ITALIC = 0x0001;
CGraphicFont.FONTFLAG_UNDERLINE = 0x0002;
CGraphicFont.FONTFLAG_BOLD = 0x0004;
CGraphicFont.FLAG_PRIORITY = 0x0008;

function CGraphicFont() {
    this.characters = null;
    this.width = 0;
    this.height = 0;
    this.image = null;
    this.color = 0;
    this.flags = 0;
    this.fontName = null;
    this.fontHeight = 0;
    this.fontFlags = 0;
    this.interline = 0;
    this.interchar = 0;
    this.nChars = 0;
    this.charWidths = null;
    this.isGraphic = true;
}

CGraphicFont.prototype = {
    compareFont: function (font) {
        if (this.fontName != font.lfFaceName) {
            return false;
        }
        if (this.fontHeight != font.lfHeight) {
            return false;
        }
        var b1 = (this.fontFlags & CGraphicFont.FONTFLAG_ITALIC) != 0;
        var b2 = (font.lfItalic) != 0;
        if (b1 != b2) {
            return false;
        }
        b1 = (this.fontFlags & CGraphicFont.FONTFLAG_BOLD) != 0;
        b2 = (font.lfWeight) > 400;
        if (b1 != b2) {
            return false;
        }
        return true;
    },

    getHeight: function () {
        return this.height + this.interline;
    },

    measureText: function (s) {
        var w = 0;
        var l = s.length;
        var n, index;
        for (n = 0; n < l; n++) {
            index = this.characters.indexOf(s.charAt(n));
            if (index >= 0) {
                w += this.charWidths[index] + this.interchar;
            }
            else {
                w += this.width;
            }
        }
        return w;
    },

    measureChar: function (c) {
        var w;
        var index = characters.indexOf(String.fromCharCode(c));
        if (index >= 0) {
            w = this.charWidths[index] + this.interchar;
        } else {
            w = this.width;
        }
        return w;
    },

    drawToCanvas: function (context, s, x, y) {
        //render to HTML5 canvas
        var l = s.length;
        var n, xs, ys, index, col, line, c;

        var image = this.image;

        if ((this.flags & CGraphicFont.FLAG_PRIORITY) == 0) {
            for (n = 0; n < l; n++) {
                index = this.characters.indexOf(s.charAt(n));

                if (index >= 0) {
                    line = Math.floor(index / this.nChars);
                    col = index - (line * this.nChars);
                    ys = line * (this.height + 1);
                    xs = col * (this.width + 1);

                    if (image.mosaicId == 0) {
                        context.drawImage(image.img, xs, ys, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height);
                    } else {
                        context.drawImage(image.app.imageBank.mosaics[image.mosaicId].image.img, xs + image.mosaicX, ys + image.mosaicY, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height);
                    }
                    x += this.charWidths[index] + this.interchar;
                } else {
                    context.fillStyle = CServices.getColorString(this.color);
                    context.fillRect(x, y, this.width, this.height);
                    x += this.width;
                }
            }
        } else {
            x += this.measureText(s);
            for (n = l - 1; n >= 0; n--) {
                index = this.characters.indexOf(s.charAt(n));
                if (index >= 0) {
                    x -= (this.charWidths[index] + this.interchar);
                    line = index / this.nChars;
                    col = index - (line * this.nChars);
                    ys = line * (this.height + 1);
                    xs = col * (this.width + 1);
                    if (image.mosaicId == 0) {
                        context.drawImage(image.img, xs, ys, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height);
                    } else {
                        context.drawImage(image.app.imageBank.mosaics[image.mosaicId].image.img, xs + image.mosaicX, ys + image.mosaicY, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height);
                    }
                } else {
                    x -= this.width;
                    context.fillStyle = CServices.getColorString(this.color);
                    context.fillRect(x, y, this.width, this.height);
                }
            }
        }
    },

    drawToRenderer: function (renderer, s, x, y) {
        //render to fusion renderer
        var l = s.length;
        var n, xs, ys, index, col, line, c;

        var image = this.image;

        if ((this.flags & CGraphicFont.FLAG_PRIORITY) == 0) {

            for (n = 0; n < l; n++) {
                c = s.charAt(n);
                index = this.characters.indexOf(c);

                if (index >= 0) {
                    line = Math.floor(index / this.nChars);
                    col = index - (line * this.nChars);
                    ys = line * (this.height + 1);
                    xs = col * (this.width + 1);

                    if (image.mosaicId == 0) {
                        renderer.renderSubImage(image, xs, ys, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height);
                    } else {
                        renderer.renderSubImage(image.app.imageBank.mosaics[image.mosaicId].image, xs + image.mosaicX, ys + image.mosaicY, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height);
                    }
                    x += this.charWidths[index] + this.interchar;
                } else {
                    renderer.renderFilledRect(x, y, this.width, this.height, this.color);
                    x += this.width;
                }
            }
        } else {
            x += this.measureText(s);
            for (n = l - 1; n >= 0; n--) {
                index = this.characters.indexOf(s.charAt(n));
                if (index >= 0) {
                    x -= (this.charWidths[index] + this.interchar);
                    line = index / this.nChars;
                    col = index - (line * this.nChars);
                    ys = line * (this.height + 1);
                    xs = col * (this.width + 1);
                    if (image.mosaicId == 0) {
                        renderer.renderSubImage(image, xs, ys, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height);
                    } else {
                        renderer.renderSubImage(image.app.imageBank.mosaics[image.mosaicId].image, xs + image.mosaicX, ys + image.mosaicY, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height);
                    }
                } else {
                    x -= this.width;
                    renderer.renderFilledRect(x, y, this.width, this.height, this.color);
                }
            }
        }
    }
}
