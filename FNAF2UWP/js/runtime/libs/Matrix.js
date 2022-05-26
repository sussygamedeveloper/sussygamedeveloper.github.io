// Matrix object

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

Matrix4.ARRAY = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

function Matrix4() {
    this.matrix = new Matrix4.ARRAY(16);
    this.stack = [];
    this.stackPointer = 0;

    this.identity();
}

Matrix4.prototype.push = function () {
    var matrix = this.matrix;
    var stack = this.stack;
    var pointer = this.stackPointer;

    for (var index = 0; index < 16; index++) {
        stack[pointer + index] = matrix[index];
    }

    this.stackPointer += 16;
}

Matrix4.prototype.popDiffers = function () {
    //return if previous item on the stack is any different from the current
    if (this.stackPointer == 0) {
        return false;
    } else {
        var matrix = this.matrix;
        var stack = this.stack;
        var pointer = this.stackPointer - 16;

        //check for changed
        for (var index = 0; index < 16; index++) {
            if (matrix[index] != stack[pointer + index]) {
                return true;
            }
        }

        //no change
        return false;
    }
}

Matrix4.prototype.pop = function () {
    if (this.stackPointer == 0) {
        throw(Error('popped matrix without push'))
    } else {
        this.stackPointer -= 16
        var matrix = this.matrix;
        var stack = this.stack;
        var pointer = this.stackPointer;
        var changed = false;

        for (var index = 0; index < 16; index++) {
            //update changed flag
            changed = changed || matrix[index] != stack[pointer + index];

            //copy the matrix item
            matrix[index] = stack[pointer + index];
        }

        //return changed state
        return changed;
    }
}

Matrix4.prototype.get = function () {
    return this.matrix;
}

Matrix4.prototype.identity = function () {
    var matrix = this.matrix;
    matrix[0] = 1.0;
    matrix[1] = 0.0;
    matrix[2] = 0.0;
    matrix[3] = 0.0;
    matrix[4] = 0.0;
    matrix[5] = 1.0;
    matrix[6] = 0.0;
    matrix[7] = 0.0;
    matrix[8] = 0.0;
    matrix[9] = 0.0;
    matrix[10] = 1.0;
    matrix[11] = 0.0;
    matrix[12] = 0.0;
    matrix[13] = 0.0;
    matrix[14] = 0.0;
    matrix[15] = 1.0;
};

