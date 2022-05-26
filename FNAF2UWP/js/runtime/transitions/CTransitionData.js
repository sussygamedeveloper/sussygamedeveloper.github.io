// CTransitionData object
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

CTransitionData.TRFLAG_COLOR = 0x0001;

function CTransitionData() {
    this.dllName = "";
    this.transID = 0;
    this.transDuration = 0;
    this.transFlags = 0;
    this.transColor = 0;
    this.dataOffset = 0;
}

CTransitionData.prototype = {
    load: function (file) {
        var debut = file.getFilePointer();

        file.skipBytes(4);
        this.transID = file.readAInt();
        this.transDuration = file.readAInt();
        this.transFlags = file.readAInt();
        this.transColor = file.readAColor();

        var nameOffset = file.readAInt();
        var paramOffset = file.readAInt();
        file.seek(debut + nameOffset);
        this.dllName = file.readAString();
        this.dllName = this.dllName.substr(0, this.dllName.indexOf('.'));
        this.dataOffset = (debut + paramOffset);
    }
}
