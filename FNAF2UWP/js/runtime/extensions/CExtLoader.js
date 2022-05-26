// CExtLoader object
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

CExtLoader.KPX_BASE = 32;

function CExtLoader(a) {
    this.app = a;
    this.extensions = null;
    this.numOfConditions = 0;
}

CExtLoader.prototype = {
    createList: function (file) {
        //pass to the compile time stuff
        CCompiledExtensions.createList.call(this);
    },

    addExt: function (e) {
        var ext = e.loadRunObject();
        if (ext != null) {
            this.extensions[e.handle] = e;
            this.numOfConditions[e.handle] = ext.getNumberOfConditions();
        }
    },

    loadRunObject: function (type) {
        type -= CExtLoader.KPX_BASE;
        var ext = null;
        if (type < this.extensions.length && this.extensions[type] != null) {
            ext = this.extensions[type].loadRunObject();
        }
        return ext;
    },

    getNumberOfConditions: function (type) {
        type -= CExtLoader.KPX_BASE;
        if (type < this.extensions.length) {
            return this.numOfConditions[type];
        }
        return 0;
    }
};
