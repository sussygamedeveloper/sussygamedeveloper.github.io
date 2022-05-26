// CEventGroup object
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

CEventGroup.EVGFLAGS_ONCE = 0x0001;
CEventGroup.EVGFLAGS_NOTALWAYS = 0x0002;
CEventGroup.EVGFLAGS_REPEAT = 0x0004;
CEventGroup.EVGFLAGS_NOMORE = 0x0008;
CEventGroup.EVGFLAGS_SHUFFLE = 0x0010;
CEventGroup.EVGFLAGS_UNDOMARK = 0x0040;
CEventGroup.EVGFLAGS_COMPLEXGROUP = 0x0080;
CEventGroup.EVGFLAGS_BREAKPOINT = 0x0100;
CEventGroup.EVGFLAGS_ALWAYSCLEAN = 0x0200;
CEventGroup.EVGFLAGS_ORINGROUP = 0x0400;
CEventGroup.EVGFLAGS_STOPINGROUP = 0x0800;
CEventGroup.EVGFLAGS_ORLOGICAL = 0x1000;
CEventGroup.EVGFLAGS_GROUPED = 0x2000;
CEventGroup.EVGFLAGS_INACTIVE = 0x4000;
CEventGroup.EVGFLAGS_NOGOOD = 0x8000;
CEventGroup.EVGFLAGS_LIMITED = CEventGroup.EVGFLAGS_SHUFFLE + CEventGroup.EVGFLAGS_NOTALWAYS + CEventGroup.EVGFLAGS_REPEAT + CEventGroup.EVGFLAGS_NOMORE;
CEventGroup.EVGFLAGS_DEFAULTMASK = CEventGroup.EVGFLAGS_BREAKPOINT + CEventGroup.EVGFLAGS_GROUPED;

function CEventGroup() {
    this.evgNCond = 0;
    this.evgNAct = 0;
    this.evgFlags = 0;
    this.evgInhibit = 0;
    this.evgInhibitCpt = 0;
    this.evgEvents = null;
}

CEventGroup.create = function (app) {
    var debut = app.file.getFilePointer();

    var size = app.file.readShort();
    var evg = new CEventGroup();
    evg.evgNCond = app.file.readAByte();
    evg.evgNAct = app.file.readAByte();
    evg.evgFlags = app.file.readAShort();
    app.file.skipBytes(2);
    evg.evgInhibit = app.file.readAInt();
    evg.evgInhibitCpt = app.file.readAInt();

    evg.evgEvents = new Array(evg.evgNCond + evg.evgNAct);
    var n;
    var count = 0;
    for (n = 0; n < evg.evgNCond; n++) {
        evg.evgEvents[count++] = CCnd.create(app);
    }
    for (n = 0; n < evg.evgNAct; n++) {
        evg.evgEvents[count++] = CAct.create(app);
    }
    app.file.seek(debut - size);
    return evg;
}
