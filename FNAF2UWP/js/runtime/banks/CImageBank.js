// CImageBank object
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

function CImageBank(a) {
    this.app = a;
    this.file = null;
    this.images = null;
    this.nHandlesReel = 0;
    this.nHandlesTotal = 0;
    this.nImages = 0;
    this.offsetsToImage = null;
    this.handleToIndex = null;
    this.useCount = null;
    this.rcInfo = null;
    this.hsInfo = null;
    this.apInfo = null;
    this.pIfo = null;

    this.mosaics = null;
    this.oldMosaics = null;
}

CImageBank.prototype = {
    preLoad: function (f) {
        this.file = f;

        this.nHandlesReel = this.file.readAShort();
        this.offsetsToImage = new Array(this.nHandlesReel);

        var nImg = this.file.readAShort();
        var n;
        var offset;
        var image = new CImage();
        for (n = 0; n < nImg; n++) {
            offset = this.file.getFilePointer();
            image.readHandle(this.file);
            this.offsetsToImage[image.handle] = offset;
        }

        this.useCount = new Array(this.nHandlesReel);
        var n;
        for (n = 0; n < this.nHandlesReel; n++) {
            this.useCount[n] = 0;
        }

        this.handleToIndex = null;
        this.nHandlesTotal = this.nHandlesReel;
        this.nImages = 0;
        this.images = null;
    },

    getImageFromHandle: function (handle) {
        if (handle >= 0 && handle < this.nHandlesTotal) {
            if (this.handleToIndex[handle] != -1) {
                return this.images[this.handleToIndex[handle]];
            }
        }
        return null;
    },

    getImageFromIndex: function (index) {
        if (index >= 0 && index < this.nImages) {
            return this.images[index];
        }
        return null;
    },

    setAllToLoad: function () {
        var n;
        for (n = 0; n < this.nHandlesReel; n++) {
            if (this.offsetsToImage[n]) {
                this.useCount[n] = 1;
            }
        }
    },

    resetToLoad: function () {
        if ((this.app.dwOptions & CRunApp.AH2OPT_LOADDATAATSTART) == 0 && (this.app.dwOptions & CRunApp.AH2OPT_KEEPRESOURCESBETWEENFRAMES) == 0) {
            var n;
            for (n = 0; n < this.nHandlesReel; n++) {
                this.useCount[n] = 0;
            }
        }
        this.oldMosaics = null;
    },

    setToLoad: function (handle) {
        this.useCount[handle]++;
    },

    enumerate: function (num) {
        this.setToLoad(num);
        return -1;
    },

    loadMosaic: function (handle) {
        if (this.mosaics[handle] == null) {
            if (this.oldMosaics != null && handle < this.oldMosaics.length && this.oldMosaics[handle] != null) {
                //there is an old mosaic we can just reuse (TODO: does this mean we kept a copy of mosaics somewhere?)
                this.mosaics[handle] = this.oldMosaics[handle];
            } else {
                //need to load a new mosaic
                this.mosaics[handle] = new CMosaic(this, handle);
                this.mosaics[handle].queueLoad()
            }
        }

        //return the mosaic so we can use it (Even if its not loaded yet)
        return this.mosaics[handle];
    },

    loadFrame: function (file) {
        //this gets called from CRunFrame.loadFullFrame() so this will get called at teh start of EVERY frame
        var n;

        // Reset mosaics
        if (this.app.mosaicMaxHandle > 0) {
            if (this.mosaics == null) {
                //load from scratch
                this.mosaics = new Array(this.app.mosaicMaxHandle);
                if ((this.app.dwOptions & CRunApp.AH2OPT_LOADDATAATSTART) != 0) {
                    for (n = 0; n < this.app.mosaicMaxHandle; n++) {
                        if (this.app.mosaics[n]) {
                            this.loadMosaic(n);
                        }
                    }
                }
            } else {
                //if we are loading frame resources per frame (eg not at start of app) we need to see if we can keep hold of mosaics that are used in this new frame
                if ((this.app.dwOptions & CRunApp.AH2OPT_LOADDATAATSTART) == 0) {
                    //create old mosaics array
                    this.oldMosaics = new Array(this.app.mosaicMaxHandle);

                    for (n = 0; n < this.app.mosaicMaxHandle; n++) {
                        this.oldMosaics[n] = this.mosaics[n];
                        this.mosaics[n] = null;
                    }
                }
            }
        }

        this.nImages = 0;
        for (n = 0; n < this.nHandlesReel; n++) {
            if (this.useCount[n] != 0) {
                this.nImages++;
            }
        }

        //get list of new images (these are mosaic items, such confusion variable names)
        var newImages = new Array(this.nImages);
        var count = 0;
        var h;
        for (h = 0; h < this.nHandlesReel; h++) {
            if (this.useCount[h] != 0) {
                //check if there is an existing image
                if (this.images != null && this.handleToIndex[h] != -1 && this.images[this.handleToIndex[h]] != null) {
                    //yup
                    newImages[count] = this.images[this.handleToIndex[h]];
                    newImages[count].useCount = this.useCount[h];

                    //can we reuse the mosaic too ?
                    if (this.mosaics != null && this.oldMosaics != null) {
                        var handle = newImages[count].mosaicId;
                        if (handle > 0) {
                            this.mosaics[handle] = this.oldMosaics[handle];
                        }
                    }
                } else {
                    //nope
                    if (this.offsetsToImage[h] != 0) {
                        newImages[count] = new CImage(this.app);
                        file.seek(this.offsetsToImage[h]);

                        newImages[count].queueLoad();
                        newImages[count].useCount = this.useCount[h];
                    }
                }
                count++;
            }
        }
        this.images = newImages;

        //reset handle to index lookup
        this.handleToIndex = new Array(this.nHandlesReel);
        for (n = 0; n < this.nHandlesReel; n++) {
            this.handleToIndex[n] = -1;
        }

        //save valid handle to index entries for this load
        this.nHandlesTotal = this.nHandlesReel;
        for (n = 0; n < this.nImages; n++) {
            if (this.images[n]) {
                this.handleToIndex[this.images[n].handle] = n;
            }
        }
    },

    delImage: function (handle) {
        var img = this.getImageFromHandle(handle);
        if (img != null) {
            img.useCount--;

            //check if its time to free this image
            if (img.useCount <= 0) {
                //remove all instances of this image
                for (var n = 0; n < this.nImages; n++) {
                    if (this.images[n] == img) {
                        this.images[n] = null;
                        this.handleToIndex[handle] = -1;
                        break;
                    }
                }

                //free the image if it was created at frame runtime
                if (!img.appData) {
                    img.free();
                }
            }
        }
    },

    addImage: function (image) {
        var h;

        // Seeking a free handle
        var hFound = -1;
        for (h = this.nHandlesReel; h < this.nHandlesTotal; h++) {
            if (this.handleToIndex[h] == -1) {
                hFound = h;
                break;
            }
        }

        // Add a handle
        if (hFound == -1) {
            this.handleToIndex.push(0);
            hFound = this.nHandlesTotal++;
        }

        // Seeking a free picture
        var i;
        var iFound = -1;
        for (i = 0; i < this.nImages; i++) {
            if (this.images[i] == null) {
                iFound = i;
                break;
            }
        }

        // Add an image?
        if (iFound == -1) {
            this.images.push(0);
            iFound = this.nImages++;
        }

        // Add new image
        this.handleToIndex[hFound] = iFound;
        this.images[iFound] = image;
        this.useCount[hFound] = 1;

        return hFound;
    },

    loadImageList: function (handles) {
        //queue a bunch of images to load
        var h;

        for (h = 0; h < handles.length; h++) {
            if (handles[h] >= 0 && handles[h] < this.nHandlesTotal && this.offsetsToImage[handles[h]] != 0 && this.getImageFromHandle(handles[h]) == null) {
                var i;
                var iFound = -1;

                for (i = 0; i < this.nImages; i++) {
                    if (this.images[i] == null) {
                        iFound = i;
                        break;
                    }
                }

                if (iFound == -1) {
                    var newImages = new Array(this.nImages + 10);
                    for (i = 0; i < this.nImages; i++) {
                        newImages[i] = this.images[i];
                    }

                    for (; i < this.nImages + 10; i++) {
                        newImages[i] = null;
                    }

                    iFound = this.nImages;
                    this.nImages += 10;
                    this.images = newImages;
                }

                this.handleToIndex[handles[h]] = iFound;

                this.images[iFound] = new CImage(this.app);
                this.images[iFound].useCount = 1;
                this.file.seek(this.offsetsToImage[handles[h]]);

                //when should we load
                this.images[iFound].queueLoad();
            }
        }
    },

    getImageInfoEx: function (nImage, nAngle, fScaleX, fScaleY) {
        var ptei;
        if (this.pIfo == null) {
            this.pIfo = new CImage();
        }

        ptei = this.getImageFromHandle(nImage);
        if (ptei != null) {
            var cx = ptei.width;
            var cy = ptei.height;
            var hsx = ptei.xSpot;
            var hsy = ptei.ySpot;
            var asx = ptei.xAP;
            var asy = ptei.yAP;

            if (nAngle == 0) {
                if (fScaleX != 1.0) {
                    hsx = hsx * fScaleX;
                    asx = asx * fScaleX;
                    cx = cx * fScaleX;
                }

                if (fScaleY != 1.0) {
                    hsy = hsy * fScaleY;
                    asy = asy * fScaleY;
                    cy = cy * fScaleY;
                }
            }
            else {
                if (fScaleX != 1.0) {
                    hsx = hsx * fScaleX;
                    asx = asx * fScaleX;
                    cx = cx * fScaleX;
                }

                if (fScaleY != 1.0) {
                    hsy = hsy * fScaleY;
                    asy = asy * fScaleY;
                    cy = cy * fScaleY;
                }

                if (this.rcInfo == null) {
                    this.rcInfo = new CRect();
                }
                if (this.hsInfo == null) {
                    this.hsInfo = new CPoint();
                }
                if (this.apInfo == null) {
                    this.apInfo = new CPoint();
                }
                this.hsInfo.x = hsx;
                this.hsInfo.y = hsy;
                this.apInfo.x = asx;
                this.apInfo.y = asy;
                this.rcInfo.left = this.rcInfo.top = 0;
                this.rcInfo.right = cx;
                this.rcInfo.bottom = cy;
                this.doRotateRect(this.rcInfo, this.hsInfo, this.apInfo, nAngle);
                cx = this.rcInfo.right;
                cy = this.rcInfo.bottom;
                hsx = this.hsInfo.x;
                hsy = this.hsInfo.y;
                asx = this.apInfo.x;
                asy = this.apInfo.y;
            }
            this.pIfo.width = cx;
            this.pIfo.height = cy;
            this.pIfo.xSpot = hsx;
            this.pIfo.ySpot = hsy;
            this.pIfo.xAP = asx;
            this.pIfo.yAP = asy;

            return this.pIfo;
        }
        return ptei;
    },

    doRotateRect: function (prc, pHotSpot, pActionPoint, fAngle) {
        var x, y;
        var cosa, sina;

        if (fAngle == 90.0) {
            cosa = 0.0;
            sina = 1.0;
        }
        else if (fAngle == 180.0) {
            cosa = -1.0;
            sina = 0.0;
        }
        else if (fAngle == 270.0) {
            cosa = 0.0;
            sina = -1.0;
        }
        else {
            var arad = fAngle * Math.PI / 180.0;
            cosa = Math.cos(arad);
            sina = Math.sin(arad);
        }

        var topLeftX;
        var topLeftY;

        var nhxcos;
        var nhxsin;
        var nhycos;
        var nhysin;
        if (pHotSpot == null) {
            nhxcos = nhxsin = nhycos = nhysin = 0.0;
            topLeftX = topLeftY = 0;
        }
        else {
            nhxcos = -pHotSpot.x * cosa;
            nhxsin = -pHotSpot.x * sina;
            nhycos = -pHotSpot.y * cosa;
            nhysin = -pHotSpot.y * sina;
            topLeftX = nhxcos + nhysin;
            topLeftY = nhycos - nhxsin;
        }

        var topRightX;
        var topRightY;

        if (pHotSpot == null) {
            x = prc.right;
        } else {
            x = prc.right - pHotSpot.x;
        }
        nhxcos = x * cosa;
        nhxsin = x * sina;
        topRightX = nhxcos + nhysin;
        topRightY = nhycos - nhxsin;

        var bottomRightX
        var bottomRightY;

        if (pHotSpot == null) {
            y = prc.bottom;
        } else {
            y = prc.bottom - pHotSpot.y;
        }
        nhycos = y * cosa;
        nhysin = y * sina;
        bottomRightX = nhxcos + nhysin;
        bottomRightY = nhycos - nhxsin;

        var bottomLeftX;
        var bottomLeftY;
        bottomLeftX = topLeftX + bottomRightX - topRightX;
        bottomLeftY = topLeftY + bottomRightY - topRightY;

        var xmin = Math.min(topLeftX, Math.min(topRightX, Math.min(bottomRightX, bottomLeftX)));
        var ymin = Math.min(topLeftY, Math.min(topRightY, Math.min(bottomRightY, bottomLeftY)));
        var xmax = Math.max(topLeftX, Math.max(topRightX, Math.max(bottomRightX, bottomLeftX)));
        var ymax = Math.max(topLeftY, Math.max(topRightY, Math.max(bottomRightY, bottomLeftY)));

        if (pActionPoint != null) {
            if (pHotSpot == null) {
                x = pActionPoint.x;
                y = pActionPoint.y;
            }
            else {
                x = pActionPoint.x - pHotSpot.x;
                y = pActionPoint.y - pHotSpot.y;
            }
            pActionPoint.x = (x * cosa + y * sina) - xmin;
            pActionPoint.y = (y * cosa - x * sina) - ymin;
        }

        if (pHotSpot != null) {
            pHotSpot.x = -xmin;
            pHotSpot.y = -ymin;
        }

        prc.right = xmax - xmin;
        prc.bottom = ymax - ymin;
    }
}
