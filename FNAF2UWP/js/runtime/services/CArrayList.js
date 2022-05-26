// CArrayList object
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

function CArrayList() {
    this.array = new Array();
}

CArrayList.prototype = {
    add: function (o) {
        this.array.push(o);
    },

    isEmpty: function () {
        return this.array.length == 0;
    },

    insert: function (index, o) {
        this.array.splice(index, 0, o);
    },

    get: function (index) {
        if (index < this.array.length) {
            return this.array[index];
        }
        return null;
    },

    put: function (index, o) {
        this.array[index] = o;
    },

    set: function (index, o) {
        if (index < this.array.length) {
            this.array[index] = o;
        }
    },

    removeIndex: function (index) {
        if (index < this.array.length) {
            this.array.splice(index, 1);
        }
    },

    indexOf: function (o) {
        return this.array.indexOf(o);
    },

    contains: function (o) {
        return this.array.indexOf(o) >= 0;
    },

    removeObject: function (o) {
        var n = this.array.indexOf(o);
        if (n >= 0) {
            this.array.splice(n, 1);
        }
    },

    size: function () {
        return this.array.length;
    },

    clear: function () {
        this.array.length = 0;
    },

    sort: function (callback) {
        Array.prototype.sort.call(this.array, callback);
    },
}
