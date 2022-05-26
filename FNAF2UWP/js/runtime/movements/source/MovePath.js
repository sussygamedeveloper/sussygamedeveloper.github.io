// CMovePath
//----------------------------------------------------------------------------------
/* Copyright (c) 1996-2016 Clickteam
 *
 * This source code is part of the HTML5 exporter for Clickteam Multimedia Fusion 2.
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

function CMoveDefPath() {
    //call chain
    CMoveDef.call(this);

    //call self
    this.mtNumber = 0;
    this.mtMinSpeed = 0;
    this.mtMaxSpeed = 0;
    this.mtLoop = 0;
    this.mtRepos = 0;
    this.mtReverse = 0;
    this.steps = null;
}

CMoveDefPath.prototype = {
    load: function (file, length) {
        this.mtNumber = file.readAShort();
        this.mtMinSpeed = file.readAShort();
        this.mtMaxSpeed = file.readAShort();
        this.mtLoop = file.readAByte();
        this.mtRepos = file.readAByte();
        this.mtReverse = file.readAByte();
        file.skipBytes(1);

        this.steps = new Array(this.mtNumber);
        var n, next;
        var debut;
        for (n = 0; n < this.mtNumber; n++) {
            debut = file.getFilePointer();
            this.steps[n] = new CPathStep();
            file.readAByte();
            next = file.readAByte();
            this.steps[n].load(file);
            file.seek(debut + next);
        }
    }
};

//setup inheritance using extend
CServices.extend(CMoveDef, CMoveDefPath);

// CPathStep
function CPathStep() {
    this.mdSpeed = 0;
    this.mdDir = 0;
    this.mdDx = 0;
    this.mdDy = 0;
    this.mdCosinus = 0;
    this.mdSinus = 0;
    this.mdLength = 0;
    this.mdPause = 0;
    this.mdName = null;
}

CPathStep.prototype = {
    load: function (file) {
        this.mdSpeed = file.readAByte();
        this.mdDir = file.readAByte();
        this.mdDx = file.readShort();
        this.mdDy = file.readShort();
        this.mdCosinus = file.readShort();
        this.mdSinus = file.readShort();
        this.mdLength = file.readAShort();
        this.mdPause = file.readAShort();
        var name = file.readAString();
        if (name.length > 0) {
            this.mdName = name;
        }
    }
}

//CMovePath
function CMovePath() {
    //call chain
    CMove.call(this);

    //call self
    this.MT_Speed = 0;
    this.MT_Sinus = 0;
    this.MT_Cosinus = 0;
    this.MT_Longueur = 0;
    this.MT_XOrigin = 0;
    this.MT_YOrigin = 0;
    this.MT_XDest = 0;
    this.MT_YDest = 0;
    this.MT_MoveNumber = 0;
    this.MT_Direction = false;
    this.MT_Movement = null;
    this.MT_Calculs = 0;
    this.MT_XStart = 0;
    this.MT_YStart = 0;
    this.MT_Pause = 0;
    this.MT_GotoNode = null;
    this.MT_FlagBranch = false;
}

CMovePath.prototype = {
    init: function (ho, mtPtr) {
        this.hoPtr = ho;

        this.MT_XStart = this.hoPtr.hoX;
        this.MT_YStart = this.hoPtr.hoY;

        this.MT_Direction = false;
        this.MT_Pause = 0;
        this.hoPtr.hoMark1 = 0;

        this.MT_Movement = mtPtr;
        this.hoPtr.roc.rcMinSpeed = mtPtr.mtMinSpeed;
        this.hoPtr.roc.rcMaxSpeed = mtPtr.mtMaxSpeed;
        this.MT_Calculs = 0;
        this.MT_GotoNode = null;
        this.mtGoAvant(0);
        this.moveAtStart(mtPtr);
        this.hoPtr.roc.rcSpeed = this.MT_Speed;
        this.hoPtr.roc.rcChanged = true;
        if (this.MT_Movement.steps.length == 0) {
            this.stop();
        }
    },

    move: function () {
        this.hoPtr.hoMark1 = 0;

        this.hoPtr.roc.rcAnim = CAnim.ANIMID_WALK;
        if (this.hoPtr.roa != null) {
            this.hoPtr.roa.animate();
        }

        if (this.MT_Speed == 0) {
            var pause = this.MT_Pause;
            if (pause == 0) {
                this.hoPtr.roc.rcSpeed = 0;
                this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
                return;
            }
            pause -= this.hoPtr.hoAdRunHeader.rhTimerDelta;
            if (pause > 0) {
                this.MT_Pause = pause;
                this.hoPtr.roc.rcSpeed = 0;
                this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
                return;
            }
            this.MT_Pause = 0;
            this.MT_Speed = this.rmStopSpeed & 0x7FFF;
            this.rmStopSpeed = 0;
            this.hoPtr.roc.rcSpeed = this.MT_Speed;
        }

        var calculs;
        if ((this.hoPtr.hoAdRunHeader.rhFrame.leFlags & CRunFrame.LEF_TIMEDMVTS) != 0) {
            calculs = 256.0 * this.hoPtr.hoAdRunHeader.rh4MvtTimerCoef;
        } else {
            calculs = 0x100;
        }
        this.hoPtr.hoAdRunHeader.rhMT_VBLCount = calculs;

        var breakMtNewSpeed;
        while (true) {
            breakMtNewSpeed = false;
            this.hoPtr.hoAdRunHeader.rhMT_VBLStep = calculs;
            calculs *= this.MT_Speed;
            calculs <<= 5;
            if (calculs <= 0x80000) {
                this.hoPtr.hoAdRunHeader.rhMT_MoveStep = calculs;
            } else {
                calculs = 0x80000 >>> 5;
                calculs /= this.MT_Speed;
                this.hoPtr.hoAdRunHeader.rhMT_VBLStep = calculs;
                this.hoPtr.hoAdRunHeader.rhMT_MoveStep = 0x80000;
            }
            while (true) {
                this.MT_FlagBranch = false;
                var flag = this.mtMove(this.hoPtr.hoAdRunHeader.rhMT_MoveStep);
                if (flag == true && this.MT_FlagBranch == false) {
                    breakMtNewSpeed = true;
                    break;
                }
                if (this.hoPtr.hoAdRunHeader.rhMT_VBLCount == this.hoPtr.hoAdRunHeader.rhMT_VBLStep) {
                    breakMtNewSpeed = true;
                    break;
                }
                if (this.hoPtr.hoAdRunHeader.rhMT_VBLCount > this.hoPtr.hoAdRunHeader.rhMT_VBLStep) {
                    this.hoPtr.hoAdRunHeader.rhMT_VBLCount -= this.hoPtr.hoAdRunHeader.rhMT_VBLStep;
                    calculs = this.hoPtr.hoAdRunHeader.rhMT_VBLCount;
                    break;
                }
                calculs = this.hoPtr.hoAdRunHeader.rhMT_VBLCount * MT_Speed;
                calculs <<= 5;
                this.mtMove(calculs);
                breakMtNewSpeed = true;
                break;
            }
            ;
            if (breakMtNewSpeed) {
                break;
            }
        }
        ;
    },

    mtMove: function (step) {
        step += this.MT_Calculs;
        var step2 = step >>> 16;
        if (step2 < this.MT_Longueur) {
            this.MT_Calculs = step;
            var x = (step2 * this.MT_Cosinus) / 16384 + this.MT_XOrigin;
            var y = (step2 * this.MT_Sinus) / 16384 + this.MT_YOrigin;

            this.hoPtr.hoX = x;
            this.hoPtr.hoY = y;
            this.hoPtr.roc.rcChanged = true;
            this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
            return this.hoPtr.rom.rmMoveFlag;
        }

        step2 -= this.MT_Longueur;
        step = (step2 << 16) | (step & 0xFFFF);
        if (this.MT_Speed != 0) {
            step /= this.MT_Speed;
        }
        step >>= 5;
        this.hoPtr.hoAdRunHeader.rhMT_VBLCount += step & 0xFFFF;

        this.hoPtr.hoX = this.MT_XDest;
        this.hoPtr.hoY = this.MT_YDest;
        this.hoPtr.roc.rcChanged = true;
        this.hoPtr.hoAdRunHeader.newHandle_Collisions(this.hoPtr);
        if (this.hoPtr.rom.rmMoveFlag) {
            return true;
        }

        this.hoPtr.hoMark1 = this.hoPtr.hoAdRunHeader.rhLoopCount;
        this.hoPtr.hoMT_NodeName = null;

        // Passe au node suivant
        var number = this.MT_MoveNumber;
        this.MT_Calculs = 0;
        if (this.MT_Direction == false) {
            number++;
            if (number < this.MT_Movement.mtNumber) {
                this.hoPtr.hoMT_NodeName = this.MT_Movement.steps[number].mdName;

                if (this.MT_GotoNode != null) {
                    if (this.MT_Movement.steps[number].mdName != null) {
                        if (CServices.compareStringsIgnoreCase(this.MT_GotoNode, this.MT_Movement.steps[number].mdName)) {
                            this.MT_MoveNumber = number;
                            this.mtMessages();
                            return this.mtTheEnd();
                        }
                    }
                }
                this.mtGoAvant(number);
                this.mtMessages();
                return this.hoPtr.rom.rmMoveFlag;
            }
            this.hoPtr.hoMark2 = this.hoPtr.hoAdRunHeader.rhLoopCount;
            this.MT_MoveNumber = number;
            if (this.MT_Direction) {
                this.mtMessages();
                return this.hoPtr.rom.rmMoveFlag;
            }
            if (this.MT_Movement.mtReverse != 0) {
                this.MT_Direction = true;
                number--;
                this.hoPtr.hoMT_NodeName = this.MT_Movement.steps[number].mdName;
                this.mtGoArriere(number);
                this.mtMessages();
                return this.hoPtr.rom.rmMoveFlag;
            }
            this.mtReposAtEnd();
            if (this.MT_Movement.mtLoop == 0) {
                this.mtTheEnd();
                this.mtMessages();
                return this.hoPtr.rom.rmMoveFlag;
            }
            number = 0;
            this.mtGoAvant(number);
            this.mtMessages();
            return this.hoPtr.rom.rmMoveFlag;
        }
        else {
            if (this.MT_GotoNode != null) {
                if (this.MT_Movement.steps[number].mdName != null) {
                    if (CServices.compareStringsIgnoreCase(this.MT_GotoNode, this.MT_Movement.steps[number].mdName)) {
                        this.mtMessages();
                        return this.mtTheEnd();            //; Fin du mouvement
                    }
                }
            }
            this.hoPtr.hoMT_NodeName = this.MT_Movement.steps[number].mdName;
            this.MT_Pause = this.MT_Movement.steps[number].mdPause;
            number--;
            if (number >= 0) {
                this.mtGoArriere(number);
                this.mtMessages();
                return this.hoPtr.rom.rmMoveFlag;
            }
            this.mtReposAtEnd();
            if (this.MT_Direction == false) {
                this.mtMessages();
                return this.hoPtr.rom.rmMoveFlag;
            }
            if (this.MT_Movement.mtLoop == 0) {
                this.mtTheEnd();
                this.mtMessages();
                return this.hoPtr.rom.rmMoveFlag;
            }
            number = 0;
            this.MT_Direction = false;
            this.mtGoAvant(number);
            this.mtMessages();
            return this.hoPtr.rom.rmMoveFlag;
        }
    },
    mtGoAvant: function (number) {
        if (number >= this.MT_Movement.steps.length) {
            this.stop();
        } else {
            this.MT_Direction = false;
            this.MT_MoveNumber = number;
            this.MT_Pause = this.MT_Movement.steps[number].mdPause;
            this.MT_Cosinus = this.MT_Movement.steps[number].mdCosinus;
            this.MT_Sinus = this.MT_Movement.steps[number].mdSinus;
            this.MT_XOrigin = this.hoPtr.hoX;
            this.MT_YOrigin = this.hoPtr.hoY;
            this.MT_XDest = this.hoPtr.hoX + this.MT_Movement.steps[number].mdDx;
            this.MT_YDest = this.hoPtr.hoY + this.MT_Movement.steps[number].mdDy;
            this.hoPtr.roc.rcDir = this.MT_Movement.steps[number].mdDir;
            this.mtBranche();
        }
    },
    mtGoArriere: function (number) {
        if (number >= this.MT_Movement.steps.length) {
            this.stop();
        } else {
            this.MT_Direction = true;
            this.MT_MoveNumber = number;
            this.MT_Cosinus = -this.MT_Movement.steps[number].mdCosinus;
            this.MT_Sinus = -this.MT_Movement.steps[number].mdSinus;
            this.MT_XOrigin = this.hoPtr.hoX;
            this.MT_YOrigin = this.hoPtr.hoY;
            this.MT_XDest = this.hoPtr.hoX - this.MT_Movement.steps[number].mdDx;
            this.MT_YDest = this.hoPtr.hoY - this.MT_Movement.steps[number].mdDy;
            var dir = this.MT_Movement.steps[number].mdDir;
            dir += 16;
            dir &= 31;
            this.hoPtr.roc.rcDir = dir;
            this.mtBranche();
        }
    },

    mtBranche: function () {
        this.MT_Longueur = this.MT_Movement.steps[this.MT_MoveNumber].mdLength;
        var speed = this.MT_Movement.steps[this.MT_MoveNumber].mdSpeed;

        var pause = this.MT_Pause;
        if (pause != 0) {
            this.MT_Pause = pause * 20;
            speed |= 0x8000;
            this.rmStopSpeed = speed;
        }
        if (this.rmStopSpeed != 0) {
            speed = 0;
        }
        if (speed != this.MT_Speed || speed != 0) {
            this.MT_Speed = speed;
            this.hoPtr.rom.rmMoveFlag = true;
            this.MT_FlagBranch = true;
        }
        this.hoPtr.roc.rcSpeed = this.MT_Speed;
    },
    mtMessages: function () {
        if (this.hoPtr.hoMark1 == this.hoPtr.hoAdRunHeader.rhLoopCount) {
            this.hoPtr.hoAdRunHeader.rhEvtProg.rhCurParam0 = 0;
            this.hoPtr.hoAdRunHeader.rhEvtProg.handle_Event(this.hoPtr, (-20 << 16) | (this.hoPtr.hoType & 0xFFFF));        // CNDL_EXTPATHNODE
            this.hoPtr.hoAdRunHeader.rhEvtProg.handle_Event(this.hoPtr, (-35 << 16) | (this.hoPtr.hoType & 0xFFFF));        // CNDL_EXTPATHNODENAME
        }
        if (this.hoPtr.hoMark2 == this.hoPtr.hoAdRunHeader.rhLoopCount) {
            this.hoPtr.hoAdRunHeader.rhEvtProg.rhCurParam0 = 0;
            this.hoPtr.hoAdRunHeader.rhEvtProg.handle_Event(this.hoPtr, (-21 << 16) | (this.hoPtr.hoType & 0xFFFF));   // CNDL_EXTENDPATH
        }
    },

    mtTheEnd: function () {
        this.MT_Speed = 0;
        this.rmStopSpeed = 0;
        this.hoPtr.rom.rmMoveFlag = true;
        this.MT_FlagBranch = false;
        return true;
    },
    mtReposAtEnd: function () {
        if (this.MT_Movement.mtRepos != 0) {
            this.hoPtr.hoX = this.MT_XStart;
            this.hoPtr.hoY = this.MT_YStart;
            this.hoPtr.roc.rcChanged = true;
        }
    },

    mtBranchNode: function (pName) {
        var number;
        for (number = 0; number < this.MT_Movement.mtNumber; number++) {
            if (this.MT_Movement.steps[number].mdName != null) {
                if (CServices.compareStringsIgnoreCase(pName, this.MT_Movement.steps[number].mdName)) {
                    if (this.MT_Direction == false) {
                        this.mtGoAvant(number);
                        this.hoPtr.hoMark1 = this.hoPtr.hoAdRunHeader.rhLoopCount;
                        this.hoPtr.hoMT_NodeName = this.MT_Movement.steps[number].mdName;
                        this.hoPtr.hoMark2 = 0;
                        this.mtMessages();
                    }
                    else {
                        if (number > 0) {
                            number--;
                            this.mtGoArriere(number);
                            this.hoPtr.hoMark1 = this.hoPtr.hoAdRunHeader.rhLoopCount;
                            this.hoPtr.hoMT_NodeName = this.MT_Movement.steps[number].mdName;
                            this.hoPtr.hoMark2 = 0;
                            this.mtMessages();
                        }
                    }
                    this.hoPtr.rom.rmMoveFlag = true;
                    return;
                }
            }
        }
    },
    mtGotoNode: function (pName) {
        var number;

        for (number = 0; number < this.MT_Movement.mtNumber; number++) {
            if (this.MT_Movement.steps[number].mdName != null) {
                if (CServices.compareStringsIgnoreCase(pName, this.MT_Movement.steps[number].mdName)) {
                    if (number == this.MT_MoveNumber) {
                        if (this.MT_Calculs == 0) {
                            return;
                        }
                    }

                    this.MT_GotoNode = pName;

                    if (this.MT_Direction == false) {
                        if (number > this.MT_MoveNumber) {
                            if (this.MT_Speed != 0) {
                                return;
                            }
                            if ((this.rmStopSpeed & 0x8000) != 0) {
                                this.start();
                            } else {
                                this.mtGoAvant(this.MT_MoveNumber);
                            }
                            return;
                        }
                        else {
                            if (this.MT_Speed != 0) {
                                this.reverse();
                                return;
                            }
                            if ((this.rmStopSpeed & 0x8000) != 0) {
                                this.start();
                                this.reverse();
                            }
                            else {
                                this.mtGoArriere(MT_MoveNumber - 1);
                            }
                            return;
                        }
                    }
                    else {
                        if (number <= this.MT_MoveNumber) {
                            if (this.MT_Speed != 0) {
                                return;
                            }
                            if ((this.rmStopSpeed & 0x8000) != 0) {
                                this.start();
                            } else {
                                this.mtGoArriere(this.MT_MoveNumber - 1);
                            }
                            return;
                        }
                        else {
                            if (this.MT_Speed != 0) {
                                this.reverse();
                                return;
                            }
                            if ((this.rmStopSpeed & 0x8000) != 0) {
                                this.start();
                                this.reverse();
                            }
                            else {
                                this.mtGoAvant(this.MT_MoveNumber);
                            }
                            return;
                        }
                    }
                }
            }
        }
    },

    stop: function () {
        if (this.rmStopSpeed == 0) {
            this.rmStopSpeed = this.MT_Speed | 0x8000;
        }
        this.MT_Speed = 0;
        this.hoPtr.rom.rmMoveFlag = true;
    },
    start: function () {
        if ((this.rmStopSpeed & 0x8000) != 0) {
            this.MT_Speed = this.rmStopSpeed & 0x7FFF;
            this.MT_Pause = 0;
            this.rmStopSpeed = 0;
            this.hoPtr.rom.rmMoveFlag = true;
        }
    },
    reverse: function () {
        if (this.rmStopSpeed == 0) {
            this.hoPtr.rom.rmMoveFlag = true;
            var number = this.MT_MoveNumber;
            if (this.MT_Calculs == 0) {
                this.MT_Direction = !this.MT_Direction;
                if (this.MT_Direction) {
                    if (number == 0) {
                        this.MT_Direction = !this.MT_Direction;
                        return;
                    }
                    number--;
                    this.mtGoArriere(number);
                }
                else {
                    this.mtGoAvant(number);
                }
            }
            else {
                this.MT_Direction = !this.MT_Direction;
                this.MT_Cosinus = -this.MT_Cosinus;
                this.MT_Sinus = -this.MT_Sinus;
                var x1 = this.MT_XOrigin;
                var x2 = this.MT_XDest;
                this.MT_XOrigin = x2;
                this.MT_XDest = x1;
                x1 = this.MT_YOrigin;
                x2 = this.MT_YDest;
                this.MT_YOrigin = x2;
                this.MT_YDest = x1;
                this.hoPtr.roc.rcDir += 16;
                this.hoPtr.roc.rcDir &= 31;
                var calcul = this.MT_Calculs >>> 16;
                calcul = this.MT_Longueur - calcul;
                this.MT_Calculs = (calcul << 16) | (this.MT_Calculs & 0xFFFF);
            }
        }
    },

    setXPosition: function (x) {
        var x2 = this.hoPtr.hoX;
        this.hoPtr.hoX = x;

        x2 -= this.MT_XOrigin;
        x -= x2;
        x2 = this.MT_XDest - this.MT_XOrigin + x;
        this.MT_XDest = x2;
        x2 = this.MT_XOrigin;
        this.MT_XOrigin = x;
        x2 -= x;
        this.MT_XStart -= x2;
        this.hoPtr.rom.rmMoveFlag = true;
        this.hoPtr.roc.rcChanged = true;
        this.hoPtr.roc.rcCheckCollides = true;
    },
    setYPosition: function (y) {
        var y2 = this.hoPtr.hoY;
        this.hoPtr.hoY = y;

        y2 -= this.MT_YOrigin;
        y -= y2;
        y2 = this.MT_YDest - this.MT_YOrigin + y;
        this.MT_YDest = y2;
        y2 = this.MT_YOrigin;
        this.MT_YOrigin = y;
        y2 -= y;
        this.MT_YStart -= y2;
        this.hoPtr.rom.rmMoveFlag = true;
        this.hoPtr.roc.rcChanged = true;
        this.hoPtr.roc.rcCheckCollides = true;
    },

    setSpeed: function (speed) {
        if (speed < 0) {
            speed = 0;
        }
        if (speed > 250) {
            speed = 250;
        }
        this.MT_Speed = speed;
        this.hoPtr.roc.rcSpeed = speed;
        this.hoPtr.rom.rmMoveFlag = true;
    },
    setMaxSpeed: function (speed) {
        this.setSpeed(speed);
    },
    setDir: function (dir) {
    }
};

//setup inheritance using extend
CServices.extend(CMove, CMovePath);