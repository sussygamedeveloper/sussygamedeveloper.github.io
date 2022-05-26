// CDefRtf object
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

function CDefRtf() {
    this.odDWSize = 0;
    this.odVersion = 0;
    this.odOptions = 0;
    this.odBackColor = 0;
    this.odCx = 0;
    this.odCy = 0;
    this.text = null;
}

CDefRtf.prototype = {
    load: function (file) {
        this.odDWSize = file.readAInt();
        this.odVersion = file.readAInt();
        this.odOptions = file.readAInt();
        this.odBackColor = file.readAColor();
        this.odCx = file.readAInt();
        this.odCy = file.readAInt();

        file.skipBytes(4);
        var size = file.readAInt();
        this.text = file.readAString(size);
    },

    enumElements: function (enumImages, enumFonts) {
    }
}
