//----------------------------------------------------------------------------------
//
// CRUNMVTCLICKTEAM-DRAGDROP
//
//----------------------------------------------------------------------------------
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
CRunMvtclickteam_dragdrop.FLAG_LIMITAREA = 1;
CRunMvtclickteam_dragdrop.FLAG_SNAPTO = 2;
CRunMvtclickteam_dragdrop.FLAG_DROPWHENLEAVE = 4;
CRunMvtclickteam_dragdrop.FLAG_FORCELIMITS = 8;

CRunMvtclickteam_dragdrop.SET_DragDrop_Method = 4145;
CRunMvtclickteam_dragdrop.SET_DragDrop_IsLimited = 4146;
CRunMvtclickteam_dragdrop.SET_DragDrop_DropOutsideArea = 4147;
CRunMvtclickteam_dragdrop.SET_DragDrop_ForceWithinLimits = 4148;
CRunMvtclickteam_dragdrop.SET_DragDrop_AreaX = 4149;
CRunMvtclickteam_dragdrop.SET_DragDrop_AreaY = 4150;
CRunMvtclickteam_dragdrop.SET_DragDrop_AreaW = 4151;
CRunMvtclickteam_dragdrop.SET_DragDrop_AreaH = 4152;
CRunMvtclickteam_dragdrop.SET_DragDrop_SnapToGrid = 4153;
CRunMvtclickteam_dragdrop.SET_DragDrop_GridX = 4154;
CRunMvtclickteam_dragdrop.SET_DragDrop_GridY = 4155;
CRunMvtclickteam_dragdrop.SET_DragDrop_GridW = 4156;
CRunMvtclickteam_dragdrop.SET_DragDrop_GridH = 4157;
CRunMvtclickteam_dragdrop.GET_DragDrop_AreaX = 4158;
CRunMvtclickteam_dragdrop.GET_DragDrop_AreaY = 4159;
CRunMvtclickteam_dragdrop.GET_DragDrop_AreaW = 4160;
CRunMvtclickteam_dragdrop.GET_DragDrop_AreaH = 4161;
CRunMvtclickteam_dragdrop.GET_DragDrop_GridX = 4162;
CRunMvtclickteam_dragdrop.GET_DragDrop_GridY = 4163;
CRunMvtclickteam_dragdrop.GET_DragDrop_GridW = 4164;
CRunMvtclickteam_dragdrop.GET_DragDrop_GridH = 4165;

function CRunMvtclickteam_dragdrop() {
    //call chain
    CRunMvtExtension.call(this);

    //call self
    this.ed_dragWithSelected = 0;
    this.ed_limitX = 0;
    this.ed_limitY = 0;
    this.ed_limitWidth = 0;
    this.ed_limitHeight = 0;
    this.ed_gridOriginX = 0;
    this.ed_gridOriginY = 0;
    this.ed_gridDx = 0;
    this.ed_gridDy = 0;
    this.ed_flags = 0;

    // DonnÃ©ez runtime
    this.dragWith = 0;

    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.keyDown = false;
    this.drag = false;

    // Variables for limited area dragging
    this.snapToGrid = false;
    this.limitedArea = false;
    this.dropWhenLeaveArea = false;
    this.forceWithinLimits = false;
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;

    this.gridOriginX = 0;
    this.gridOriginY = 0;
    this.gridSizeX = 0;
    this.gridSizeY = 0;
    this.x = 0;
    this.y = 0;

    this.lastX = 0;
    this.lastY = 0;

    this.bLeftLast = false;
    this.bRightLast = false;
    this.clickLoop = 0;
    this.clickLeft = false;
    this.clickRight = false;
}

