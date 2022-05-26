// PARAM_EXPRESSION object
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

function PARAM_EXPRESSION(app) {
    this.comparaison = app.file.readAShort();

    var debut = app.file.getFilePointer();
    var count = 0;
    var size;
    var code;
    while (true) {
        count++;
        code = app.file.readAInt();
        if (code == 0) {
            break;
        }
        size = app.file.readAShort();
        if (size > 6) {
            app.file.skipBytes(size - 6);
        }
    }

    app.file.seek(debut);
    this.tokens = new Array(count);
    var n;
    for (n = 0; n < count; n++) {
        this.tokens[n] = CExp.create(app.file);
    }
}
