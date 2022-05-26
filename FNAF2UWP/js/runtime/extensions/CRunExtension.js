// CRunExtension object
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

CRunExtension.REFLAG_DISPLAY = 1;
CRunExtension.REFLAG_ONESHOT = 2;

function CRunExtension() {
    CBoundingCache.call(this);

    this.ho = null;
    this.rh = null;
}

CRunExtension.prototype = {
    init: function (hoPtr) {
        this.ho = hoPtr;
        this.rh = hoPtr.hoAdRunHeader;
    },

    getNumberOfConditions: function () {
        return 0;
    },

    createRunObject: function (file, cob, version) {
        return false;
    },

    handleRunObject: function () {
        return CRunExtension.REFLAG_ONESHOT;
    },

    displayRunObject: function (context, xDraw, yDraw) {
    },

    destroyRunObject: function (bFast) {
    },

    createFont: function () {
    },

    pauseRunObject: function () {
    },

    continueRunObject: function () {
    },

    getZoneInfos: function () {
    },

    condition: function (num, cnd) {
        return false;
    },

    action: function (num, act) {
    },

    expression: function (num) {
        return null;
    },

    getRunObjectCollisionMask: function (flags) {
        return null;
    },

    getRunObjectFont: function () {
        return null;
    },

    setRunObjectFont: function (fi, rc) {
    },

    getRunObjectTextColor: function () {
        return 0;
    },

    setRunObjectTextColor: function (rgb) {
    },

    autoResize: function () {
    },

    forcePosition: function () {
    }
}

//setup inheritance using extend
CServices.extend(CBoundingCache, CRunExtension);