// CObjectSelection object
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

function CObjectSelection(runApp) {
    this.rhPtr = runApp;
    this.run = this.rhPtr.run;
    this.eventProgram = this.run.rhEvtProg;
    this.ObjectList = this.run.rhObjectList;                //get a pointer to the mmf object list
    this.OiList = this.run.rhOiList;                        //get a pointer to the mmf object info list
    this.QualToOiList = this.eventProgram.qualToOiList;    //get a pointer to the mmf qualifier to Oi list
}

CObjectSelection.prototype = {
    //Selects *all* objects of the given object-type
    selectAll: function (OiList) {
        var pObjectInfo = this.OiList[OiList];
        pObjectInfo.oilNumOfSelected = pObjectInfo.oilNObjects;
        pObjectInfo.oilListSelected = pObjectInfo.oilObject;
        pObjectInfo.oilEventCount = this.eventProgram.rh2EventCount;

        var i = pObjectInfo.oilObject;
        while ((i & 0x80000000) == 0) {
            var pObject = this.ObjectList[i];
            pObject.hoNextSelected = pObject.hoNumNext;
            i = pObject.hoNumNext;
        }
    },

    //Resets all objects of the given object-type
    selectNone: function (OiList) {
        var pObjectInfo = this.OiList[OiList];
        if (pObjectInfo == null) {
            return;
        }
        pObjectInfo.oilNumOfSelected = 0;
        pObjectInfo.oilListSelected = -1;
        pObjectInfo.oilEventCount = this.eventProgram.rh2EventCount;
    },

    //Resets the SOL and inserts only one given object
    selectOneObject: function (object) {
        var pObjectInfo = object.hoOiList;
        pObjectInfo.oilNumOfSelected = 1;
        pObjectInfo.oilEventCount = this.eventProgram.rh2EventCount;
        pObjectInfo.oilListSelected = object.hoNumber;
        this.ObjectList[object.hoNumber].hoNextSelected = -1;
    },

    //Resets the SOL and inserts the given list of objects
    selectObjects: function (OiList, objects) {
        var pObjectInfo = this.OiList[OiList];

        if (pObjectInfo == null) {
            return;
        }

        pObjectInfo.oilNumOfSelected = objects.length;
        pObjectInfo.oilEventCount = eventProgram.rh2EventCount;

        if (objects.length == 0) {
            return;
        }

        var i = 0;
        var prevNumber = objects[i].hoNumber;
        pObjectInfo.oilListSelected = prevNumber;
        while (i < objects.length) {
            currentNumber = objects[i++].hoNumber;
            this.ObjectList[prevNumber].hoNextSelected = currentNumber;
            prevNumber = currentNumber;
        }
        this.ObjectList[prevNumber].hoNextSelected = -1;
    },

    //Run a custom filter on the SOL (via function callback)
    filterObjects: function (rdPtr, OiList, negate, filter) {
        if ((OiList & 0x8000) != 0) {
            return ((this.filterQualifierObjects(rdPtr, OiList & 0x7FFF, negate, filter) ? 1 : 0) ^ (negate ? 1 : 0)) != 0;
        }
        return ((this.filterNonQualifierObjects(rdPtr, OiList, negate, filter) ? 1 : 0) ^ (negate ? 1 : 0)) != 0;
    },

    //Filter qualifier objects
    filterQualifierObjects: function (rdPtr, OiList, negate, filter) {
        var CurrentQualToOi = this.QualToOiList[OiList];

        var hasSelected = false;
        var i = 0;

        while (i < CurrentQualToOi.qoiList.length) {
            var CurrentOi = CurrentQualToOi.qoiList[i + 1];
            hasSelected = (((hasSelected ? 1 : 0) |
                (this.filterNonQualifierObjects(rdPtr, CurrentOi, negate, filter) ? 1 : 0))) != 0;

            i += 2;
        }
        return hasSelected;
    },

    //Filter normal objects
    filterNonQualifierObjects: function (rdPtr, OiList, negate, filter) {
        var pObjectInfo = this.OiList[OiList];
        if (pObjectInfo == null) {
            return false;
        }
        var hasSelected = false;
        if (pObjectInfo.oilEventCount != this.eventProgram.rh2EventCount) {
            this.selectAll(OiList);    //The SOL is invalid, must reset.
        }

        //If SOL is empty
        if (pObjectInfo.oilNumOfSelected <= 0) {
            return false;
        }

        var firstSelected = -1;
        var count = 0;
        var current = pObjectInfo.oilListSelected;
        var previous = null;

        while ((current & 0x80000000) == 0) {
            var pObject = this.ObjectList[current];
            var filterResult = filter(rdPtr, pObject);
            var useObject = ((filterResult ? 1 : 0) ^ (negate ? 1 : 0)) != 0;
            hasSelected = ((hasSelected ? 1 : 0) | (useObject ? 1 : 0)) != 0;

            if (useObject) {
                if (firstSelected == -1) {
                    firstSelected = current;
                }

                if (previous != null) {
                    previous.hoNextSelected = current;
                }

                previous = pObject;
                count++;
            }
            current = pObject.hoNextSelected;
        }
        if (previous != null) {
            previous.hoNextSelected = -1;
        }

        pObjectInfo.oilListSelected = firstSelected;
        pObjectInfo.oilNumOfSelected = count;

        return hasSelected;
    },

    //Return the number of selected objects for the given object-type
    getNumberOfSelected: function (OiList) {
        if ((OiList & 0x8000) != 0) {
            OiList &= 0x7FFF;    //Mask out the qualifier part
            var numberSelected = 0;

            var CurrentQualToOi = this.QualToOiList[OiList];

            var i = 0;
            while (i < CurrentQualToOi.qoiList.length) {
                var CurrentOi = this.OiList[CurrentQualToOi.qoiList[i + 1]];
                numberSelected += CurrentOi.oilNumOfSelected;
                i += 2;
            }
            return numberSelected;
        }
        else {
            var pObjectInfo = this.OiList[OiList];
            return pObjectInfo.oilNumOfSelected;
        }
    },

    objectIsOfType: function (obj, OiList) {
        if ((OiList & 0x8000) != 0) {
            OiList &= 0x7FFF;    //Mask out the qualifier part
            var CurrentQualToOi = this.QualToOiList[OiList];

            var i = 0;
            while (i < CurrentQualToOi.qoiList.length) {
                var CurrentOi = this.OiList[CurrentQualToOi.qoiList[i + 1]];
                if (CurrentOi.oilOi == obj.hoOi) {
                    return true;
                }
                i += 2;
            }
            return false;
        }
        return (obj.hoOi == this.OiList[OiList].oilOi);
    },

    //Returns the object-info structure from a given object-type
    GetOILFromOI: function (Oi) {
        for (i = 0; i < this.run.rhMaxOI; ++i) {
            var oil = this.OiList[i];
            if (oil.oilOi == Oi) {
                return oil;
            }
        }
        return null;
    }
}
