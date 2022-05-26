// CMoveDefList
//----------------------------------------------------------------------------------
/* Copyright (c) 1996-2016 Clickteam
 *
 * This source code is part of the HTML5 exporter for Clickteam Multimedia Fusion 2.
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

function CMoveDefList() {
    this.nMovements = 0;
    this.moveList = null;
}

CMoveDefList.prototype = {
    load: function (file) {
        var debut = file.getFilePointer();
        this.nMovements = file.readAInt();
        this.moveList = new Array(this.nMovements);
        var n;
        for (n = 0; n < this.nMovements; n++) {
            file.seek(debut + 4 + 16 * n);

            var moduleNameOffset = file.readAInt();
            var mvtID = file.readAInt();
            var dataOffset = file.readAInt();
            var dataLength = file.readAInt();

            file.seek(debut + dataOffset);
            var control = file.readAShort();
            var type = file.readAShort();
            var move = file.readAByte();
            var mo = file.readAByte();
            file.skipBytes(2);
            var dirAtStart = file.readAInt();
            switch (type) {
                case 0:
                    this.moveList[n] = new CMoveDefStatic();
                    break;
                case 1:
                    this.moveList[n] = new CMoveDefMouse();
                    break;
                case 2:
                    this.moveList[n] = new CMoveDefRace();
                    break;
                case 3:
                    this.moveList[n] = new CMoveDefGeneric();
                    break;
                case 4:
                    this.moveList[n] = new CMoveDefBall();
                    break;
                case 5:
                    this.moveList[n] = new CMoveDefPath();
                    break;
                case 9:
                    this.moveList[n] = new CMoveDefPlatform();
                    break;
                case 14:
                    this.moveList[n] = new CMoveDefExtension();
                    break;
            }
            this.moveList[n].setData(type, control, move, dirAtStart, mo);
            this.moveList[n].load(file, dataLength - 12);
            if (type == 14) {
                file.seek(debut + moduleNameOffset);
                var name = file.readAString();
                name = name.substring(0, name.length - 4);
                name = name.toLowerCase();
                this.moveList[n].setModuleName(name, mvtID);
            }
        }
    }
}
