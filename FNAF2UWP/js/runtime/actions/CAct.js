// CAct object
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

CAct.ACTFLAGS_REPEAT = 0x0001;
CAct.ACT_EXTSETFRICTION = (68 << 8);
CAct.ACT_EXTSETELASTICITY = (69 << 8);
CAct.ACT_EXTAPPLYIMPULSE = (70 << 8);
CAct.ACT_EXTAPPLYANGULARIMPULSE = (71 << 8);
CAct.ACT_EXTAPPLYFORCE = (72 << 8);
CAct.ACT_EXTAPPLYTORQUE = (73 << 8);
CAct.ACT_EXTSETLINEARVELOCITY = (74 << 8);
CAct.ACT_EXTSETANGULARVELOCITY = (75 << 8);
CAct.ACT_EXTFOREACH = (76 << 8);
CAct.ACT_EXTFOREACH2 = (77 << 8);
CAct.ACT_EXTSTOPFORCE = (78 << 8);
CAct.ACT_EXTSTOPTORQUE = (79 << 8);
CAct.ACT_EXTSETDENSITY = (80 << 8);
CAct.ACT_EXTSETGRAVITYSCALE = (81 << 8);
CAct.ACT_STARTLOOP = ((14 << 16) | 0xFFFF);
CAct.create = function (app) {
    var bSetVarGConst = false;
    var bAddVarGConst = false;
    var bSubVarGConst = false;
    var bExtSetVar = false;
    var bExtAddVar = false;
    var bExtSubVar = false;
    var bExtSetFlag = false;
    var bExtClrFlag = false;
    var bExtChgFlag = false;

    var debut = app.file.getFilePointer();

    var size = app.file.readAShort()
    var act = null;
    var c = app.file.readAInt();
    switch (c) {
        case ((0 << 16) | 0xFFFF):
            act = new ACT_SKIP();
            break;
        case ((1 << 16) | 0xFFFF):        // ACT_SKIPMONITOR            
            act = new ACT_SKIP();
            break;
        case ((3 << 16) | 0xFFFF):
            act = new ACT_SETVARG();
            break;
        case ((4 << 16) | 0xFFFF):
            act = new ACT_SUBVARG();
            break;
        case ((5 << 16) | 0xFFFF):
            act = new ACT_ADDVARG();
            break;
        case ((6 << 16) | 0xFFFF):
            act = new ACT_GRPACTIVATE();
            break;
        case ((7 << 16) | 0xFFFF):
            act = new ACT_GRPDEACTIVATE();
            break;
        case ((14 << 16) | 0xFFFF):
            act = new ACT_STARTLOOP();
            break;
        case ((15 << 16) | 0xFFFF):
            act = new ACT_STOPLOOP();
            break;
        case ((16 << 16) | 0xFFFF):
            act = new ACT_SETLOOPINDEX();
            break;
        case ((17 << 16) | 0xFFFF):
            act = new ACT_RANDOMIZE();
            break;
        case ((19 << 16) | 0xFFFF):
            act = new ACT_SETGLOBALSTRING();
            break;
        case ((23 << 16) | 0xFFFF):
            act = new ACT_SKIP();
            break;
        case ((24 << 16) | 0xFFFF):
            act = new ACT_SKIP();
            break;
        case ((27 << 16) | 0xFFFF):
            act = new ACT_SETVARGCONST();
            bSetVarGConst = true;
            break;
        case ((28 << 16) | 0xFFFF):
            act = new ACT_SETVARG();
            break;
        case ((29 << 16) | 0xFFFF):
            act = new ACT_SETVARGCONST();
            bSetVarGConst = true;
            break;
        case ((30 << 16) | 0xFFFF):
            act = new ACT_SETVARG();
            break;
        case ((31 << 16) | 0xFFFF):
            act = new ACT_ADDVARGCONST();
            bAddVarGConst = true;
            break;
        case ((32 << 16) | 0xFFFF):
            act = new ACT_ADDVARG();
            break;
        case ((33 << 16) | 0xFFFF):
            act = new ACT_ADDVARGCONST();
            bAddVarGConst = true;
            break;
        case ((34 << 16) | 0xFFFF):
            act = new ACT_ADDVARG();
            break;
        case ((35 << 16) | 0xFFFF):
            act = new ACT_SUBVARGCONST();
            bSubVarGConst = true;
            break;
        case ((36 << 16) | 0xFFFF):
            act = new ACT_SUBVARG();
            break;
        case ((37 << 16) | 0xFFFF):
            act = new ACT_SUBVARGCONST();
            bSubVarGConst = true;
            break;
        case ((38 << 16) | 0xFFFF):
            act = new ACT_SUBVARG();
            break;
        case ((0 << 16) | 0xFFFE):
            act = new ACT_PLAYSAMPLE();
            break;
        case ((1 << 16) | 0xFFFE):
            act = new ACT_STOPSAMPLE();
            break;
        case ((4 << 16) | 0xFFFE):
            act = new ACT_PLAYLOOPSAMPLE();
            break;
        case ((6 << 16) | 0xFFFE):
            act = new ACT_STOPSPESAMPLE();
            break;
        case ((7 << 16) | 0xFFFE):
            act = new ACT_PAUSESAMPLE();
            break;
        case ((8 << 16) | 0xFFFE):
            act = new ACT_RESUMESAMPLE();
            break;
        case ((11 << 16) | 0xFFFE):
            act = new ACT_PLAYCHANNEL();
            break;
        case ((12 << 16) | 0xFFFE):
            act = new ACT_PLAYLOOPCHANNEL();
            break;
        case ((13 << 16) | 0xFFFE):
            act = new ACT_PAUSECHANNEL();
            break;
        case ((14 << 16) | 0xFFFE):
            act = new ACT_RESUMECHANNEL();
            break;
        case ((15 << 16) | 0xFFFE):
            act = new ACT_STOPCHANNEL();
            break;
        case ((16 << 16) | 0xFFFE):
            act = new ACT_SETCHANNELPOS();
            break;
        case ((17 << 16) | 0xFFFE):
            act = new ACT_SETCHANNELVOL();
            break;
        case ((18 << 16) | 0xFFFE):                // SETCHANNELPAN
            act = new ACT_SKIP();
            break;
        case ((19 << 16) | 0xFFFE):
            act = new ACT_SETSAMPLEPOS();
            break;
        case ((20 << 16) | 0xFFFE):
            act = new ACT_SETSAMPLEMAINVOL();
            break;
        case ((21 << 16) | 0xFFFE):
            act = new ACT_SETSAMPLEVOL();
            break;
        case ((22 << 16) | 0xFFFE):
            act = new ACT_SKIP();
            break;
        case ((23 << 16) | 0xFFFE):
            act = new ACT_SKIP();
            break;
        case ((24 << 16) | 0xFFFE):
            act = new ACT_PAUSEALLCHANNELS();
            break;
        case ((25 << 16) | 0xFFFE):
            act = new ACT_RESUMEALLCHANNELS();
            break;
        case ((30 << 16) | 0xFFFE):
            act = new ACT_LOCKCHANNEL();
            break;
        case ((31 << 16) | 0xFFFE):
            act = new ACT_UNLOCKCHANNEL();
            break;
        case ((32 << 16) | 0xFFFE):
            act = new ACT_SETCHANNELFREQ();
            break;
        case ((33 << 16) | 0xFFFE):
            act = new ACT_SETSAMPLEFREQ();
            break;
        case ((0 << 16) | 0xFFFD):
            act = new ACT_NEXTLEVEL();
            break;
        case ((1 << 16) | 0xFFFD):
            act = new ACT_PREVLEVEL();
            break;
        case ((2 << 16) | 0xFFFD):
            act = new ACT_GOLEVEL();
            break;
        case ((3 << 16) | 0xFFFD):
            act = new ACT_PAUSEKEY();
            break;
        case ((4 << 16) | 0xFFFD):
            act = new ACT_ENDGAME();
            break;
        case ((5 << 16) | 0xFFFD):
            act = new ACT_RESTARTGAME();
            break;
        case ((6 << 16) | 0xFFFD):
            act = new ACT_RESTARTLEVEL();
            break;
        case ((7 << 16) | 0xFFFD):
            act = new ACT_CDISPLAY();
            break;
        case ((8 << 16) | 0xFFFD):
            act = new ACT_CDISPLAYX();
            break;
        case ((9 << 16) | 0xFFFD):
            act = new ACT_CDISPLAYY();
            break;
        case ((14 << 16) | 0xFFFD):
            act = new ACT_FULLSCREENMODE();
            break;
        case ((15 << 16) | 0xFFFD):
            act = new ACT_WINDOWEDMODE();
            break;
        case ((16 << 16) | 0xFFFD):
            act = new ACT_SETFRAMERATE();
            break;
        case ((17 << 16) | 0xFFFD):
            act = new ACT_PAUSEKEY();
            break;
        case ((18 << 16) | 0xFFFD):
            act = new ACT_PAUSEANYKEY();
            break;
        case ((19 << 16) | 0xFFFD):
            act = new ACT_SETVSYNCON();
            break;
        case ((20 << 16) | 0xFFFD):
            act = new ACT_SETVSYNCOFF();
            break;
        case ((21 << 16) | 0xFFFD):
            act = new ACT_SETVIRTUALWIDTH();
            break;
        case ((22 << 16) | 0xFFFD):
            act = new ACT_SETVIRTUALHEIGHT();
            break;
        case ((23 << 16) | 0xFFFD):
            act = new ACT_SETFRAMEBDKCOLOR();
            break;
        case ((24 << 16) | 0xFFFD):
            act = new ACT_DELCREATEDBKDAT();
            break;
        case ((25 << 16) | 0xFFFD):
            act = new ACT_DELALLCREATEDBKD();
            break;
        case ((26 << 16) | 0xFFFD):
            act = new ACT_SETFRAMEWIDTH();
            break;
        case ((27 << 16) | 0xFFFD):
            act = new ACT_SETFRAMEHEIGHT();
            break;
        case ((31 << 16) | 0xFFFD):
            act = new ACT_PLAYDEMO();
            break;
        case ((32 << 16) | 0xFFFD):         // ACT_SETFRAMEEFFECT                
            act = new ACT_SKIP();
            break;
        case ((33 << 16) | 0xFFFD):
            act = new ACT_SKIP();
            break;
        case ((34 << 16) | 0xFFFD):
            act = new ACT_SKIP();
            break;
        case ((35 << 16) | 0xFFFD):            // ACT_SETFRAMEALPHACOEF            
            act = new ACT_SKIP();
            break;
        case ((36 << 16) | 0xFFFD):         // ACT_SETFRAMERGBCOEF                
            act = new ACT_SKIP();
            break;
        case ((0 << 16) | 0xFFFC):
            act = new ACT_SETTIMER();
            break;
        case ((1 << 16) | 0xFFFC):
            act = new ACT_EVENTAFTER();
            break;
        case ((2 << 16) | 0xFFFC):
            act = new ACT_NEVENTSAFTER();
            break;
        case ((0 << 16) | 0xFFFA):
            act = new ACT_HIDECURSOR();
            break;
        case ((1 << 16) | 0xFFFA):
            act = new ACT_SHOWCURSOR();
            break;
        case ((0 << 16) | 0xFFF9):
            act = new ACT_SETSCORE();
            break;
        case ((1 << 16) | 0xFFF9):
            act = new ACT_SETLIVES();
            break;
        case ((2 << 16) | 0xFFF9):
            act = new ACT_NOINPUT();
            break;
        case ((3 << 16) | 0xFFF9):
            act = new ACT_RESTINPUT();
            break;
        case ((4 << 16) | 0xFFF9):
            act = new ACT_ADDSCORE();
            break;
        case ((5 << 16) | 0xFFF9):
            act = new ACT_ADDLIVES();
            break;
        case ((6 << 16) | 0xFFF9):
            act = new ACT_SUBSCORE();
            break;
        case ((7 << 16) | 0xFFF9):
            act = new ACT_SUBLIVES();
            break;
        case ((8 << 16) | 0xFFF9):
            act = new ACT_SETINPUT();
            break;
        case ((9 << 16) | 0xFFF9):
            act = new ACT_SETINPUTKEY();
            break;
        case ((10 << 16) | 0xFFF9):
            act = new ACT_SETPLAYERNAME();
            break;
        case ((0 << 16) | 0xFFFB):
            act = new ACT_CREATE();
            break;
        case ((1 << 16) | 0xFFFB):
            act = new ACT_CREATEBYNAME();
            break;
        case (((80 + 0) << 16) | 3):
            act = new ACT_STRDESTROY();
            break;
        case (((80 + 1) << 16) | 3):
            act = new ACT_STRDISPLAY();
            break;
        case (((80 + 2) << 16) | 3):
            act = new ACT_STRDISPLAYDURING();
            break;
        case (((80 + 3) << 16) | 3):
            act = new ACT_STRSETCOLOUR();
            break;
        case (((80 + 4) << 16) | 3):
            act = new ACT_STRSET();
            break;
        case (((80 + 5) << 16) | 3):
            act = new ACT_STRPREV();
            break;
        case (((80 + 6) << 16) | 3):
            act = new ACT_STRNEXT();
            break;
        case (((80 + 7) << 16) | 3):
            act = new ACT_STRDISPLAYSTRING();
            break;
        case (((80 + 8) << 16) | 3):
            act = new ACT_STRSETSTRING();
            break;
        case (((80 + 0) << 16) | 2):
            act = new ACT_SPRPASTE();
            break;
        case (((80 + 1) << 16) | 2):
            act = new ACT_SPRFRONT();
            break;
        case (((80 + 2) << 16) | 2):
            act = new ACT_SPRBACK();
            break;
        case (((80 + 3) << 16) | 2):
            act = new ACT_SPRADDBKD();
            break;
        case (((80 + 4) << 16) | 2):
            act = new ACT_SPRREPLACECOLOR();
            break;
        case (((80 + 5) << 16) | 2):
            act = new ACT_SPRSETSCALE();
            break;
        case (((80 + 6) << 16) | 2):
            act = new ACT_SPRSETSCALEX();
            break;
        case (((80 + 7) << 16) | 2):
            act = new ACT_SPRSETSCALEY();
            break;
        case (((80 + 8) << 16) | 2):
            act = new ACT_SPRSETANGLE();
            break;
        case (((80 + 9) << 16) | 2):
            act = new ACT_SPRLOADFRAME();
            break;
        case (((80 + 0) << 16) | 7):
            act = new ACT_CSETVALUE();
            break;
        case (((80 + 1) << 16) | 7):
            act = new ACT_CADDVALUE();
            break;
        case (((80 + 2) << 16) | 7):
            act = new ACT_CSUBVALUE();
            break;
        case (((80 + 3) << 16) | 7):
            act = new ACT_CSETMIN();
            break;
        case (((80 + 4) << 16) | 7):
            act = new ACT_CSETMAX();
            break;
        case (((80 + 5) << 16) | 7):
            act = new ACT_CSETCOLOR1();
            break;
        case (((80 + 6) << 16) | 7):
            act = new ACT_CSETCOLOR2();
            break;
        case (((80 + 0) << 16) | 4):
            act = new ACT_QASK();
            break;
        case (((80 + 0) << 16) | 9):
            act = new ACT_CCARESTARTAPP();
            break;
        case (((80 + 1) << 16) | 9):
            act = new ACT_CCARESTARTFRAME();
            break;
        case (((80 + 2) << 16) | 9):
            act = new ACT_CCANEXTFRAME();
            break;
        case (((80 + 3) << 16) | 9):
            act = new ACT_CCAPREVIOUSFRAME();
            break;
        case (((80 + 4) << 16) | 9):
            act = new ACT_CCAENDAPP();
            break;
        case (((80 + 6) << 16) | 9):
            act = new ACT_CCAJUMPFRAME();
            break;
        case (((80 + 7) << 16) | 9):
            act = new ACT_CCASETGLOBALVALUE();
            break;
        case (((80 + 8) << 16) | 9):
            act = new ACT_CCASHOW();
            break;
        case (((80 + 9) << 16) | 9):
            act = new ACT_CCAHIDE();
            break;
        case (((80 + 10) << 16) | 9):
            act = new ACT_CCASETGLOBALSTRING();
            break;
        case (((80 + 11) << 16) | 9):
            act = new ACT_CCAPAUSEAPP();
            break;
        case (((80 + 12) << 16) | 9):
            act = new ACT_CCARESUMEAPP();
            break;
        case (((80 + 13) << 16) | 9):
            act = new ACT_CCASETWIDTH();
            break;
        case (((80 + 14) << 16) | 9):
            act = new ACT_CCASETHEIGHT();
            break;

        // Actions pour les objets extensions
        default:
        {
            switch (c & 0xFFFF0000) {
                case (1 << 16):
                    act = new ACT_EXTSETPOS();
                    break;
                case (2 << 16):
                    act = new ACT_EXTSETX();
                    break;
                case (3 << 16):
                    act = new ACT_EXTSETY();
                    break;
                case (4 << 16):
                    act = new ACT_EXTSTOP();
                    break;
                case (5 << 16):
                    act = new ACT_EXTSTART();
                    break;
                case (6 << 16):
                    act = new ACT_EXTSPEED();
                    break;
                case (7 << 16):
                    act = new ACT_EXTMAXSPEED();
                    break;
                case (8 << 16):
                    act = new ACT_EXTWRAP();
                    break;
                case (9 << 16):
                    act = new ACT_EXTBOUNCE();
                    break;
                case (10 << 16):
                    act = new ACT_EXTREVERSE();
                    break;
                case (11 << 16):
                    act = new ACT_EXTNEXTMOVE();
                    break;
                case (12 << 16):
                    act = new ACT_EXTPREVMOVE();
                    break;
                case (13 << 16):
                    act = new ACT_EXTSELMOVE();
                    break;
                case (14 << 16):
                    act = new ACT_EXTLOOKAT();
                    break;
                case (15 << 16):
                    act = new ACT_EXTSTOPANIM();
                    break;
                case (16 << 16):
                    act = new ACT_EXTSTARTANIM();
                    break;
                case (17 << 16):
                    act = new ACT_EXTFORCEANIM();
                    break;
                case (18 << 16):
                    act = new ACT_EXTFORCEDIR();
                    break;
                case (19 << 16):
                    act = new ACT_EXTFORCESPEED();
                    break;
                case (20 << 16):
                    act = new ACT_EXTRESTANIM();
                    break;
                case (21 << 16):
                    act = new ACT_EXTRESTDIR();
                    break;
                case (22 << 16):
                    act = new ACT_EXTRESTSPEED();
                    break;
                case (23 << 16):
                    act = new ACT_EXTSETDIR();
                    break;
                case (24 << 16):
                    act = new ACT_EXTDESTROY();
                    break;
                case (25 << 16):
                    act = new ACT_EXTSHUFFLE();
                    break;
                case (26 << 16):
                    act = new ACT_EXTHIDE();
                    break;
                case (27 << 16):
                    act = new ACT_EXTSHOW();
                    break;
                case (28 << 16):
                    act = new ACT_EXTDISPLAYDURING();
                    break;
                case (29 << 16):
                    act = new ACT_EXTSHOOT();
                    break;
                case (30 << 16):
                    act = new ACT_EXTSHOOTTOWARD();
                    break;
                case (31 << 16):
                    act = new ACT_EXTSETVAR();
                    bExtSetVar = true;
                    break;
                case (32 << 16):
                    act = new ACT_EXTADDVAR();
                    bExtAddVar = true;
                    break;
                case (33 << 16):
                    act = new ACT_EXTSUBVAR();
                    bExtSubVar = true;
                    break;
                case (34 << 16):
                    act = new ACT_EXTDISPATCHVAR();
                    break;
                case (35 << 16):
                    act = new ACT_EXTSETFLAG();
                    bExtSetFlag = true;
                    break;
                case (36 << 16):
                    act = new ACT_EXTCLRFLAG();
                    bExtClrFlag = true;
                    break;
                case (37 << 16):
                    act = new ACT_EXTCHGFLAG();
                    bExtChgFlag = true;
                    break;
                case (38 << 16):
                    act = new ACT_EXTINKEFFECT();
                    break;
                case (39 << 16):
                    act = new ACT_EXTSETSEMITRANSPARENCY();
                    break;
                case (40 << 16):
                    act = new ACT_EXTFORCEFRAME();
                    break;
                case (41 << 16):
                    act = new ACT_EXTRESTFRAME();
                    break;
                case (42 << 16):
                    act = new ACT_EXTSETACCELERATION();
                    break;
                case (43 << 16):
                    act = new ACT_EXTSETDECELERATION();
                    break;
                case (44 << 16):
                    act = new ACT_EXTSETROTATINGSPEED();
                    break;
                case (45 << 16):
                    act = new ACT_EXTSETDIRECTIONS();
                    break;
                case (46 << 16):
                    act = new ACT_EXTBRANCHNODE();
                    break;
                case (47 << 16):
                    act = new ACT_EXTSETGRAVITY();
                    break;
                case (48 << 16):
                    act = new ACT_EXTGOTONODE();
                    break;
                case (49 << 16):
                    act = new ACT_EXTSETVARSTRING();
                    break;
                case (50 << 16):
                    act = new ACT_EXTSETFONTNAME();
                    break;
                case (51 << 16):
                    act = new ACT_EXTSETFONTSIZE();
                    break;
                case (52 << 16):
                    act = new ACT_EXTSETBOLD();
                    break;
                case (53 << 16):
                    act = new ACT_EXTSETITALIC();
                    break;
                case (54 << 16):
                    act = new ACT_EXTSETUNDERLINE();
                    break;
                case (55 << 16):
                    act = new ACT_SKIP();
                    break;
                case (56 << 16):
                    act = new ACT_EXTSETTEXTCOLOR();
                    break;
                case (57 << 16):
                    act = new ACT_EXTSPRFRONT();
                    break;
                case (58 << 16):
                    act = new ACT_EXTSPRBACK();
                    break;
                case (59 << 16):
                    act = new ACT_EXTMOVEBEFORE();
                    break;
                case (60 << 16):
                    act = new ACT_EXTMOVEAFTER();
                    break;
                case (61 << 16):
                    act = new ACT_EXTMOVETOLAYER();
                    break;
                case (62 << 16):                //  ACT_EXTADDTODEBUGGER        
                    act = new ACT_SKIP();
                    break;
                case (63 << 16):
                    act = new ACT_EXTSETEFFECT();
                    break;
                case (64 << 16):  //  ACT_EXTSETEFFECTPARAM
                    act = new ACT_SKIP();
                    break;
                case (65 << 16):
                    act = new ACT_EXTSETALPHACOEF();
                    break;
                case (66 << 16):
                    act = new ACT_EXTSETRGBCOEF();
                    break;
                case (67 << 16):  // ACT_EXTSETEFFECTPARAMTEXTURE
                    act = new ACT_SKIP();
                    break;
                case (68 << 16):
                    act = new ACT_EXTSETFRICTION();
                    break;
                case (69 << 16):
                    act = new ACT_EXTSETELASTICITY();
                    break;
                case (70 << 16):
                    act = new ACT_EXTAPPLYIMPULSE();
                    break;
                case (71 << 16):
                    act = new ACT_EXTAPPLYANGULARIMPULSE();
                    break;
                case (72 << 16):
                    act = new ACT_EXTAPPLYFORCE();
                    break;
                case (73 << 16):
                    act = new ACT_EXTAPPLYTORQUE();
                    break;
                case (74 << 16):
                    act = new ACT_EXTSETLINEARVELOCITY();
                    break;
                case (75 << 16):
                    act = new ACT_EXTSETANGULARVELOCITY();
                    break;
                case (76 << 16):
                    act = new ACT_EXTFOREACH();
                    break;
                case (77 << 16):
                    act = new ACT_EXTFOREACH2();
                    break;
                case (78 << 16):
                    act = new ACT_EXTSTOPFORCE();
                    break;
                case (79 << 16):
                    act = new ACT_EXTSTOPTORQUE();
                    break;
                default:
                    act = new CActExtension();
                    break;
            }
        }
    }

    if (act != null) {
        act.evtCode = c;
        act.evtOi = app.file.readShort();
        act.evtOiList = app.file.readShort();
        act.evtFlags = app.file.readAByte();
        act.evtFlags2 = app.file.readAByte();
        act.evtNParams = app.file.readAByte();
        act.evtDefType = app.file.readAByte();

        if (act.evtNParams > 0) {
            act.evtParams = new Array(act.evtNParams);
            var n;
            for (n = 0; n < act.evtNParams; n++) {
                act.evtParams[n] = CParam.create(app);
            }
        }

        // Optimization of operations on global values for constant values
        if (bSetVarGConst || bAddVarGConst || bSubVarGConst) {
            var pParam = act.evtParams[0];
            act.num = pParam.value;

            var pExp1 = act.evtParams[1];
            act.value = pExp1.tokens[0].value;
        }

        // Optimization of operations on alterable values for constant values
        if (bExtSetVar || bExtAddVar || bExtSubVar) {
            var newAct = null;
            var pParam = act.evtParams[0];
            if (pParam.code != 53) {
                // Value number = constant
                var num = pParam.value;

                // Parameter = simple constant?
                var pExp1 = act.evtParams[1];
                if (num >= 0 && pExp1.tokens.length == 2 && (pExp1.tokens[1].code <= 0 || pExp1.tokens[1].code >= 0x00140000)) {
                    // INT
                    if (pExp1.tokens[0].code == ((0 << 16) | 65535) || pExp1.tokens[0].code == ((23 << 16) | 65535)) {
                        if (bExtSetVar) {
                            newAct = new ACT_EXTSETVARCONST();
                            newAct.num = num;
                            newAct.value = pExp1.tokens[0].value;
                        }
                        else if (bExtAddVar) {
                            newAct = new ACT_EXTADDVARCONST();
                            newAct.num = num;
                            newAct.value = pExp1.tokens[0].value;
                        }
                        else if (bExtSubVar) {
                            newAct = new ACT_EXTSUBVARCONST();
                            newAct.num = num;
                            newAct.value = pExp1.tokens[0].value;
                        }
                    }
                }
                if (newAct != null) {
                    newAct.evtCode = act.evtCode;
                    newAct.evtOi = act.evtOi;
                    newAct.evtOiList = act.evtOiList;
                    newAct.evtFlags = act.evtFlags;
                    newAct.evtFlags2 = act.evtFlags2;
                    newAct.evtNParams = act.evtNParams;
                    newAct.evtDefType = act.evtDefType;
                    newAct.evtParams = act.evtParams;

                    act = newAct;
                }
            }
        }

        // Optimization of operations on alterable flags for constant flag numbers
        if (bExtSetFlag || bExtClrFlag || bExtChgFlag) {
            var newAct = null;

            // Flag number = simple constant?
            var pExp = act.evtParams[0];
            if (pExp.tokens.length == 2 && (pExp.tokens[1].code <= 0 || pExp.tokens[1].code >= 0x00140000) && pExp.tokens[0].code == ((0 << 16) | 65535)) {
                if (bExtSetFlag) {
                    newAct = new ACT_EXTSETFLAGCONST();
                    newAct.mask = (1 << pExp.tokens[0].value);
                }
                else if (bExtClrFlag) {
                    newAct = new ACT_EXTCLRFLAGCONST();
                    newAct.mask = (1 << pExp.tokens[0].value);
                }
                else if (bExtChgFlag) {
                    newAct = new ACT_EXTCHGFLAGCONST();
                    newAct.mask = (1 << pExp.tokens[0].value);
                }
            }
            if (newAct != null) {
                newAct.evtCode = act.evtCode;
                newAct.evtOi = act.evtOi;
                newAct.evtOiList = act.evtOiList;
                newAct.evtFlags = act.evtFlags;
                newAct.evtFlags2 = act.evtFlags2;
                newAct.evtNParams = act.evtNParams;
                newAct.evtDefType = act.evtDefType;
                newAct.evtParams = act.evtParams;

                act = newAct;
            }
        }
    }
    app.file.seek(debut + size);
    return act;
}

function CAct() {
}
