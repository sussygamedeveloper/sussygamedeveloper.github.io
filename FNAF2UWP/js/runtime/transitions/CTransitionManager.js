// CTransitionManager object
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

function CTransitionManager(a) {
    this.app = a;
}

CTransitionManager.prototype = {
    startObjectTransition: function (hoPtr, out) {
        var app = this.app;
        var sourceImage = null;
        var sourceX = 0;
        var sourceY = 0;
        var sourceWidth, sourceHeight;

        //get transition data
        var pData;
        if (out) {
            pData = hoPtr.hoCommon.ocFadeOut;
        } else {
            pData = hoPtr.hoCommon.ocFadeIn;
        }

        //get the image in question
        if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_ANIMATIONS) != 0) {
            //active object style
            sourceImage = app.imageBank.getImageFromHandle(hoPtr.roc.rcImage);

            if (sourceImage.mosaicId == 0) {
                sourceWidth = sourceImage.width;
                sourceHeight = sourceImage.width;
            } else {
                sourceX = sourceImage.mosaicX;
                sourceY = sourceImage.mosaicY;
                sourceWidth = sourceImage.width;
                sourceHeight = sourceImage.height;
                sourceImage = this.app.imageBank.mosaics[sourceImage.mosaicId].image;
            }

        } else if (hoPtr.hoType >= 32) {
            //getSurface: is not currently implemented by anything so we dont do transition here (TODO: reimpliment if required)
            //if (!hoPtr.getSurface(...)) { }
        }

        //if no valid image was found then we can just skip this procedure
        if (sourceImage == null) {
            return null;
        }

        //create the final display buffer (that teh transition will update)
        var displayBuffer = app.createImageBuffer(sourceWidth, sourceHeight);

        //create buffers
        var buffer1 = app.createImageBuffer(sourceWidth, sourceHeight);
        var buffer2 = app.createImageBuffer(sourceWidth, sourceHeight);

        //render the buffers
        if (out) {
            //fade out
            buffer1.start();
            buffer1.drawSubImage(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
            buffer1.finish();

            buffer2.start();

            //are we transitioning to color?
            if ((pData.transFlags & CTransitionData.TRFLAG_COLOR) != 0) {
                //to color
                buffer2.clear(pData.transColor);
            } else {
                //to background (we will composit this over the top)
                buffer2.clear(0x000000);
            }
            buffer2.finish();


            // Source = image
            /*
             context = surface1.getContext("2d");
             context.drawImage(img, 0, 0);
             context = display.getContext("2d");
             context.drawImage(img, 0, 0);
             if ((pData.transFlags & CTransitionData.TRFLAG_COLOR) != 0) {
             this.copyColorMask(surface2, img, pData.transColor);
             }
             */
        } else {
            //fade in
            buffer1.start();
            buffer1.clear(0x000000);
            buffer1.finish();

            buffer2.start();
            buffer2.drawSubImage(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
            buffer2.finish();

            // Destination = image
            /*
             context = surface2.getContext("2d");
             context.drawImage(img, 0, 0);
             if ((pData.transFlags & CTransitionData.TRFLAG_COLOR) != 0) {
             this.copyColorMask(surface1, img, pData.transColor);
             }
             */
        }

        //prepare transition
        var transition = this.createTransition(pData, displayBuffer, buffer1, buffer2);

        if (transition != null) {
            var flags = 0;

            //todo: why is the fade in/out detection different from above?
            if ((hoPtr.hoFlags & CObject.HOF_FADEOUT) != 0) {
                flags |= CTrans.TRFLAG_FADEOUT;
            } else {
                flags |= CTrans.TRFLAG_FADEIN;
            }

            //assign transitionbuffer
            hoPtr.transitionBuffer = displayBuffer.use();

            //do first step of transition
            transition.update(flags);
        }

        //release handle on buffers
        displayBuffer.free();
        buffer1.free();
        buffer2.free();

        //return the transition
        return transition;
    },

    copyColorMask: function (dest, source, color) {
        //so this applies mask data onto the destination canvas

        //draw the source on the destination
        var context = dest.getContext("2d");
        context.drawImage(source, 0, 0);

        //get pixel data from the destination
        var width = source.width;
        var height = source.height;
        var pixels = context.getImageData(0, 0, width, height);


        var x, y, alpha;

        //get the mask rgb
        var color = color & 0x00FFFFFF;
        var r = (color & 0x00FF0000) >> 16;
        var g = (color & 0x0000FF00) >> 8;
        var b = color & 0x000000FF;

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                //for any pixel that is visible, we set the mask pixel as on
                if (pixels.data[(y * width + x) * 4 + 3] != 0) {
                    pixels.data[(y * width + x) * 4] = r;
                    pixels.data[(y * width + x) * 4 + 1] = g;
                    pixels.data[(y * width + x) * 4 + 2] = b;
                }
            }
        }

        context.putImageData(pixels, 0, 0);
    },

    createTransition: function (pData, display, surfaceStart, surfaceEnd) {
        var dllName = pData.dllName;
        var dll = null;

        // STARTCUT (yves: this is for possible future porting advnaced transitions)
        if (dllName.toLowerCase() == "cctrans") {
            dll = new CTransitionCCTrans();
        }
        // ENDCUT

        if (dll != null) {
            //create trans
            var trans = dll.getTrans(pData);

            //prepare stuff
            this.app.file.seek(pData.dataOffset);

            //init the trans
            trans.init(pData, this.app.file, display, surfaceStart, surfaceEnd);
            return trans;
        }
        return null;
    }
}
