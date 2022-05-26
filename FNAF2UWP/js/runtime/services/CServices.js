// CService object
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

var CServices = {};

CServices.extend = function (base, sub) {
    var origProto = sub.prototype;
    sub.prototype = Object.create(base.prototype);
    for (var key in origProto) {
        sub.prototype[key] = origProto[key];
    }

    //fix constructor property
    Object.defineProperty(sub.prototype, 'constructor', {
        enumerable: false,
        value: sub
    });
}

CServices.merge = function (base, extend) {
    //create object using the base object
    var newClass = Object.create(base.prototype || base);

    //overwrite NEW properties 
    if (extend !== undefined && (extend = extend.prototype || extend)) {
        for (var property in extend) {
            if (extend.hasOwnProperty(property)) {
                //check property type as we may have to copy (for now this only handles arrays)
                if (Array.isArray(extend[property])) {
                    //array
                    newClass[property] = Array.apply(Array, extend[property]);
                } else {
                    //primitive
                    newClass[property] = extend[property];
                }
            }
        }
    }

    return newClass;
};

CServices.HIWORD = function (ul) {
    return ul >> 16;
}

CServices.LOWORD = function (ul) {
    return ul & 0x0000FFFF;
}

CServices.MAKELONG = function (lo, hi) {
    return (hi << 16) | (lo & 0xFFFF);
}

CServices.getRValueFlash = function (rgb) {
    return (rgb >>> 16) & 0xFF;
}

CServices.getGValueFlash = function (rgb) {
    return (rgb >>> 8) & 0xFF;
}

CServices.getBValueFlash = function (rgb) {
    return rgb & 0xFF;
}

CServices.RGBFlash = function (r, g, b) {
    return (r & 0xFF) << 16 | (g & 0xFF) << 8 | (b & 0xFF);
}

CServices.swapRGB = function (rgb) {
    var r = (rgb >>> 16) & 0xFF;
    var g = (rgb >>> 8) & 0xFF;
    var b = rgb & 0xFF;
    return (b & 0xFF) << 16 | (g & 0xFF) << 8 | (r & 0xFF);
}

CServices.clamp = function (val, a, b) {
    return Math.min(Math.max(val, a), b);
}

CServices.getColorString = function (rgb) {
    var r = ((rgb >>> 16) & 0xFF).toString(16);
    var g = ((rgb >>> 8) & 0xFF).toString(16);
    var b = (rgb & 0xFF).toString(16);
    while (r.length < 2) {
        r = '0' + r;
    }
    while (g.length < 2) {
        g = '0' + g;
    }
    while (b.length < 2) {
        b = '0' + b;
    }

    return '#' + r + g + b;
}

CServices.floatToInt = function (value) {
    if (value < 0) {
        return Math.ceil(value);
    } else {
        return Math.floor(value);
    }
}

CServices.approximateInt = function (value) {
    return Math.round(value);
}

CServices.isInt = function (value) {
    return Math.ceil(value) == value;
}

CServices.createEllipse = function (ctx, x, y, w, h) {
    var kappa = .5522848;
    ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
}

CServices.drawRect = function (context, rc) {
    context.beginPath();
    context.moveTo(rc.left, rc.top);
    context.lineTo(rc.right, rc.top);
    context.lineTo(rc.right, rc.bottom);
    context.lineTo(rc.left, rc.bottom);
    context.lineTo(rc.left, rc.top);
    context.closePath();
    context.stroke();
}

CServices.drawLine = function (context, x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}

CServices.formatDiscName = function (number, extension) {
    var s = number.toString();
    while (s.length < 4) {
        s = '0' + s;
    }
    s += '.' + extension;
    return s;
}

CServices.compareStringsIgnoreCase = function (string1, string2) {
    if (string1 == string2) {
        return true;
    }
    string1 = string1.toLowerCase();
    string2 = string2.toLowerCase();
    return (string1 == string2);
}

