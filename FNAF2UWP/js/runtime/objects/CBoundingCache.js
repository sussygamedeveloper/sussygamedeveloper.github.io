// CBoundingCache object
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

function CBoundingCache() {
    this.boundingCache = false;
    this.boundingCacheResult = new Float32Array(4);

    this.boundingCacheLastX = 0.0;
    this.boundingCacheLastY = 0.0;
    this.boundingCacheLastAngle = 0.0;
    this.boundingCacheLastScaleX = 1.0;
    this.boundingCacheLastScaleY = 1.0;
    this.boundingCacheLastWidth = 0.0;
    this.boundingCacheLastHeight = 0.0;
}

CBoundingCache.prototype = {
    calculateBoundingCache: function (x, y, width, height, centerX, centerY, angle, scaleX, scaleY) {
        //regenerate cache???
        if (!this.boundingCache || width != this.boundingCacheLastWidth || height != this.boundingCacheLastHeight || angle != this.boundingCacheLastAngle || scaleX != this.boundingCacheLastScaleX || scaleY != this.boundingCacheLastScaleY) {
            this.boundingCache = true;
            this.boundingCacheLastWidth = width;
            this.boundingCacheLastHeight = height;
            this.boundingCacheLastAngle = angle;
            this.boundingCacheLastScaleX = scaleX;
            this.boundingCacheLastScaleY = scaleY;

            CServices.calculateBounding(width, height, centerX, centerY, angle, scaleX, scaleY, this.boundingCacheResult);
        }

        //now return it for chain
        return this.boundingCacheResult;
    }
}