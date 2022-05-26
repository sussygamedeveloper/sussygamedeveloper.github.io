// CCnd object
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

CCnd.NUM_ONEVENT = 6;
CCnd.CND_ONLOOP = ((-16 << 16) | 0xFFFF);
CCnd.CND_OR = ((-24 << 16) | 65535);
CCnd.CND_ORLOGICAL = ((-25 << 16) | 65535);

CCnd.create = function (app) {
    var debut = app.file.getFilePointer();

    var size = app.file.readAShort();
    var cnd = null;
    var c = app.file.readAInt();
    switch (c) {
        case ((-40 << 16) | 0xFFFF):
            cnd = new CND_RUNNINGAS();
            break;
        case ((-39 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_GT();
            break;
        case ((-38 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_GE();
            break;
        case ((-37 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_LT();
            break;
        case ((-36 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_LE();
            break;
        case ((-35 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_NE();
            break;
        case ((-34 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_EQ();
            break;
        case ((-33 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_GT();
            break;
        case ((-32 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_GE();
            break;
        case ((-31 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_LT();
            break;
        case ((-30 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_LE();
            break;
        case ((-29 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_NE();
            break;
        case ((-28 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGCONST_EQ();
            break;
        case ((-27 << 16) | 0xFFFF):    // ELSE IF
            cnd = new CND_NEVER();
            break;
        case ((-26 << 16) | 0xFFFF):
            cnd = new CND_CHANCE();
            break;
        case ((-25 << 16) | 0xFFFF):        // CND_ORLOGICAL
            cnd = new CND_NEVER();
            break;
        case ((-24 << 16) | 0xFFFF):        // CND_OR        
            cnd = new CND_NEVER();
            break;
        case ((-23 << 16) | 0xFFFF):
            cnd = new CND_GROUPSTART();
            break;
        case ((-20 << 16) | 0xFFFF):
            cnd = new CND_COMPAREGSTRING();
            break;
        case ((-16 << 16) | 0xFFFF):
            cnd = new CND_ONLOOP();
            break;
        case ((-12 << 16) | 0xFFFF):
            cnd = new CND_GROUPACTIVATED();
            break;
        case ((-11 << 16) | 0xFFFF):
            cnd = new CND_NEVER();
            break;
        case ((-10 << 16) | 0xFFFF):
            cnd = new CND_NEVER();
            break;
        case ((-9 << 16) | 0xFFFF):
            cnd = new CND_NEVER();
            break;
        case ((-8 << 16) | 0xFFFF):
            cnd = new CND_COMPAREG();
            break;
        case ((-7 << 16) | 0xFFFF):
            cnd = new CND_NOTALWAYS();
            break;
        case ((-6 << 16) | 0xFFFF):
            cnd = new CND_ONCE();
            break;
        case ((-5 << 16) | 0xFFFF):
            cnd = new CND_REPEAT();
            break;
        case ((-4 << 16) | 0xFFFF):
            cnd = new CND_NOMORE();
            break;
        case ((-3 << 16) | 0xFFFF):
            cnd = new CND_COMPARE();
            break;
        case ((-2 << 16) | 0xFFFF):
            cnd = new CND_NEVER();
            break;
        case ((-1 << 16) | 0xFFFF):
            cnd = new CND_ALWAYS();
            break;
        case ((-9 << 16) | 0xFFFE):
            cnd = new CND_SPCHANNELPAUSED();
            break;
        case ((-8 << 16) | 0xFFFE):
            cnd = new CND_NOSPCHANNELPLAYING();
            break;
        case ((-6 << 16) | 0xFFFE):
            cnd = new CND_SPSAMPAUSED();
            break;
        case ((-3 << 16) | 0xFFFE):
            cnd = new CND_NOSAMPLAYING;
            break;
        case ((-1 << 16) | 0xFFFE):
            cnd = new CND_NOSPSAMPLAYING();
            break;
        case ((-8 << 16) | 0xFFFD):
            cnd = new CND_ENDOFPAUSE();
            break;
        case ((-7 << 16) | 0xFFFD):
            cnd = new CND_ISVSYNCON();
            break;
        case ((-6 << 16) | 0xFFFD):
            cnd = new CND_ISLADDER();
            break;
        case ((-5 << 16) | 0xFFFD):
            cnd = new CND_ISOBSTACLE();
            break;
        case ((-4 << 16) | 0xFFFD): // This is end of application event!
            cnd = new CND_QUITAPPLICATION();
            break;
        case ((-3 << 16) | 0xFFFD):
            cnd = new CND_NEVER();
            break;
        case ((-2 << 16) | 0xFFFD): // CND_END (OF FRAME)
            cnd = new CND_ALWAYS();
            break;
        case ((-1 << 16) | 0xFFFD): // CND_START (OF FRAME)
            cnd = new CND_START();
            break;
        case ((-8 << 16) | 0xFFFC):
            cnd = new CND_EVERY2();
            break;
        case ((-7 << 16) | 0xFFFC):
            cnd = new CND_TIMEREQUALS();
            break;
        case ((-6 << 16) | 0xFFFC):
            cnd = new CND_ONEVENT();
            break;
        case ((-5 << 16) | 0xFFFC):
            cnd = new CND_TIMEOUT();
            break;
        case ((-4 << 16) | 0xFFFC):
            cnd = new CND_EVERY();
            break;
        case ((-3 << 16) | 0xFFFC):
            cnd = new CND_TIMER();
            break;
        case ((-2 << 16) | 0xFFFC):
            cnd = new CND_TIMERINF();
            break;
        case ((-1 << 16) | 0xFFFC):
            cnd = new CND_TIMERSUP();
            break;
        case ((-12 << 16) | 0xFFFA):
            cnd = new CND_ONMOUSEWHEELDOWN();
            break;
        case ((-11 << 16) | 0xFFFA):
            cnd = new CND_ONMOUSEWHEELUP();
            break;
        case ((-10 << 16) | 0xFFFA):
            cnd = new CND_MOUSEON();
            break;
        case ((-9 << 16) | 0xFFFA):
            cnd = new CND_ANYKEY();
            break;
        case ((-8 << 16) | 0xFFFA):
            cnd = new CND_MKEYDEPRESSED();
            break;
        case ((-7 << 16) | 0xFFFA):
            cnd = new CND_MCLICKONOBJECT();
            break;
        case ((-6 << 16) | 0xFFFA):
            cnd = new CND_MCLICKINZONE();
            break;
        case ((-5 << 16) | 0xFFFA):
            cnd = new CND_MCLICK();
            break;
        case ((-4 << 16) | 0xFFFA):
            cnd = new CND_MONOBJECT();
            break;
        case ((-3 << 16) | 0xFFFA):
            cnd = new CND_MINZONE();
            break;
        case ((-2 << 16) | 0xFFFA):
            cnd = new CND_KBKEYDEPRESSED();
            break;
        case ((-1 << 16) | 0xFFFA):
            cnd = new CND_KBPRESSKEY();
            break;
        case ((-6 << 16) | 0xFFF9):
            cnd = new CND_JOYPUSHED();
            break;
        case ((-5 << 16) | 0xFFF9):
            cnd = new CND_NOMORELIVE();
            break;
        case ((-4 << 16) | 0xFFF9):
            cnd = new CND_JOYPRESSED();
            break;
        case ((-3 << 16) | 0xFFF9):
            cnd = new CND_LIVE();
            break;
        case ((-2 << 16) | 0xFFF9):
            cnd = new CND_SCORE();
            break;
        case ((-1 << 16) | 0xFFF9):
            cnd = new CND_PLAYERPLAYING();
            break;
        case ((-23 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEALLINLINE();
            break;
        case ((-22 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEFLAGRESET();
            break;
        case ((-21 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEFLAGSET();
            break;
        case ((-20 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEVALUE();
            break;
        case ((-19 << 16) | 0xFFFB):
            cnd = new CND_PICKFROMID();
            break;
        case ((-18 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEALLINZONE();
            break;
        case ((-17 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEALL();
            break;
        case ((-16 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEZONE();
            break;
        case ((-15 << 16) | 0xFFFB):
            cnd = new CND_NUMOFALLOBJECT();
            break;
        case ((-14 << 16) | 0xFFFB):
            cnd = new CND_NUMOFALLZONE();
            break;
        case ((-13 << 16) | 0xFFFB):
            cnd = new CND_NOMOREALLZONE();
            break;
        case ((-12 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEFLAGRESET_OLD();
            break;
        case ((-11 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEFLAGSET_OLD();
            break;
        case ((-8 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEVALUE_OLD();
            break;
        case ((-7 << 16) | 0xFFFB):
            cnd = new CND_PICKFROMID_OLD();
            break;
        case ((-6 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEALLINZONE_OLD();
            break;
        case ((-5 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEALL_OLD();
            break;
        case ((-4 << 16) | 0xFFFB):
            cnd = new CND_CHOOSEZONE_OLD();
            break;
        case ((-3 << 16) | 0xFFFB):
            cnd = new CND_NUMOFALLOBJECT_OLD();
            break;
        case ((-2 << 16) | 0xFFFB):
            cnd = new CND_NUMOFALLZONE_OLD();
            break;
        case ((-1 << 16) | 0xFFFB):
            cnd = new CND_NOMOREALLZONE_OLD();
            break;
        case (((-80 - 1) << 16) | 7):
            cnd = new CND_CCOUNTER();
            break;
        case (((-80 - 3) << 16) | 4):
            cnd = new CND_QEQUAL();
            break;
        case (((-80 - 2) << 16) | 4):
            cnd = new CND_QFALSE();
            break;
        case (((-80 - 1) << 16) | 4):
            cnd = new CND_QEXACT();
            break;
        case (((-80 - 4) << 16) | (9 & 0x00FF)):
            cnd = new CND_CCAISPAUSED();
            break;
        case (((-80 - 3) << 16) | (9 & 0x00FF)):
            cnd = new CND_CCAISVISIBLE();
            break;
        case (((-80 - 2) << 16) | (9 & 0x00FF)):
            cnd = new CND_CCAAPPFINISHED();
            break;
        case (((-80 - 1) << 16) | (9 & 0x00FF)):
            cnd = new CND_CCAFRAMECHANGED();
            break;
        default:
            switch (c & 0xFFFF0000) {
                case (-43 << 16):
                    cnd = new CND_EXTCMPVARCONST();
                    break;
                case (-42 << 16):
                    cnd = new CND_EXTCMPVARCONST();
                    break;
                case (-41 << 16):
                    cnd = new CND_EXTONLOOP();
                    break;
                case (-40 << 16):
                    cnd = new CND_EXTISSTRIKEOUT();
                    break;
                case (-39 << 16):
                    cnd = new CND_EXTISUNDERLINE();
                    break;
                case (-38 << 16):
                    cnd = new CND_EXTISITALIC();
                    break;
                case (-37 << 16):
                    cnd = new CND_EXTISBOLD();
                    break;
                case (-36 << 16):
                    cnd = new CND_EXTCMPVARSTRING();
                    break;
                case (-35 << 16):
                    cnd = new CND_EXTPATHNODENAME();
                    break;
                case (-34 << 16):
                    cnd = new CND_EXTCHOOSE();
                    break;
                case (-33 << 16):
                    cnd = new CND_EXTNOMOREOBJECT();
                    break;
                case (-32 << 16):
                    cnd = new CND_EXTNUMOFOBJECT();
                    break;
                case (-31 << 16):
                    cnd = new CND_EXTNOMOREZONE();
                    break;
                case (-30 << 16):
                    cnd = new CND_EXTNUMBERZONE();
                    break;
                case (-29 << 16):
                    cnd = new CND_EXTSHOWN();
                    break;
                case (-28 << 16):
                    cnd = new CND_EXTHIDDEN();
                    break;
                case (-27 << 16):
                    cnd = new CND_EXTCMPVAR();
                    break;
                case (-26 << 16):
                    cnd = new CND_EXTCMPVARFIXED();
                    break;
                case (-25 << 16):
                    cnd = new CND_EXTFLAGSET();
                    break;
                case (-24 << 16):
                    cnd = new CND_EXTFLAGRESET();
                    break;
                case (-23 << 16):
                    cnd = new CND_EXTISCOLBACK();
                    break;
                case (-22 << 16):
                    cnd = new CND_EXTNEARBORDERS();
                    break;
                case (-21 << 16):
                    cnd = new CND_EXTENDPATH();
                    break;
                case (-20 << 16):
                    cnd = new CND_EXTPATHNODE();
                    break;
                case (-19 << 16):
                    cnd = new CND_EXTCMPACC();
                    break;
                case (-18 << 16):
                    cnd = new CND_EXTCMPDEC();
                    break;
                case (-17 << 16):
                    cnd = new CND_EXTCMPX();
                    break;
                case (-16 << 16):
                    cnd = new CND_EXTCMPY();
                    break;
                case (-15 << 16):
                    cnd = new CND_EXTCMPSPEED();
                    break;
                case (-14 << 16):
                    cnd = new CND_EXTCOLLISION();
                    break;
                case (-13 << 16):
                    cnd = new CND_EXTCOLBACK();
                    break;
                case (-12 << 16):
                    cnd = new CND_EXTOUTPLAYFIELD();
                    break;
                case (-11 << 16):
                    cnd = new CND_EXTINPLAYFIELD();
                    break;
                case (-10 << 16):
                    cnd = new CND_EXTISOUT();
                    break;
                case (-9 << 16):
                    cnd = new CND_EXTISIN();
                    break;
                case (-8 << 16):
                    cnd = new CND_EXTFACING();
                    break;
                case (-7 << 16):
                    cnd = new CND_EXTSTOPPED();
                    break;
                case (-6 << 16):
                    cnd = new CND_EXTBOUNCING();
                    break;
                case (-5 << 16):
                    cnd = new CND_EXTREVERSED();
                    break;
                case (-4 << 16):
                    cnd = new CND_EXTISCOLLIDING();
                    break;
                case (-3 << 16):
                    cnd = new CND_EXTANIMPLAYING();
                    break;
                case (-2 << 16):
                    cnd = new CND_EXTANIMENDOF();
                    break;
                case (-1 << 16):
                    cnd = new CND_EXTCMPFRAME();
                    break;
                default:
                    cnd = new CCndExtension();
                    break;
            }
    }
    if (cnd != null) {
        cnd.evtCode = c;
        cnd.evtOi = app.file.readShort();
        cnd.evtOiList = app.file.readShort();
        cnd.evtFlags = app.file.readAByte();
        cnd.evtFlags2 = app.file.readAByte();
        cnd.evtNParams = app.file.readAByte();
        cnd.evtDefType = app.file.readAByte();
        cnd.evtIdentifier = app.file.readAShort();

        if (cnd.evtNParams > 0) {
            cnd.evtParams = new Array(cnd.evtNParams);
            var n;
            for (n = 0; n < cnd.evtNParams; n++) {
                cnd.evtParams[n] = CParam.create(app);
            }
        }
    }
    app.file.seek(debut + size);

    return cnd;
}
CCnd.negaTRUE = function (evtPtr) {
    if (evtPtr.evtFlags2 & CEvent.EVFLAG2_NOT) {
        return false;
    }
    return true;
}
CCnd.negaFALSE = function (evtPtr) {
    if (evtPtr.evtFlags2 & CEvent.EVFLAG2_NOT) {
        return true;
    }
    return false;
}
CCnd.negate = function (evtPtr, b) {
    if (evtPtr.evtFlags2 & CEvent.EVFLAG2_NOT) {
        return !b;
    }
    return b;
}
CCnd.compute_GlobalNoRepeat = function (rhPtr) {
    var evgPtr = rhPtr.rhEvtProg.rhEventGroup;
    var inhibit = evgPtr.evgInhibit;
    evgPtr.evgInhibit = rhPtr.rhLoopCount;
    var loopCount = rhPtr.rhLoopCount;
    if (loopCount == inhibit) {
        return false;
    }
    loopCount--;
    if (loopCount == inhibit) {
        return false;
    }
    return true;
}
CCnd.compute_NoRepeatCol = function (identifier, pHo) {
    var id;
    var n;

    var pArray = pHo.hoBaseNoRepeat;
    if (pArray == null) {
        pArray = new CArrayList();
        pHo.hoBaseNoRepeat = pArray;
    }
    else {
        for (n = 0; n < pArray.size(); n++) {
            if (pArray.get(n) == identifier) {
                return false;
            }
        }
    }
    pArray.add(identifier);

    pArray = pHo.hoPrevNoRepeat;
    if (pArray == null) {
        return true;
    }
    for (n = 0; n < pArray.size(); n++) {
        if (pArray.get(n) == identifier) {
            return false;
        }
    }
    return true;
}
CCnd.checkMark = function (rhPtr, mark) {
    if (mark == 0) {
        return false;
    }
    if (mark == rhPtr.rhLoopCount) {
        return true;
    }
    if (mark == rhPtr.rhLoopCount - 1) {
        return true;
    }
    return false;
}

function CCnd() {
}

CCnd.prototype = {
    compute_NoRepeat: function (pHo) {
        return CCnd.compute_NoRepeatCol(this.evtIdentifier, pHo);
    },
    evaChooseValueOld: function (rhPtr, pRoutine) {
        var cpt = 0;

        var pHo = rhPtr.rhEvtProg.evt_FirstObjectFromType(COI.OBJ_SPR);
        while (pHo != null) {
            cpt++;
            var value = rhPtr.get_EventExpressionInt(this.evtParams[0]);
            if (pRoutine.evaluate(pHo, value) == false) {
                cpt--;
                rhPtr.rhEvtProg.evt_DeleteCurrentObject();
            }
            pHo = rhPtr.rhEvtProg.evt_NextObjectFromType();
        }
        if (cpt != 0) {
            return true;
        }
        return false;
    },
    evaChooseValue: function (rhPtr, pRoutine) {
        var cpt = 0;

        var pHo = rhPtr.rhEvtProg.evt_FirstObjectFromType(-1);
        while (pHo != null) {
            cpt++;
            var value = rhPtr.get_EventExpressionInt(this.evtParams[0]);
            if (pRoutine.evaluate(pHo, value) == false) {
                cpt--;
                rhPtr.rhEvtProg.evt_DeleteCurrentObject();
            }
            pHo = rhPtr.rhEvtProg.evt_NextObjectFromType();
        }
        if (cpt != 0) {
            return true;
        }
        return false;
    },
    evaExpObject: function (rhPtr, pRoutine) {
        var pHo = rhPtr.rhEvtProg.evt_FirstObject(this.evtOiList);
        var cpt = rhPtr.rhEvtProg.evtNSelectedObjects;
        var p = this.evtParams[0];
        var value;

        var token = p.tokens[0];
        if ((token.code == CExp.EXP_LONG || token.code == CExp.EXP_DOUBLE) && p.tokens[1].code == 0) {
            var value = token.value;
            while (pHo != null) {
                if (pRoutine.evaExpRoutine(pHo, value, p.comparaison) == false) {
                    cpt--;
                    rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                }
                pHo = rhPtr.rhEvtProg.evt_NextObject();
            }
        }
        else {
            while (pHo != null) {
                value = rhPtr.get_EventExpressionInt(p);
                if (pRoutine.evaExpRoutine(pHo, value, p.comparaison) == false) {
                    cpt--;
                    rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                }
                pHo = rhPtr.rhEvtProg.evt_NextObject();
            }
        }
        if (cpt != 0) {
            return true;
        }
        return false;
    },
    evaObject: function (rhPtr, pRoutine) {
        var pHo = rhPtr.rhEvtProg.evt_FirstObject(this.evtOiList);
        var cpt = rhPtr.rhEvtProg.evtNSelectedObjects;
        while (pHo != null) {
            if (pRoutine.evaObjectRoutine(pHo) == false) {
                cpt--;
                rhPtr.rhEvtProg.evt_DeleteCurrentObject();
            }
            pHo = rhPtr.rhEvtProg.evt_NextObject();
        }
        if (cpt != 0) {
            return true;
        }
        return false;
    },
    compareCondition: function (rhPtr, param, v) {
        var value2 = rhPtr.get_EventExpressionAny(this.evtParams[param]);
        var comp = this.evtParams[param].comparaison;
        return CRun.compareTo(v, value2, comp);
    },
    isColliding: function (rhPtr) {
        //this is where we test collision conditions (not "On collision" events) E.g. If overlapping...

        //check to see if we can skip because there are no objects in the current selection
        if (rhPtr.rhEvtProg.rh4ConditionsFalse) {
            rhPtr.rhEvtProg.evt_FirstObject(this.evtOiList);
            rhPtr.rhEvtProg.evt_FirstObject(this.evtParams[0].oiList);
            return false;
        }

        //are we negating this result?
        var negate = false;
        if ((this.evtFlags2 & CEvent.EVFLAG2_NOT) != 0) {
            negate = true;
        }

        //get the first object in selection
        var pHo = rhPtr.rhEvtProg.evt_FirstObject(this.evtOiList);
        if (pHo == null) {
            return CCnd.negaFALSE(this);
        }
        var cpt = rhPtr.rhEvtProg.evtNSelectedObjects;

        //get list of objects to test
        var oi = this.evtParams[0].oi;
        var oi2List;
        if (oi >= 0) {
            rhPtr.isColArray[0] = oi;
            rhPtr.isColArray[1] = this.evtParams[0].oiList;
            oi2List = rhPtr.isColArray;
        } else {
            var qoil = rhPtr.rhEvtProg.qualToOiList[this.evtParams[0].oiList & 0x7FFF];
            oi2List = qoil.qoiList;
        }

        //get list of collisions
        var bFlag = false;
        var list;
        var list2 = new CArrayList();
        var index, n;
        var pHo2;
        do {
            list = rhPtr.objectAllCol_IXY(pHo, pHo.roc.rcImage, pHo.roc.rcAngle, pHo.roc.rcScaleX, pHo.roc.rcScaleY, pHo.hoX, pHo.hoY, oi2List);
            if (list == null) {
                if (negate == false) {
                    cpt--;
                    rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                }
            } else {
                bFlag = false;
                for (index = 0; index < list.size(); index++) {
                    pHo2 = list.get(index);
                    if ((pHo2.hoFlags & CObject.HOF_DESTROYED) == 0) {
                        list2.add(pHo2);
                        bFlag = true;
                    }
                }

                if (negate == true) {
                    if (bFlag == true) {
                        cpt--;
                        rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                    }
                } else {
                    if (bFlag == false) {
                        cpt--;
                        rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                    }
                }
            }
            pHo = rhPtr.rhEvtProg.evt_NextObject();
        } while (pHo != null);

        //skip if no objcts 
        if (cpt == 0) {
            return false;
        }

        pHo = rhPtr.rhEvtProg.evt_FirstObject(this.evtParams[0].oiList);
        if (pHo == null) {
            return false;
        }
        cpt = rhPtr.rhEvtProg.evtNSelectedObjects;
        if (negate == false) {
            do {
                for (index = 0; index < list2.size(); index++) {
                    pHo2 = list2.get(index);
                    if (pHo == pHo2) {
                        break;
                    }
                }
                if (index == list2.size()) {
                    cpt--;
                    rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                }
                pHo = rhPtr.rhEvtProg.evt_NextObject();
            } while (pHo != null);
            if (cpt != 0) {
                return true;
            }
            return false;
        }

        do {
            for (index = 0; index < list2.size(); index++) {
                pHo2 = list2.get(index);
                if (pHo == pHo2) {
                    cpt--;
                    rhPtr.rhEvtProg.evt_DeleteCurrentObject();
                    break;
                }
            }
            pHo = rhPtr.rhEvtProg.evt_NextObject();
        } while (pHo != null);
        if (cpt != 0) {
            return true;
        }
        return false;
    }
};
