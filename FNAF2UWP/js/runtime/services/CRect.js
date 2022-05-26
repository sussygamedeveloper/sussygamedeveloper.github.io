// CRect object
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

function CRect(l, t, r, b) {
    if (l) {
        this.left = l
    } else {
        this.left = 0;
    }

    if (t) {
        this.top = t
    } else {
        this.top = 0;
    }

    if (r) {
        this.right = r;
    } else {
        this.right = 0;
    }

    if (b) {
        this.bottom = b;
    } else {
        this.bottom = 0;
    }
}

CRect.prototype = {
    load: function (file) {
        this.left = file.readAInt();
        this.top = file.readAInt();
        this.right = file.readAInt();
        this.bottom = file.readAInt();
    },

    copyRect: function (srce) {
        this.left = srce.left;
        this.right = srce.right;
        this.top = srce.top;
        this.bottom = srce.bottom;
    },

    ptInRect: function (x, y) {
        if (x >= this.left && x < this.right && y >= this.top && y < this.bottom) {
            return true;
        }
        return false;
    },

    setSize: function (width, height) {
        this.right = this.left + width;
        this.bottom = this.top + height;
    },

    equals: function (rect) {
        return typeof rect != "undefined" && rect != null && this.left == rect.left && this.right == rect.right && this.top == rect.top && this.bottom == rect.bottom;
    },

    intersectRect: function (rc) {
        if ((this.left >= rc.left && this.left < rc.right) || (this.right >= rc.left && this.right < rc.right) || (rc.left >= this.left && rc.left < this.right) || (rc.right >= this.left && rc.right < this.right)) {
            if ((this.top >= rc.top && this.top < rc.bottom) || (this.bottom >= rc.top && this.bottom < rc.bottom) || (rc.top >= this.top && rc.top < this.bottom) || (rc.bottom >= this.top && rc.bottom < this.bottom)) {
                return true;
            }
        }
        return false;
    }
}
