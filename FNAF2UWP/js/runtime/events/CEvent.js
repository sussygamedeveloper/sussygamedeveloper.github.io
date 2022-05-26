// CEvent object
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

CEvent.EVFLAGS_REPEAT = 0x01;
CEvent.EVFLAGS_DONE = 0x02;
CEvent.EVFLAGS_DEFAULT = 0x04;
CEvent.EVFLAGS_DONEBEFOREFADEIN = 0x08;
CEvent.EVFLAGS_NOTDONEINSTART = 0x10;
CEvent.EVFLAGS_ALWAYS = 0x20;
CEvent.EVFLAGS_BAD = 0x40;
CEvent.EVFLAGS_BADOBJECT = 0x80;
CEvent.EVFLAGS_DEFAULTMASK = CEvent.EVFLAGS_ALWAYS + CEvent.EVFLAGS_REPEAT + CEvent.EVFLAGS_DEFAULT + CEvent.EVFLAGS_DONEBEFOREFADEIN + CEvent.EVFLAGS_NOTDONEINSTART;
CEvent.EVFLAG2_NOT = 0x01;

function CEvent() {
}
