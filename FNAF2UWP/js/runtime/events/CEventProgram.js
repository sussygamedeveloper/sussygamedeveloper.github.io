// CEventProgram object
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

CEventProgram.EVENTS_EXTBASE = 80;
CEventProgram.PARAMCLICK_DOUBLE = 0x100;
CEventProgram.bts = function (array, index) {
    var d = (index >> 5);           // Build 284.2, fixes bug #2828
    var mask = 1 << (index & 31);
    var b = (array[d] & mask) != 0;
    array[d] |= mask;
    return b;
}
CEventProgram.evg_FindAction = function (evgPtr, n) {
    return evgPtr.evgNCond + n;
}
CEventProgram.EVTTYPE = function (code) {
    var c = code & 0xFFFF;
    if ((c & 0x8000) != 0) {
        return c - 65536;
    }
    return c;
}
CEventProgram.EVTNUM = function (code) {
    return (code >> 16);
}
CEventProgram.getEventCode = function (code) {
    return code & 0xFFFF0000;
}

function CEventProgram(app) {
    this.application = app;
    this.rhPtr = null;
    this.maxObjects = 0;
    this.maxOi = 0;
    this.nPlayers = 0;
    this.nConditions = new Array(COI.NUMBEROF_SYSTEMTYPES + COI.OBJ_LAST);
    this.nQualifiers = 0;
    this.nEvents = 0;
    this.qualifiers = null;
    this.events = null;
    this.qualToOiList = null;
    this.listPointers = null;
    this.eventPointersGroup = null;
    this.eventPointersCnd = null;
    this.limitBuffer = null;
    this.rhEvents = new Array(COI.NUMBEROF_SYSTEMTYPES + 1);
    this.rhEventAlways = false;
    this.rh4TimerEventsBase = 0;
    this.colBuffer = null;
    this.qualOilPtr = 0;
    this.qualOilPos = 0;
    this.qualOilPtr2 = 0;
    this.qualOilPos2 = 0;
    this.rh4CheckDoneInstart = false;
    this.rhEventGroup = null;
    this.rhCurCode = 0;
    this.rh4PickFlags = new Array(4);
    this.rh2ActionLoop = false;
    this.rh2ActionOn = false;
    this.rh2EnablePick = false;
    this.rh2EventCount = 0;
    this.rh2ActionCount = 0;
    this.rh2ActionLoopCount = 0;
    this.rh4EventCountOR = 0;
    this.rh4ConditionsFalse = false;
    this.rh3DoStop = false;
    this.rh2EventQualPos = null;
    this.rh2EventQualPosNum = 0;
    this.rh2EventPos = 0;
    this.rh2EventPosOiList = 0;
    this.rh2EventPrev = null;
    this.rh2EventPrevOiList = null;
    this.evtNSelectedObjects = 0;
    this.repeatFlag = false;
    this.rh2EventType = 0;
    this.rhCurOi = 0;
    this.rhCurParam0 = 0;
    this.rhCurParam1 = 0;
    //  this.rh3CurrentMenu=0;
    this.rh2CurrentClick = 0;
    this.rh4_2ndObject = null;
    this.bReady = false;
    this.rh2ShuffleBuffer = null;
    this.rhCurObjectNumber = 0;
    this.rh1stObjectNumber = 0;
    this.rh2PushedEvents = null;
    this.callEndForEach = false;
    this.bTestAllKeys = false;
    this.maxEvents = 0;
    this.complexOnLoop = false;
}

