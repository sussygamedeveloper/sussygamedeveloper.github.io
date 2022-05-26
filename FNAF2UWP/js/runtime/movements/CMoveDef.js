// CMoveDef
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

CMoveDef.MVTYPE_STATIC = 0;
CMoveDef.MVTYPE_MOUSE = 1;
CMoveDef.MVTYPE_RACE = 2;
CMoveDef.MVTYPE_GENERIC = 3;
CMoveDef.MVTYPE_BALL = 4;
CMoveDef.MVTYPE_TAPED = 5;
CMoveDef.MVTYPE_PLATFORM = 9;
CMoveDef.MVTYPE_DISAPPEAR = 11;
CMoveDef.MVTYPE_APPEAR = 12;
CMoveDef.MVTYPE_BULLET = 13;
CMoveDef.MVTYPE_EXT = 14;

function CMoveDef() {
    this.mvType = 100;
    this.mvControl = 0;
    this.mvMoveAtStart = 0;
    this.mvDirAtStart = 0;
    this.mvOpt = 0;
}

CMoveDef.prototype = {
    setData: function (t, c, m, d, mo) {
        this.mvType = t;
        this.mvControl = c;
        this.mvMoveAtStart = m;
        this.mvDirAtStart = d;
        this.mvOpt = mo;
    }
}