Matrix4.prototype.transpose = function (out) {
    var matrix = this.matrix;
    var a01 = matrix[1], a02 = matrix[2], a03 = matrix[3], a12 = matrix[6], a13 = matrix[7], a23 = matrix[11];

    if (out) {
        out[0] = matrix[0];
        out[1] = matrix[4];
        out[2] = matrix[8];
        out[3] = matrix[12];
        out[4] = a01;
        out[5] = matrix[5];
        out[6] = matrix[9];
        out[7] = matrix[13];
        out[8] = a02;
        out[9] = a12;
        out[10] = matrix[10];
        out[11] = matrix[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
        out[15] = matrix[15];
    } else {
        matrix[1] = matrix[4];
        matrix[2] = matrix[8];
        matrix[3] = matrix[12];
        matrix[4] = a01;
        matrix[6] = matrix[9];
        matrix[7] = matrix[13];
        matrix[8] = a02;
        matrix[9] = a12;
        matrix[11] = matrix[14];
        matrix[12] = a03;
        matrix[13] = a13;
        matrix[14] = a23;
    }
};

Matrix4.prototype.invert = function () {
    var a00 = matrix[0], a01 = matrix[1], a02 = matrix[2], a03 = matrix[3],
        a10 = matrix[4], a11 = matrix[5], a12 = matrix[6], a13 = matrix[7],
        a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11],
        a30 = matrix[12], a31 = matrix[13], a32 = matrix[14], a33 = matrix[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return;
    }
    det = 1.0 / det;

    var matrix = this.matrix;

    matrix[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    matrix[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    matrix[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    matrix[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;

    matrix[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    matrix[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    matrix[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    matrix[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;

    matrix[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    matrix[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    matrix[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    matrix[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;

    matrix[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    matrix[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    matrix[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    matrix[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
};

Matrix4.prototype.determinant = function () {
    var a00 = matrix[0], a01 = matrix[1], a02 = matrix[2], a03 = matrix[3],
        a10 = matrix[4], a11 = matrix[5], a12 = matrix[6], a13 = matrix[7],
        a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11],
        a30 = matrix[12], a31 = matrix[13], a32 = matrix[14], a33 = matrix[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

Matrix4.prototype.multiply = function () {
    var matrix = this.matrix;

    var a00 = matrix[0], a01 = matrix[1], a02 = matrix[2], a03 = matrix[3],
        a10 = matrix[4], a11 = matrix[5], a12 = matrix[6], a13 = matrix[7],
        a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11],
        a30 = matrix[12], a31 = matrix[13], a32 = matrix[14], a33 = matrix[15];

    var b0 = matrix[0], b1 = matrix[1], b2 = matrix[2], b3 = matrix[3];
    matrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    matrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    matrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    matrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = matrix[4];
    b1 = matrix[5];
    b2 = matrix[6];
    b3 = matrix[7];
    matrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    matrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    matrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    matrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = matrix[8];
    b1 = matrix[9];
    b2 = matrix[10];
    b3 = matrix[11];
    matrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    matrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    matrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    matrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = matrix[12];
    b1 = matrix[13];
    b2 = matrix[14];
    b3 = matrix[15];
    matrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    matrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    matrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    matrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
};

Matrix4.prototype.translate = function (x, y, z) {
    var matrix = this.matrix;

    matrix[12] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
    matrix[13] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
    matrix[14] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
    matrix[15] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
};

Matrix4.prototype.scale = function (x, y, z) {
    var matrix = this.matrix;

    matrix[0] = matrix[0] * x;
    matrix[1] = matrix[1] * x;
    matrix[2] = matrix[2] * x;
    matrix[3] = matrix[3] * x;
    matrix[4] = matrix[4] * y;
    matrix[5] = matrix[5] * y;
    matrix[6] = matrix[6] * y;
    matrix[7] = matrix[7] * y;
    matrix[8] = matrix[8] * z;
    matrix[9] = matrix[9] * z;
    matrix[10] = matrix[10] * z;
    matrix[11] = matrix[11] * z;
};

Matrix4.prototype.rotateX = function (rad) {
    var matrix = this.matrix;

    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = matrix[4],
        a11 = matrix[5],
        a12 = matrix[6],
        a13 = matrix[7],
        a20 = matrix[8],
        a21 = matrix[9],
        a22 = matrix[10],
        a23 = matrix[11];

    matrix[4] = a10 * c + a20 * s;
    matrix[5] = a11 * c + a21 * s;
    matrix[6] = a12 * c + a22 * s;
    matrix[7] = a13 * c + a23 * s;
    matrix[8] = a20 * c - a10 * s;
    matrix[9] = a21 * c - a11 * s;
    matrix[10] = a22 * c - a12 * s;
    matrix[11] = a23 * c - a13 * s;
};

Matrix4.prototype.rotateY = function (rad) {
    var matrix = this.matrix;

    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = matrix[0],
        a01 = matrix[1],
        a02 = matrix[2],
        a03 = matrix[3],
        a20 = matrix[8],
        a21 = matrix[9],
        a22 = matrix[10],
        a23 = matrix[11];

    matrix[0] = a00 * c - a20 * s;
    matrix[1] = a01 * c - a21 * s;
    matrix[2] = a02 * c - a22 * s;
    matrix[3] = a03 * c - a23 * s;
    matrix[8] = a00 * s + a20 * c;
    matrix[9] = a01 * s + a21 * c;
    matrix[10] = a02 * s + a22 * c;
    matrix[11] = a03 * s + a23 * c;
};

Matrix4.prototype.rotateZ = function (rad) {
    var matrix = this.matrix;

    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = matrix[0],
        a01 = matrix[1],
        a02 = matrix[2],
        a03 = matrix[3],
        a10 = matrix[4],
        a11 = matrix[5],
        a12 = matrix[6],
        a13 = matrix[7];

    matrix[0] = a00 * c + a10 * s;
    matrix[1] = a01 * c + a11 * s;
    matrix[2] = a02 * c + a12 * s;
    matrix[3] = a03 * c + a13 * s;
    matrix[4] = a10 * c - a00 * s;
    matrix[5] = a11 * c - a01 * s;
    matrix[6] = a12 * c - a02 * s;
    matrix[7] = a13 * c - a03 * s;
};

Matrix4.prototype.ortho = function (left, right, bottom, top, near, far) {
    var matrix = this.matrix;

    var lr = 1.0 / (left - right),
        bt = 1.0 / (bottom - top),
        nf = 1.0 / (near - far);

    matrix[0] = -2.0 * lr;
    matrix[1] = 0.0;
    matrix[2] = 0.0;
    matrix[3] = 0.0;
    matrix[4] = 0.0;
    matrix[5] = -2.0 * bt;
    matrix[6] = 0.0;
    matrix[7] = 0.0;
    matrix[8] = 0.0;
    matrix[9] = 0.0;
    matrix[10] = 2.0 * nf;
    matrix[11] = 0.0;
    matrix[12] = (left + right) * lr;
    matrix[13] = (top + bottom) * bt;
    matrix[14] = (far + near) * nf;
    matrix[15] = 1.0;
};