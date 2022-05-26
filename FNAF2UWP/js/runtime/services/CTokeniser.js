// CTokeniser object
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

function CTokeniser(text, delimiter) {
    this.tokens = new CArrayList();

    var oldPos = 0;
    var pos = text.indexOf(delimiter);

    // Special case: if delimiter = \n, then remove \r from end of tokens
    if (delimiter.length == 1 && delimiter.charCodeAt(0) == 10) {
        while (pos >= 0) {
            if (pos > oldPos) {
                var str = text.substring(oldPos, pos);
                if (str.length > 0 && str.charCodeAt(str.length - 1) == 13)
                    str = str.substr(0, str.length - 1);
                this.tokens.add(str);
            }
            oldPos = pos + delimiter.length;
            pos = text.indexOf(delimiter, oldPos);
        }

        if (text.length > oldPos) {
            var str = text.substring(oldPos, text.length);
            if (str.length > 0 && str.charCodeAt(str.length - 1) == 13)
                str = str.substr(0, str.length - 1);
            this.tokens.add(str);
        }
    }
    else {
        while (pos >= 0) {
            if (pos > oldPos) {
                this.tokens.add(text.substring(oldPos, pos));
            }
            oldPos = pos + delimiter.length;
            pos = text.indexOf(delimiter, oldPos);
        }

        if (text.length > oldPos) {
            this.tokens.add(text.substring(oldPos, text.length));
        }
    }

    this.numToken = 0;
}

CTokeniser.prototype = {
    countTokens: function () {
        return this.tokens.size();
    },

    nextToken: function () {
        if (this.numToken < this.tokens.size()) {
            var s = this.tokens.get(this.numToken++);
            if (s == null) {
                return "";
            }
            return s;
        }
        return "";
    }
}
