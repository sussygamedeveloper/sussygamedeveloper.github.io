// CLO Object
// -------------------------------------------------------------------
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

CLO.PARENT_NONE = 0;
CLO.PARENT_FRAME = 1;
CLO.PARENT_FRAMEITEM = 2;
CLO.PARENT_QUALIFIER = 3;

function CLO() {
    this.loHandle = 0;
    this.loOiHandle = 0;
    this.loX = 0;
    this.loY = 0;
    this.loParentType = 0;
    this.loOiParentHandle = 0;
    this.loLayer = 0;
    this.loType = 0;
    this.loInstances = null;

    this.loInstances = new Array(4);
    var i;
    for (i = 0; i < 4; i++) {
        this.loInstances[i] = null;
    }
}

CLO.prototype = {
    load: function (file) {
        this.loHandle = file.readAShort();
        this.loOiHandle = file.readAShort();
        this.loX = file.readAInt();
        this.loY = file.readAInt();
        this.loParentType = file.readAShort();
        this.loOiParentHandle = file.readAShort();
        this.loLayer = file.readAShort();
        file.skipBytes(2);
    },

    addInstance: function (num, bi) {
        this.loInstances[num] = bi;
    }
}
