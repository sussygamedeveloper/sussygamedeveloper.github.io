// CExp object
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

CExp.EXP_EXTGETFRICTION = (35 << 8);
CExp.EXP_EXTGETRESTITUTION = (36 << 8);
CExp.EXP_EXTGETDENSITY = (37 << 8);
CExp.EXP_EXTGETVELOCITY = (38 << 8);
CExp.EXP_EXTGETANGLE = (39 << 8);
CExp.EXP_EXTGETMASS = (42 << 8);
CExp.EXP_EXTGETANGULARVELOCITY = (43 << 8);
CExp.EXP_STRING = ((3 << 16) | 0xFFFF);
CExp.EXP_LONG = ((0 << 16) | 0xFFFF);
CExp.EXP_DOUBLE = ((23 << 16) | 0xFFFF);

CExp.create = function (file) {
    var debut = file.getFilePointer();
    var exp = null;
    var c = file.readAInt();
    switch (c) {
        case 0x00000000:
            exp = new EXP_ZERO();
            break;
        case 0x00020000:
            exp = new EXP_PLUS();
            break;
        case 0x00040000:
            exp = new EXP_MINUS();
            break;
        case 0x00060000:
            exp = new EXP_MULT();
            break;
        case 0x00080000:
            exp = new EXP_DIV();
            break;
        case 0x000A0000:
            exp = new EXP_MOD();
            break;
        case 0x000C0000:
            exp = new EXP_POW();
            break;
        case 0x000E0000:
            exp = new EXP_AND();
            break;
        case 0x00100000:
            exp = new EXP_OR();
            break;
        case 0x00120000:
            exp = new EXP_XOR();
            break;
        case ((0 << 16) | 0xFFFF):
            exp = new EXP_LONG();
            break;
        case ((1 << 16) | 0xFFFF):
            exp = new EXP_RANDOM();
            break;
        case ((2 << 16) | 0xFFFF):
            exp = new EXP_VARGLO();
            break;
        case ((3 << 16) | 0xFFFF):
            exp = new EXP_STRING();
            break;
        case ((4 << 16) | 0xFFFF):
            exp = new EXP_STR();
            break;
        case ((5 << 16) | 0xFFFF):
            exp = new EXP_VAL();
            break;
        case ((6 << 16) | 0xFFFF):		// EXP_DRIVE
            exp = new EXP_DRIVE();
            break;
        case ((7 << 16) | 0xFFFF):		// EXP_DIRECTORY
            exp = new EXP_DIRECTORY();
            break;
        case ((8 << 16) | 0xFFFF):		// EXP_PATH
            exp = new EXP_PATH();
            break;
        case ((9 << 16) | 0xFFFF):
            exp = new EXP_EMPTY();
            break;
        case ((10 << 16) | 0xFFFF):
            exp = new EXP_SIN();
            break;
        case ((11 << 16) | 0xFFFF):
            exp = new EXP_COS();
            break;
        case ((12 << 16) | 0xFFFF):
            exp = new EXP_TAN();
            break;
        case ((13 << 16) | 0xFFFF):
            exp = new EXP_SQR();
            break;
        case ((14 << 16) | 0xFFFF):
            exp = new EXP_LOG();
            break;
        case ((15 << 16) | 0xFFFF):
            exp = new EXP_LN();
            break;
        case ((16 << 16) | 0xFFFF):
            exp = new EXP_HEX();
            break;
        case ((17 << 16) | 0xFFFF):
            exp = new EXP_BIN();
            break;
        case ((18 << 16) | 0xFFFF):
            exp = new EXP_EXP();
            break;
        case ((19 << 16) | 0xFFFF):
            exp = new EXP_LEFT();
            break;
        case ((20 << 16) | 0xFFFF):
            exp = new EXP_RIGHT();
            break;
        case ((21 << 16) | 0xFFFF):
            exp = new EXP_MID();
            break;
        case ((22 << 16) | 0xFFFF):
            exp = new EXP_LEN();
            break;
        case ((23 << 16) | 0xFFFF):
            exp = new EXP_DOUBLE();
            break;
        case ((24 << 16) | 0xFFFF):
            exp = new EXP_VARGLONAMED();
            break;
        case ((28 << 16) | 0xFFFF):
            exp = new EXP_INT();
            break;
        case ((29 << 16) | 0xFFFF):
            exp = new EXP_ABS();
            break;
        case ((30 << 16) | 0xFFFF):
            exp = new EXP_CEIL();
            break;
        case ((31 << 16) | 0xFFFF):
            exp = new EXP_FLOOR();
            break;
        case ((32 << 16) | 0xFFFF):
            exp = new EXP_ACOS();
            break;
        case ((33 << 16) | 0xFFFF):
            exp = new EXP_ASIN();
            break;
        case ((34 << 16) | 0xFFFF):
            exp = new EXP_ATAN();
            break;
        case ((35 << 16) | 0xFFFF):
            exp = new EXP_NOT();
            break;
        case ((40 << 16) | 0xFFFF):
            exp = new EXP_MIN();
            break;
        case ((41 << 16) | 0xFFFF):
            exp = new EXP_MAX();
            break;
        case ((42 << 16) | 0xFFFF):
            exp = new EXP_GETRGB();
            break;
        case ((43 << 16) | 0xFFFF):
            exp = new EXP_GETRED();
            break;
        case ((44 << 16) | 0xFFFF):
            exp = new EXP_GETGREEN();
            break;
        case ((45 << 16) | 0xFFFF):
            exp = new EXP_GETBLUE();
            break;
        case ((46 << 16) | 0xFFFF):
            exp = new EXP_LOOPINDEX();
            break;
        case ((47 << 16) | 0xFFFF):
            exp = new EXP_NEWLINE();
            break;
        case ((48 << 16) | 0xFFFF):
            exp = new EXP_ROUND();
            break;
        case ((49 << 16) | 0xFFFF):
            exp = new EXP_STRINGGLO();
            break;
        case ((50 << 16) | 0xFFFF):
            exp = new EXP_STRINGGLONAMED();
            break;
        case ((51 << 16) | 0xFFFF):
            exp = new EXP_LOWER();
            break;
        case ((52 << 16) | 0xFFFF):
            exp = new EXP_UPPER();
            break;
        case ((53 << 16) | 0xFFFF):
            exp = new EXP_FIND();
            break;
        case ((54 << 16) | 0xFFFF):
            exp = new EXP_REVERSEFIND();
            break;
        case ((58 << 16) | 0xFFFF):
            exp = new EXP_FLOATTOSTRING();
            break;
        case ((59 << 16) | 0xFFFF):
            exp = new EXP_ATAN2();
            break;
        case ((60 << 16) | 0xFFFF):
            exp = new EXP_ZERO();
            break;
        case ((61 << 16) | 0xFFFF):
            exp = new EXP_EMPTY();
            break;
        case ((62 << 16) | 0xFFFF):
            exp = new EXP_DISTANCE();
            break;
        case ((63 << 16) | 0xFFFF):
            exp = new EXP_ANGLE();
            break;
        case ((64 << 16) | 0xFFFF):
            exp = new EXP_RANGE();
            break;
        case ((65 << 16) | 0xFFFF):
            exp = new EXP_RANDOMRANGE();
            break;
        case ((67 << 16) | 0xFFFF):
            exp = new EXP_RUNTIMENAME();
            break;
        case ((-1 << 16) | 0xFFFF):
            exp = new EXP_PARENTH1();
            break;
        case ((-2 << 16) | 0xFFFF):
            exp = new EXP_PARENTH2();
            break;
        case ((-3 << 16) | 0xFFFF):
            exp = new EXP_VIRGULE();
            break;
        case ((0 << 16) | 0xFFFE):
            exp = new EXP_GETSAMPLEMAINVOL();
            break;
        case ((1 << 16) | 0xFFFE):
            exp = new EXP_GETSAMPLEVOL();
            break;
        case ((2 << 16) | 0xFFFE):
            exp = new EXP_GETCHANNELVOL();
            break;
        case ((3 << 16) | 0xFFFE):
            exp = new EXP_ZERO();
            break;
        case ((4 << 16) | 0xFFFE):
            exp = new EXP_GETSAMPLEPAN();
            break;
        case ((5 << 16) | 0xFFFE):
            exp = new EXP_GETCHANNELPAN();
            break;
        case ((6 << 16) | 0xFFFE):
            exp = new EXP_GETSAMPLEPOS();
            break;
        case ((7 << 16) | 0xFFFE):
            exp = new EXP_GETCHANNELPOS();
            break;
        case ((8 << 16) | 0xFFFE):
            exp = new EXP_GETSAMPLEDUR();
            break;
        case ((9 << 16) | 0xFFFE):
            exp = new EXP_GETCHANNELDUR();
            break;
        case ((10 << 16) | 0xFFFE):
            exp = new EXP_GETSAMPLEFREQ();
            break;
        case ((11 << 16) | 0xFFFE):
            exp = new EXP_GETCHANNELFREQ();
            break;
        case ((0 << 16) | 0xFFFD):
            exp = new EXP_GAMLEVEL();
            break;
        case ((1 << 16) | 0xFFFD):
            exp = new EXP_GAMNPLAYER();
            break;
        case ((2 << 16) | 0xFFFD):
            exp = new EXP_PLAYXLEFT();
            break;
        case ((3 << 16) | 0xFFFD):
            exp = new EXP_PLAYXRIGHT();
            break;
        case ((4 << 16) | 0xFFFD):
            exp = new EXP_PLAYYTOP();
            break;
        case ((5 << 16) | 0xFFFD):
            exp = new EXP_PLAYYBOTTOM();
            break;
        case ((6 << 16) | 0xFFFD):
            exp = new EXP_PLAYWIDTH();
            break;
        case ((7 << 16) | 0xFFFD):
            exp = new EXP_PLAYHEIGHT();
            break;
        case ((8 << 16) | 0xFFFD):
            exp = new EXP_GAMLEVELNEW();
            break;
        case ((9 << 16) | 0xFFFD):
            exp = new EXP_GETCOLLISIONMASK();
            break;
        case ((10 << 16) | 0xFFFD):
            exp = new EXP_FRAMERATE();
            break;
        case ((11 << 16) | 0xFFFD):
            exp = new EXP_GETVIRTUALWIDTH();
            break;
        case ((12 << 16) | 0xFFFD):
            exp = new EXP_GETVIRTUALHEIGHT();
            break;
        case ((13 << 16) | 0xFFFD):
            exp = new EXP_GETFRAMEBKDCOLOR();
            break;
        case ((14 << 16) | 0xFFFD):
            exp = new EXP_ZERO();
            break;
        case ((15 << 16) | 0xFFFD):
            exp = new EXP_ZERO();
            break;
        case ((16 << 16) | 0xFFFD):
            exp = new EXP_FRAMEALPHACOEF();
            break;
        case ((17 << 16) | 0xFFFD):
            exp = new EXP_FRAMERGBCOEF();
            break;
        case ((18 << 16) | 0xFFFD):
            exp = new EXP_ZERO();
            break;
        case ((0 << 16) | 0xFFFC):
            exp = new EXP_TIMVALUE();
            break;
        case ((1 << 16) | 0xFFFC):
            exp = new EXP_TIMCENT();
            break;
        case ((2 << 16) | 0xFFFC):
            exp = new EXP_TIMSECONDS();
            break;
        case ((3 << 16) | 0xFFFC):
            exp = new EXP_TIMHOURS();
            break;
        case ((4 << 16) | 0xFFFC):
            exp = new EXP_TIMMINITS();
            break;
        case ((5 << 16) | 0xFFFC):
            exp = new EXP_EVENTAFTER();
            break;
        case ((0 << 16) | 0xFFFA):
            exp = new EXP_XMOUSE();
            break;
        case ((1 << 16) | 0xFFFA):
            exp = new EXP_YMOUSE();
            break;
        case ((2 << 16) | 0xFFFA):
            exp = new EXP_MOUSEWHEELDELTA();
            break;
        case ((0 << 16) | 0xFFF9):
            exp = new EXP_PLASCORE();
            break;
        case ((1 << 16) | 0xFFF9):
            exp = new EXP_PLALIVES();
            break;
        case ((2 << 16) | 0xFFF9):
            exp = new EXP_GETINPUT();
            break;
        case ((3 << 16) | 0xFFF9):
            exp = new EXP_GETINPUTKEY();
            break;
        case ((4 << 16) | 0xFFF9):
            exp = new EXP_GETPLAYERNAME();
            break;
        case ((0 << 16) | 0xFFFB):
            exp = new EXP_CRENUMBERALL();
            break;
        case (((80 + 0) << 16) | 3):
            exp = new EXP_STRNUMBER();
            break;
        case (((80 + 1) << 16) | 3):
            exp = new EXP_STRGETCURRENT();
            break;
        case (((80 + 2) << 16) | 3):
            exp = new EXP_STRGETNUMBER();
            break;
        case (((80 + 3) << 16) | 3):
            exp = new EXP_STRGETNUMERIC();
            break;
        case (((80 + 4) << 16) | 3):
            exp = new EXP_STRGETNPARA();
            break;
        case ((80 + 0) << 16 | 2):
            exp = new EXP_GETRGBAT();
            break;
        case ((80 + 1) << 16 | 2):
            exp = new EXP_GETSCALEX();
            break;
        case ((80 + 2) << 16 | 2):
            exp = new EXP_GETSCALEY();
            break;
        case ((80 + 3) << 16 | 2):
            exp = new EXP_GETANGLE();
            break;
        case (((80 + 0) << 16) | 7):
            exp = new EXP_CVALUE();
            break;
        case (((80 + 1) << 16) | 7):
            exp = new EXP_CGETMIN();
            break;
        case (((80 + 2) << 16) | 7):
            exp = new EXP_CGETMAX();
            break;
        case (((80 + 3) << 16) | 7):
            exp = new EXP_CGETCOLOR1();
            break;
        case (((80 + 4) << 16) | 7):
            exp = new EXP_CGETCOLOR2();
            break;
        case (((80 + 0) << 16) | 9):
            exp = new EXP_CCAGETFRAMENUMBER();
            break;
        case (((80 + 1) << 16) | 9):
            exp = new EXP_CCAGETGLOBALVALUE();
            break;
        case (((80 + 2) << 16) | 9):
            exp = new EXP_CCAGETGLOBALSTRING();
            break;
        default:
            switch (c & 0xFFFF0000) {
                case (1 << 16):
                    exp = new EXP_EXTYSPR();
                    break;
                case (2 << 16):
                    exp = new EXP_EXTISPR();
                    break;
                case (3 << 16):
                    exp = new EXP_EXTSPEED();
                    break;
                case (4 << 16):
                    exp = new EXP_EXTACC();
                    break;
                case (5 << 16):
                    exp = new EXP_EXTDEC();
                    break;
                case (6 << 16):
                    exp = new EXP_EXTDIR();
                    break;
                case (7 << 16):
                    exp = new EXP_EXTXLEFT();
                    break;
                case (8 << 16):
                    exp = new EXP_EXTXRIGHT();
                    break;
                case (9 << 16):
                    exp = new EXP_EXTYTOP();
                    break;
                case (10 << 16):
                    exp = new EXP_EXTYBOTTOM();
                    break;
                case (11 << 16):
                    exp = new EXP_EXTXSPR();
                    break;
                case (12 << 16):
                    exp = new EXP_EXTIDENTIFIER();
                    break;
                case (13 << 16):
                    exp = new EXP_EXTFLAG();
                    break;
                case (14 << 16):
                    exp = new EXP_EXTNANI();
                    break;
                case (15 << 16):
                    exp = new EXP_EXTNOBJECTS();
                    break;
                case (16 << 16):
                    exp = new EXP_EXTVAR();
                    break;
                case (17 << 16):
                    exp = new EXP_EXTGETSEMITRANSPARENCY();
                    break;
                case (18 << 16):
                    exp = new EXP_EXTNMOVE();
                    break;
                case (19 << 16):
                    exp = new EXP_EXTVARSTRING();
                    break;
                case (20 << 16):
                    exp = new EXP_EXTGETFONTNAME();
                    break;
                case (21 << 16):
                    exp = new EXP_EXTGETFONTSIZE();
                    break;
                case (22 << 16):
                    exp = new EXP_EXTGETFONTCOLOR();
                    break;
                case (23 << 16):
                    exp = new EXP_EXTGETLAYER();
                    break;
                case (24 << 16):
                    exp = new EXP_EXTGETGRAVITY();
                    break;
                case (25 << 16):
                    exp = new EXP_EXTXAP();
                    break;
                case (26 << 16):
                    exp = new EXP_EXTYAP();
                    break;
                case (27 << 16):
                    exp = new EXP_EXTALPHACOEF();
                    break;
                case (28 << 16):
                    exp = new EXP_EXTRGBCOEF();
                    break;
                case (29 << 16):
                    exp = new EXP_ZERO();
                    break;
                case (30 << 16):
                    exp = new EXP_EXTVARBYINDEX();
                    break;
                case (31 << 16):
                    exp = new EXP_EXTVARSTRINGBYINDEX();
                    break;

                case (32 << 16):
                    exp = new EXP_EXTDISTANCE();
                    break;
                case (33 << 16):
                    exp = new EXP_EXTANGLE();
                    break;
                case (34 << 16):
                    exp = new EXP_EXTLOOPINDEX();
                    break;

                case (35 << 16):
                    exp = new EXP_EXTGETFRICTION();
                    break;
                case (36 << 16):
                    exp = new EXP_EXTGETRESTITUTION();
                    break;
                case (37 << 16):
                    exp = new EXP_EXTGETDENSITY();
                    break;
                case (38 << 16):
                    exp = new EXP_EXTGETVELOCITY();
                    break;
                case (39 << 16):
                    exp = new EXP_EXTGETANGLE();
                    break;
                case (40 << 16):
                    exp = new EXP_EXTWIDTH();
                    break;
                case (41 << 16):
                    exp = new EXP_EXTHEIGHT();
                    break;
                case (42 << 16):
                    exp = new EXP_EXTGETMASS();
                    break;
                case (43 << 16):
                    exp = new EXP_EXTGETANGULARVELOCITY();
                    break;
                case (44 << 16):
                    exp = new EXP_EXTGETNAME();
                    break;

                default:
                    exp = new CExpExtension();
                    break;
            }
    }
    if (exp != null) {
        exp.code = c;

        if (c != 0x00000000) {
            var size = file.readAShort();

            var type;
            switch (c) {
                case ((3 << 16) | 0xFFFF):
                    exp.string = file.readAString();
                    break;
                case ((0 << 16) | 0xFFFF):
                    exp.value = file.readAInt();
                    break;
                case ((23 << 16) | 0xFFFF):
                    exp.value = file.readADouble();
                    break;
                case ((24 << 16) | 0xFFFF):
                    file.skipBytes(4);
                    exp.number = file.readAShort();
                    break;
                case ((50 << 16) | 0xFFFF):
                    file.skipBytes(4);
                    exp.number = file.readAShort();
                    break;
                default:
                    type = c & 0xFFFF;
                    if ((type & 0x8000) != 0) {
                        type = type - 65536;
                    }
                    if (type >= 2 || type == COI.OBJ_PLAYER) {
                        exp.oi = file.readShort();
                        exp.oiList = file.readShort();
                        switch (c & 0xFFFF0000) {
                            case (16 << 16):        // EXP_EXTVAR
                                exp.number = file.readAShort();
                                break;
                            case (19 << 16):        // EXP_EXTVARSTRING            
                                exp.number = file.readAShort();
                                break;
                            default:
                                break;
                        }
                    }
            }
            file.seek(debut + size);
        }
    }
    return exp;
}

function CExp() {
}
