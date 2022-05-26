//ACT_GOLEVEL Object
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

function ACT_GOLEVEL() {
}
ACT_GOLEVEL.prototype = {
    execute: function (rhPtr) {
        var level;
        if (this.evtParams[0].code == 26) {
            level = this.evtParams[0].value;
            if (rhPtr.rhApp.HCellToNCell(level) == -1) {
                return;
            }
        }
        else {
            level = rhPtr.get_EventExpressionInt(this.evtParams[0]) - 1;
            if (level < 0 || level >= 4096) {
                return;
            }
            if (rhPtr.rhApp.bShiftFrameNumber) {
                level++;
            }
            level |= 0x8000;
        }
        rhPtr.rhQuit = CRun.LOOPEXIT_GOTOLEVEL;
        rhPtr.rhQuitParam = level;
        rhPtr.rhApp.subAppStopped = true;
    }
}