CRunMvtclickteam_dragdrop.prototype = {
    initialize: function (file) {
        file.skipBytes(1);

        //Flags
        this.ed_flags = file.readAInt();
        this.ed_dragWithSelected = file.readAInt();
        this.ed_limitX = file.readAInt();
        this.ed_limitY = file.readAInt();
        this.ed_limitWidth = file.readAInt();
        this.ed_limitHeight = file.readAInt();
        this.ed_gridOriginX = file.readAInt();
        this.ed_gridOriginY = file.readAInt();
        this.ed_gridDx = file.readAInt();
        this.ed_gridDy = file.readAInt();

        //*** General variables
        this.dragWith = this.ed_dragWithSelected;
        this.drag = false;
        this.keyDown = false;
        this.snapToGrid = ((this.ed_flags & CRunMvtclickteam_dragdrop.FLAG_SNAPTO) != 0);
        this.limitedArea = ((this.ed_flags & CRunMvtclickteam_dragdrop.FLAG_LIMITAREA) != 0);
        this.dropWhenLeaveArea = ((this.ed_flags & CRunMvtclickteam_dragdrop.FLAG_DROPWHENLEAVE) != 0);
        this.forceWithinLimits = ((this.ed_flags & CRunMvtclickteam_dragdrop.FLAG_FORCELIMITS) != 0);

        // Limit area settings
        this.minX = this.ed_limitX;
        this.minY = this.ed_limitY;
        this.maxX = this.minX + this.ed_limitWidth;
        this.maxY = this.minY + this.ed_limitHeight;

        // Grid settings
        this.gridOriginX = this.ed_gridOriginX;
        this.gridOriginY = this.ed_gridOriginY;
        this.gridSizeX = this.ed_gridDx;
        this.gridSizeY = this.ed_gridDy;

        this.lastX = this.ho.hoX;
        this.lastY = this.ho.hoY;
    },

    handleMouseKeys: function () {
        var bLeft = this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_LBUTTON);
        if (bLeft != this.bLeftLast) {
            this.bLeftLast = bLeft;
            if (bLeft) {
                if (this.clickLoop != this.ho.hoAdRunHeader.rhLoopCount + 1) {
                    this.clickRight = false;
                }
                this.clickLoop = this.ho.hoAdRunHeader.rhLoopCount + 1;
                this.clickLeft = true;
            }
        }
        var bRight = this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_RBUTTON);
        if (bRight != this.bRightLast) {
            this.bRightLast = bRight;
            if (bRight) {
                if (this.clickLoop != this.ho.hoAdRunHeader.rhLoopCount + 1) {
                    this.clickLeft = false;
                }
                this.clickLoop = this.ho.hoAdRunHeader.rhLoopCount + 1;
                this.clickRight = true;
            }
        }
    },

    getObjectAtXY: function (xx, yy) {
        // Explore les sprites en collision
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var count = 0;
        var i;
        var pHox;
        var x1, y1, x2, y2;
        var currentHo = null;
        var currentIndex = -1;
        var index;

        for (i = 0; i < this.ho.hoAdRunHeader.rhNObjects; i++) {
            while (this.ho.hoAdRunHeader.rhObjectList[count] == null) {
                count++;
            }
            pHox = this.ho.hoAdRunHeader.rhObjectList[count];
            count++;

            x1 = pHox.hoX - pHox.hoImgXSpot;
            y1 = pHox.hoY - pHox.hoImgYSpot;
            x2 = x1 + pHox.hoImgWidth;
            y2 = y1 + pHox.hoImgHeight;
            if (xx >= x1 && xx < x2 && yy >= y1 && yy < y2) {
                if ((pHox.hoFlags & CObject.HOF_DESTROYED) == 0) {
                    var bOK = true;
                    if (pHox.hoType == COI.OBJ_SPR) {
                        if ((pHox.ros.rsFlags & CRSpr.RSFLAG_COLBOX) == 0) {
                            var image = this.ho.hoAdRunHeader.rhApp.imageBank.getImageFromHandle(pHox.roc.rcImage);
                            var mask = image.getMask(CMask.GCMF_OBSTACLE, 0, 1.0, 1.0);
                            if (mask.testPointEx(xx - pHox.hoX, yy - pHox.hoY, pHox.roc.rcAngle, pHox.roc.rcScaleX, pHox.roc.rcScaleY) == false) {
                                bOK = false;
                            }
                        }
                    }
                    if (bOK) {
                        if (pHox.ros != null) {
                            index = pHox.getZOrder();
                            if (index > currentIndex) {
                                currentIndex = index;
                                currentHo = pHox;
                            }
                        }
                    }
                }
            }
        }
        return currentHo;
    },

    isTopMostAOAtXY_Transparent: function (xx, yy) {
        var pRo;

        pRo = this.getObjectAtXY(xx, yy);
        if (pRo != null) {
            if (pRo == this.ho) {
                return true;
            }
        }
        return false;
    },

    move: function () {
        this.handleMouseKeys();
        this.handleDragAndDrop();

        // Handle the objects movement, if it needs to be moved.
        if (this.drag) {
            var dX = this.ho.hoAdRunHeader.getXMouse() - this.lastMouseX;
            var dY = this.ho.hoAdRunHeader.getYMouse() - this.lastMouseY;

            this.lastMouseX = this.ho.hoAdRunHeader.getXMouse();
            this.lastMouseY = this.ho.hoAdRunHeader.getYMouse();

            this.animations(CAnim.ANIMID_WALK);
            this.x += dX;
            this.y += dY;

            this.ho.hoX = this.x;
            this.ho.hoY = this.y;

            if (this.snapToGrid) {
                var topX = ((this.ho.hoX - this.ho.hoImgXSpot) - this.gridOriginX) % this.gridSizeX;
                var topY = ((this.ho.hoY - this.ho.hoImgYSpot) - this.gridOriginY) % this.gridSizeY;

                this.ho.hoX -= topX;
                this.ho.hoY -= topY;
            }

            this.checkLimitedArea();
            this.collisions();

            return true;
        }
        else {
            var hasChanged = false;
            if (this.forceWithinLimits) {
                var oldX = this.ho.hoX;
                var oldY = this.ho.hoY;
                this.checkLimitedArea();
                if ((oldX != this.ho.hoX) || (oldY != this.ho.hoY)) {
                    hasChanged = true;
                }
            }
            this.animations(CAnim.ANIMID_STOP);
            this.collisions();
            return hasChanged;
        }
    },

    handleDragAndDrop: function () {
        if (!this.drag) {
            // Check if dragging of object has started
            if (this.dragWith == 0) {
                // Left mouse button is down
                if (this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_LBUTTON)) {
                    if (this.keyDown == false) {
                        this.keyDown = true;

                        if (this.isTopMostAOAtXY_Transparent(this.ho.hoAdRunHeader.getXMouse(), this.ho.hoAdRunHeader.getYMouse())) {
                            this.startDragging();
                        }
                    }
                }
                else {
                    this.keyDown = false;
                }
            }
            else if (this.dragWith == 1) {
                // Right mouse button is down
                if (this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_RBUTTON)) {
                    if (this.keyDown == false) {
                        this.keyDown = true;

                        if (this.isTopMostAOAtXY_Transparent(this.ho.hoAdRunHeader.getXMouse(), this.ho.hoAdRunHeader.getYMouse())) {
                            this.startDragging();
                        }
                    }
                }
                else {
                    this.keyDown = false;
                }
            }
            else if (this.dragWith == 2) {
                // Left mouse button clicked or currently down
                if (this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_LBUTTON)) {
                    if (this.keyDown == false) {
                        this.keyDown = true;
                    }
                }
                else {
                    if (this.keyDown == true) {
                        if (this.isTopMostAOAtXY_Transparent(this.ho.hoAdRunHeader.getXMouse(), this.ho.hoAdRunHeader.getYMouse())) {
                            this.startDragging();
                        }
                    }

                    this.keyDown = false;
                }
            }

            else if (this.dragWith == 3) {
                // Right mouse button clicked or currently down
                if (((this.clickLoop == this.ho.hoAdRunHeader.rhLoopCount) && this.clickRight) || (this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_RBUTTON))) {
                    if (this.keyDown == false) {
                        this.keyDown = true;
                    }
                }
                else {
                    if (this.keyDown == true) {
                        if (this.isTopMostAOAtXY_Transparent(this.ho.hoAdRunHeader.getXMouse(), this.ho.hoAdRunHeader.getYMouse())) {
                            this.startDragging();
                        }
                    }

                    this.keyDown = false;
                }
            }
        } else {
            // Check if dragging of object has ended.
            if (this.dragWith == 0) {
                // Left mouse button released
                if (this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_LBUTTON) == false) {
                    this.stop(true);
                }
            }
            else if (this.dragWith == 1) {
                // Right mouse button released
                if (this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_RBUTTON) == false) {
                    this.stop(true);
                }
            }
            else if (this.dragWith == 2) {
                // Left mouse button clicked or currently down
                if (((this.clickLoop == this.ho.hoAdRunHeader.rhLoopCount) && this.clickLeft) || (this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_LBUTTON))) {
                    this.keyDown = true;
                }
                else {
                    if (this.keyDown) {
                        this.stop(true);
                    }
                }
            }
            else if (this.dragWith == 3) {
                // Right mouse button clicked or currently down
                if (((this.clickLoop == this.ho.hoAdRunHeader.rhLoopCount) && this.clickRight) || (this.ho.hoAdRunHeader.rhApp.getKeyState(CRunApp.VK_RBUTTON))) {
                    this.keyDown = true;
                }
                else {
                    if (this.keyDown) {
                        this.stop(true);
                    }
                }
            }
        }
    },

    startDragging: function () {
        this.lastMouseX = this.ho.hoAdRunHeader.getXMouse();
        this.lastMouseY = this.ho.hoAdRunHeader.getYMouse();

        this.lastX = this.ho.hoX;
        this.lastY = this.ho.hoY;

        this.x = this.ho.hoX;
        this.y = this.ho.hoY;

        this.drag = true;

        this.ho.roc.rcSpeed = 50;
    },

    checkLimitedArea: function () {
        if (this.limitedArea) {
            // Check this.x-coordinates
            if (this.ho.hoX < this.minX) {
                this.ho.hoX = this.minX;
                if (this.dropWhenLeaveArea) {
                    this.drag = false;
                }
            }
            else if (this.ho.hoX > this.maxX) {
                this.ho.hoX = this.maxX;
                if (this.dropWhenLeaveArea) {
                    this.drag = false;
                }
            }

            // Check this.y-coordinates
            if (this.ho.hoY < this.minY) {
                this.ho.hoY = this.minY;
                if (this.dropWhenLeaveArea) {
                    this.drag = false;
                }
            }
            else if (this.ho.hoY > this.maxY) {
                this.ho.hoY = this.maxY;
                if (this.dropWhenLeaveArea) {
                    this.drag = false;
                }
            }
        }
    },

    setPosition: function (xx, yy) {
        this.ho.hoX = xx;
        this.ho.hoY = yy;
    },

    setXPosition: function (xx) {
        this.ho.hoX = xx;
    },

    setYPosition: function (yy) {
        this.ho.hoY = yy;
    },

    stop: function (bCurrent) {
        this.drag = false;
        this.keyDown = false;

        this.ho.roc.rcSpeed = 0;
    },

    start: function () {
        this.startDragging();
    },

    bounce: function (bCurrent) {
        if (this.drag) {
            this.setPosition(this.lastX, this.lastY);
            this.stop(true);
        }
    },

    actionEntry: function (action) {
        var param;
        switch (action) {
            case CRunMvtclickteam_dragdrop.SET_DragDrop_Method: {
                param = this.getParamDouble();
                // Methods 0-4 supported
                if ((param >= 0) && (param < 5)) {
                    this.dragWith = param;
                }
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_IsLimited: {
                param = this.getParamDouble();
                this.limitedArea = param != 0;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_DropOutsideArea: {
                param = this.getParamDouble();
                this.dropWhenLeaveArea = param != 0;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_ForceWithinLimits: {
                param = this.getParamDouble();
                this.forceWithinLimits = param != 0;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_AreaX: {
                param = this.getParamDouble();
                this.minX = param;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_AreaY: {
                param = this.getParamDouble();
                this.minY = param;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_AreaW: {
                param = this.getParamDouble();
                this.maxX = this.minX + param;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_AreaH: {
                param = this.getParamDouble();
                this.maxY = this.minY + param;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_SnapToGrid: {
                param = this.getParamDouble();
                this.snapToGrid = param != 0;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_GridX: {
                param = this.getParamDouble();
                this.gridOriginX = param;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_GridY: {
                param = this.getParamDouble();
                this.gridOriginY = param;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_GridW: {
                param = this.getParamDouble();
                this.gridSizeX = param;
            }
                break;

            case CRunMvtclickteam_dragdrop.SET_DragDrop_GridH: {
                param = this.getParamDouble();
                this.gridSizeY = param;
            }
                break;

            case CRunMvtclickteam_dragdrop.GET_DragDrop_AreaX: {
                return this.minX;
            }

            case CRunMvtclickteam_dragdrop.GET_DragDrop_AreaY: {
                return this.minY;
            }

            case CRunMvtclickteam_dragdrop.GET_DragDrop_AreaW: {
                return this.maxX - this.minX;
            }

            case CRunMvtclickteam_dragdrop.GET_DragDrop_AreaH: {
                return this.maxY - this.minY;
            }

            case CRunMvtclickteam_dragdrop.GET_DragDrop_GridX: {
                return this.gridOriginX;
            }

            case CRunMvtclickteam_dragdrop.GET_DragDrop_GridY: {
                return this.gridOriginY;
            }

            case CRunMvtclickteam_dragdrop.GET_DragDrop_GridW: {
                return this.gridSizeX;
            }

            case CRunMvtclickteam_dragdrop.GET_DragDrop_GridH: {
                return this.gridSizeY;
            }
        }
        return 0;
    },

    getSpeed: function () {
        return this.ho.roc.rcSpeed;
    },

    getAcceleration: function () {
        return 100;
    },

    getDeceleration: function () {
        return 100;
    }
};

//setup inheritance using extend
CServices.extend(CRunMvtExtension, CRunMvtclickteam_dragdrop);