// CEmbeddedFile object
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

function CEmbeddedFile(app) {
    this.app = app;
    this.path = "";
    this.length = 0;
    this.offset = 0;
    this.bytes = null;
    this.unicode = false;
}

CEmbeddedFile.prototype = {
    preLoad: function () {
        this.bytes = this.app.file.bytes;
        this.unicode = this.app.file.unicode;

        //read path
        var pathLength = this.app.file.readAShort();
        this.path = CServices.stripLeadingPath(this.app.file.readAString(pathLength), this.app.appEditorRootPath);

        //get size
        this.length = this.app.file.readAInt();
        this.offset = this.app.file.getFilePointer();

        //skip bytes in file (we will read them later)
        this.app.file.skipBytes(this.length);
    },

    open: function () {
        return this.app.file.createFromFile(this.offset, this.length)
    },
}
