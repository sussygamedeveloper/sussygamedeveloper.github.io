// CWebGLRendererImageBuffer object
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

function CWebGLRendererImageBuffer(renderer, width, height, renderTarget) {
    //call chain
    CRendererImageBuffer.call(this, renderer, width, height, renderTarget);

    //call self
    this.frameBuffer = null;
    this.image = null;
    this.texture = null;

}

CWebGLRendererImageBuffer.prototype = {
    //events
    onFree: function () {
        if (this.image) {
            this.image.free();
            this.image = null;
            this.texture = null;
        }

    },

    onPrepareTexture: function () {
        var renderer = this.renderer;
        var gl = renderer._context;

        //delete old data?
        if (this.image) {
            this.image.free();
            this.image = null;
            this.texture = null;
        }

        //create new
        if (this.image == null) {
            //create fake CImage object
            var image = new CImage();
            image.textureFlip = true; //make sure its flipped so tex coords get flipped!
            this.image = image;

            //setup some non default details
            image.width = this.width;
            image.height = this.height;

            //let teh renderer update the image. The texture will be bound after this call so we dont need to bind it now!
            this.renderer.updateImage(image, null, this.renderTarget);//3rd param is enforcing the texture is created

            //extract any bits we need from image
            this.texture = image.texture;
        }
    },

    onStart: function () {
        var renderer = this.renderer;
        var gl = renderer._context;

        renderer.pushMatrix();

        //reset clipping
        renderer.pushClip();
        renderer.setClip(0, 0, this.width, this.height, false);

        if (renderer.isClipVisible()) {
            //create texture?
            if (this.texture == null) {
                //create new texture
                this.onPrepareTexture();
            } else {
                //just bind it
                renderer.bindTexture(this.texture);
            }

            //create frame buffer? (we dont need to do this if the buffer is not set to renderTarget)
            if (this.renderTarget) {
                if (this.frameBuffer == null) {
                    this.frameBuffer = gl.createFramebuffer();
                }

                //bind frame buffer and texture
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);

                //force projection matrix to be flipped (TODO: remove this?)
                //renderer.setProjectionMatrix(0, renderer.canvasWidth, renderer.canvasHeight, 0);
            }
        }
    },

    onFinish: function () {
        var renderer = this.renderer;
        var gl = renderer._context;

        if (renderer.isClipVisible()) {
            //unbind texture from renderer
            renderer.bindTexture(null);

            //unbind the frame buffer
            if (this.renderTarget) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
        }

        renderer.popClip();
        renderer.popMatrix();
    },

    //api
    getImage: function () {
        return this.image;
    },

    getData: function () {
        //get pixel data from the buffer
        var renderer = this.renderer;
        var gl = renderer._context;

        //read pixel data
        this.start();
        var data = new Uint8Array(this.width * this.height * 4);
        gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
        this.finish();

        //done
        return data;
    },

    captureGameCanvas: function (sourceX, sourceY, sourceWidth, sourceHeight) {
        //copy a part of the current framebuffer to the image buffer


        var renderer = this.renderer;
        var gl = renderer._context;

        //need to flip the sourceY
        sourceY = renderer.canvasHeight - sourceHeight - sourceY;

        //copy from framebuffer into texture
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGB, sourceX, sourceY, sourceWidth, sourceHeight, 0);
    },

    //debug api

};

//setup inheritance using extend
CServices.extend(CRendererImageBuffer, CWebGLRendererImageBuffer);