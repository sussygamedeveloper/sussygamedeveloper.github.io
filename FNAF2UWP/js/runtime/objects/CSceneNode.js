// SceneNode object
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

//functions
CSceneNode._sortChildrenByZOrder = function (a, b) {
    return a.zOrder - b.zOrder;
};

//class
function CSceneNode() {
    //call chain
    CBoundingCache.call(this);

    //call self


    this.x = 0;
    this.y = 0;
    this.xDest = 0;
    this.yDest = 0;
    this.xSpot = 0;
    this.ySpot = 0;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.angle = 0.0;
    this.visible = true;

    this.clip = false;
    this.sortable = false;
    this.lockCount = 0;
    this.dirtySort = false;
    this.zOrder = null;
    this.parent = null;
    this.parentIndex = -1;

    this.children = null;
    this.childrenTotal = 0;
    this.childrenSortList = null;
    this.childrenZOrderHigh = 0;
    this.childrenZOrderLow = 0;
}

//methods
CSceneNode.prototype = {
    //events
    onSort: function () {

        //turn off dirty sort flag
        this.dirtySort = false;

        //so do we have speciffic children that need sorting
        if (this.childrenSortList == null || this.childrenSortList.length == 0) {
            //perform sort on the entire children array
            this.children.sort(CSceneNode._sortChildrenByZOrder);

        } else {
            //perform sort on only the children that need sorting

            //TODO: add code to improve this!, for now we just sort the entire array
            this.children.sort(CSceneNode._sortChildrenByZOrder);

            this.childrenSortList.length = 0;
        }

        //make sure children are neat
        this._compactChildren();
    },

    //internal
    _compactChildren: function () {
        var child;

        //fix child parent indexes
        for (var index = 0; index < this.children.length; index++) {
            child = this.children[index];

            child.parentIndex = index;
        }
    },

    //api
    lock: function () {
        this.lockCount++;
    },

    unlock: function () {
        if (this.lockCount == 1) {
            //unlock time
            this.lockCount -= 1;

            //perform actions
            if (this.dirtySort) {
                this.onSort();
            }

        } else if (this.lockCount > 1) {
            this.lockCount--;
        }
    },

    lockParent: function () {
        //shortcut for locking parent via child
        if (this.parent != null) {
            this.parent.lock();
        }
    },

    unlockParent: function () {
        //shortcut for unlocking parent via child
        if (this.parent != null) {
            this.parent.unlock();
        }
    },

    sort: function (child) {
        //skip?
        if (!this.sortable) {
            return;
        }

        //add the child to the sort list (if there is one)
        if (child != null) {
            var childInList = false;

            //make sure sort child list exists
            if (this.childrenSortList == null) {
                this.childrenSortList = new Array();
            } else {
                //check to see if its already in the list
                childInList = this.childrenSortList.indexOf(child) != -1;
            }

            //add it
            if (!childInList) {
                this.childrenSortList.push(child);
            }
        }

        //sort now or later?
        if (this.lockCount == 0) {
            //now
            this.onSort();
        } else {
            //later
            this.dirtySort = true;
        }
    },

    draw: function (context, xx, yy) {
        //we are rendering only children so this is group/layer and nothing else! we can manipulate the matrix fairly cost free!

        //only bother if it is visible! the old code made sprites ALWAYS visible even at 0.0 scale.. so just avoid drawing 0.0 scale sprites (more effecient)
        if (this.visible && this.scaleX != 0.0 && this.scaleY != 0.0) {
            //move matrix so 0,0 is THIS sprite this is preparing the render fo all child renders!
            if (this.x != 0.0 || this.y != 0.0) {
                context.translateMatrix(this.x, this.y);
            }

            //destination (from screen zoom)
            if (this.zoom && this.xDest != 0.0 && this.yDest != 0.0) {
                context.translateMatrix(this.xDest, this.yDest);
            }

            //angle (from screen zoom)
            if (this.angle != 0.0) {
                context.rotateMatrix(-this.angle * ToRadians);
            }

            //scale (from screen zoom or from subApp scaling)
            if (this.scaleX != 1.0 || this.scaleY != 1.0) {
                context.scaleMatrix(this.scaleX, this.scaleY);
            }

            //spot (from screen zoom)
            if (this.zoom && this.xSpot != 0.0 && this.xSpot != 0.0) {
                context.translateMatrix(-this.xSpot, -this.ySpot);
            }

            //render children
            if (this.childrenTotal > 0) {
                for (var n = 0; n < this.children.length; n++) {
                    context.pushMatrix();
                    this.children[n].draw(context, 0, 0);
                    context.popMatrix();
                }
            }
        }
    },

    addChild: function (child) {
        //remove child from existing parent
        if (child.parent != null && child.parent != this) {
            child.removeFromParent();
        }

        //make sure children array exists
        if (this.children == null) {
            this.children = new Array();
        }

        //add a new child to the end (top of visually)
        this.children.push(child);

        //increase child count
        this.childrenTotal++;

        //remember to store parent in child
        child.parent = this;
        child.parentIndex = this.childrenTotal - 1;

        //set initial zorder if the child has no zorder
        if (child.zOrder === null) {
            child.zOrder = this.getHighChildZOrder();
        }

        //update max zOrder
        this.childrenZOrderHigh = Math.max(this.childrenZOrderHigh, child.zOrder);

        //call to sort
        this.sort(child);
    },

    insertChild: function (child, index) {
        //remove from existing parent
        if (child.parent != this) {
            child.removeFromParent();
        }

        //make sure array exists
        if (this.children == null) {
            this.children = new Array();
        }

        //fix index
        if (index < 0) {
            index = 0;
        }

        //can we add this at the end?
        if (index >= this.children.length) {
            //can just add it to the end
            this.children.push(child);
        } else {
            //need to insert it

            //add to children array
            this.children.splice(index, 0, child);

            //update children after
            for (var updateIndex = index + 1; updateIndex < this.childrenTotal; updateIndex++) {
                this.children[updateIndex].parentIndex++;
            }
        }

        //remember to store parent in child
        child.parent = this;
        child.parentIndex = index;

        //increase child count
        this.childrenTotal++;
    },

    clearChildren: function () {
        if (this.children == null) {
            return;
        }

        //remove links to parents
        var child;
        for (var index = 0; index < this.children.length; index++) {
            child = this.children[index];
            child.parent = null;
            child.parentIndex = -1;
        }

        //clear the child array
        this.children.length = 0;
        this.childrenTotal = 0;
        this.dirtySort = false;
    },

    removeChild: function (child) {
        //remove a child sprite
        if (this.children == null) {
            return;
        }

        //find the child index
        var index = this.children.indexOf(child);

        //remove teh child
        if (index > -1) {
            //update all parentIndexes of all children after this
            for (var updateIndex = index + 1; updateIndex < this.childrenTotal; updateIndex++) {
                this.children[updateIndex].parentIndex--;
            }

            //remove from teh array
            this.children.splice(index, 1);

            //unlink parent
            child.parent = null;
            child.parentIndex = -1;

            //decrease count
            this.childrenTotal--;

            //disable flagged sort if no more children
            if (this.childrenTotal == 0) {
                this.dirtySort = false;
            }
        }

        //return the old index
        return index;
    },

    removeFromParent: function () {
        //remove self from parent node
        if (this.parent != null) {
            this.parent.removeChild(this);
        }
    },

    setChildren: function(children) {
        //this lets us force an array of children
        this.children = children;
        this.childrenTotal = this.children.length;
        
        //unflag sort
        this.dirtySort = false;

        //figure out min/max zorder values
        if (this.childrenTotal == 0) {
            this.childrenZOrderHigh = 0;
            this.childrenZOrderLow = 0;
        } else {
            this.childrenZOrderHigh = this.children[0].zOrder;
            this.childrenZOrderLow = this.children[0].zOrder;
        }

        var child;
        for (var index = 1; index < this.childrenTotal; index++) {
            child = this.children[index];
            this.childrenZOrderHigh = Math.max(this.childrenZOrderHigh, child.zOrder);
            this.childrenZOrderLow = Math.min(this.childrenZOrderLow, child.zOrder);
        }

        //update children
        for (var index = 0; index < this.childrenTotal; index++) {
            child = this.children[index];
            child.parentIndex = index;
        }
    },

    getZOrder: function () {
        return this.zOrder;
    },

    resetChildrenZOrderCounters: function () {
        this.childrenZOrderHigh = 0;
        this.childrenZOrderLow = 0;
    },

    getHighChildZOrder: function () {
        this.childrenZOrderHigh++;
        return this.childrenZOrderHigh;
    },

    getLowChildZOrder: function () {
        this.childrenZOrderLow--;
        return this.childrenZOrderLow;
    },

    getNumChildren: function () {
        return this.childrenTotal;
    },

    setZOrder: function (zOrder) {
        //set z order of this child
        this.zOrder = zOrder;

        //tell the parent to sort
        if (this.parent) {
            this.parent.sort();
        }
    },

    bringToFront: function () {
        //brings this to front in parent
        if (this.parent != null) {
            this.setZOrder(this.parent.getHighChildZOrder());
        }
    },

    bringToBack: function () {
        if (this.parent != null) {
            this.setZOrder(this.parent.getLowChildZOrder());
        }
    },

    bringForwardOne: function () {

    },

    bringBackOne: function () {

    },

    moveAfter: function (other) {
        if (this.parent != null && this.zOrder < other.zOrder) {
            var newZOrder = other.zOrder + 1;

            //if they have teh same parent we can modify the parent list
            if (this.parent == other.parent && this.parent.children != null) {
                //same parent

                //shift zorder of all children after this
                var child;

                //can we skip some?
                var scanZOrder = other.zOrder;
                var scanStartIndex = 0;
                if (!this.dirtySort) {
                    //the children list is compact so we can cheat a little and start the search from a speciffic point
                    scanStartIndex = other.parentIndex + 1;
                }

                for (var index = scanStartIndex; index < this.parent.children.length; index++) {
                    child = this.parent.children[index];

                    if (child.zOrder > scanZOrder) {
                        child.zOrder += 1;
                    }
                }
            }

            //set this zorder!
            this.setZOrder(newZOrder);
        }
    },

    moveBefore: function (other) {
        if (this.parent != null && this.zOrder > other.zOrder) {
            var newZOrder = other.zOrder;

            //if they have teh same parent we can modify the parent list
            if (this.parent == other.parent && this.parent.children != null) {
                //same parent

                //shift zorder of all children after this
                var child;

                //can we skip some?
                var scanZOrder = other.zOrder;
                var scanStartIndex = 0;
                if (!this.dirtySort) {
                    //the children list is compact so we can cheat a little and start the search from a speciffic point
                    scanStartIndex = other.parentIndex;
                }

                for (var index = scanStartIndex; index < this.parent.children.length; index++) {
                    child = this.parent.children[index];

                    if (child.zOrder >= scanZOrder) {
                        child.zOrder += 1;
                    }
                }
            }

            //set this zorder!
            this.setZOrder(newZOrder);
        }
    },
};

//setup inheritance using extend
CServices.extend(CBoundingCache, CSceneNode);