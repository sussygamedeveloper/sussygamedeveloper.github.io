// COCBackground object
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

function COCBackground() {
    this.ocImage = 0;
}

COCBackground.prototype = {
    load: function (file, type) {
        file.skipBytes(4);        // ocDWSize
        this.ocObstacleType = file.readAShort();
        this.ocColMode = file.readAShort();
        this.ocCx = file.readAInt();
        this.ocCy = file.readAInt();
        this.ocImage = file.readAShort();
    },

    enumElements: function (enumImages, enumFonts) {
        if (enumImages != null) {
            var num = enumImages.enumerate(this.ocImage);
            if (num != -1) {
                this.ocImage = num;
            }
        }
    }
}
