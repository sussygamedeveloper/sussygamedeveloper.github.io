// CReplaceColor object
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

function CReplaceColor() {
    this.mode = 0;
    this.app = null;
    this.pImages = null;
}

CReplaceColor.prototype = {
    //internal
    _performReplacement: function (app, image, sourceColor, destColor) {
        //create canvas that we can work with
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        //draw the image onto the canvas
        var context = canvas.getContext("2d");
        if (image.mosaicId == 0) {
            context.drawImage(image.img, 0, 0);
        } else {
            context.drawImage(app.imageBank.mosaics[image.mosaicId].image.img, image.mosaicX, image.mosaicY, image.width, image.height, 0, 0, image.width, image.height);
        }

        //get the image data
        var imageData = context.getImageData(0, 0, image.width, image.height);

        //prepare color values
        var newR = (destColor >> 16) & 0xFF;
        var newG = (destColor >> 8) & 0xFF;
        var newB = destColor & 0xFF;
        var oldR = (sourceColor >> 16) & 0xFF;
        var oldG = (sourceColor >> 8) & 0xFF;
        var oldB = sourceColor & 0xFF;

        //scan image and replace colors that match
        var index, x, y;
        var data = imageData.data;
        var imageWidth = image.width;
        var imageHeight = image.height;

        for (y = 0; y < imageHeight; y++) {
            index = (y * imageWidth) * 4;
            for (x = 0; x < imageWidth; x++) {
                if (data[index] == oldR && data[index + 1] == oldG && data[index + 2] == oldB) {
                    data[index] = newR;
                    data[index + 1] = newG;
                    data[index + 2] = newB;
                }
                index += 4;
            }
        }

        //push the image data back to the canvas
        context.putImageData(imageData, 0, 0);

        //create new image with this data
        var newImage = new CImage(app);
        newImage.width = image.width;
        newImage.height = image.height;
        newImage.xSpot = image.xSpot;
        newImage.ySpot = image.ySpot;
        newImage.xAP = image.xAP;
        newImage.yAP = image.yAP;
        newImage.useCount = 0;
        newImage.img = canvas;
        newImage.maskNormal = image.maskNormal;
        newImage.maskPlatform = image.maskPlatform;
        newImage.maskRotation = image.maskRotation;

        //TODO: hack hack hack until we can fix this
        app.renderer.updateImage(newImage, canvas, true, image.width, image.height);

        return newImage;
    },

    //api
    replaceColor: function (rhPtr, pHo, newColor, oldColor) {
        this.app = rhPtr.rhApp;

        // Changement des couleurs
        var oi = pHo.hoOi;
        var poi = rhPtr.rhApp.OIList.getOIFromHandle(oi);
        if (poi == null) {
            return;
        }

        // Get image max
        this.dwMax = -1;
        this.mode = 0;
        poi.enumElements(this, null);

        // Rechercher le premier
        var pHoFirst = pHo;
        while ((pHoFirst.hoNumPrev & 0x80000000) == 0) {
            pHoFirst = rhPtr.rhObjectList[pHoFirst.hoNumPrev & 0x7FFFFFFF];
        }

        // Parcourir la liste
        do {
            if (pHoFirst.roc.rcImage != -1 && pHoFirst.roc.rcImage > this.dwMax) {
                this.dwMax = pHoFirst.roc.rcImage;
            }

            if (pHoFirst.roc.rcOldImage != -1 && pHoFirst.roc.rcOldImage > this.dwMax) {
                this.dwMax = pHoFirst.roc.rcOldImage;
            }

            // Le dernier?
            if ((pHoFirst.hoNumNext & 0x80000000) != 0) {
                break;
            }

            // Next OI
            pHoFirst = rhPtr.rhObjectList[pHoFirst.hoNumNext];

        } while (true);

        // Allocate memory
        this.pImages = new Array(this.dwMax + 1);
        var n;
        for (n = 0; n < this.dwMax + 1; n++) {
            this.pImages[n] = -1;
        }

        // List all images
        this.mode = 1;
        poi.enumElements(this, null);

        // Replace color in all images and create new images
        var i;
        var newImg;
        for (i = 0; i <= this.dwMax; i++) {
            if (this.pImages[i] == -1) {
                continue;
            }

            //get source image
            var sourceImg = rhPtr.rhApp.imageBank.getImageFromHandle(i);

            //do the color replace and get a new image
            var destImg = this._performReplacement(rhPtr.rhApp, sourceImg, oldColor, newColor);

            if (destImg != null) {
                // Create new image in the bank
                this.pImages[i] = rhPtr.rhApp.imageBank.addImage(destImg);
            }
        }

        // Replace images in objects mE
        pHoFirst = pHo;
        while ((pHoFirst.hoNumPrev & 0x80000000) == 0) {
            pHoFirst = rhPtr.rhObjectList[pHoFirst.hoNumPrev & 0x7FFFFFFF];
        }

        // Browse the list
        do {
            if (pHoFirst.roc.rcImage != -1 && this.pImages[pHoFirst.roc.rcImage] != -1) {
                pHoFirst.roc.rcImage = this.pImages[pHoFirst.roc.rcImage];
            }

            if (pHoFirst.roc.rcOldImage != -1 && this.pImages[pHoFirst.roc.rcOldImage] != -1) {
                pHoFirst.roc.rcOldImage = this.pImages[pHoFirst.roc.rcOldImage];
            }

            // The last?
            if ((pHoFirst.hoNumNext & 0x80000000) != 0) {
                break;
            }
            // Next OI
            pHoFirst = rhPtr.rhObjectList[pHoFirst.hoNumNext];

        } while (true);

        //remove old ones
        this.mode = 2;
        poi.enumElements(this, null);

        //replace old images by new ones
        this.mode = 3;
        poi.enumElements(this, null);

        // Mark OI to reload
        poi.oiLoadFlags |= COI.OILF_TORELOAD;
    },

    enumerate: function (num) {
        switch (this.mode) {
            case 0:
                if (num > this.dwMax) {
                    this.dwMax = num;
                }
                return -1;
            case 1:
                this.pImages[num] = 1;
                return -1;
            case 2:
                this.app.imageBank.delImage(num);
                return -1;
            case 3:
                var image = this.app.imageBank.getImageFromHandle(this.pImages[num]);
                image.useCount++;
                return this.pImages[num];
        }
        return -1;
    }
}
