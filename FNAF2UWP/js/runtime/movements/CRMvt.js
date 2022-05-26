// CRMvt object
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

CRMvt.EF_GOESINPLAYFIELD = 0x0001;
CRMvt.EF_GOESOUTPLAYFIELD = 0x0002;
CRMvt.EF_WRAP = 0x0004;

function CRMvt() {
    this.rmObject = null;
    this.rmMvtNum = 0;
    this.rmMovement = null;
    this.rmWrapping = 0;
    this.rmMoveFlag = false;
    this.rmReverse = 0;
    this.rmBouncing = false;
    this.rmEventFlags = 0;
}

CRMvt.prototype = {
    init: function (nMove, hoPtr, ocPtr, cob, forcedType) {
        this.rmObject = hoPtr;

        if (this.rmMovement != null) {
            this.rmMovement.kill();
        }

        if (cob != null) {
            hoPtr.roc.rcDir = cob.cobDir;
        }
        this.rmWrapping = hoPtr.hoOiList.oilWrap;

        var mvPtr = null;
        hoPtr.roc.rcMovementType = -1;
        if (ocPtr.ocMovements != null) {
            if (nMove < ocPtr.ocMovements.nMovements) {
                mvPtr = ocPtr.ocMovements.moveList[nMove];
                this.rmMvtNum = nMove;
                if (forcedType == -1) {
                    forcedType = mvPtr.mvType;
                }
                hoPtr.roc.rcMovementType = forcedType;
                switch (forcedType) {
                    case 0:
                        this.rmMovement = new CMoveStatic();
                        break;
                    case 1:
                        this.rmMovement = new CMoveMouse();
                        break;
                    case 2:
                        this.rmMovement = new CMoveRace();
                        break;
                    case 3:
                        this.rmMovement = new CMoveGeneric();
                        break;
                    case 4:
                        this.rmMovement = new CMoveBall();
                        break;
                    case 5:
                        this.rmMovement = new CMovePath();
                        break;
                    case 9:
                        this.rmMovement = new CMovePlatform();
                        break;
                    case 14:
                        this.rmMovement = this.loadMvtExtension(hoPtr, mvPtr);
                        if (this.rmMovement == null) {
                            this.rmMovement = new CMoveStatic();
                        }
                        break;
                }
                hoPtr.roc.rcDir = this.dirAtStart(hoPtr, mvPtr.mvDirAtStart, hoPtr.roc.rcDir);
                this.rmMovement.init(hoPtr, mvPtr);
            }
        }
        if (hoPtr.roc.rcMovementType == -1) {
            hoPtr.roc.rcMovementType = 0;
            this.rmMovement = new CMoveStatic();
            this.rmMovement.init(hoPtr, null);
            hoPtr.roc.rcDir = 0;
        }
    },

    loadMvtExtension: function (hoPtr, mvDef) {
        var extName = mvDef.moduleName;
        /*
         var index = extName.indexOf('-');
         while (index > 0)
         {
         extName = extName.substring(0, index) + '_' + extName.substring(index+1, extName.length);
         index = extName.indexOf('-');
         }
         */

        var object = CCompiledMovements.loadMvtExtension.call(this, extName);

        /*
         if (document.debug==undefined)
         {
         if (!CRMvt.types[extName])
         {
         var extFile = new CFile();
         extFile.openFile(document.srcPath + extName+ '.js');
         (new Function(extFile.bytes)).call(CRMvt.types);
         }
         var type = CRMvt.types[extName];
         if (type)
         object=new type;
         }
         else
         {
         object=new window['CRunMvt' + extName];
         }
         */
        if (object != null) {
            object.init(hoPtr);
            var mvExt = new CMoveExtension(object);
            return mvExt;
        }
        return null;
    },

    initSimple: function (hoPtr, forcedType, bRestore) {
        this.rmObject = hoPtr;

        if (this.rmMovement != null) {
            this.rmMovement.kill();
        }

        hoPtr.roc.rcMovementType = forcedType;
        switch (forcedType) {
            case 11:
                this.rmMovement = new CMoveDisappear();
                break;
            case 13:
                this.rmMovement = new CMoveBullet();
                break;
        }
        this.rmMovement.hoPtr = hoPtr;
        if (bRestore == false) {
            this.rmMovement.init(hoPtr, null);
        }
    },

    kill: function (bFast) {
        this.rmMovement.kill();
    },

    move: function () {
        this.rmMovement.move();
    },

    nextMovement: function (hoPtr) {
        var ocPtr = hoPtr.hoCommon;
        if (ocPtr.ocMovements != null) {
            if (this.rmMvtNum + 1 < ocPtr.ocMovements.nMovements) {
                this.init(this.rmMvtNum + 1, hoPtr, ocPtr, null, -1);
                var pMovement = hoPtr.hoAdRunHeader.GetMBase(hoPtr);
                if (pMovement) {
                    pMovement.CreateBody();
                }
            }
        }
    },

    previousMovement: function (hoPtr) {
        var ocPtr = hoPtr.hoCommon;
        if (ocPtr.ocMovements != null) {
            if (this.rmMvtNum - 1 >= 0) {
                this.init(this.rmMvtNum - 1, hoPtr, ocPtr, null, -1);
                var pMovement = hoPtr.hoAdRunHeader.GetMBase(hoPtr);
                if (pMovement) {
                    pMovement.CreateBody();
                }
            }
        }
    },

    selectMovement: function (hoPtr, mvt) {
        var ocPtr = hoPtr.hoCommon;
        if (ocPtr.ocMovements != null) {
            if (mvt >= 0 && mvt < ocPtr.ocMovements.nMovements) {
                this.init(mvt, hoPtr, ocPtr, null, -1);
                var pMovement = hoPtr.hoAdRunHeader.GetMBase(hoPtr);
                if (pMovement) {
                    pMovement.CreateBody();
                }
            }
        }
    },

    dirAtStart: function (hoPtr, dirAtStart, dir) {
        if (dir < 0 || dir >= 32) {
            var cpt = 0;
            var das = dirAtStart;
            var das2;
            var n;
            for (n = 0; n < 32; n++) {
                das2 = das;
                das >>= 1;
                if ((das2 & 1) != 0) {
                    cpt++;
                }
            }

            if (cpt == 0) {
                dir = 0;
            } else {
                cpt = hoPtr.hoAdRunHeader.random(cpt);
                das = dirAtStart;
                for (dir = 0; ; dir++) {
                    das2 = das;
                    das >>= 1;
                    if ((das2 & 1) != 0) {
                        cpt--;
                        if (cpt < 0) {
                            break;
                        }
                    }
                }
            }
        }
        return dir;
    }
}