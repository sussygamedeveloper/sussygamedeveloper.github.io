// CLayerPlane object
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

function CLayerPlane(layer) {
    //call chain
    CSceneNode.call(this);

    //call self


    this.layer = layer;
    this.oldBoundingOffsetX = 0.0;
    this.oldBoundingOffsetY = 0.0;
}

//methods
CLayerPlane.prototype = {
    draw: function (context, xx, yy) {
        //offset bounding in the renderer so all child renders can calculate the rendering properly!
        this.oldBoundingOffsetX = context.boundingOffsetX;
        this.oldBoundingOffsetY = context.boundingOffsetY;
        context.boundingOffsetX = context.boundingOffsetX - xx + this.layer.app.run.rhWindowX - this.layer.x;
        context.boundingOffsetY = context.boundingOffsetY - yy + this.layer.app.run.rhWindowY - this.layer.y;

        //call chain so that normal render happens
        CSceneNode.prototype.draw.call(this, context, xx, yy);

        //restore values in the renderer (see this can be nested, not that anything uses it...)
        context.boundingOffsetX = this.oldBoundingOffsetX;
        context.boundingOffsetY = this.oldBoundingOffsetY;
    },
};

//setup inheritance using extend
CServices.extend(CSceneNode, CLayerPlane);