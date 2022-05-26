// CCreateObjectInfo Object
// -----------------------------------------------------------------------
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

CCreateObjectInfo.COF_HIDDEN = 0x0002;

CCreateObjectInfo.pool = new Array();
CCreateObjectInfo.getFromPool = function () {
    //need to create new one?
    if (CCreateObjectInfo.pool.length == 0) {
        return new CCreateObjectInfo();
    }

    //get one from pool
    return CCreateObjectInfo.pool.pop();
};

function CCreateObjectInfo() {
    this.reset();
}

CCreateObjectInfo.prototype = {
    reset: function () {
        this.cobLevObj = null;
        this.cobLevObjSeg = 0;
        this.cobFlags = 0;
        this.cobX = 0;
        this.cobY = 0;
        this.cobDir = 0;
        this.cobLayer = 0;
        this.cobZOrder = 0;
    },

    free: function () {
        //add to pool
        this.reset();
        CCreateObjectInfo.pool.push(this);
    },
};
