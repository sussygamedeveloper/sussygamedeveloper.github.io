// PARAM_SHOOT object
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

function PARAM_SHOOT(app) {
    //call chain
    CPosition.call(this, app);

    //call self
    this.posOINUMParent = app.file.readShort();
    this.posFlags = app.file.readShort();
    this.posX = app.file.readShort();
    this.posY = app.file.readShort();
    this.posSlope = app.file.readShort();
    this.posAngle = app.file.readShort();
    this.posDir = app.file.readAInt();
    this.posTypeParent = app.file.readShort();
    this.posOiList = app.file.readShort();
    this.posLayer = app.file.readShort();
    this.cdpHFII = app.file.readShort();
    this.cdpOi = app.file.readShort();
    app.file.skipBytes(4);        //cdpFree
    this.shtSpeed = app.file.readAShort();
}

PARAM_SHOOT.prototype = {};

//setup inheritance using extend
CServices.extend(CPosition, PARAM_SHOOT);