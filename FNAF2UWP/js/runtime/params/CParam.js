// CParam object
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

CParam.PARAM_EXPRESSIONNUM = 22;

CParam.create = function (app) {
    var debut = app.file.getFilePointer();

    var param = null;
    var size = app.file.readAShort();
    var c = app.file.readAShort();

    switch (c) {
        case 1:
            param = new PARAM_OBJECT(app);
            break;
        case 2:
            param = new PARAM_TIME(app);
            break;
        case 3:
            param = new PARAM_SHORT(app);
            break;
        case 4:
            param = new PARAM_SHORT(app);
            break;
        case 5:
            param = new PARAM_INT(app);
            break;
        case 6:
            param = new PARAM_SAMPLE(app);
            break;
        case 9:
            param = new PARAM_CREATE(app);
            break;
        case 10:
            param = new PARAM_SHORT(app);
            break;
        case 11:
            param = new PARAM_SHORT(app);
            break;
        case 12:
            param = new PARAM_SHORT(app);
            break;
        case 13:
            param = new PARAM_EVERY(app);
            break;
        case 14:
            param = new PARAM_KEY(app);
            break;
        case 15:
            param = new PARAM_EXPRESSION(app);
            break;
        case 16:
            param = new PARAM_POSITION(app);
            break;
        case 17:
            param = new PARAM_SHORT(app);
            break;
        case 18:
            param = new PARAM_SHOOT(app);
            break;
        case 19:
            param = new PARAM_ZONE(app);
            break;
        case 21:
            param = new PARAM_CREATE(app);
            break;
        case 22:
            param = new PARAM_EXPRESSION(app);
            break;
        case 23:
            param = new PARAM_EXPRESSION(app);
            break;
        case 24:
            param = new PARAM_COLOUR(app);
            break;
        case 25:
            param = new PARAM_INT(app);
            break;
        case 26:
            param = new PARAM_SHORT(app);
            break;
        case 27:
            param = new PARAM_EXPRESSION(app);
            break;
        case 28:
            param = new PARAM_EXPRESSION(app);
            break;
        case 29:
            param = new PARAM_INT(app);
            break;
        case 31:
            param = new PARAM_SHORT(app);
            break;
        case 32:
            param = new PARAM_SHORT(app);
            break;
        case 34:
            param = new PARAM_INT(app);
            break;
        case 35:
            param = new PARAM_SAMPLE(app);
            break;
        case 36:
            param = new PARAM_SAMPLE(app);
            break;
        case 37:
            param = new PARAM_SHORT(app);
            break;
        case 38:
            param = new PARAM_GROUP(app);
            break;
        case 39:
            param = new PARAM_GROUPOINTER(app);
            break;
        case 40:
            param = new PARAM_STRING(app);
            break;
        case 41:
            param = new PARAM_STRING(app);
            break;
        case 42:
            param = new PARAM_CMPTIME(app);
            break;
        case 43:
            param = new PARAM_SHORT(app);
            break;
        case 44:
            param = new PARAM_KEY(app);
            break;
        case 45:
            param = new PARAM_EXPRESSION(app);
            break;
        case 46:
            param = new PARAM_EXPRESSION(app);
            break;
        case 47:
            param = new PARAM_2SHORTS(app);
            break;
        case 48:
            param = new PARAM_INT(app);
            break;
        case 49:
            param = new PARAM_SHORT(app);
            break;
        case 50:
            param = new PARAM_SHORT(app);
            break;
        case 51:
            param = new PARAM_2SHORTS(app);
            break;
        case 52:
            param = new PARAM_EXPRESSION(app);
            break;
        case 53:
            param = new PARAM_EXPRESSION(app);
            break;
        case 54:
            param = new PARAM_EXPRESSION(app);
            break;
        case 55:
            param = new PARAM_EXTENSION(app);
            break;
        case 56:
            param = new PARAM_INT(app);
            break;
        case 57:
            param = new PARAM_SHORT(app);
            break;
        case 58:
            param = new PARAM_SHORT(app);
            break;
        case 59:
            param = new PARAM_EXPRESSION(app);
            break;
        case 60:
            param = new PARAM_SHORT(app);
            break;
        case 61:
            param = new PARAM_SHORT(app);
            break;
        case 62:
            param = new PARAM_EXPRESSION(app);
            break;
        case 63:
            param = new PARAM_STRING(app);
            break;
        case 64:
            param = new PARAM_STRING(app);
            break;
        case 67:
            param = new PARAM_SHORT(app);
            break;
    }
    param.code = c;
    app.file.seek(debut + size);
    return param;
}

function CParam() {
}