CEventProgram.prototype = {
    evt_FirstObjectFromType: function (nType) {
        this.rh2EventType = nType;
        if (nType == -1) {
            var pHo;
            var pHoStore = null;
            var oil;
            var poil;
            var bStore = true;
            for (oil = 0; oil < this.rhPtr.rhOiList.length; oil++) {
                poil = this.rhPtr.rhOiList[oil];
                if (CEventProgram.bts(this.rh4PickFlags, poil.oilType) == false) {
                    pHo = this.evt_SelectAllFromType(poil.oilType, bStore);
                    if (pHo != null) {
                        pHoStore = pHo;
                        bStore = false;
                    }
                }
            }
            if (pHoStore != null) {
                return pHoStore;
            }
        }
        else {
            if (CEventProgram.bts(this.rh4PickFlags, nType) == false) {
                return this.evt_SelectAllFromType(nType, true);
            }
        }

        var oil2 = 0;
        var oilPtr;
        do {
            oilPtr = this.rhPtr.rhOiList[oil2];
            if (oilPtr.oilType == nType) {
                if ((oilPtr.oilListSelected & 0x80000000) == 0) {
                    var pHo = this.rhPtr.rhObjectList[oilPtr.oilListSelected];
                    this.rh2EventPrev = null;
                    this.rh2EventPrevOiList = oilPtr;
                    this.rh2EventPos = pHo;
                    this.rh2EventPosOiList = oil2;
                    return pHo;
                }
            }
            oil2++; // Un autre OI?
        }
        while (oil2 < this.rhPtr.rhMaxOI);
        return null;
    },

    evt_NextObjectFromType: function () {
        var pHo = this.rh2EventPos;
        var oilPtr;
        if (pHo == null) {
            oilPtr = this.rhPtr.rhOiList[this.rh2EventPosOiList];
            if ((oilPtr.oilListSelected & 0x80000000) == 0) {
                pHo = this.rhPtr.rhObjectList[oilPtr.oilListSelected];
                this.rh2EventPrev = null;
                this.rh2EventPrevOiList = oilPtr;
                this.rh2EventPos = pHo;
                return pHo;
            }
        }
        if (pHo != null) {
            if ((pHo.hoNextSelected & 0x80000000) == 0) {
                this.rh2EventPrev = pHo;
                this.rh2EventPrevOiList = null;
                pHo = this.rhPtr.rhObjectList[pHo.hoNextSelected];
                this.rh2EventPos = pHo;
                return pHo;
            }
        }

        var oil = this.rh2EventPosOiList;
        var nType = this.rhPtr.rhOiList[oil].oilType;
        oil++;
        while (oil < this.rhPtr.rhMaxOI) {
            if ((this.rh2EventType != -1 && this.rhPtr.rhOiList[oil].oilType == nType) || this.rh2EventType == -1) {
                if ((this.rhPtr.rhOiList[oil].oilListSelected & 0x80000000) == 0) {
                    pHo = this.rhPtr.rhObjectList[this.rhPtr.rhOiList[oil].oilListSelected];
                    this.rh2EventPrev = null;
                    this.rh2EventPrevOiList = this.rhPtr.rhOiList[oil];
                    this.rh2EventPos = pHo;
                    this.rh2EventPosOiList = oil;
                    return pHo;
                }
            }
            oil++;
        }
        return null;
    },

    evt_SelectAllFromType: function (nType, bStore) {
        var first = -1;
        var evtCount = this.rh2EventCount;

        var oil = 0;
        var oilPtr;
        var pHo;
        do {
            oilPtr = this.rhPtr.rhOiList[oil];
            if (oilPtr.oilType == nType && oilPtr.oilEventCount != evtCount) {
                oilPtr.oilEventCount = evtCount;
                if (this.rh4ConditionsFalse) {
                    oilPtr.oilListSelected = -1;
                    oilPtr.oilNumOfSelected = 0;
                }
                else {
                    oilPtr.oilNumOfSelected = oilPtr.oilNObjects;
                    var num = oilPtr.oilObject;
                    if ((num & 0x80000000) == 0) {
                        if (first == -1 && bStore == true) {
                            first = num;
                            this.rh2EventPrev = null;
                            this.rh2EventPrevOiList = oilPtr;
                            this.rh2EventPosOiList = oil;
                        }
                        do {
                            pHo = this.rhPtr.rhObjectList[num];
                            pHo.hoNextSelected = pHo.hoNumNext;
                            num = pHo.hoNumNext;
                        }
                        while ((num & 0x80000000) == 0);

                        num = oilPtr.oilObject;
                    }
                    oilPtr.oilListSelected = num;
                }
            }
            oil++;
        }
        while (oil < this.rhPtr.rhMaxOI);

        if (bStore == false) {
            return null;
        }
        if (first < 0) {
            return null;
        }

        pHo = this.rhPtr.rhObjectList[first];
        this.rh2EventPos = pHo;
        return pHo;
    },

    evt_FirstObject: function (sEvtOiList) {
        var pHo;

        this.evtNSelectedObjects = 0;
        this.rh2EventQualPos = null;
        this.rh2EventQualPosNum = -1;

        if ((sEvtOiList & 0x8000) != 0) {
            if ((sEvtOiList & 0x7FFF) == 0x7FFF) {
                return null;
            }
            return this.qualProc(sEvtOiList);
        }

        var oilPtr = this.rhPtr.rhOiList[sEvtOiList];
        if (oilPtr.oilEventCount == this.rh2EventCount) {
            if ((oilPtr.oilListSelected & 0x80000000) != 0) {
                return null;
            }
            pHo = this.rhPtr.rhObjectList[oilPtr.oilListSelected];
            this.rh2EventPrev = null;
            this.rh2EventPrevOiList = oilPtr;
            this.rh2EventPos = pHo;
            this.rh2EventPosOiList = sEvtOiList;
            this.evtNSelectedObjects = oilPtr.oilNumOfSelected;
            return pHo;
        }
        else {
            oilPtr.oilEventCount = this.rh2EventCount;

            if (this.rh4ConditionsFalse) {
                oilPtr.oilListSelected = -1;
                oilPtr.oilNumOfSelected = 0;
                return null;
            }

            oilPtr.oilListSelected = oilPtr.oilObject;
            if ((oilPtr.oilObject & 0x80000000) != 0) {
                oilPtr.oilNumOfSelected = 0;
                return null;
            }
            var num = oilPtr.oilObject;
            do {
                pHo = this.rhPtr.rhObjectList[num];
                num = pHo.hoNumNext;
                pHo.hoNextSelected = num;
            }
            while ((num & 0x80000000) == 0);


            pHo = this.rhPtr.rhObjectList[oilPtr.oilObject];
            this.rh2EventPrev = null;
            this.rh2EventPrevOiList = oilPtr;
            this.rh2EventPos = pHo;
            this.rh2EventPosOiList = sEvtOiList;
            oilPtr.oilNumOfSelected = oilPtr.oilNObjects;
            this.evtNSelectedObjects = oilPtr.oilNumOfSelected;
            return pHo;
        }
    },

    qualProc: function (sEvtOiList) {
        var pHo;
        var oilPtr;
        var count = 0;

        var qoi = 0;
        var qoiList;
        var addCount;
        var pQoi = this.qualToOiList[sEvtOiList & 0x7FFF];
        while (qoi < pQoi.qoiList.length) {
            qoiList = pQoi.qoiList[qoi + 1];
            oilPtr = this.rhPtr.rhOiList[qoiList];
            if (oilPtr.oilEventCount == this.rh2EventCount) {
                addCount = 0;
                if ((oilPtr.oilListSelected & 0x80000000) == 0) {
                    addCount = oilPtr.oilNumOfSelected;
                    if (this.rh2EventQualPos == null) {
                        this.rh2EventQualPos = pQoi;
                        this.rh2EventQualPosNum = qoi;
                    }
                }
            }
            else {
                addCount = 0;
                oilPtr.oilEventCount = this.rh2EventCount;

                if (this.rh4ConditionsFalse) {
                    oilPtr.oilListSelected = -1;
                    oilPtr.oilNumOfSelected = 0;
                }
                else {
                    oilPtr.oilListSelected = oilPtr.oilObject;
                    if ((oilPtr.oilObject & 0x80000000) != 0) {
                        oilPtr.oilNumOfSelected = 0;
                    }
                    else {
                        if (this.rh2EventQualPos == null) {
                            this.rh2EventQualPos = pQoi;
                            this.rh2EventQualPosNum = qoi;
                        }
                        var num = oilPtr.oilObject;
                        do {
                            pHo = this.rhPtr.rhObjectList[num];
                            pHo.hoNextSelected = pHo.hoNumNext;
                            num = pHo.hoNumNext;
                        } while ((num & 0x80000000) == 0);

                        oilPtr.oilNumOfSelected = oilPtr.oilNObjects;
                        addCount = oilPtr.oilNObjects;
                    }
                }
            }
            count += addCount;
            qoi += 2;
        }

        pQoi = this.rh2EventQualPos;
        if (pQoi != null) {
            oilPtr = this.rhPtr.rhOiList[pQoi.qoiList[this.rh2EventQualPosNum + 1]];
            this.rh2EventPrev = null;
            this.rh2EventPrevOiList = oilPtr;
            pHo = this.rhPtr.rhObjectList[oilPtr.oilListSelected];
            this.rh2EventPos = pHo;
            this.rh2EventPosOiList = pQoi.qoiList[this.rh2EventQualPosNum + 1];
            this.evtNSelectedObjects = count;
            return pHo;
        }
        return null;
    },

    evt_NextObject: function () {
        var pHo = this.rh2EventPos;
        var oilPtr;
        if (pHo == null) {
            oilPtr = this.rhPtr.rhOiList[this.rh2EventPosOiList];
            if ((oilPtr.oilListSelected & 0x80000000) == 0) {
                pHo = this.rhPtr.rhObjectList[oilPtr.oilListSelected];
                this.rh2EventPrev = null;
                this.rh2EventPrevOiList = oilPtr;
                this.rh2EventPos = pHo;
                return pHo;
            }
        }
        if (pHo != null) {
            if ((pHo.hoNextSelected & 0x80000000) == 0) {
                this.rh2EventPrev = pHo;
                this.rh2EventPrevOiList = null;
                pHo = this.rhPtr.rhObjectList[pHo.hoNextSelected];
                this.rh2EventPos = pHo;
                return pHo;
            }
        }
        if (this.rh2EventQualPos == null) {
            return null;
        }

        do {
            this.rh2EventQualPosNum += 2;
            if (this.rh2EventQualPosNum >= this.rh2EventQualPos.qoiList.length) {
                return null;
            }
            oilPtr = this.rhPtr.rhOiList[this.rh2EventQualPos.qoiList[this.rh2EventQualPosNum + 1]];
        } while ((oilPtr.oilListSelected & 0x80000000) != 0);

        this.rh2EventPrev = null;
        this.rh2EventPrevOiList = oilPtr;
        pHo = this.rhPtr.rhObjectList[oilPtr.oilListSelected];
        this.rh2EventPos = pHo;
        this.rh2EventPosOiList = this.rh2EventQualPos.qoiList[this.rh2EventQualPosNum + 1];
        return pHo;
    },

    evt_AddCurrentQualifier: function (qual) {
        var pQoi = this.qualToOiList[qual & 0x7FFF];
        var noil = 0;
        var oilPtr;
        while (noil < pQoi.qoiList.length) {
            oilPtr = this.rhPtr.rhOiList[pQoi.qoiList[noil + 1]];
            if (oilPtr.oilEventCount != this.rh2EventCount) {
                oilPtr.oilEventCount = this.rh2EventCount;
                oilPtr.oilNumOfSelected = 0;
                oilPtr.oilListSelected = -1;
            }
            noil += 2;
        }
        ;
    },

    evt_DeleteCurrentObject: function () {
        this.rh2EventPos.hoOiList.oilNumOfSelected -= 1;
        if (this.rh2EventPrev != null) {
            this.rh2EventPrev.hoNextSelected = this.rh2EventPos.hoNextSelected;
            this.rh2EventPos = this.rh2EventPrev;
        }
        else {
            //            rhPtr.rhOiList[rh2EventPosOiList].oilListSelected=rh2EventPos.hoNextSelected;
            this.rh2EventPrevOiList.oilListSelected = this.rh2EventPos.hoNextSelected;
            this.rh2EventPos = null;
        }
    },

    evt_AddCurrentObject: function (pHo) {
        var oilPtr = pHo.hoOiList;
        if (oilPtr.oilEventCount != this.rh2EventCount) {
            oilPtr.oilEventCount = this.rh2EventCount;
            oilPtr.oilListSelected = pHo.hoNumber;
            oilPtr.oilNumOfSelected = 1;
            pHo.hoNextSelected = -1;
        }
        else {
            var oils = oilPtr.oilListSelected;
            if ((oils & 0x80000000) != 0) {
                oilPtr.oilListSelected = pHo.hoNumber;
                oilPtr.oilNumOfSelected += 1;
                pHo.hoNextSelected = -1;
            }
            else {
                var pHo1;
                do {
                    if (pHo.hoNumber == oils) {
                        return;
                    }
                    pHo1 = this.rhPtr.rhObjectList[oils];
                    oils = pHo1.hoNextSelected;
                } while ((oils & 0x80000000) == 0);

                pHo1.hoNextSelected = pHo.hoNumber;
                pHo.hoNextSelected = -1;
                pHo.hoOiList.oilNumOfSelected += 1;
            }
        }
    },

    deselectThem: function (oil) {
        var poil = this.rhPtr.rhOiList[oil];
        poil.oilEventCount = this.rh2EventCount;
        poil.oilListSelected = -1;
        poil.oilNumOfSelected = 0;
    },

    evt_ForceOneObject: function (oil, pHo) {
        if ((oil & 0x8000) == 0) {
            this.deselectThem(oil);
        }
        else {
            if ((oil & 0x7FFF) == 0x7FFF) {
                return;
            }
            var pqoi = this.qualToOiList[oil & 0x7FFF];
            var qoi;
            for (qoi = 0; qoi < pqoi.qoiList.length; qoi += 2) {
                this.deselectThem(pqoi.qoiList[qoi + 1]);
            }
        }
        pHo.hoNextSelected = -1;
        pHo.hoOiList.oilListSelected = pHo.hoNumber;
        pHo.hoOiList.oilNumOfSelected = 1;
        pHo.hoOiList.oilEventCount = this.rh2EventCount;
    },

    evt_DeleteCurrentType: function (nType) {
        CEventProgram.bts(this.rh4PickFlags, nType);

        var oil;
        var oilPtr;
        for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
            oilPtr = this.rhPtr.rhOiList[oil];
            if (oilPtr.oilType == nType) {
                oilPtr.oilEventCount = this.rh2EventCount;
                oilPtr.oilListSelected = -1;
                oilPtr.oilNumOfSelected = 0;
            }
        }
    },

    evt_DeleteCurrent: function () {
        this.rh4PickFlags[0] = -1;
        this.rh4PickFlags[1] = -1;
        this.rh4PickFlags[2] = -1;
        this.rh4PickFlags[3] = -1;

        var oil;
        var oilPtr;
        for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
            oilPtr = this.rhPtr.rhOiList[oil];
            oilPtr.oilEventCount = this.rh2EventCount;
            oilPtr.oilListSelected = -1;
            oilPtr.oilNumOfSelected = 0;
        }
    },

    evt_MarkSelectedObjects: function () {
        var num;
        var pHO;
        var oil;
        var oilPtr;

        for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
            oilPtr = this.rhPtr.rhOiList[oil];
            if (oilPtr.oilEventCount == this.rh2EventCount) {
                if (oilPtr.oilEventCountOR != this.rh4EventCountOR) {
                    oilPtr.oilEventCountOR = this.rh4EventCountOR;
                    num = oilPtr.oilObject;
                    while ((num & 0x80000000) == 0) {
                        pHO = this.rhPtr.rhObjectList[num];
                        pHO.hoSelectedInOR = 0;
                        num = pHO.hoNumNext;
                    }
                }
                num = oilPtr.oilListSelected;
                while ((num & 0x80000000) == 0) {
                    pHO = this.rhPtr.rhObjectList[num];
                    pHO.hoSelectedInOR = 1;
                    num = pHO.hoNextSelected;
                }
            }
        }
    },

    evt_BranchSelectedObjects: function () {
        var num;
        var pHO, pHOPrev;
        var oil;
        var oilPtr;

        for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
            oilPtr = this.rhPtr.rhOiList[oil];
            if (oilPtr.oilEventCountOR == this.rh4EventCountOR) {
                oilPtr.oilEventCount = this.rh2EventCount;

                num = oilPtr.oilObject;
                pHOPrev = null;
                while ((num & 0x80000000) == 0) {
                    pHO = this.rhPtr.rhObjectList[num];
                    if (pHO.hoSelectedInOR != 0) {
                        if (pHOPrev != null) {
                            pHOPrev.hoNextSelected = num;
                        }
                        else {
                            oilPtr.oilListSelected = num;
                        }
                        pHO.hoNextSelected = -1;
                        pHOPrev = pHO;
                    }
                    num = pHO.hoNumNext;
                }
            }
        }
    },

    get_ExpressionObjects: function (expoi) {
        var object;
        if (this.rh2ActionOn) {
            this.rh2EnablePick = false;
            var object = this.get_CurrentObjects(expoi);
            return object;
        }

        var oilPtr;
        if ((expoi & 0x8000) == 0) {
            oilPtr = this.rhPtr.rhOiList[expoi];
            if (oilPtr.oilEventCount == this.rh2EventCount) {
                if ((oilPtr.oilListSelected & 0x80000000) == 0) {
                    return this.rhPtr.rhObjectList[oilPtr.oilListSelected];
                }
                if ((oilPtr.oilObject & 0x80000000) == 0) {
                    return this.rhPtr.rhObjectList[oilPtr.oilObject];
                }
                return null;
            }
            else {
                if ((oilPtr.oilObject & 0x80000000) == 0) {
                    return this.rhPtr.rhObjectList[oilPtr.oilObject];
                }
                return null;
            }
        }

        var pQoi = this.qualToOiList[expoi & 0x7FFF];
        var qoi = 0;
        if (qoi >= pQoi.qoiList.length) {
            return null;
        }
        do {
            oilPtr = this.rhPtr.rhOiList[pQoi.qoiList[qoi + 1]];
            if (oilPtr.oilEventCount == this.rh2EventCount) {
                if ((oilPtr.oilListSelected & 0x80000000) == 0) {
                    return this.rhPtr.rhObjectList[oilPtr.oilListSelected];
                }
            }
            qoi += 2;
        } while (qoi < pQoi.qoiList.length);

        qoi = 0;
        do {
            oilPtr = this.rhPtr.rhOiList[pQoi.qoiList[qoi + 1]];
            if ((oilPtr.oilObject & 0x80000000) == 0) {
                return this.rhPtr.rhObjectList[oilPtr.oilObject];
            }
            qoi += 2;
        } while (qoi < pQoi.qoiList.length);
        return null;
    },

    get_ParamActionObjects: function (qoil, pAction) {
        this.rh2EnablePick = true;
        var pObject = this.get_CurrentObjects(qoil);
        if (pObject != null) {
            if (this.repeatFlag == false) {
                return pObject;
            }
            else {
                pAction.evtFlags |= CAct.ACTFLAGS_REPEAT;
                this.rh2ActionLoop = true;
                return pObject;
            }
        }
        pAction.evtFlags |= CEvent.EVFLAGS_NOTDONEINSTART;
        return pObject;
    },

    get_ActionObjects: function (pAction) {
        pAction.evtFlags &= ~CEvent.EVFLAGS_NOTDONEINSTART;
        this.rh2EnablePick = true;
        var qoil = pAction.evtOiList;
        var pObject = this.get_CurrentObjects(qoil);
        if (pObject != null) {
            if (this.repeatFlag == false) {
                return pObject;
            }
            else {
                pAction.evtFlags |= CAct.ACTFLAGS_REPEAT;
                this.rh2ActionLoop = true;
                return pObject;
            }
        }
        pAction.evtFlags |= CEvent.EVFLAGS_NOTDONEINSTART;
        return pObject;
    },

    get_CurrentObjects: function (qoil) {
        var object;
        if ((qoil & 0x8000) == 0) {
            object = this.get_CurrentObject(qoil);
        }
        else {
            object = this.get_CurrentObjectQualifier(qoil);
        }
        return object;
    },

    get_CurrentObject: function (qoil) {
        var pHo;
        var oilPtr = this.rhPtr.rhOiList[qoil];

        if (oilPtr.oilActionCount != this.rh2ActionCount) {
            oilPtr.oilActionCount = this.rh2ActionCount;
            oilPtr.oilActionLoopCount = this.rh2ActionLoopCount;

            if (oilPtr.oilEventCount == this.rh2EventCount) {
                if ((oilPtr.oilListSelected & 0x80000000) == 0) {
                    oilPtr.oilCurrentOi = oilPtr.oilListSelected;
                    pHo = this.rhPtr.rhObjectList[oilPtr.oilListSelected];
                    oilPtr.oilNext = pHo.hoNextSelected;
                    if ((pHo.hoNextSelected & 0x80000000) != 0) {
                        oilPtr.oilNextFlag = false;
                        oilPtr.oilCurrentRoutine = 1;
                        this.repeatFlag = false;
                        return pHo;
                    }
                    oilPtr.oilNextFlag = true;
                    oilPtr.oilCurrentRoutine = 2;
                    this.repeatFlag = true;
                    return pHo;
                }
            }

            if (this.rh2EnablePick) {
                if (oilPtr.oilEventCount == this.rh2EventCount) {
                    oilPtr.oilCurrentRoutine = 0;
                    oilPtr.oilCurrentOi = -1;
                    return null;
                }
            }
            if ((oilPtr.oilObject & 0x80000000) == 0) {
                oilPtr.oilCurrentOi = oilPtr.oilObject;
                pHo = this.rhPtr.rhObjectList[oilPtr.oilObject];
                if (pHo == null) {
                    oilPtr.oilCurrentRoutine = 0;
                    oilPtr.oilCurrentOi = -1;
                    return null;
                }
                if ((pHo.hoNumNext & 0x80000000) == 0) {
                    oilPtr.oilNext = pHo.hoNumNext;
                    oilPtr.oilNextFlag = true;
                    oilPtr.oilCurrentRoutine = 3;
                    this.repeatFlag = true;
                    return pHo;
                }
                oilPtr.oilNextFlag = false;
                oilPtr.oilCurrentRoutine = 1;
                this.repeatFlag = false;
                return pHo;
            }
            else {
                oilPtr.oilCurrentRoutine = 0;
                oilPtr.oilCurrentOi = -1;
                return null;
            }
        }

        if (oilPtr.oilActionLoopCount != this.rh2ActionLoopCount) {
            var next;
            oilPtr.oilActionLoopCount = this.rh2ActionLoopCount;
            switch (oilPtr.oilCurrentRoutine) {
                case 0:
                    this.repeatFlag = oilPtr.oilNextFlag;
                    return null;
                case 1:
                    pHo = this.rhPtr.rhObjectList[oilPtr.oilCurrentOi];
                    this.repeatFlag = oilPtr.oilNextFlag;
                    return pHo;
                case 2:
                    oilPtr.oilCurrentOi = oilPtr.oilNext;
                    pHo = this.rhPtr.rhObjectList[oilPtr.oilNext];
                    if (pHo == null) {
                        return null;
                    }
                    next = pHo.hoNextSelected;
                    if ((next & 0x80000000) != 0) {
                        oilPtr.oilNextFlag = false;
                        next = oilPtr.oilListSelected;
                    }
                    oilPtr.oilNext = next;
                    this.repeatFlag = oilPtr.oilNextFlag;
                    return pHo;
                case 3:
                    oilPtr.oilCurrentOi = oilPtr.oilNext;
                    pHo = this.rhPtr.rhObjectList[oilPtr.oilNext];
                    if (pHo == null) {
                        return null;
                    }
                    next = pHo.hoNumNext;
                    if ((next & 0x80000000) != 0) {
                        oilPtr.oilNextFlag = false;
                        next = oilPtr.oilObject;
                    }
                    oilPtr.oilNext = next;
                    this.repeatFlag = oilPtr.oilNextFlag;
                    return pHo;
            }
        }
        if (oilPtr.oilCurrentOi < 0) {
            return null;
        }
        pHo = this.rhPtr.rhObjectList[oilPtr.oilCurrentOi];
        this.repeatFlag = oilPtr.oilNextFlag;
        return pHo;
    },

    get_CurrentObjectQualifier: function (qoil) {
        var pHo;
        var next, num;

        var pqoi = this.qualToOiList[qoil & 0x7FFF];
        if (pqoi.qoiActionCount != this.rh2ActionCount) {
            pqoi.qoiActionCount = this.rh2ActionCount;
            pqoi.qoiActionLoopCount = this.rh2ActionLoopCount;

            num = this.qoi_GetFirstListSelected(pqoi);
            if (num >= 0) {
                pqoi.qoiCurrentOi = num;
                pHo = this.rhPtr.rhObjectList[num];
                if (pHo == null) {
                    pqoi.qoiCurrentRoutine = 0;
                    pqoi.qoiCurrentOi = -1;
                    return null;
                }
                next = pHo.hoNextSelected;
                if ((next & 0x80000000) != 0) {
                    next = this.qoi_GetNextListSelected(pqoi);
                    if (next < 0) {
                        pqoi.qoiCurrentRoutine = 1;
                        pqoi.qoiNextFlag = false;
                        this.repeatFlag = false;
                        return pHo;
                    }
                }
                pqoi.qoiNext = next;
                pqoi.qoiCurrentRoutine = 2;
                pqoi.qoiNextFlag = true;
                this.repeatFlag = true;
                return pHo;
            }

            if (this.rh2EnablePick) {
                if (pqoi.qoiSelectedFlag) {
                    pqoi.qoiCurrentRoutine = 0;
                    pqoi.qoiCurrentOi = -1;
                    return null;
                }
            }
            num = this.qoi_GetFirstList(pqoi);
            if (num >= 0) {
                pqoi.qoiCurrentOi = num;
                pHo = this.rhPtr.rhObjectList[num];
                if (pHo != null) {
                    num = pHo.hoNumNext;
                    if ((num & 0x80000000) != 0) {
                        num = this.qoi_GetNextList(pqoi);
                        if ((num & 0x80000000) != 0) {
                            pqoi.qoiCurrentRoutine = 1;
                            pqoi.qoiNextFlag = false;
                            this.repeatFlag = false;
                            return pHo;
                        }
                    }
                    pqoi.qoiNext = num;
                    pqoi.qoiCurrentRoutine = 3;
                    pqoi.qoiNextFlag = true;
                    this.repeatFlag = true;
                    return pHo;
                }
            }
            pqoi.qoiCurrentRoutine = 0;
            pqoi.qoiCurrentOi = -1;
            return null;
        }

        if (pqoi.qoiActionLoopCount != this.rh2ActionLoopCount) {
            pqoi.qoiActionLoopCount = this.rh2ActionLoopCount;
            switch (pqoi.qoiCurrentRoutine) {
                case 0:
                    this.repeatFlag = pqoi.qoiNextFlag;
                    return null;
                case 1:
                    pHo = this.rhPtr.rhObjectList[pqoi.qoiCurrentOi];
                    this.repeatFlag = pqoi.qoiNextFlag;
                    return pHo;
                case 2:
                    pqoi.qoiCurrentOi = pqoi.qoiNext;
                    pHo = this.rhPtr.rhObjectList[pqoi.qoiNext];
                    if (pHo != null) {
                        next = pHo.hoNextSelected;
                        if ((next & 0x80000000) != 0) {
                            next = this.qoi_GetNextListSelected(pqoi);
                            if (next < 0) {
                                pqoi.qoiNextFlag = false;
                                next = this.qoi_GetFirstListSelected(pqoi);
                            }
                        }
                        pqoi.qoiNext = next;
                    }
                    this.repeatFlag = pqoi.qoiNextFlag;
                    return pHo;
                case 3:
                    pqoi.qoiCurrentOi = pqoi.qoiNext;
                    pHo = this.rhPtr.rhObjectList[pqoi.qoiNext];
                    if (pHo != null) {
                        next = pHo.hoNumNext;
                        if ((next & 0x80000000) != 0) {
                            next = this.qoi_GetNextList(pqoi);
                            if ((next & 0x80000000) != 0) {
                                pqoi.qoiNextFlag = false;
                                next = this.qoi_GetFirstList(pqoi);
                            }
                        }
                        pqoi.qoiNext = next;
                    }
                    this.repeatFlag = pqoi.qoiNextFlag;
                    return pHo;
            }
        }

        if (pqoi.qoiCurrentOi < 0) {
            return null;
        }
        pHo = this.rhPtr.rhObjectList[pqoi.qoiCurrentOi];
        this.repeatFlag = pqoi.qoiNextFlag;
        return pHo;
    },

    qoi_GetNextListSelected: function (pqoi) {
        var pos = pqoi.qoiActionPos;
        var qoil;
        var oilPtr;
        while (pos < pqoi.qoiList.length) {
            qoil = pqoi.qoiList[pos + 1];
            oilPtr = this.rhPtr.rhOiList[qoil];
            if (oilPtr.oilEventCount == this.rh2EventCount) {
                pqoi.qoiSelectedFlag = true;
                if ((oilPtr.oilListSelected & 0x80000000) == 0) {
                    pqoi.qoiActionPos = (pos + 2);
                    return oilPtr.oilListSelected;
                }
            }
            pos += 2;
        }
        return -1;
    },

    qoi_GetFirstListSelected: function (pqoi) {
        pqoi.qoiActionPos = 0;
        pqoi.qoiSelectedFlag = false;
        return this.qoi_GetNextListSelected(pqoi);
    },

    qoi_GetNextList: function (pqoi) {
        var pos = pqoi.qoiActionPos;
        var qoil;
        var oilPtr;
        while (pos < pqoi.qoiList.length) {
            qoil = pqoi.qoiList[pos + 1];
            oilPtr = this.rhPtr.rhOiList[qoil];
            if ((oilPtr.oilObject & 0x80000000) == 0) {
                pqoi.qoiActionPos = (pos + 2);
                return oilPtr.oilObject;
            }
            pos += 2;
        }
        return -1;
    },

    qoi_GetFirstList: function (pqoi) {
        pqoi.qoiActionPos = 0;
        return this.qoi_GetNextList(pqoi);
    },

    endForEach: function () {
        this.callEndForEach = false;

        var saveForEach = this.rhPtr.rh4CurrentForEach;
        var saveForEach2 = this.rhPtr.rh4CurrentForEach2;
        while (true) {
            var pForEach2 = null;
            var pPrevious = null;
            var pForEach = this.rhPtr.rh4ForEachs;
            while (pForEach != null) {
                if (pForEach.index < 0) {
                    pForEach2 = pForEach.next;
                    if (pForEach2) {
                        if (!CServices.compareStringsIgnoreCase(pForEach.name, pForEach2.name)) {
                            pForEach2 = null;
                        }
                    }
                    break;
                }
                pPrevious = pForEach;
                pForEach = pForEach.next;
            }

            if (pForEach == null) {
                break;
            }

            pForEach.stop = false;
            for (pForEach.index = 0; pForEach.index < pForEach.number; pForEach.index++) {
                this.rhPtr.rh4CurrentForEach = pForEach;
                this.rhPtr.rh4CurrentForEach2 = pForEach2;
                if (pForEach2) {
                    pForEach2.index = pForEach.index;
                }
                this.rh2ActionOn = 0;
                this.handle_Event(pForEach.objects[pForEach.index], (-41 << 16));    // CNDL_EXTONLOOP);
                if (pForEach.stop) {
                    break;
                }
            }
            if (pForEach2) {
                for (pForEach2.index = 0; pForEach2.index < pForEach2.number; pForEach2.index++) {
                    this.rhPtr.rh4CurrentForEach = pForEach2;
                    this.rhPtr.rh4CurrentForEach2 = pForEach;
                    if (pForEach) {
                        pForEach.index = pForEach2.index;
                    }
                    this.rh2ActionOn = 0;
                    this.handle_Event(pForEach2.objects[pForEach2.index], (-41 << 16));    // CNDL_EXTONLOOP);
                    if (pForEach2.stop) {
                        break;
                    }
                }
            }
            if (pForEach2) {
                pForEach.next = pForEach2.next;
            }
            if (pPrevious == null) {
                this.rhPtr.rh4ForEachs = pForEach.next;
            } else {
                pPrevious.next = pForEach.next;
            }
        }
        this.rhPtr.rh4CurrentForEach = saveForEach;
        this.rhPtr.rh4CurrentForEach2 = saveForEach2;
    },

    addForEach: function (pName, pHo, oi) {
        var pForEach = this.rhPtr.rh4ForEachs;
        var pForEachPrevious = null;
        while (pForEach != null) {
            if (pForEach.oi == oi && CServices.compareStringsIgnoreCase(pName, pForEach.name)) {
                pForEach.objects[pForEach.number++] = pHo;
                return;
            }
            pForEachPrevious = pForEach;
            pForEach = pForEach.next;
        }

        var pForEach = new CForEach();
        if (pForEachPrevious) {
            pForEachPrevious.next = pForEach;
        } else {
            this.rhPtr.rh4ForEachs = pForEach;
        }
        pForEach.next = null;
        pForEach.number = 1;
        pForEach.oi = oi;
        pForEach.objects[0] = pHo;
        pForEach.index = -1;
        pForEach.name = pName;
    },

    handle_GlobalEvents: function (code) {
        var type = code & 0xFFFF;
        if ((type & 0x8000) != 0) {
            type = 65536 - type;
        }
        var cond = -(code >> 16);
        var num = this.listPointers[this.rhEvents[type] + cond];
        if (num != 0) {
            this.computeEventList(num, null);
        }
    },

    handle_Event: function (pHo, code) {
        this.rhCurCode = code;

        var cond = -(code >> 16);
        var num = this.listPointers[pHo.hoEvents + cond];
        if (num != 0) {
            this.computeEventList(num, pHo);
            return true;
        }
        return false;
    },

    handle_TimerEvents: function () {
        var bDelete = false;
        var pEvent = this.rhPtr.rh4TimerEvents;
        while (pEvent) {
            if (this.rhPtr.rhTimer >= pEvent.timer) {
                if (pEvent.type == CTimerEvents.TIMEREVENTTYPE_ONESHOT) {
                    this.rhPtr.rhEvtProg.rhCurParam0 = pEvent.name;
                    var num = this.listPointers[this.rhEvents[-COI.OBJ_TIMER] + CCnd.NUM_ONEVENT];
                    if (num != 0) {
                        this.computeEventList(num, null);
                    }
                    pEvent.bDelete = true;
                    bDelete = true;
                }
                else {
                    if (pEvent.timerPosition == 0) {
                        pEvent.timerPosition = this.rhPtr.rhTimer;
                    }
                    while (this.rhPtr.rhTimer >= pEvent.timerPosition) {
                        this.rhPtr.rhEvtProg.rhCurParam0 = pEvent.name;
                        this.rhPtr.rhEvtProg.rhCurParam1 = pEvent.index;
                        var num = this.listPointers[this.rhEvents[-COI.OBJ_TIMER] + CCnd.NUM_ONEVENT];
                        if (num != 0) {
                            this.computeEventList(num, null);
                        }
                        pEvent.index++;
                        pEvent.loops--;
                        if (pEvent.loops == 0) {
                            pEvent.bDelete = true;
                            bDelete = true;
                            break;
                        }
                        pEvent.timerPosition += pEvent.timerNext;
                    }
                }
            }
            pEvent = pEvent.next;
        }
        if (bDelete) {
            pEvent = this.rhPtr.rh4TimerEvents;
            var pPrevious = null;
            var pNext;
            while (pEvent) {
                pNext = pEvent.next;
                if (pEvent.bDelete) {
                    if (pPrevious == null) {
                        this.rhPtr.rh4TimerEvents = pNext;
                    } else {
                        pPrevious.next = pNext;
                    }
                }
                else {
                    pPrevious = pEvent;
                }
                pEvent = pNext;
            }
        }
    },

    compute_TimerEvents: function () {

        var num;

        if ((this.rhPtr.rhGameFlags & CRun.GAMEFLAGS_FIRSTLOOPFADEIN) != 0) {
            num = this.listPointers[this.rhEvents[-COI.OBJ_GAME] + 1];
            if (num != 0) {
                this.listPointers[this.rhEvents[-COI.OBJ_GAME] + 1] = -1;
                this.computeEventList(num, null);
                this.rh4CheckDoneInstart = true;
            }
            return;
        }

        num = this.listPointers[this.rhEvents[-COI.OBJ_TIMER] + 3];
        if (num != 0) {
            this.computeEventList(num, null);
        }

        num = this.listPointers[this.rhEvents[-COI.OBJ_GAME] + 1];
        var num2, count;
        var evgPtr, evgGroup;
        var evtPtr;
        if (num != 0) {
            if (this.rh4CheckDoneInstart) {
                evgGroup = null;
                num2 = num;
                do {
                    evgPtr = this.eventPointersGroup[num2];
                    if (evgPtr != evgGroup) {
                        evgGroup = evgPtr;

                        for (count = evgPtr.evgNCond; count < evgPtr.evgNCond + evgPtr.evgNAct; count++) {
                            evtPtr = evgPtr.evgEvents[count];
                            if ((evtPtr.evtFlags & CEvent.EVFLAGS_NOTDONEINSTART) == 0)        // Une action BAD?
                            {
                                evtPtr.evtFlags |= CEvent.EVFLAGS_DONEBEFOREFADEIN;
                            }
                        }
                    }
                    num2++;
                } while (this.eventPointersGroup[num2] != null);
            }
            this.computeEventList(num, null);
            this.listPointers[this.rhEvents[-COI.OBJ_GAME] + 1] = 0;
            if (this.rh4CheckDoneInstart) {
                evgGroup = null;
                num2 = num;
                do {
                    evgPtr = this.eventPointersGroup[num2];
                    if (evgPtr != evgGroup) {
                        evgGroup = evgPtr;
                        for (count = evgPtr.evgNCond; count < evgPtr.evgNCond + evgPtr.evgNAct; count++) {
                            evtPtr = evgPtr.evgEvents[count];
                            evtPtr.evtFlags &= ~CEvent.EVFLAGS_DONEBEFOREFADEIN;
                        }
                    }
                    num2++;
                } while (this.eventPointersGroup[num2] != null);
                this.rh4CheckDoneInstart = false;
            }
        }

        num = this.listPointers[this.rhEvents[-COI.OBJ_TIMER] + 2];
        if (num != 0) {
            this.computeEventList(num, null);
        }

        num = this.listPointers[this.rhEvents[-COI.OBJ_TIMER] + 1];
        if (num != 0) {
            this.computeEventList(num, null);
        }
    },

    restartTimerEvents: function () {
        var time = this.rhPtr.rhTimer;

        var num = this.listPointers[this.rhEvents[-COI.OBJ_TIMER] + 3];
        var evtPtr;
        var evgPtr;
        if (num != 0) {
            do {
                evgPtr = this.eventPointersGroup[num];
                evtPtr = evgPtr.evgEvents[this.eventPointersCnd[num]];
                evtPtr.evtFlags |= CEvent.EVFLAGS_DONE;
                var p = evtPtr.evtParams[0];
                if (p.timer > time) {
                    evtPtr.evtFlags &= ~CEvent.EVFLAGS_DONE;
                }
                num++;
            } while (this.eventPointersGroup[num] != null);
        }
    },

    computeEventFastLoopList: function (pointers) {
        var evgPtr;
        var count;
        var num = 0;
        do {
            evgPtr = pointers[num];
            if ((evgPtr.evgFlags & CEventGroup.EVGFLAGS_INACTIVE) == 0) {
                this.rhEventGroup = evgPtr;
                this.rh4PickFlags[0] = 0;
                this.rh4PickFlags[1] = 0;
                this.rh4PickFlags[2] = 0;
                this.rh4PickFlags[3] = 0;
                this.rh2EventCount += 1;
                this.rh4ConditionsFalse = false;

                for (count = 1; count < evgPtr.evgNCond; count++) {
                    if (evgPtr.evgEvents[count].eva2(this.rhPtr) == false) {
                        break;
                    }
                }

                if (count == evgPtr.evgNCond) {
                    this.call_Actions(evgPtr);
                }
            }
            num++;
        } while (num < pointers.length)
    },

    computeEventList: function (num, pHo) {
        var bTrue;
        var evgPtr, evgPtr2;
        var count;
        this.rh3DoStop = false;
        do {
            evgPtr = this.eventPointersGroup[num];

            if ((evgPtr.evgFlags & CEventGroup.EVGFLAGS_INACTIVE) == 0) {
                this.rhEventGroup = evgPtr;
                this.rh4PickFlags[0] = 0;
                this.rh4PickFlags[1] = 0;
                this.rh4PickFlags[2] = 0;
                this.rh4PickFlags[3] = 0;

                if ((evgPtr.evgFlags & CEventGroup.EVGFLAGS_ORINGROUP) == 0) {
                    this.rh2EventCount += 1;
                    this.rh4ConditionsFalse = false;

                    count = 0;
                    if (evgPtr.evgEvents[count].eva1(this.rhPtr, pHo)) {
                        for (count++; count < evgPtr.evgNCond; count++) {
                            if (evgPtr.evgEvents[count].eva2(this.rhPtr) == false) {
                                break;
                            }
                        }
                    }

                    if (count == evgPtr.evgNCond) {
                        if (this.rh3DoStop) {
                            if (pHo != null) {
                                this.call_Stops(pHo);
                            }
                        }
                        else {
                            this.call_Actions(evgPtr);
                        }
                    }
                    num++;
                }
                else {
                    this.rh4EventCountOR++;
                    if ((evgPtr.evgFlags & CEventGroup.EVGFLAGS_ORLOGICAL) == 0) {
                        bTrue = false;
                        do {
                            this.rh2EventCount++;
                            this.rh4ConditionsFalse = false;
                            count = this.eventPointersCnd[num];
                            if (evgPtr.evgEvents[count].eva1(this.rhPtr, pHo) == false) {
                                this.rh4ConditionsFalse = true;
                            }

                            count++;
                            while (count < evgPtr.evgNCond && evgPtr.evgEvents[count].evtCode != ((-24 << 16) | 65535)) {
                                if (evgPtr.evgEvents[count].eva2(this.rhPtr) == false) {
                                    this.rh4ConditionsFalse = true;
                                }
                                count++;
                            }

                            this.evt_MarkSelectedObjects();
                            if (this.rh4ConditionsFalse == false) {
                                bTrue = true;
                            }

                            num++;
                            evgPtr = this.eventPointersGroup[num];
                            if (evgPtr == null) {
                                break;
                            }
                        } while (evgPtr == this.rhEventGroup);

                        if (bTrue) {
                            this.rh2EventCount++;
                            this.evt_BranchSelectedObjects();
                            this.call_Actions(this.rhEventGroup);
                        }
                    }
                    else {
                        var bFalse;
                        this.rh4ConditionsFalse = false;

                        bTrue = false;
                        do {
                            this.rh2EventCount++;
                            bFalse = false;
                            count = this.eventPointersCnd[num];

                            if (evgPtr.evgEvents[count].eva1(this.rhPtr, pHo)) {
                                count++;
                                while (count < evgPtr.evgNCond && evgPtr.evgEvents[count].evtCode != ((-25 << 16) | 65535)) {
                                    if (evgPtr.evgEvents[count].eva2(this.rhPtr) == false) {
                                        bFalse = true;
                                        break;
                                    }
                                    count++;
                                }
                            }
                            else {
                                bFalse = true;
                            }

                            if (bFalse == false) {
                                this.evt_MarkSelectedObjects();
                                bTrue = true;
                            }

                            num++;
                            evgPtr = this.eventPointersGroup[num];
                            if (evgPtr == null) {
                                break;
                            }

                        } while (evgPtr == this.rhEventGroup);

                        if (bTrue) {
                            this.rh2EventCount++;
                            this.evt_BranchSelectedObjects();
                            this.call_Actions(this.rhEventGroup);
                        }
                    }
                }
            }
            else {
                num++;
                if (this.eventPointersGroup[num] != null) {
                    evgPtr2 = this.eventPointersGroup[num];
                    while (evgPtr2 == evgPtr) {
                        num++;
                        if (this.eventPointersGroup[num] == null) {
                            break;
                        }
                        evgPtr2 = this.eventPointersGroup[num];
                    }
                }
            }
        } while (this.eventPointersGroup[num] != null);
    },

    call_Actions: function (pEvg) {
        if ((pEvg.evgFlags & CEventGroup.EVGFLAGS_LIMITED) != 0) {
            if ((pEvg.evgFlags & CEventGroup.EVGFLAGS_SHUFFLE) != 0) {
                this.rh2ShuffleBuffer = new CArrayList();
            }

            if ((pEvg.evgFlags & CEventGroup.EVGFLAGS_NOTALWAYS) != 0) {
                var w_cx = this.rhPtr.rhLoopCount;
                var w_dx = pEvg.evgInhibit;
                pEvg.evgInhibit = w_cx;
                if (w_cx == w_dx) {
                    return;
                }
                w_cx -= 1;
                if (w_cx == w_dx) {
                    return;
                }
            }

            if ((pEvg.evgFlags & CEventGroup.EVGFLAGS_REPEAT) != 0) {
                if (pEvg.evgInhibitCpt != 0) {
                    pEvg.evgInhibitCpt--;
                }
                else {
                    return;
                }
            }

            if ((pEvg.evgFlags & CEventGroup.EVGFLAGS_NOMORE) != 0) {
                var dwt = this.rhPtr.rhTimer / 10;
                var dwmax = pEvg.evgInhibitCpt;
                if (dwmax != 0 && dwt < dwmax) {
                    return;
                }
                pEvg.evgInhibitCpt = (dwt + pEvg.evgInhibit);
            }
        }


        this.rh2ActionCount++;
        this.rh2ActionLoop = false;
        this.rh2ActionLoopCount = 0;
        this.rh2ActionOn = true;
        var count = 0;
        var actPtr;

        do {
            actPtr = pEvg.evgEvents[count + pEvg.evgNCond];
            if ((actPtr.evtFlags & (CEvent.EVFLAGS_BADOBJECT | CEvent.EVFLAGS_DONEBEFOREFADEIN)) == 0) {
                actPtr.evtFlags &= ~CAct.ACTFLAGS_REPEAT;
                actPtr.execute(this.rhPtr);
            }
            count++;
        } while (count < pEvg.evgNAct);

        if (this.rh2ActionLoop) {
            do {
                this.rh2ActionLoop = false;
                this.rh2ActionLoopCount++;
                for (count = 0; count < pEvg.evgNAct; count++) {
                    actPtr = pEvg.evgEvents[count + pEvg.evgNCond];
                    if ((actPtr.evtFlags & CAct.ACTFLAGS_REPEAT) != 0) {
                        actPtr.evtFlags &= ~CAct.ACTFLAGS_REPEAT;
                        actPtr.execute(this.rhPtr);
                    }
                }
            } while (this.rh2ActionLoop);
        }

        this.rh2ActionOn = false;
        if (this.rh2ShuffleBuffer != null) {
            this.endShuffle();
        }
        if (this.callEndForEach) {
            this.endForEach();
        }
    },

    call_Stops: function (pHo) {
        var oi;

        oi = pHo.hoOi;
        this.rh2EventCount += 1;
        this.evt_AddCurrentObject(pHo);

        this.rh2ActionCount++;
        this.rh2ActionLoop = false;
        this.rh2ActionLoopCount = 0;
        this.rh2ActionOn = true;
        var actPtr;
        var count = 0;
        var num, numOi;
        do {
            actPtr = this.rhEventGroup.evgEvents[this.rhEventGroup.evgNCond + count];
            num = actPtr.evtCode & 0xFFFF0000;
            if (num == (4 << 16) || num == (9 << 16)) {
                if (oi == actPtr.evtOi) {
                    actPtr.execute(this.rhPtr);
                }
                else {
                    var oil = actPtr.evtOiList;
                    if ((oil & 0x8000) != 0) {
                        var pq = this.qualToOiList[oil & 0x7FFF];
                        numOi = 0;
                        while (numOi < pq.qoiList.length) {
                            if (pq.qoiList[numOi] == oi) {
                                actPtr.execute(this.rhPtr);
                                break;
                            }
                            numOi += 2;
                        }
                    }
                }
            }
            count++;
        } while (count < this.rhEventGroup.evgNAct);
        this.rh2ActionOn = false;
    },

    endShuffle: function () {
        if (this.rh2ShuffleBuffer.size() <= 1) {
            return;
        }

        var num1 = this.rhPtr.random(this.rh2ShuffleBuffer.size());
        var num2;
        do {
            num2 = this.rhPtr.random(this.rh2ShuffleBuffer.size());
        } while (num1 == num2);

        var pHo1 = this.rh2ShuffleBuffer.get(num1);
        var pHo2 = this.rh2ShuffleBuffer.get(num2);

        var x1 = pHo1.hoX;
        var y1 = pHo1.hoY;
        var x2 = pHo2.hoX;
        var y2 = pHo2.hoY;
        CRun.setXPosition(pHo1, x2);
        CRun.setYPosition(pHo1, y2);
        CRun.setXPosition(pHo2, x1);
        CRun.setYPosition(pHo2, y1);
        this.rh2ShuffleBuffer = null;
    },

    onMouseButton: function (b, nClicks) {
        var mouse;
        this.rhPtr.getMouseCoords();

        if (this.rhPtr == null) {
            return;
        }
        if (this.rhPtr.rh2PauseCompteur != 0) {
            return;
        }
        if (this.bReady == false) {
            return;
        }

        mouse = b;
        if (nClicks == 2) {
            mouse += CEventProgram.PARAMCLICK_DOUBLE;
        }

        this.rhPtr.rh4TimeOut = 0;
        if ((this.rhPtr.rhMouseUsed) != 0) {
            return;
        }

        this.rhCurParam0 = mouse;
        this.rh2CurrentClick = mouse;
        this.handle_GlobalEvents(((-5 << 16) | 0xFFFA));
        this.handle_GlobalEvents(((-6 << 16) | 0xFFFA));

        var count = 0;
        var i;
        var pHox;
        var x1, y1, x2, y2;
        var list = new CArrayList();
        for (i = 0; i < this.rhPtr.rhNObjects; i++) {
            while (this.rhPtr.rhObjectList[count] == null) {
                count++;
            }
            pHox = this.rhPtr.rhObjectList[count];
            count++;

            x1 = pHox.hoX - pHox.hoImgXSpot;
            y1 = pHox.hoY - pHox.hoImgYSpot;
            x2 = x1 + pHox.hoImgWidth;
            y2 = y1 + pHox.hoImgHeight;
            if (this.rhPtr.rh2MouseX >= x1 && this.rhPtr.rh2MouseX < x2 && this.rhPtr.rh2MouseY >= y1 && this.rhPtr.rh2MouseY < y2) {
                //if ((pHox.hoFlags & CObject.HOF_DESTROYED) == 0) {
                if ((pHox.hoLimitFlags & CObjInfo.OILIMITFLAGS_QUICKCOL) != 0 && (pHox.hoFlags & CObject.HOF_DESTROYED) == 0) {
                    if (pHox.hoType == COI.OBJ_SPR) {
                        if ((pHox.ros.rsFlags & CRSpr.RSFLAG_COLBOX) == 0) {
                            var image = this.application.imageBank.getImageFromHandle(pHox.roc.rcImage);
                            var mask = image.getMask(CMask.GCMF_OBSTACLE, 0, 1.0, 1.0);
                            if (mask.testPointEx(this.rhPtr.rh2MouseX - pHox.hoX, this.rhPtr.rh2MouseY - pHox.hoY, pHox.roc.rcAngle, pHox.roc.rcScaleX, pHox.roc.rcScaleY)) {
                                list.add(pHox);
                            }
                        }
                        else {
                            list.add(pHox);
                        }
                    }
                    else {
                        list.add(pHox);
                    }
                }
            }
        }
        for (count = 0; count < list.size(); count++) {
            pHox = list.get(count);
            this.rhCurParam1 = pHox.hoOi;
            this.rh4_2ndObject = pHox;
            this.handle_GlobalEvents(((-7 << 16) | 0xFFFA));
        }
    },

    onKeyDown: function (vk) {
        if (this.rhPtr != null) {
            if (this.bReady == false) {
                return;
            }
            /*
             if (this.rhPtr.rh2PauseCompteur != 0)
             {
             if (this.rhPtr.rh4PauseKey == -1)
             {
             this.rhPtr.resume();
             this.rhPtr.rh4EndOfPause = this.rhPtr.rhLoopCount;        
             this.handle_GlobalEvents(((-8 << 16) | 0xFFFD));    
             }
             if (this.rhPtr.rh4PauseKey != 0 && this.rhPtr.rh4PauseKey == vk)
             {
             this.rhPtr.resume();
             this.rhPtr.rh4EndOfPause = this.rhPtr.rhLoopCount;        
             this.handle_GlobalEvents(((-8 << 16) | 0xFFFD));        
             }
             return;
             }
             */
            this.rhPtr.rh4TimeOut = 0;
            this.handle_GlobalEvents(((-9 << 16) | 0xFFFA));
        }
    },

    onMouseMove: function () {
        if (this.bReady == false) {
            return;
        }
        if (this.rhPtr.rh2PauseCompteur != 0) {
            return;
        }
        this.rhPtr.rh4TimeOut = 0;
    },

    ctoCompare: function (pZone, pHo) {
        if (pHo.hoImgWidth == 0 || pHo.hoImgHeight == 0) {
            return false;
        }
        if (pHo.hoX < pZone.x1 || pHo.hoX >= pZone.x2) {
            return false;
        }
        if (pHo.hoY < pZone.y1 || pHo.hoY >= pZone.y2) {
            return false;
        }
        return true;
    },

    count_ZoneTypeObjects: function (pZone, stop, type) {
        stop++;
        this.evtNSelectedObjects = 0;

        var oil = 0;
        var poilLoop = null;
        var pHo;
        var num;
        do {
            for (; oil < this.rhPtr.rhOiList.length; oil++) {
                poilLoop = this.rhPtr.rhOiList[oil];
                if (type == 0 || (type != 0 && type == poilLoop.oilType)) {
                    break;
                }
            }
            if (oil == this.rhPtr.rhOiList.length) {
                return null;
            }

            var poil = poilLoop;
            oil++;

            if (poil.oilEventCount != this.rh2EventCount) {
                if (this.rh4ConditionsFalse == false) {
                    num = poil.oilObject;
                    while ((num & 0x80000000) == 0) {
                        pHo = this.rhPtr.rhObjectList[num];
                        if (pHo == null) {
                            return null;
                        }
                        if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                            if (this.ctoCompare(pZone, pHo)) {
                                this.evtNSelectedObjects++;
                                if (this.evtNSelectedObjects == stop) {
                                    return pHo;
                                }
                            }
                        }
                        num = pHo.hoNumNext;
                    }
                }
            }
            else {
                num = poil.oilListSelected;
                while ((num & 0x80000000) == 0) {
                    pHo = this.rhPtr.rhObjectList[num];
                    if (pHo == null) {
                        return null;
                    }
                    if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                        if (this.ctoCompare(pZone, pHo)) {
                            this.evtNSelectedObjects++;
                            if (this.evtNSelectedObjects == stop) {
                                return pHo;
                            }
                        }
                    }
                    num = pHo.hoNextSelected;
                }
            }
        } while (true);
    },

    count_ObjectsFromType: function (type, stop) {
        stop++;
        this.evtNSelectedObjects = 0;

        var oil = 0;
        var poilLoop = null;
        var pHo;
        var num;

        do {
            for (; oil < this.rhPtr.rhOiList.length; oil++) {
                poilLoop = this.rhPtr.rhOiList[oil];
                if (type == 0 || (type != 0 && type == poilLoop.oilType)) {
                    break;
                }
            }
            if (oil == this.rhPtr.rhOiList.length) {
                return null;
            }

            var poil = poilLoop;
            oil++;

            if (poil.oilEventCount != this.rh2EventCount) {
                if (this.rh4ConditionsFalse == false) {
                    num = poil.oilObject;
                    while ((num & 0x80000000) == 0) {
                        pHo = this.rhPtr.rhObjectList[num];
                        if (pHo == null) {
                            return null;
                        }
                        if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                            this.evtNSelectedObjects++;
                            if (this.evtNSelectedObjects == stop) {
                                return pHo;
                            }
                        }
                        num = pHo.hoNumNext;
                    }
                }
            }
            else {
                num = poil.oilListSelected;
                while ((num & 0x80000000) == 0) {
                    pHo = this.rhPtr.rhObjectList[num];
                    if (pHo == null) {
                        return null;
                    }
                    if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                        this.evtNSelectedObjects++;
                        if (this.evtNSelectedObjects == stop) {
                            return pHo;
                        }
                    }
                    num = pHo.hoNextSelected;
                }
            }
        } while (true);
    },

    czaCompare: function (pZone, pHo) {
        if (pHo.hoX < pZone.x1 || pHo.hoX >= pZone.x2) {
            return false;
        }
        if (pHo.hoY < pZone.y1 || pHo.hoY >= pZone.y2) {
            return false;
        }
        return true;
    },

    select_ZoneTypeObjects: function (p, type) {
        var cpt = 0;

        var oil = 0;
        var poilLoop = null;
        var pHoLoop, pHoFound;
        var num;
        do {
            for (; oil < this.rhPtr.rhOiList.length; oil++) {
                poilLoop = this.rhPtr.rhOiList[oil];
                if (type == 0 || (type != 0 && type == poilLoop.oilType)) {
                    break;
                }
            }
            if (oil == this.rhPtr.rhOiList.length) {
                return cpt;
            }

            var poil = poilLoop;
            oil++;

            if (poil.oilEventCount != this.rh2EventCount) {
                pHoLoop = null;
                poil.oilNumOfSelected = 0;
                poil.oilEventCount = this.rh2EventCount;
                poil.oilListSelected = -1;
                if (this.rh4ConditionsFalse == false) {
                    num = poil.oilObject;
                    while ((num & 0x80000000) == 0) {
                        pHoFound = this.rhPtr.rhObjectList[num];
                        if (pHoFound == null) {
                            break;
                        }
                        if ((pHoFound.hoFlags & CObject.HOF_DESTROYED) == 0) {
                            if (this.czaCompare(p, pHoFound)) {
                                cpt++;
                                poil.oilNumOfSelected++;
                                pHoFound.hoNextSelected = -1;
                                if (pHoLoop == null) {
                                    poil.oilListSelected = pHoFound.hoNumber;
                                }
                                else {
                                    pHoLoop.hoNextSelected = pHoFound.hoNumber;
                                }
                                pHoLoop = pHoFound;
                            }
                        }
                        num = pHoFound.hoNumNext;
                    }
                    ;
                }
                continue;
            }

            pHoLoop = null;
            num = poil.oilListSelected;
            while ((num & 0x80000000) == 0) {
                pHoFound = rhPtr.rhObjectList[num];
                if (pHoFound == null) {
                    break;
                }
                if ((pHoFound.hoFlags & CObject.HOF_DESTROYED) == 0) {
                    if (this.czaCompare(p, pHoFound) == false) {
                        poil.oilNumOfSelected--;
                        if (pHoLoop == null) {
                            poil.oilListSelected = pHoFound.hoNextSelected;
                        }
                        else {
                            pHoLoop.hoNextSelected = pHoFound.hoNextSelected;
                        }
                    }
                    else {
                        cpt++;
                        pHoLoop = pHoFound;
                    }
                }
                num = pHoFound.hoNextSelected;
            }
            ;
            continue;
        } while (true);
    },

    losCompare: function (x1, y1, x2, y2, pHo) {
        var delta;
        var x, y;

        var xLeft = pHo.hoX - pHo.hoImgXSpot;
        var xRight = xLeft + pHo.hoImgWidth;
        var yTop = pHo.hoY - pHo.hoImgYSpot;
        var yBottom = yTop + pHo.hoImgHeight;

        if (x2 - x1 > y2 - y1) {
            delta = (y2 - y1) / (x2 - x1);
            if (x2 > x1) {
                if (xRight < x1 || xLeft >= x2) {
                    return false;
                }
            }
            else {
                if (xRight < x2 || xLeft >= x1) {
                    return false;
                }
            }
            y = delta * (xLeft - x1) + y1;
            if (y >= yTop && y < yBottom) {
                return true;
            }

            y = delta * (xRight - x1) + y1;
            if (y >= yTop && y < yBottom) {
                return true;
            }

            return false;
        }
        else {
            delta = (x2 - x1) / (y2 - y1);
            if (y2 > y1) {
                if (yBottom < y1 || yTop >= y2) {
                    return false;
                }
            }
            else {
                if (yBottom < y2 || yTop >= y1) {
                    return false;
                }
            }
            x = delta * (yTop - y1) + x1;
            if (x >= xLeft && x < xRight) {
                return true;
            }

            x = delta * (yTop - y1) + x1;
            if (x >= xLeft && x < xRight) {
                return true;
            }

            return false;
        }
    },

    select_LineOfSight: function (x1, y1, x2, y2) {
        var cpt = 0;

        var poil;
        var oil;
        var pHoLoop, pHoFound;
        var num;
        for (oil = 0; oil < this.rhPtr.rhOiList.length; oil++) {
            poil = this.rhPtr.rhOiList[oil];
            if (poil.oilEventCount != this.rh2EventCount) {
                pHoLoop = null;
                poil.oilNumOfSelected = 0;
                poil.oilEventCount = this.rh2EventCount;
                poil.oilListSelected = -1;

                if (this.rh4ConditionsFalse == false) {
                    num = poil.oilObject;
                    while ((num & 0x80000000) == 0) {
                        pHoFound = this.rhPtr.rhObjectList[num];
                        if (pHoFound == null) {
                            break;
                        }
                        if ((pHoFound.hoFlags & CObject.HOF_DESTROYED) == 0) {
                            if (this.losCompare(x1, y1, x2, y2, pHoFound)) {
                                cpt++;
                                poil.oilNumOfSelected++;
                                pHoFound.hoNextSelected = -1;
                                if (pHoLoop == null) {
                                    poil.oilListSelected = pHoFound.hoNumber;
                                }
                                else {
                                    pHoLoop.hoNextSelected = pHoFound.hoNumber;
                                }
                                pHoLoop = pHoFound;
                            }
                        }
                        num = pHoFound.hoNumNext;
                    }
                }
                continue;
            }

            pHoLoop = null;
            num = poil.oilListSelected;
            while ((num & 0x80000000) == 0) {
                pHoFound = this.rhPtr.rhObjectList[num];
                if (pHoFound == null) {
                    break;
                }
                if ((pHoFound.hoFlags & CObject.HOF_DESTROYED) == 0) {
                    if (this.losCompare(x1, y1, x2, y2, pHoFound) == false) {
                        poil.oilNumOfSelected--;
                        if (pHoLoop == null) {
                            poil.oilListSelected = pHoFound.hoNextSelected;
                        }
                        else {
                            pHoLoop.hoNextSelected = pHoFound.hoNextSelected;
                        }
                    }
                    else {
                        cpt++;
                        pHoLoop = pHoFound;
                    }
                }
                num = pHoFound.hoNextSelected;
            }

        }
        return cpt;
    },

    czoCountThem: function (oil, pZone) {
        var count = 0;
        var poil = this.rhPtr.rhOiList[oil];
        var pHo;
        var num;

        if (poil.oilEventCount != this.rh2EventCount) {
            if (this.rh4ConditionsFalse == false) {
                num = poil.oilObject;
                while ((num & 0x80000000) == 0) {
                    pHo = this.rhPtr.rhObjectList[num];
                    if (pHo == null) {
                        return 0;
                    }
                    if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                        if (this.czaCompare(pZone, pHo)) {
                            count++;
                        }
                    }
                    num = pHo.hoNumNext;
                }
            }
            return count;
        }

        num = poil.oilListSelected;
        while ((num & 0x80000000) == 0) {
            pHo = this.rhPtr.rhObjectList[num];
            if (pHo == null) {
                return 0;
            }
            if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                if (this.czaCompare(pZone, pHo)) {
                    count++;
                }
            }
            num = pHo.hoNextSelected;
        }
        return count;
    },

    count_ZoneOneObject: function (oil, pZone) {
        if ((oil & 0x8000) == 0) {
            return this.czoCountThem(oil, pZone);
        }

        if ((oil & 0x7FFF) == 0x7FFF) {
            return 0;
        }
        var pqoi = this.qualToOiList[oil & 0x7FFF];
        var qoi;
        var count = 0;
        for (qoi = 0; qoi < pqoi.qoiList.length; qoi += 2) {
            count += this.czoCountThem(pqoi.qoiList[qoi + 1], pZone);
        }
        return count;
    },

    countThem: function (oil, stop) {
        var poil = this.rhPtr.rhOiList[oil];
        var pHo;
        var num;

        if (poil.oilEventCount != this.rh2EventCount) {
            if (this.rh4ConditionsFalse) {
                this.evtNSelectedObjects = 0;
                return null;
            }

            num = poil.oilObject;
            while ((num & 0x80000000) == 0) {
                pHo = this.rhPtr.rhObjectList[num];
                if (pHo == null) {
                    return null;
                }
                if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                    this.evtNSelectedObjects++;
                    if (this.evtNSelectedObjects == stop) {
                        return pHo;
                    }
                }
                num = pHo.hoNumNext;
            }
            return null;
        }

        num = poil.oilListSelected;
        while ((num & 0x80000000) == 0) {
            pHo = this.rhPtr.rhObjectList[num];
            if (pHo == null) {
                return null;
            }
            if ((pHo.hoFlags & CObject.HOF_DESTROYED) == 0) {
                this.evtNSelectedObjects++;
                if (this.evtNSelectedObjects == stop) {
                    return pHo;
                }
            }
            num = pHo.hoNextSelected;
        }
        return null;
    },

    count_ObjectsFromOiList: function (oil, stop) {
        stop++;
        this.evtNSelectedObjects = 0;
        if ((oil & 0x8000) == 0) {
            return this.countThem(oil, stop);
        }

        if ((oil & 0x7FFF) == 0x7FFF) {
            return null;
        }
        var pqoi = this.qualToOiList[oil & 0x7FFF];
        var qoi;
        for (qoi = 0; qoi < pqoi.qoiList.length; qoi += 2) {
            var pHo = this.countThem(pqoi.qoiList[qoi + 1], stop);
            if (pHo != null) {
                return pHo;
            }
        }
        return null;
    },

    pickFromId: function (value) {
        var number = value & 0xFFFF;
        if (number >= this.rhPtr.rhMaxObjects) {
            return false;
        }
        var pHo = this.rhPtr.rhObjectList[number];
        if (pHo == null) {
            return false;
        }

        var code = value >>> 16;
        if (code != pHo.hoCreationId) {
            return false;
        }

        var poil = pHo.hoOiList;
        if (poil.oilEventCount == this.rh2EventCount) {
            var next = poil.oilListSelected;
            var pHoFound = null;
            while ((next & 0x80000000) == 0) {
                pHoFound = this.rhPtr.rhObjectList[next];
                if (pHo == pHoFound) {
                    break;
                }
                next = pHoFound.hoNextSelected;
            }
            ;
            if (pHo != pHoFound) {
                return false;
            }
        }
        poil.oilEventCount = this.rh2EventCount;
        poil.oilListSelected = -1;
        poil.oilNumOfSelected = 0;
        pHo.hoNextSelected = -1;
        this.evt_AddCurrentObject(pHo);
        return true;
    },

    push_Event: function (routine, code, lParam, pHo, oi) {
        var p = new CPushedEvent(routine, code, lParam, pHo, oi);
        if (this.rh2PushedEvents == null) {
            this.rh2PushedEvents = new CArrayList();
        }
        this.rh2PushedEvents.add(p);
    },

    handle_PushedEvents: function () {
        if (this.rh2PushedEvents != null) {
            var index;
            for (index = 0; index < this.rh2PushedEvents.size(); index++) {
                var pEvt = this.rh2PushedEvents.get(index);
                if (pEvt != null) {
                    if (pEvt.code != 0) {
                        this.rhCurParam0 = pEvt.param;
                        this.rhCurOi = pEvt.oi;
                        switch (pEvt.routine) {
                            case 0:
                                this.handle_GlobalEvents(pEvt.code);
                                break;
                            case 1:
                                this.handle_Event(pEvt.pHo, pEvt.code);
                                break;
                        }
                    }
                }
            }
            this.rh2PushedEvents.clear();
        }
    },

    load: function (app) {

        var code = new Array(4);
        var number;
        var n;
        var eventPos = 0;
        while (true) {
            var code = app.file.readBuffer(4);

            if (code[0] == 0x45 && code[1] == 0x52 && code[2] == 0x3E && code[3] == 0x3E) {
                this.maxObjects = app.file.readAShort();
                if (this.maxObjects < 300) {
                    this.maxObjects = 300;
                }
                this.maxOi = app.file.readAShort();
                this.nPlayers = app.file.readAShort();
                for (n = 0; n < 7 + COI.OBJ_LAST; n++) {
                    this.nConditions[n] = app.file.readAShort();
                }
                this.nQualifiers = app.file.readAShort();
                if (this.nQualifiers > 0) {
                    this.qualifiers = new Array(this.nQualifiers);
                    for (n = 0; n < this.nQualifiers; n++) {
                        this.qualifiers[n] = new CLoadQualifiers();
                        this.qualifiers[n].qOi = app.file.readShort();
                        this.qualifiers[n].qType = app.file.readShort();
                    }
                }
            }
            else if (code[0] == 0x45 && code[1] == 0x52 && code[2] == 0x65 && code[3] == 0x73) {
                app.file.readAInt();
                this.nEvents = app.file.readAInt();
                this.events = new Array(this.nEvents);
                this.eventPos = 0;
            }
            else if (code[0] == 0x45 && code[1] == 0x52 && code[2] == 0x65 && code[3] == 0x76) {
                app.file.readAInt();
                number = app.file.readAInt();
                for (n = 0; n < number; n++) {
                    this.events[eventPos] = CEventGroup.create(app);
                    eventPos++;
                }
            }
            else if (code[0] == 0x3C && code[1] == 0x3C && code[2] == 0x45 && code[3] == 0x52) {
                break;
            }
        }
        this.maxEvents = Math.max(this.maxEvents, eventPos);
    },

    inactiveGroup: function (evg) {
        var bQuit;
        var evgPtr;
        var evtPtr;
        var grpPtr;

        evgPtr = this.events[evg];
        evgPtr.evgFlags &= CEventGroup.EVGFLAGS_DEFAULTMASK;
        evgPtr.evgFlags |= CEventGroup.EVGFLAGS_INACTIVE;

        for (evg++, bQuit = false; ;) {
            evgPtr = this.events[evg];
            evgPtr.evgFlags &= CEventGroup.EVGFLAGS_DEFAULTMASK;
            evgPtr.evgFlags |= CEventGroup.EVGFLAGS_INACTIVE;

            evtPtr = evgPtr.evgEvents[0];
            switch (evtPtr.evtCode) {
                case ((-10 << 16) | 65535):        // CNDL_GROUP:
                    grpPtr = evtPtr.evtParams[0];
                    grpPtr.grpFlags |= PARAM_GROUP.GRPFLAGS_PARENTINACTIVE;
                    evg = this.inactiveGroup(evg);
                    continue;
                case ((-11 << 16) | 65535):        // CNDL_ENDGROUP:
                    bQuit = true;
                    evg++;
                    break;
            }
            if (bQuit) {
                break;
            }
            evg++;
        }
        return evg;
    },

    prepareProgram: function () {
        var evgPtr;
        var evtPtr;
        var grpPtr;
        var evpPtr;
        var evg, evt, evp;
        var groups = new CArrayList();
        var g;

        for (evg = 0; evg < this.events.length;) {
            evgPtr = this.events[evg];
            evgPtr.evgFlags &= CEventGroup.EVGFLAGS_DEFAULTMASK;

            evtPtr = evgPtr.evgEvents[0];
            if (evtPtr.evtCode == ((-10 << 16) | 65535)) {
                grpPtr = evtPtr.evtParams[0];
                g = new CGroupFind();
                g.id = grpPtr.grpId;
                g.evg = evg;
                groups.add(g);
                grpPtr.grpFlags &= ~(PARAM_GROUP.GRPFLAGS_PARENTINACTIVE | PARAM_GROUP.GRPFLAGS_GROUPINACTIVE);

                if ((grpPtr.grpFlags & PARAM_GROUP.GRPFLAGS_INACTIVE) != 0) {
                    grpPtr.grpFlags |= PARAM_GROUP.GRPFLAGS_GROUPINACTIVE;
                }
            }
            evg++;
        }

        for (evg = 0; evg < this.events.length;) {
            evgPtr = this.events[evg];
            evgPtr.evgFlags &= CEventGroup.EVGFLAGS_DEFAULTMASK;

            evtPtr = evgPtr.evgEvents[0];
            if (evtPtr.evtCode == ((-10 << 16) | 65535)) {
                grpPtr = evtPtr.evtParams[0];
                grpPtr.grpFlags &= ~PARAM_GROUP.GRPFLAGS_PARENTINACTIVE;

                if ((grpPtr.grpFlags & PARAM_GROUP.GRPFLAGS_GROUPINACTIVE) != 0) {
                    evg = this.inactiveGroup(evg);
                    continue;
                }
            }
            evg++;
        }

        for (evg = 0; evg < this.events.length; evg++) {
            evgPtr = this.events[evg];
            evtPtr = evgPtr.evgEvents[0];
            switch (evtPtr.evtCode) {
                case ((-10 << 16) | 65535):        // CNDL_GROUP
                case ((-11 << 16) | 65535):        // CNDL_ENDGROUP
                    break;

                default:
                    evgPtr.evgInhibit = 0;
                    evgPtr.evgInhibitCpt = 0;
                    for (evt = 0; evt < evgPtr.evgNCond + evgPtr.evgNAct; evt++) {
                        evtPtr = evgPtr.evgEvents[evt];
                        if (evtPtr.evtCode < 0) {
                            evtPtr.evtFlags &= CEvent.EVFLAGS_DEFAULTMASK;
                        }
                        else {
                            evtPtr.evtFlags &= ~(CAct.ACTFLAGS_REPEAT | CEvent.EVFLAGS_NOTDONEINSTART);
                        }

                        if (evtPtr.evtNParams != 0) {
                            for (evp = 0; evp < evtPtr.evtNParams; evp++) {
                                evpPtr = evtPtr.evtParams[evp];
                                switch (evpPtr.code) {
									case 25:	    // PARAM_INT
										evpPtr.value2 = 0;
										break;
                                    case 13:        // PARAM_EVERY
                                        evpPtr.compteur = evpPtr.delay;
                                        break;
                                    case 39:        // PARAM_GROUPOINTER
                                        var n;
                                        for (n = 0; n < groups.size(); n++) {
                                            g = groups.get(n);
                                            if (g.id == evpPtr.id) {
                                                evpPtr.pointer = g.evg;
                                                break;
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                    }
                    break;
            }
        }
    },

    assemblePrograms: function (run) {
        var evgPtr;
        var evtPtr;
        var evpPtr;

        var o, oo;
        var oi, oi1, oi2;
        var type;
        var nOi, i, n, num, type1, type2;
        var d, evgF, evgM, q, d1, d2;
        var code;
        var fWrap;
        var evtAlways, evtAlwaysPos;
        var aTimers, ss;
        var bOrBefore;
        var cndOR;
        var oilPtr;
        var hoPtr;

        this.rhPtr = run;

        this.rh2ActionCount = 0;

        var oiMax = 0;
        for (nOi = 0, n = 0; n < this.rhPtr.rhMaxOI; n++) {
            if (this.rhPtr.rhOiList[n].oilOi != -1) {
                this.rhPtr.rhOiList[n].oilActionCount = -1;
                this.rhPtr.rhOiList[n].oilLimitFlags = 0;
                this.rhPtr.rhOiList[n].oilLimitList = -1;
                nOi++;
                if (this.rhPtr.rhOiList[n].oilOi + 1 > oiMax) {
                    oiMax = this.rhPtr.rhOiList[n].oilOi + 1;
                }
            }
        }

        this.qualToOiList = null;
        var oil;
        if (this.nQualifiers > 0) {
            var count = new Array(this.nQualifiers);
            for (q = 0; q < this.nQualifiers; q++) {
                oi = (this.qualifiers[q].qOi) & 0x7FFF;
                count[q] = 0;
                for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
                    if (this.rhPtr.rhOiList[oil].oilType == this.qualifiers[q].qType) {
                        for (n = 0; n < 8 && this.rhPtr.rhOiList[oil].oilQualifiers[n] != -1; n++) {
                            if (oi == this.rhPtr.rhOiList[oil].oilQualifiers[n]) {
                                count[q]++;
                            }
                        }
                    }
                }
            }

            this.qualToOiList = new Array(this.nQualifiers);
            for (q = 0; q < this.nQualifiers; q++) {
                this.qualToOiList[q] = new CQualToOiList();

                if (count[q] != 0) {
                    this.qualToOiList[q].qoiList = new Array(count[q] * 2);
                }

                i = 0;
                oi = (this.qualifiers[q].qOi) & 0x7FFF;
                for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
                    if (this.rhPtr.rhOiList[oil].oilType == this.qualifiers[q].qType) {
                        for (n = 0; n < 8 && this.rhPtr.rhOiList[oil].oilQualifiers[n] != -1; n++) {
                            if (oi == this.rhPtr.rhOiList[oil].oilQualifiers[n]) {
                                this.qualToOiList[q].qoiList[i * 2] = this.rhPtr.rhOiList[oil].oilOi;
                                this.qualToOiList[q].qoiList[i * 2 + 1] = oil;
                                i++;
                            }
                        }
                    }
                }
                this.qualToOiList[q].qoiActionCount = -1;
            }
        }

        this.colBuffer = new Array(oiMax * 100 * 2 + 1);
        var colList = 0;
        var posStartLoop = new Array();
        var evg, evt, evp;
        for (evg = 0; evg < this.events.length; evg++) {
            evgPtr = this.events[evg];

            for (evt = 0; evt < evgPtr.evgNAct + evgPtr.evgNCond; evt++) {
                evtPtr = evgPtr.evgEvents[evt];

                evtPtr.evtFlags &= ~CEvent.EVFLAGS_BADOBJECT;

                if (CEventProgram.EVTTYPE(evtPtr.evtCode) >= 0) {
                    evtPtr.evtOiList = this.get_OiListOffset(evtPtr.evtOi, CEventProgram.EVTTYPE(evtPtr.evtCode));
                }

                if (evtPtr.evtCode == CAct.ACT_STARTLOOP) {
                    var expression = evtPtr.evtParams[0];
                    if (expression.tokens[0].code == CExp.EXP_STRING && expression.tokens[1].code == 0) {
                        var posStart = {};
                        posStart.address = evtPtr.evtParams[0];
                        posStart.name = expression.tokens[0].string;
                        posStartLoop.push(posStart);

                        this.rhPtr.addFastLoop(expression.tokens[0].string);
                    }
                }
                else if (evtPtr.evtCode == CAct.ACT_STOPLOOP || evtPtr.evtCode == CAct.ACT_SETLOOPINDEX) {
                    var expression = evtPtr.evtParams[0];
                    if (expression.tokens[0].code == CExp.EXP_STRING && expression.tokens[1].code == 0) {
                        expression.tokens[0] = new EXP_LONG();
                        expression.tokens[0].code = CExp.EXP_LONG;
                        expression.tokens[0].value = this.rhPtr.addFastLoop(expression.tokens[0].string);
                    }
                }

                if (evtPtr.evtNParams > 0) {
                    for (evp = 0; evp < evtPtr.evtNParams; evp++) {
                        evpPtr = evtPtr.evtParams[evp];
                        switch (evpPtr.code) {
                            // Met un parametre buffer 4 a zero
                            case 25:        // PARAM_BUFFER4:
                                evpPtr.value = 0;
                                break;

                            // Trouve le levobj de creation
                            case 21:        // PARAM_SYSCREATE:
                                if ((evtPtr.evtOi & COI.OIFLAG_QUALIFIER) == 0) {
                                    var loPtr;
                                    for (loPtr = this.rhPtr.rhFrame.LOList.first_LevObj(); loPtr != null; loPtr = this.rhPtr.rhFrame.LOList.next_LevObj()) {
                                        if (evtPtr.evtOi == loPtr.loOiHandle) {
                                            evpPtr.cdpHFII = loPtr.loHandle;
                                            break;
                                        }
                                    }
                                }
                                else {
                                    evpPtr.cdpHFII = -1;
                                }
                                oi = evpPtr.posOINUMParent;
                                if (oi != -1) {
                                    evpPtr.posOiList = this.get_OiListOffset(oi, evpPtr.posTypeParent);
                                }
                                break;

                            // Met l'adresse du levObj pour create object
                            case 9:         // PARAM_CREATE:
                            case 18:        // PARAM_SHOOT:
                            case 16:        // PARAM_POSITION:
                                oi = evpPtr.posOINUMParent;
                                if (oi != -1) {
                                    evpPtr.posOiList = this.get_OiListOffset(oi, evpPtr.posTypeParent);
                                }
                                break;

                            // Poke l'adresse de l'objet dans l'curFrame.m_oiList
                            case 1:         // PARAM_OBJECT:
                                evpPtr.oiList = this.get_OiListOffset(evpPtr.oi, evpPtr.type);
                                break;

                            // Expression : poke l'adresse de l'curFrame.m_oiList dans les parametres objets
                            case 15:        // PARAM_SPEED:
                            case 27:        // PARAM_SAMLOOP:
                            case 28:        // PARAM_MUSLOOP:
                            case 45:        // PARAM_EXPSTRING:
                            case 46:        // PARAM_CMPSTRING:
                            case 22:        // PARAM_EXPRESSION:
                            case 23:        // PARAM_COMPARAISON:
                            case 52:        // PARAM_VARGLOBAL_EXP:
                            case 59:        // PARAM_STRINGGLOBAL_EXP:
                            case 53:        // PARAM_ALTVALUE_EXP:
                            case 62:        // PARAM_ALTSTRING_EXP:
                            case 54:        // PARAM_FLAG_EXP:
                                var expPtr = evpPtr;
                                for (n = 0; n < expPtr.tokens.length; n++) {
                                    // Un objet avec OI?
                                    if (CEventProgram.EVTTYPE(expPtr.tokens[n].code) > 0) {
                                        var expOi = expPtr.tokens[n];
                                        expOi.oiList = this.get_OiListOffset(expOi.oi, CEventProgram.EVTTYPE(expOi.code));
                                    }
                                }
                                ;
                                break;
                        }
                    }
                }
            }

            // Flags par defaut / Listes de limitation
            // ---------------------------------------
            evgF = 0;
            evgM = CEventGroup.EVGFLAGS_ONCE | CEventGroup.EVGFLAGS_LIMITED | CEventGroup.EVGFLAGS_STOPINGROUP;
            for (evt = 0; evt < evgPtr.evgNCond + evgPtr.evgNAct; evt++) {
                evtPtr = evgPtr.evgEvents[evt];

                type = CEventProgram.EVTTYPE(evtPtr.evtCode);
                code = evtPtr.evtCode;
                n = 0;
                d1 = 0;
                d2 = 0;
                evpPtr = null;
                if (type >= COI.OBJ_SPR) {
                    switch (CEventProgram.getEventCode(code)) {
                        case (4 << 16):      // ACTL_EXTSTOP:
                        case (9 << 16):      // ACTL_EXTBOUNCE:

                            evgF |= CEventGroup.EVGFLAGS_STOPINGROUP;

                            // Recherche dans le groupe, la cause du STOP. limitList
                            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                            oi = evtPtr.evtOi;
                            if ((oi & COI.OIFLAG_QUALIFIER) != 0) {
                                for (o = this.qual_GetFirstOiList2(evtPtr.evtOiList); o != -1; o = this.qual_GetNextOiList2()) {
                                    colList = this.make_ColList1(evgPtr, colList, this.rhPtr.rhOiList[o].oilOi);
                                }
                            }
                            else {
                                colList = this.make_ColList1(evgPtr, colList, oi);
                            }
                            break;
                        case (25 << 16):      // ACTL_EXTSHUFFLE:
                            evgF |= CEventGroup.EVGFLAGS_SHUFFLE;
                            break;
                        case (-14 << 16):     // CNDL_EXTCOLLISION:
                            evpPtr = evtPtr.evtParams[0];
                            var pEvpObject = evtPtr.evtParams[0];
                            this.addColList(evtPtr.evtOiList, evtPtr.evtOi, pEvpObject.oiList, pEvpObject.oi);
                            this.addColList(pEvpObject.oiList, pEvpObject.oi, evtPtr.evtOiList, evtPtr.evtOi);
                            // L'objet 1 est-il un sprite?
                            type1 = CEventProgram.EVTTYPE(evtPtr.evtCode);
                            if (this.isTypeRealSprite(type1)) {
                                d2 = CObjInfo.OILIMITFLAGS_QUICKCOL | CObjInfo.OILIMITFLAGS_ONCOLLIDE;
                            }
                            else {
                                d2 = CObjInfo.OILIMITFLAGS_QUICKCOL | CObjInfo.OILIMITFLAGS_QUICKEXT | CObjInfo.OILIMITFLAGS_ONCOLLIDE;
                            }

                            // L'objet 2 est-il un sprite?
                            type2 = pEvpObject.type;
                            if (this.isTypeRealSprite(type2)) {
                                d1 = CObjInfo.OILIMITFLAGS_QUICKCOL | CObjInfo.OILIMITFLAGS_ONCOLLIDE;
                            }
                            else {
                                d1 = CObjInfo.OILIMITFLAGS_QUICKCOL | CObjInfo.OILIMITFLAGS_QUICKEXT | CObjInfo.OILIMITFLAGS_ONCOLLIDE;
                            }
                            n = 3;
                            break;
                        case (-4 << 16):     // CNDL_EXTISCOLLIDING:
                            // L'objet 1 est-il un sprite?
                            type1 = CEventProgram.EVTTYPE(evtPtr.evtCode);
                            if (this.isTypeRealSprite(type1)) {
                                d2 = CObjInfo.OILIMITFLAGS_QUICKCOL;
                            }
                            else {
                                d2 = CObjInfo.OILIMITFLAGS_QUICKCOL | CObjInfo.OILIMITFLAGS_QUICKEXT;
                            }

                            // L'objet 2 est-il un sprite?
                            evpPtr = evtPtr.evtParams[0];
                            type2 = evtPtr.evtParams[0].type;
                            if (this.isTypeRealSprite(type2)) {
                                d1 = CObjInfo.OILIMITFLAGS_QUICKCOL;
                            }
                            else {
                                d1 = CObjInfo.OILIMITFLAGS_QUICKCOL | CObjInfo.OILIMITFLAGS_QUICKEXT;
                            }
                            n = 3;
                            break;
                        case (-11 << 16):     // CNDL_EXTINPLAYFIELD:
                        case (-12 << 16):     // CNDL_EXTOUTPLAYFIELD:
                            d1 = CObjInfo.OILIMITFLAGS_QUICKBORDER;
                            n = 1;
                            break;
                        case (-13 << 16):     // CNDL_EXTCOLBACK:
                            d1 = CObjInfo.OILIMITFLAGS_QUICKBACK;
                            n = 1;
                            break;
                    }
                }
                else {
                    switch (code) {
                        case ((-6 << 16) | 65535):      // CNDL_ONCE
                            evgM &= ~CEventGroup.EVGFLAGS_ONCE;
                            break;
                        case ((-7 << 16) | 65535):      // CNDL_NOTALWAYS:
                            evgM |= CEventGroup.EVGFLAGS_NOMORE;
                            break;
                        case ((-5 << 16) | 65535):      // CNDL_REPEAT:
                            evgM |= CEventGroup.EVGFLAGS_NOMORE;
                            break;
                        case ((-4 << 16) | 65535):      // CNDL_NOMORE:
                            evgM |= CEventGroup.EVGFLAGS_NOTALWAYS + CEventGroup.EVGFLAGS_REPEAT;
                            break;
                        case ((-4 << 16) | 0xFFFA):     // CNDL_MONOBJECT:
                            d2 = CObjInfo.OILIMITFLAGS_QUICKCOL;
                            evpPtr = evtPtr.evtParams[0];
                            n = 2;
                            break;
                        case ((-7 << 16) | 0xFFFA):     // CNDL_MCLICKONOBJECT:
                            d2 = CObjInfo.OILIMITFLAGS_QUICKCOL;
                            evpPtr = evtPtr.evtParams[1];
                            n = 2;
                            break;
                    }
                }
                // Poke les flags collision
                if ((n & 1) != 0) {
                    for (o = this.qual_GetFirstOiList(evtPtr.evtOiList); o != -1; o = this.qual_GetNextOiList()) {
                        this.rhPtr.rhOiList[o].oilLimitFlags |= d1;
                    }
                }
                if ((n & 2) != 0) {
                    for (o = this.qual_GetFirstOiList(evpPtr.oiList); o != -1; o = this.qual_GetNextOiList()) {
                        this.rhPtr.rhOiList[o].oilLimitFlags |= d2;
                    }
                }
            }
            // Inhibe les anciens flags
            evgPtr.evgFlags &= ~evgM;
            evgPtr.evgFlags |= evgF;
        }
        this.colBuffer[colList] = -1;

        // Reserve le buffer des pointeurs sur listes d'events
        // ---------------------------------------------------
        var aListPointers = new Array(COI.NUMBEROF_SYSTEMTYPES + oiMax + 1);

        // Filled the table with offsets based on the types (translated from french)
        ss = 0;
        var alp;
        for (alp = 0, type = -COI.NUMBEROF_SYSTEMTYPES; type < 0; type++, alp++) {
            aListPointers[alp] = ss;
            ss += this.nConditions[COI.NUMBEROF_SYSTEMTYPES + type];
        }
        // Continue with OI , the right size for the type of oi (translated from french)
        for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++, alp++) {
            aListPointers[alp] = ss;
            if (this.rhPtr.rhOiList[oil].oilType < COI.KPX_BASE) {
                ss += this.nConditions[COI.NUMBEROF_SYSTEMTYPES + this.rhPtr.rhOiList[oil].oilType] + CEventProgram.EVENTS_EXTBASE + 1;
            }
            else {
                ss += this.application.extLoader.getNumberOfConditions(this.rhPtr.rhOiList[oil].oilType) + CEventProgram.EVENTS_EXTBASE + 1;
            }
        }

        // Reserve le buffer des pointeurs
        var sListPointers = ss;
        this.listPointers = new Array(sListPointers);
        for (n = 0; n < sListPointers; n++) {
            this.listPointers[n] = 0;
        }
        evtAlways = 0;

        // Explore le programme et repere les evenements
        var wBufNear = new Array(this.rhPtr.rhFrame.maxObjects);
        var wPtrNear;
        for (evg = 0; evg < this.nEvents; evg++) {
            evgPtr = this.events[evg];
            evgPtr.evgFlags &= ~CEventGroup.EVGFLAGS_ORINGROUP;
            bOrBefore = true;
            cndOR = 0;
            for (evt = 0; evt < evgPtr.evgNCond; evt++) {
                evtPtr = evgPtr.evgEvents[evt];
                type = CEventProgram.EVTTYPE(evtPtr.evtCode);
                code = evtPtr.evtCode;
                num = -CEventProgram.EVTNUM(code);

                if (bOrBefore) {
                    // Dans la liste des evenements ALWAYS
                    if ((evtPtr.evtFlags & CEvent.EVFLAGS_ALWAYS) != 0) {
                        evtAlways++;
                    }

                    // Dans la liste des evenements generaux si objet systeme
                    if (type < 0) {
                        this.listPointers[aListPointers[7 + type] + num]++;
                    }
                    else
                    // Un objet normal / qualifier : relie aux objets
                    {
                        wPtrNear = 0;
                        for (o = this.qual_GetFirstOiList(evtPtr.evtOiList); o != -1; o = this.qual_GetNextOiList()) {
                            this.listPointers[aListPointers[COI.NUMBEROF_SYSTEMTYPES + o] + num]++;
                            wBufNear[wPtrNear++] = o;
                        }
                        wBufNear[wPtrNear] = -1;
                        // Cas special pour les collisions de sprites : branche aux deux sprites (sauf si meme!)
                        if (CEventProgram.getEventCode(code) == (-14 << 16))      // CNDL_EXTCOLLISION
                        {
                            evpPtr = evtPtr.evtParams[0];
                            for (oo = this.qual_GetFirstOiList(evpPtr.oiList); oo != -1; oo = this.qual_GetNextOiList()) {
                                for (wPtrNear = 0; wBufNear[wPtrNear] != oo && wBufNear[wPtrNear] != -1;) {
                                    wPtrNear++;
                                }
                                if (wBufNear[wPtrNear] == -1) {
                                    this.listPointers[aListPointers[COI.NUMBEROF_SYSTEMTYPES + oo] + num]++;
                                }
                            }
                        }
                    }
                }
                bOrBefore = false;
                if (evtPtr.evtCode == ((-24 << 16) | 65535) || evtPtr.evtCode == ((-25 << 16) | 65535))     // CNDL_OR - CNDL_ORLOGICAL
                {
                    bOrBefore = true;
                    evgPtr.evgFlags |= CEventGroup.EVGFLAGS_ORINGROUP;
                    // Un seul type de OR dans un groupe
                    if (cndOR == 0) {
                        cndOR = evtPtr.evtCode;
                    }
                    else {
                        evtPtr.evtCode = cndOR;
                    }
                    // Marque les OR Logical
                    if (cndOR == ((-25 << 16) | 65535))       // CNDL_ORLOGICAL)
                    {
                        evgPtr.evgFlags |= CEventGroup.EVGFLAGS_ORLOGICAL;
                    }
                }
            }
        }

        // Calcule les tailles necessaires, poke les pointeurs dans les listes
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var sEventPointers = evtAlways + 1;
        var uil;
        for (uil = 0; uil < sListPointers; uil++) {
            if (this.listPointers[uil] != 0) {
                ss = this.listPointers[uil];
                this.listPointers[uil] = sEventPointers;
                sEventPointers += ss + 1;
            }
        }
        this.eventPointersGroup = new Array(sEventPointers);
        this.eventPointersCnd = new Array(sEventPointers);
        for (n = 0; n < sEventPointers; n++) {
            this.eventPointersGroup[n] = null;
            this.eventPointersCnd[n] = 0;
        }

        var lposBuffer = new Array(sListPointers);
        for (n = 0; n < sListPointers; n++) {
            lposBuffer[n] = this.listPointers[n];
        }

        // 288.2 - fast loops were doubled if there was a frame fade-in transition
        this.rhPtr.rh4PosOnLoop = null;

        evtAlwaysPos = 0;
        evtAlways = 0;
        var lposPtr;
        this.complexOnLoop = false;
        for (evg = 0; evg < this.nEvents; evg++) {
            evgPtr = this.events[evg];
            bOrBefore = true;
            for (evt = 0; evt < evgPtr.evgNCond; evt++) {
                evtPtr = evgPtr.evgEvents[evt];
                type = CEventProgram.EVTTYPE(evtPtr.evtCode);
                code = evtPtr.evtCode;
                num = -CEventProgram.EVTNUM(code);

                if (bOrBefore) {
                    // Dans la liste des evenements ALWAYS
                    if ((evtPtr.evtFlags & CEvent.EVFLAGS_ALWAYS) != 0) {
                        evtAlways++;
                        this.eventPointersGroup[evtAlwaysPos] = evgPtr;
                        this.eventPointersCnd[evtAlwaysPos] = evt;
                        evtAlwaysPos++;
                    }

                    // Dans la liste des evenements generaux si objet systeme
                    if (type < 0) {
                        lposPtr = aListPointers[COI.NUMBEROF_SYSTEMTYPES + type] + num;
                        this.eventPointersGroup[lposBuffer[lposPtr]] = evgPtr;
                        this.eventPointersCnd[lposBuffer[lposPtr]] = evt;
                        lposBuffer[lposPtr]++;

                        if (evtPtr.evtCode == CCnd.CND_ONLOOP) {
                            var n;
                            var bOR = false;
                            for (n = 0; n < evgPtr.evgNCond; n++) {
                                if (evgPtr.evgEvents[n].evtCode == CCnd.CND_OR || evgPtr.evgEvents[n].evtCode == CCnd.CND_ORLOGICAL) {
                                    break;
                                }
                            }
                            if (n < evgPtr.evgNCond) {
                                bOR = true;
                            }

                            var expression = evtPtr.evtParams[0];
                            if (expression.tokens[0].code == CExp.EXP_STRING && expression.tokens[1].code == 0) {
                                var pName = expression.tokens[0].string;
                                var fastLoopIndex = this.rhPtr.addFastLoop(pName);
                                for (n = 0; n < posStartLoop.length; n++) {
                                    var pPos = posStartLoop[n];
                                    if (CServices.compareStringsIgnoreCase(pPos.name, pName)) {
                                        if (!this.rhPtr.rh4PosOnLoop) {
                                            this.rhPtr.rh4PosOnLoop = new Array();
                                        }

                                        var posOnLoop = null;
                                        for (n = 0; n < this.rhPtr.rh4PosOnLoop.length; n++) {
                                            if (CServices.compareStringsIgnoreCase(pName, this.rhPtr.rh4PosOnLoop[n].name)) {
                                                posOnLoop = this.rhPtr.rh4PosOnLoop[n];
                                                break;
                                            }
                                        }
                                        if (!posOnLoop) {
                                            posOnLoop = new CPosOnLoop(pName, fastLoopIndex);
                                            this.rhPtr.rh4PosOnLoop.push(posOnLoop);
                                        }
                                        posOnLoop.AddOnLoop(evgPtr);
                                        posOnLoop.m_bOR |= bOR;
                                        pPos.address.fastFastLoop = n + 1;
                                        break;
                                    }
                                }
                            }
                            else {
                                this.complexOnLoop = true;
                            }
                        }

                    }
                    else
                    // Un objet normal : relie a l'objet
                    {
                        wPtrNear = 0;
                        for (o = this.qual_GetFirstOiList(evtPtr.evtOiList); o != -1; o = this.qual_GetNextOiList()) {
                            lposPtr = aListPointers[COI.NUMBEROF_SYSTEMTYPES + o] + num;
                            this.eventPointersGroup[lposBuffer[lposPtr]] = evgPtr;
                            this.eventPointersCnd[lposBuffer[lposPtr]] = evt;
                            lposBuffer[lposPtr]++;
                            wBufNear[wPtrNear++] = o;
                        }
                        wBufNear[wPtrNear] = -1;
                        // Cas special pour les collisions de sprites : branche aux deux sprites (sauf si meme!)
                        if (CEventProgram.getEventCode(code) == (-14 << 16))      // CNDL_EXTCOLLISION
                        {
                            evpPtr = evtPtr.evtParams[0];
                            for (oo = this.qual_GetFirstOiList(evpPtr.oiList); oo != -1; oo = this.qual_GetNextOiList()) {
                                for (wPtrNear = 0; wBufNear[wPtrNear] != oo && wBufNear[wPtrNear] != -1;) {
                                    wPtrNear++;
                                }
                                if (wBufNear[wPtrNear] == -1) {
                                    lposPtr = aListPointers[COI.NUMBEROF_SYSTEMTYPES + oo] + num;
                                    this.eventPointersGroup[lposBuffer[lposPtr]] = evgPtr;
                                    this.eventPointersCnd[lposBuffer[lposPtr]] = evt;
                                    lposBuffer[lposPtr]++;
                                }
                            }
                        }
                    }
                }
                bOrBefore = false;
                if (evtPtr.evtCode == ((-24 << 16) | 65535) || evtPtr.evtCode == ((-25 << 16) | 65535))     // CNDL_OR - CNDL_ORLOGICAL
                {
                    bOrBefore = true;
                }
            }
        }
        ;

        // Adresse des conditions timer
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        uil = aListPointers[COI.NUMBEROF_SYSTEMTYPES + COI.OBJ_TIMER];
        aTimers = this.listPointers[uil - CEventProgram.EVTNUM(((-3 << 16) | 0xFFFC))];     // CNDL_TIMER

        // Poke les adresses et les autres flags des pointeurs dans tous OI
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.limitBuffer = new Array(oiMax + 1 + colList / 2);
        var limitListStart = 0;
        var limitPos, limitCur;
        for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
            oilPtr = this.rhPtr.rhOiList[oil];

            // Poke l'offset dans les events
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            uil = aListPointers[COI.NUMBEROF_SYSTEMTYPES + oil];
            oilPtr.oilEvents = uil;

            // Traitement des flags particuliers
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            var act;
            if ((oilPtr.oilOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) != 0) {
                // Recherche les flags WRAP dans les messages OUT OF PLAYFIELD
                fWrap = 0;
                ss = this.listPointers[uil - CEventProgram.EVTNUM(-12 << 16)];     // CNDL_EXTOUTPLAYFIELD
                if (ss != 0) {
                    while (this.eventPointersGroup[ss] != null) {
                        evgPtr = this.eventPointersGroup[ss];
                        evtPtr = evgPtr.evgEvents[this.eventPointersCnd[ss]];
                        d = evtPtr.evtParams[0].value;    // Prend la direction
                        for (act = CEventProgram.evg_FindAction(evgPtr, 0), n = evgPtr.evgNAct; n > 0; n--, act++) {
                            evtPtr = evgPtr.evgEvents[act];
                            if (evtPtr.evtCode == ((8 << 16) | (oilPtr.oilType & 0xFFFF))) // ACT_EXTWRAP
                            {
                                fWrap |= d;
                            }
                        }
                        ss++;
                    }
                }
                oilPtr.oilWrap = fWrap;

                // Fabrique la table de limitations des mouvements
                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                oi1 = oilPtr.oilOi;
                for (colList = 0, limitPos = 0; this.colBuffer[colList] != -1; colList += 2) {
                    if (this.colBuffer[colList] == oi1) {
                        oi2 = this.colBuffer[colList + 1];
                        if ((oi2 & 0x8000) != 0) {
                            oilPtr.oilLimitFlags |= oi2;
                            continue;
                        }
                        for (limitCur = 0; limitCur < limitPos && this.limitBuffer[limitListStart + limitCur] != oi2;) {
                            limitCur++;
                        }
                        if (limitCur == limitPos) {
                            this.limitBuffer[limitListStart + limitPos++] = oi2;
                        }
                    }
                }
                // Marque la fin...
                if (limitPos > 0) {
                    oilPtr.oilLimitList = limitListStart;
                    this.limitBuffer[limitListStart + limitPos++] = -1;
                    limitListStart += limitPos;
                }
            }
        }

        // Met les adresses des tables de pointeur systeme
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.rhEvents[0] = 0;
        for (n = 1; n <= COI.NUMBEROF_SYSTEMTYPES; n++) {
            this.rhEvents[n] = aListPointers[COI.NUMBEROF_SYSTEMTYPES - n];
        }

        // Poke les adresses et les autres flags des pointeurs dans tous les objets definis
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
            oilPtr = this.rhPtr.rhOiList[oil];

            // Explore tous les objets de meme OI dans le programme
            o = oilPtr.oilObject;
            if ((o & 0x80000000) == 0) {
                do {
                    // Met les oi dans les ro
                    hoPtr = this.rhPtr.rhObjectList[o];
                    hoPtr.hoEvents = oilPtr.oilEvents;
                    hoPtr.hoOiList = oilPtr;
                    hoPtr.hoLimitFlags = oilPtr.oilLimitFlags;
                    // Flags Wrap pour les objets avec movement
                    if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_MOVEMENTS) != 0) {
                        hoPtr.rom.rmWrapping = oilPtr.oilWrap;
                    }
                    // Si le sprite n'est pas implique dans les collisions . le passe en neutre
                    if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_SPRITES) != 0 && (hoPtr.hoLimitFlags & (CObjInfo.OILIMITFLAGS_QUICKCOL)) == 0) {
                        hoPtr.ros.setColFlag(false);
                    }
                    // CSceneNode en mode inbitate?
                    if ((hoPtr.hoOEFlags & CObjectCommon.OEFLAG_MANUALSLEEP) == 0) {
                        // On detruit... sauf si...
                        hoPtr.hoOEFlags &= ~CObjectCommon.OEFLAG_NEVERSLEEP;

                        // On teste des collisions avec le decor?
                        if ((hoPtr.hoLimitFlags & CObjInfo.OILIMITFLAGS_QUICKBACK) != 0) {
                            // Si masque des collisions general
                            if ((this.rhPtr.rhFrame.leFlags & CRunFrame.LEF_TOTALCOLMASK) != 0) {
                                hoPtr.hoOEFlags |= CObjectCommon.OEFLAG_NEVERSLEEP;
                            }
                        }
                        // Ou test des collisions normal
                        if ((hoPtr.hoLimitFlags & (CObjInfo.OILIMITFLAGS_QUICKCOL | CObjInfo.OILIMITFLAGS_QUICKBORDER)) != 0) {
                            hoPtr.hoOEFlags |= CObjectCommon.OEFLAG_NEVERSLEEP;
                        }
                    }
                    o = hoPtr.hoNumNext;
                } while ((o & 0x80000000) == 0);
            }
        }
        // Les messages speciaux
        // ~~~~~~~~~~~~~~~~~~~~~
        if (evtAlways != 0) {
            this.rhEventAlways = true;
        }
        else {
            this.rhEventAlways = false;
        }
        // Messages Timer (a bulle!)
        if (aTimers != 0) {
            this.rh4TimerEventsBase = aTimers;
        }
        else {
            this.rh4TimerEventsBase = 0;
        }

        // Liberation
        this.colBuffer = null;
        this.bReady = true;

    },

    unBranchPrograms: function () {
        this.bReady = false;
        this.qualToOiList = null;
        this.limitBuffer = null;
        this.listPointers = null;
        this.eventPointersGroup = null;
        this.eventPointersCnd = null;
    },

    get_OiListOffset: function (oi, type) {
        if ((oi & COI.OIFLAG_QUALIFIER) != 0) {
            var q;
            for (q = 0; oi != this.qualifiers[q].qOi || type != this.qualifiers[q].qType;) {
                q++;
            }
            return (q | 0x8000);
        }
        else {
            var n;
            for (n = 0; n < this.rhPtr.rhMaxOI && this.rhPtr.rhOiList[n].oilOi != oi;) {
                n++;
            }
            return n;
        }
    },

    isTypeRealSprite: function (type) {
        var oil;
        for (oil = 0; oil < this.rhPtr.rhMaxOI; oil++) {
            if (this.rhPtr.rhOiList[oil].oilOi != -1) {
                if (this.rhPtr.rhOiList[oil].oilType == type) {
                    if ((this.rhPtr.rhOiList[oil].oilOEFlags & CObjectCommon.OEFLAG_SPRITES) != 0 && (this.rhPtr.rhOiList[oil].oilOEFlags & CObjectCommon.OEFLAG_QUICKDISPLAY) == 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    qual_GetFirstOiList: function (o) {
        if ((o & 0x8000) == 0) {
            this.qualOilPtr = -1;
            return (o);
        }
        if (o == -1) {
            return -1;
        }

        o &= 0x7FFF;
        this.qualOilPtr = o;
        this.qualOilPos = 0;
        return this.qual_GetNextOiList();
    },

    qual_GetNextOiList: function () {
        var o;

        if (this.qualOilPtr == -1) {
            return -1;
        }
        if (this.qualOilPos >= this.qualToOiList[this.qualOilPtr].qoiList.length) {
            return -1;
        }
        o = this.qualToOiList[this.qualOilPtr].qoiList[this.qualOilPos + 1];
        this.qualOilPos += 2;
        return (o);
    },

    qual_GetFirstOiList2: function (o) {
        if ((o & 0x8000) == 0) {
            this.qualOilPtr2 = -1;
            return (o);
        }
        if (o == -1) {
            return -1;
        }

        o &= 0x7FFF;
        this.qualOilPtr2 = o;
        this.qualOilPos2 = 0;
        return this.qual_GetNextOiList2();
    },

    qual_GetNextOiList2: function () {
        var o;

        if (this.qualOilPtr2 == -1) {
            return -1;
        }
        if (this.qualOilPos2 >= this.qualToOiList[this.qualOilPtr2].qoiList.length) {
            return -1;
        }
        o = this.qualToOiList[this.qualOilPtr2].qoiList[this.qualOilPos2 + 1];
        this.qualOilPos2 += 2;
        return (o);
    },

    addColList: function (oiList, oiNum, oiList2, oiNum2) {
        var qoil;
        var pOinOil;
        if (oiNum < 0) {
            if (this.qualToOiList != null) {
                qoil = this.qualToOiList[oiList & 0x7FFF];
                pOinOil = 0;
                while (pOinOil < qoil.qoiList.length) {
                    this.addColList(qoil.qoiList[pOinOil + 1], qoil.qoiList[pOinOil], oiList2, oiNum2);
                    pOinOil += 2;
                }
            }
            return;
        }

        if (oiNum2 < 0) {
            if (this.qualToOiList != null) {
                qoil = this.qualToOiList[oiList2 & 0x7FFF];
                pOinOil = 0;
                while (pOinOil < qoil.qoiList.length) {
                    this.addColList(oiList, oiNum, qoil.qoiList[pOinOil + 1], qoil.qoiList[pOinOil]);
                    pOinOil += 2;
                }
            }
            return;
        }

        var colList;
        var oilPtr = this.rhPtr.rhOiList[oiList];
        if (oilPtr.oilColList == null) {
            oilPtr.oilColList = new Array();
            colList = oilPtr.oilColList;
        }
        else {
            colList = oilPtr.oilColList;

            var n;
            for (n = 0; n < colList.length; n += 2) {
                if (oiNum2 == colList[n]) {
                    return;
                }
            }
        }
        colList.push(oiNum2);
        colList.push(oiList2);
    },

    make_ColList1: function (evgPtr, colList, oi1) {
        var oi2;
        var flag;
        var code;
        var o;
        var evtPtr;
        var evpPtr;
        var evt;

        for (evt = 0; evt < evgPtr.evgNCond; evt++) {
            evtPtr = evgPtr.evgEvents[evt];
            if (CEventProgram.EVTTYPE(evtPtr.evtCode) >= 2) {
                flag = (0x8000 + CObjInfo.OILIMITFLAGS_BACKDROPS);
                code = CEventProgram.getEventCode(evtPtr.evtCode);
                switch (code) {
                    case (-14 << 16):
                        evpPtr = evtPtr.evtParams[0];
                        for (o = this.qual_GetFirstOiList(evtPtr.evtOiList); o != -1; o = this.qual_GetNextOiList()) {
                            oi2 = this.rhPtr.rhOiList[o].oilOi;
                            if (oi1 == oi2) {
                                flag = 0;
                                colList = this.make_ColList2(colList, oi1, evpPtr.oiList);
                            }
                        }
                        if (flag == 0) {
                            break;
                        }
                        for (o = this.qual_GetFirstOiList(evpPtr.oiList); o != -1; o = this.qual_GetNextOiList()) {
                            oi2 = this.rhPtr.rhOiList[o].oilOi;
                            if (oi1 == oi2) {
                                colList = this.make_ColList2(colList, oi1, evtPtr.evtOiList);
                            }
                        }
                        break;
                    case (-12 << 16):
                        evpPtr = evtPtr.evtParams[0];
                        flag = (0x8000 + evpPtr.value);
                    case (-13 << 16):
                        for (o = this.qual_GetFirstOiList(evtPtr.evtOiList); o != -1; o = this.qual_GetNextOiList()) {
                            oi2 = this.rhPtr.rhOiList[o].oilOi;
                            if (oi1 == oi2) {
                                this.colBuffer[colList++] = oi1;
                                this.colBuffer[colList++] = flag;
                            }
                        }
                        break;
                }
            }
        }
        return (colList);
    },

    make_ColList2: function (colList, oi1, ol) {
        var oi2;
        var o;
        for (o = this.qual_GetFirstOiList(ol); o != -1; o = this.qual_GetNextOiList()) {
            oi2 = this.rhPtr.rhOiList[o].oilOi;

            var pos;
            for (pos = 0; pos < colList; pos += 2) {
                if (this.colBuffer[pos] == oi1 && this.colBuffer[pos + 1] == oi2) {
                    break;
                }
            }
            if (pos == colList) {
                this.colBuffer[colList++] = oi1;
                this.colBuffer[colList++] = oi2;
            }
        }
        return colList;
    },

    getCollisionFlags: function () {
        var evgPtr;
        var evtPtr;
        var evpPtr;
        var evg, evt, evp;
        var flag;
        for (evg = 0; evg < this.events.length; evg++) {
            evgPtr = this.events[evg];

            for (evt = 0; evt < evgPtr.evgNAct + evgPtr.evgNCond; evt++) {
                evtPtr = evgPtr.evgEvents[evt];

                if (evtPtr.evtNParams > 0) {
                    for (evp = 0; evp < evtPtr.evtNParams; evp++) {
                        evpPtr = evtPtr.evtParams[evp];
                        if (evpPtr.code == 43) {
                            var p = evpPtr;
                            switch (p.value) {
                                case 1:
                                    flag |= CColMask.CM_OBSTACLE;
                                    break;
                                case 2:
                                    flag |= CColMask.CM_PLATFORM;
                                    break;
                            }
                        }
                    }
                }
            }
        }
        return flag;
    },

    enumSounds: function (sounds) {
        var evgPtr;
        var evtPtr;
        var evg, evt, p;
        var pSample;

        for (evg = 0; evg < this.nEvents; evg++) {
            evgPtr = this.events[evg];
            for (evt = 0; evt < evgPtr.evgNCond + evgPtr.evgNAct; evt++) {
                evtPtr = evgPtr.evgEvents[evt];
                for (p = 0; p < evtPtr.evtNParams; p++) {
                    switch (evtPtr.evtParams[p].code) {
                        case 6:
                        case 35:
                            pSample = evtPtr.evtParams[p];
                            sounds.enumerate(pSample.sndHandle);
                            break;
                    }
                }
            }
        }
    },

    HandleKeyRepeat: function () {
        var evgPtr;
        var evtPtr;
        var evg, evt, p;

        for (evg = 0; evg < this.nEvents; evg++) {
            evgPtr = this.events[evg];
            for (evt = 0; evt < evgPtr.evgNCond; evt++) {
                evtPtr = evgPtr.evgEvents[evt];
                if (evtPtr.evtCode == ((-1 << 16) | 0xFFFA)) {
                    evgPtr.evgInhibit = this.rhPtr.rhLoopCount;
                    break;
                }
            }
        }
    }
}
