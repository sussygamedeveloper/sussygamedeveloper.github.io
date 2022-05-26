Matrix2D.ARRAY = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

function Matrix2D() {
    this.stack = [];
    this.pointer = 0;
    this.matrix = new Matrix2D.ARRAY(6);

    this.reset();
}

Matrix2D.prototype.reset = function () {
    this.matrix = [1, 0, 0, 1, 0, 0];
};

Matrix2D.prototype.push = function () {
    var matrix = this.matrix;
    var stack = this.stack;
    var pointer = this.pointer;

    for (var index = 0; index < 6; index++) {
        stack[pointer + index] = matrix[index];
    }

    this.pointer += 6;
};

Matrix2D.prototype.pop = function () {
    if (this.pointer == 0) {
        throw (Error('popped matrix without push'))
    }

    this.pointer -= 6
    var matrix = this.matrix;
    var stack = this.stack;
    var pointer = this.pointer;
    var changed = false;

    for (var index = 0; index < 6; index++) {
        matrix[index] = stack[pointer + index];
    }
}

Matrix2D.prototype.popDiffers = function () {
    //return if previous item on the stack is any different from the current
    if (this.pointer == 0) {
        return false;
    } else {
        var matrix = this.matrix;
        var stack = this.stack;
        var pointer = this.pointer - 6;

        //check for changed
        for (var index = 0; index < 6; index++) {
            if (matrix[index] != stack[pointer + index]) {
                return true;
            }
        }

        //no change
        return false;
    }
}


Matrix2D.prototype.multiply = function (matrix) {
    var m11 = this.matrix[0] * matrix.m[0] + this.matrix[2] * matrix.m[1];
    var m12 = this.matrix[1] * matrix.m[0] + this.matrix[3] * matrix.m[1];

    var m21 = this.matrix[0] * matrix.m[2] + this.matrix[2] * matrix.m[3];
    var m22 = this.matrix[1] * matrix.m[2] + this.matrix[3] * matrix.m[3];

    var dx = this.matrix[0] * matrix.m[4] + this.matrix[2] * matrix.m[5] + this.matrix[4];
    var dy = this.matrix[1] * matrix.m[4] + this.matrix[3] * matrix.m[5] + this.matrix[5];

    this.matrix[0] = m11;
    this.matrix[1] = m12;
    this.matrix[2] = m21;
    this.matrix[3] = m22;
    this.matrix[4] = dx;
    this.matrix[5] = dy;
};

Matrix2D.prototype.invert = function () {
    var d = 1 / (this.matrix[0] * this.matrix[3] - this.matrix[1] * this.matrix[2]);
    var m0 = this.matrix[3] * d;
    var m1 = -this.matrix[1] * d;
    var m2 = -this.matrix[2] * d;
    var m3 = this.matrix[0] * d;
    var m4 = d * (this.matrix[2] * this.matrix[5] - this.matrix[3] * this.matrix[4]);
    var m5 = d * (this.matrix[1] * this.matrix[4] - this.matrix[0] * this.matrix[5]);
    this.matrix[0] = m0;
    this.matrix[1] = m1;
    this.matrix[2] = m2;
    this.matrix[3] = m3;
    this.matrix[4] = m4;
    this.matrix[5] = m5;
};

Matrix2D.prototype.rotate = function (rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var m11 = this.matrix[0] * c + this.matrix[2] * s;
    var m12 = this.matrix[1] * c + this.matrix[3] * s;
    var m21 = this.matrix[0] * -s + this.matrix[2] * c;
    var m22 = this.matrix[1] * -s + this.matrix[3] * c;
    this.matrix[0] = m11;
    this.matrix[1] = m12;
    this.matrix[2] = m21;
    this.matrix[3] = m22;
};

Matrix2D.prototype.translate = function (x, y) {
    this.matrix[4] += this.matrix[0] * x + this.matrix[2] * y;
    this.matrix[5] += this.matrix[1] * x + this.matrix[3] * y;
};

Matrix2D.prototype.scale = function (sx, sy) {
    this.matrix[0] *= sx;
    this.matrix[1] *= sx;
    this.matrix[2] *= sy;
    this.matrix[3] *= sy;
};

Matrix2D.prototype.transformPoint = function (px, py) {
    if (arguments.length == 1) {
        //by ref array
        var point = arguments[0];
        var x = point[0];
        var y = point[1];
        point[0] = x * this.matrix[0] + y * this.matrix[2] + this.matrix[4];
        point[1] = x * this.matrix[1] + y * this.matrix[3] + this.matrix[5];
        return point;
    } else {
        //create new array
        var x = px;
        var y = py;
        px = x * this.matrix[0] + y * this.matrix[2] + this.matrix[4];
        py = x * this.matrix[1] + y * this.matrix[3] + this.matrix[5];
        return [px, py];
    }

    return null;
};

Matrix2D.prototype.to3D = function () {

}