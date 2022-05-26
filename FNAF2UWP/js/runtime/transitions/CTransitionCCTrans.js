// CTransitionCCTrans object
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

CTransitionCCTrans.identifiers = [
    "BAND",
    "SE00",
    "SE10",
    "SE12",
    "DOOR",
    "SE03",
    "MOSA",
    "SE05",
    "SE06",
    "SCRL",
    "SE01",
    "SE07",
    "SE09",
    "SE13",
    "SE08",
    "SE02",
    "ZIGZ",
    "SE04",
    "ZOOM",
    "SE11",
    "FADE"
];

function CTransitionCCTrans() {
    //call chain
    CTransition.call(this);

    //call self
}

CTransitionCCTrans.prototype = {
    getTrans: function (data) {
        // Extrait l'identifier
        var id = data.transID;
        var idChars = "";
        idChars += String.fromCharCode(id & 0xFF);
        id >>= 8;
        idChars += String.fromCharCode(id & 0xFF);
        id >>= 8;
        idChars += String.fromCharCode(id & 0xFF);
        id >>= 8;
        idChars += String.fromCharCode(id & 0xFF);

        // Recherche dans la liste
        var n;
        for (n = 0; n < CTransitionCCTrans.identifiers.length; n++) {
            if (idChars == CTransitionCCTrans.identifiers[n]) {
                break;
            }
        }

        // Cree la transition
        var trans = null;
        switch (n) {
            case 0:
                trans = new CTransBand();
                break;
            case 1:
                trans = new CTransAdvancedScrolling();
                break;
            case 2:
                trans = new CTransBack();
                break;
            case 3:
                trans = new CTransCell();
                break;
            case 4:
                trans = new CTransDoor();
                break;
            case 5:
                trans = new CTransLine();
                break;
            case 6:
                trans = new CTransMosaic();
                break;
            case 7:
                trans = new CTransOpen();
                break;
            case 8:
                trans = new CTransPush();
                break;
            case 9:
                trans = new CTransScroll();
                break;
            case 10:
                trans = new CTransSquare();
                break;
            case 11:
                trans = new CTransStretch();
                break;
            case 12:
                trans = new CTransStretch2();
                break;
            case 13:
                trans = new CTransTrame();
                break;
            case 14:
                trans = new CTransTurn();
                break;
            case 15:
                trans = new CTransTurn2();
                break;
            case 16:
                trans = new CTransZigZag();
                break;
            case 17:
                trans = new CTransZigZag2();
                break;
            case 18:
                trans = new CTransZoom();
                break;
            case 19:
                trans = new CTransZoom2();
                break;
            case 20:
                trans = new CTransFade();
                break;
        }
        return trans;
    }
};

//setup inheritance using extend
CServices.extend(CTransition, CTransitionCCTrans);