CServices.MAX_HEIGHTS = 40;

CServices.aHeightNormalToLF = [
    0, // 0
    1, // 1
    2, // 2
    3, // 3
    5, // 4
    7, // 5
    8, // 6
    9, // 7
    11, // 8
    12, // 9
    13, // 10
    15, // 11
    16, // 12
    17, // 13
    19, // 14
    20, // 15
    21, // 16
    23, // 17
    24, // 18
    25, // 19
    27, // 20
    28, // 21
    29, // 22
    31, // 23
    32, // 24
    33, // 25
    35, // 26
    36, // 27
    37, // 28
    39, // 29
    40, // 30
    41, // 31
    43, // 32
    44, // 33
    45, // 34
    47, // 35
    48, // 36
    49, // 37
    51, // 38
    52        // 39
];

CServices.heightNormalToLF = function (height) {
    if (height < CServices.MAX_HEIGHTS) {
        return CServices.aHeightNormalToLF[height];
    }
    return Math.round((height * 96) / 72);
}

CServices.intToString = function (value, displayFlags) {
    var s = value.toString();
    if ((displayFlags & CCounter.CPTDISPFLAG_INTNDIGITS) != 0) {
        var nDigits = displayFlags & CCounter.CPTDISPFLAG_INTNDIGITS;
        if (s.length > nDigits) {
            s = s.substring(s.length - nDigits);
        }
        else {
            while (s.length < nDigits) {
                s = "0" + s;
            }
        }
    }
    return s;
}

CServices.doubleToString = function (value, displayFlags) {
    var s;
    if ((displayFlags & CCounter.CPTDISPFLAG_FLOAT_FORMAT) == 0) {
        s = value.toString();
    }
    else {
        var bRemoveTrailingZeros = false;
        var nDigits = Math.floor(((displayFlags & CCounter.CPTDISPFLAG_FLOATNDIGITS) >> CCounter.CPTDISPFLAG_FLOATNDIGITS_SHIFT) + 1);
        var nDecimals = -1;
        if ((displayFlags & CCounter.CPTDISPFLAG_FLOAT_USENDECIMALS) != 0) {
            nDecimals = ((displayFlags & CCounter.CPTDISPFLAG_FLOATNDECIMALS) >> CCounter.CPTDISPFLAG_FLOATNDECIMALS_SHIFT);
        } else if (value != 0.0 && value > -1.0 && value < 1.0) {
            nDecimals = nDigits;
            bRemoveTrailingZeros = true;
        }
        if (nDecimals < 0) {
            s = value.toPrecision(nDigits);
        }
        else {
            s = value.toFixed(nDecimals);
        }
        var l, n;
        var ss;
        if ((displayFlags & CCounter.CPTDISPFLAG_FLOAT_PADD) != 0) {
            l = 0;
            for (n = 0; n < s.length; n++) {
                ss = s.charAt(n);
                if (ss != "." && ss != "+" && ss != "-" && ss != "e" && ss != "E") {
                    l++;
                }
            }
        }
        var bFlag = false;
        if (s.charAt(0) == "-") {
            bFlag = true;
            s = s.substr(1);
        }
        while (l < nDigits) {
            s = "0" + s;
            l++;
        }
        if (bFlag) {
            s = "-" + s;
        }
    }
    return s;
}

CServices.stripLeadingPath = function (path, remove) {
    //navigate the path by chunks until they dont match
    var pos1 = path.indexOf(remove);
    if (pos1 != 0) {
        return path;
    }
    return path.substring(remove.length);
}

CServices.stripFileName = function (path) {
    var pos1 = path.lastIndexOf(".");
    var pos2 = path.lastIndexOf("\\");

    //skip
    if (pos1 == -1 || pos1 < pos2) {
        return path;
    }

    //consists of only filename
    if (pos2 == -1) {
        return "";
    }

    //trim
    return path.substring(0, pos2 + 1);
}

