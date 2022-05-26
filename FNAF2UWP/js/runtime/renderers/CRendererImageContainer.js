// CRendererImageContainer object
// ----------------------------------------------------------
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

/*
 This object can be used anywhere in the runtime that wishes to call renderer.renderImage or .renderSimpleImage.
 The job of the owner of this object, is to call .update() when it knows the source image has changed. This way
 the renderer can then decide if any textures/resources need updating.

 In HTML5 Canvas mode, we still use this, but is just a wrapper.

 This is currently used in Object.js Ctext and CCounter
 */
function CRendererImageContainer(renderer, source, width, height) {
    this.renderer = renderer;
    this.source = null;
    this.width = 0;
    this.height = 0;
}

CRendererImageContainer.prototype = {
    //api
    free: function () {
        //null some bits
        this.renderer = null;
    },

    update: function (source, width, height) {
    },

    draw: function (context, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam) {
    },

    drawSimple: function (context, x, y, inkEffect, inkEffectParam) {
    },

    drawRect: function (context, x, y, width,height, inkEffect, inkEffectParam) {
    },

    getImage: function() {
    },
}