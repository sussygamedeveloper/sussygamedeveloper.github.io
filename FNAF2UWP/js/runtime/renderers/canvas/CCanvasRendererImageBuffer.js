// CCanvasRendererImageBuffer object
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

function CCanvasRendererImageBuffer(renderer, width, height, renderTarget) {
    //call chain
    CRendererImageBuffer.call(this, renderer, width, height, renderTarget);

    //call self
    this.canvas = null;


}

CCanvasRendererImageBuffer.prototype = {
    //events
    onFree: function () {
        this.canvas = null;

    },

    onStart: function () {
        //create rendering resources if they have not been created
        this.onPrepareTexture();
    },

    onFinish: function () {
        //dont need to do anything
    },

    onPrepareTexture: function () {
        if (this.canvas == null) {
            //create canvas
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';

            //create renderer
            this.renderer = new CCanvasRenderer(this.canvas);
            this.renderer.resize(this.width, this.height);
        }
    },

    //api
    getImage: function () {
        //return drawable
        return this.canvas;
    },

    getData: function () {
        this.start();
        var data = this.renderer._context.getImageData(0, 0, this.width, this.height);
        this.finish();
        return data;
    },

    captureGameCanvas: function (sourceX, sourceY, sourceWidth, sourceHeight) {

        //quick and dirty dump of the canvas
        this.renderer._context.drawImage(Runtime.application.renderer.canvas, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
    },

};

//setup inheritance using extend
CServices.extend(CRendererImageBuffer, CCanvasRendererImageBuffer);