CServices.getMIMEType = function (extension) {
    var pos = extension.lastIndexOf(".");
    if (pos >= 0) {
        extension = extension.substring(pos + 1).toLowerCase();
    }

    //test extensions
    switch (extension) {
        //image formats
        case "png":
            return "image/png";
        case "jpeg":
        case "jpg":
            return "image/jpeg";
        case "gif":
            return "image/gif";
        case "tif":
        case "tiff":
            return "image/tiff";
        case "ico":
            return "image/ico";
        case "bmp":
            return "image/bmp";

        //audio formats
        case "wav":
            return "audio/wav";
        case "ogg":
            return "audio/ogg";
        case "mp3":
            return "audio/mpeg3";
        case "m4a":
        case "mp4":
            return "audio/mp4";

        //text formats
        case "json":
            return "application/json";
        case "xml":
            return "text/xml";
        case "txt":
            return "text/plain";

        //fusion formats

        //unknown format
        default:
            return "application/octet-stream";
    }
}

CServices.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

CServices.setVendorStyle = function (element, style, value) {
    element.style[style] = value;

    style = CServices.capitalizeFirstLetter(style);

    element.style['ms' + style] = value;
    element.style['webkit' + style] = value;
    element.style['moz' + style] = value;
    element.style['o' + style] = value;
};

CServices.removeCSSClass = function (element, className) {
    element.className = element.className.replace(new RegExp('(?:^|\\s)' + className + '(?!\\S)'), '');
};

CServices.addCSSClass = function (element, className) {
    CServices.removeCSSClass(element, className);
    element.className += (element.className.length ? ' ' : '') + className;
};

CServices._calculateBoundingMatrix = new Matrix2D();
CServices._calculateBoundingPoints = [new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2)];

CServices.calculateBounding = function (width, height, centerX, centerY, angle, scaleX, scaleY, out) {
    //rotate and scale points
    var matrix = CServices._calculateBoundingMatrix;
    var point1 = CServices._calculateBoundingPoints[0];
    var point2 = CServices._calculateBoundingPoints[1];
    var point3 = CServices._calculateBoundingPoints[2];
    var point4 = CServices._calculateBoundingPoints[3];

    point1[0] = 0.0;
    point1[1] = 0.0;
    point2[0] = width;
    point2[1] = 0.0;
    point3[0] = width;
    point3[1] = height;
    point4[0] = 0.0;
    point4[1] = height;

    matrix.reset();
    if (angle != 0.0) {
        matrix.rotate(-angle * ToRadians);
    }
    if (scaleX != 1.0 || scaleY != 1.0) {
        matrix.scale(scaleX, scaleY);
    }
    if (centerX != 0.0 || centerY != 0.0) {
        matrix.translate(-centerX, -centerY);
    }
    matrix.transformPoint(point1);
    matrix.transformPoint(point2);
    matrix.transformPoint(point3);
    matrix.transformPoint(point4);

    //calculate bounding
    var minX = point1[0];
    if (point2[0] < minX) { minX = point2[0]; }
    if (point3[0] < minX) { minX = point3[0]; }
    if (point4[0] < minX) { minX = point4[0]; }

    var minY = point1[1];
    if (point2[1] < minY) { minY = point2[1]; }
    if (point3[1] < minY) { minY = point3[1]; }
    if (point4[1] < minY) { minY = point4[1]; }

    var maxX = point1[0];
    if (point2[0] > maxX) { maxX = point2[0]; }
    if (point3[0] > maxX) { maxX = point3[0]; }
    if (point4[0] > maxX) { maxX = point4[0]; }

    var maxY = point1[1];
    if (point2[1] > maxY) { maxY = point2[1]; }
    if (point3[1] > maxY) { maxY = point3[1]; }
    if (point4[1] > maxY) { maxY = point4[1]; }

    //save result
    out[0] = minX;
    out[1] = minY;
    out[2] = maxX - minX;
    out[3] = maxY - minY;
};