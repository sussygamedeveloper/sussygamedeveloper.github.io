// PARAM_GROUP object
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

PARAM_GROUP.GRPFLAGS_INACTIVE = 0x0001;
PARAM_GROUP.GRPFLAGS_CLOSED = 0x0002;
PARAM_GROUP.GRPFLAGS_PARENTINACTIVE = 0x0004;
PARAM_GROUP.GRPFLAGS_GROUPINACTIVE = 0x0008;
PARAM_GROUP.GRPFLAGS_GLOBAL = 0x0010;

function PARAM_GROUP(app) {
    this.grpFlags = app.file.readAShort();
    this.grpId = app.file.readAShort();
}
