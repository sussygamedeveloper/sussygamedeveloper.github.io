// CWebGLRenderer object
// ----------------------------------------------------------
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

CWebGLRenderer.ATTRIB_VERTEX = 0;
CWebGLRenderer.ATTRIB_COLOR = 1;
CWebGLRenderer.ATTRIB_TEXURE_COORDINATES = 2;
CWebGLRenderer.ATTRIB_INK_EFFECT = 3;
CWebGLRenderer.ATTRIB_EXTRA_DATA = 4;

CWebGLRenderer.BATCH_TYPE_NONE = 0;
CWebGLRenderer.BATCH_TYPE_RECT = 1;
CWebGLRenderer.BATCH_TYPE_GRADIENT_RECT = 2;
CWebGLRenderer.BATCH_TYPE_GRADIENT_ELLIPSE = 3;
CWebGLRenderer.BATCH_TYPE_IMAGE = 4;
CWebGLRenderer.BATCH_TYPE_LINE = 5;
CWebGLRenderer.BATCH_TYPE_TRIANGLE = 6;
CWebGLRenderer.BATCH_TYPE_PATTERN = 7;

CWebGLRenderer.BATCH_UNIFORM_INT_1 = 0;
CWebGLRenderer.BATCH_UNIFORM_INT_2 = 1;
CWebGLRenderer.BATCH_UNIFORM_INT_3 = 2;
CWebGLRenderer.BATCH_UNIFORM_INT_4 = 3;
CWebGLRenderer.BATCH_UNIFORM_FLOAT_1 = 4;
CWebGLRenderer.BATCH_UNIFORM_FLOAT_2 = 5;
CWebGLRenderer.BATCH_UNIFORM_FLOAT_3 = 6;
CWebGLRenderer.BATCH_UNIFORM_FLOAT_4 = 7;
CWebGLRenderer.BATCH_UNIFORM_MATRIX_2 = 8;
CWebGLRenderer.BATCH_UNIFORM_MATRIX_3 = 9;
CWebGLRenderer.BATCH_UNIFORM_MATRIX_4 = 10;

CWebGLRenderer.BATCH_VERT_MAX = 100;//300;//so 300 = 150 lines, 100 triangles or 50 quads
CWebGLRenderer.MULTIPLE_BUFFERS = 300;//each time a flush happens, the webgl renderer will switch to a new set of buffers to be used for the next render, increasing performance

function CWebGLRenderer(element, context) {
    //call chain
    CRenderer.call(this, element, context);

    //call self
    this.isWebGL = true;
    this.element = element;

    this.loadShaderQueue = [];

    this.renderSession = 0;

    this.matrix = new Matrix4();
    this.matrixLast = new Matrix4.ARRAY(16);

    this.currentBoundTexture = null;
    this.currentShader = null;
    this.currentBlendEquationA = -1;
    this.currentBlendEquationB = -1;
    this.currentBlendFunctionA = -1;
    this.currentBlendFunctionB = -1;
    this.currentProjectionLeft = -1;
    this.currentProjectionRight = -1;
    this.currentProjectionTop = -1;
    this.currentProjectionBottom = -1;
    this.currentBufferIndex = 0;

    this.clipEnabled = false;

    this._calculateTexCoords = new Float32Array(8);

    this._calculateGradientLast = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255];
    this._calculateGradientLastColor1 = -1;
    this._calculateGradientLastColor2 = -1;
    this._calculateGradientLastVertical = null;

    this._calculateInkEffectLast = [0, 0.0, null, 0, 0, 0, 0];
    this._calculateInkEffectLastEffect = -1;
    this._calculateInkEffectLastParam = -1;
    this._calculateInkEffectLastShader = null;
    this._calculateInkEffectLastGlobalAlpha = 1.0;

    this._calculateBlendLast = [-1, -1, -1, -1];
    this._calculateBlendLastEffect = -1

    //batch stuff
    this.batchEmpty = true;
    this.batchFlushCount = 0;
    this.batchType = CWebGLRenderer.BATCH_TYPE_NONE;
    this.batchVertCount = 0;
    this.batchVertMax = CWebGLRenderer.BATCH_VERT_MAX;

    this.batchShader = null;
    this.batchTexture = null;
    this.batchTextureSmoothing = false;//default mode is no smoothing (As set in this._setupNewTexture())

    this.batchFreeImages = [];

    this.batchUniforms = [];
    this.batchUniformCount = 0;

    this.batchBlendOptions = [-1, -1, -1, -1];
    this.batchBlendEquationA = -1;
    this.batchBlendEquationB = -1;
    this.batchBlendFunctionA = -1;
    this.batchBlendFunctionB = -1;

    this.batchInkEffect = -1;
    this.batchInkEffectParam = -1;
    this.batchRed = 255;
    this.batchGreen = 255;
    this.batchBlue = 255;
    this.batchAlpha = 255;

    this.batchVertDataFloats = 4;//size (in floats) for each vert
    this.batchVertDataMax = this.batchVertMax * this.batchVertDataFloats;// number of required verts * number of floats per vert
    this.batchVertDataOffset = 0;

    this.batchColorDataBytes = 4;//size (in bytes) for each vert
    this.batchColorDataMax = this.batchVertMax * this.batchColorDataBytes;// number of required verts * number of bytes per color
    this.batchColorDataOffset = 0;

    this.batchInkEffectDataFloats = 2;//size (in floats) for each vert
    this.batchInkEffectDataMax = this.batchVertMax * this.batchInkEffectDataFloats;// number of required verts * number of ints per ink effect
    this.batchInkEffectDataOffset = 0;

    this.batchExtraDataFloats = 4;//size (in floats) for each vert
    this.batchExtraDataMax = this.batchVertMax * this.batchExtraDataFloats;// number of required verts * number of floats per extra data
    this.batchExtraDataOffset = 0;

    this.batchLastVertDataOffset = 0;
    this.batchLastColorDataOffset = 0;
    this.batchLastInkEffectDataOffset = 0;
    this.batchLastExtraDataOffset = 0;

    //attempt to get webgl context
    //disable alpha, depth and antialias on the context to improve performance
    //TODO: could probably enable antialiasing on more powerful devices!
    var options = {
        alpha: false,
        antialias: false,
        depth: false,
    };

    this._context = context || element.getContext('webgl', options) || element.getContext('experimental-webgl', options);
    if (!this._context) {
        throw new Error("WebGL not supported");
    }

    //local context
    var gl = this._context;

    //setup gl!
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //gl.enable(gl.DEPTH_TEST);
    //gl.depthFunc(gl.LEQUAL);
    //gl.enable(gl.TEXTURE_2D);
    gl.disable(gl.CULL_FACE);

    //create vert position/texcoord data buffer
    this.batchVertData = new Array(CWebGLRenderer.MULTIPLE_BUFFERS);
    this.batchColorData = new Array(CWebGLRenderer.MULTIPLE_BUFFERS);
    this.batchInkEffectData = new Array(CWebGLRenderer.MULTIPLE_BUFFERS);
    this.batchExtraData = new Array(CWebGLRenderer.MULTIPLE_BUFFERS);

    this.batchVertDataBuffer = new Array(CWebGLRenderer.MULTIPLE_BUFFERS);
    this.batchColorDataBuffer = new Array(CWebGLRenderer.MULTIPLE_BUFFERS);
    this.batchInkEffectDataBuffer = new Array(CWebGLRenderer.MULTIPLE_BUFFERS);
    this.batchExtraDataBuffer = new Array(CWebGLRenderer.MULTIPLE_BUFFERS);

    for (var index = 0; index < CWebGLRenderer.MULTIPLE_BUFFERS; index++) {
        this.batchVertData[index] = new Float32Array(this.batchVertDataMax);
        this.batchVertDataBuffer[index] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.batchVertDataBuffer[index]);
        gl.bufferData(gl.ARRAY_BUFFER, this.batchVertData[index], gl.DYNAMIC_DRAW);

        //create vert color data buffer
        this.batchColorData[index] = new Uint8Array(this.batchColorDataMax);
        this.batchColorDataBuffer[index] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.batchColorDataBuffer[index]);
        gl.bufferData(gl.ARRAY_BUFFER, this.batchColorData[index], gl.DYNAMIC_DRAW);

        //create vert ink effect data buffer;
        this.batchInkEffectData[index] = new Float32Array(this.batchInkEffectDataMax);
        this.batchInkEffectDataBuffer[index] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.batchInkEffectDataBuffer[index]);
        gl.bufferData(gl.ARRAY_BUFFER, this.batchInkEffectData[index], gl.DYNAMIC_DRAW);

        //create vert ellipse data buffer
        this.batchExtraData[index] = new Float32Array(this.batchExtraDataMax);
        this.batchExtraDataBuffer[index] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.batchExtraDataBuffer[index]);
        gl.bufferData(gl.ARRAY_BUFFER, this.batchExtraData[index], gl.DYNAMIC_DRAW);
    }

    //load shaders
    this.shaderBasic = null;
    this.shaderTextured = null;
    this.shaderGradient = null;
    this.shaderTexturedEllipse = null;
    this.shaderGradientEllipse = null;
    this.shaderFilled = null;
    this.shaderPattern = null;

    this.updateImageCanvas = null;

};

CWebGLRenderer.prototype = {
    //events
    onLoad: function (callback) {
        //add shaders to queue

        var rootPath = 'js/runtime/renderers/webgl/shaders/';
        var shaderName = '';

        //basic
        shaderName = 'shaderBasic';
        this.loadShaderQueue.push({
            destination: shaderName,
            vert: rootPath + shaderName + '.vert',
            frag: rootPath + shaderName + '.frag',
            options: {
                id: "basic",
                useTexture: true,
                useColor: false,
                useInkEffect: false,
                useExtraData: false,
                uniforms: ['texture', 'projectionMatrix'],
            }
        });

        //textured
        shaderName = 'shaderTextured';
        this.loadShaderQueue.push({
            destination: shaderName,
            vert: rootPath + shaderName + '.vert',
            frag: rootPath + shaderName + '.frag',
            options: {
                id: "textured",
                useTexture: true,
                useColor: true,
                useInkEffect: true,
                useExtraData: false,
                uniforms: ['texture', 'projectionMatrix'],
            }
        });

        //gradientRect
        shaderName = 'shaderGradient';
        this.loadShaderQueue.push({
            destination: shaderName,
            vert: rootPath + shaderName + '.vert',
            frag: rootPath + shaderName + '.frag',
            options: {
                id: "gradient",
                useTexture: false,
                useColor: true,
                useInkEffect: true,
                useExtraData: false,
                uniforms: ['projectionMatrix']
            }
        });

        //line
        shaderName = 'shaderFilled';
        this.loadShaderQueue.push({
            destination: shaderName,
            vert: rootPath + shaderName + '.vert',
            frag: rootPath + shaderName + '.frag',
            options: {
                id: "filled",
                useTexture: false,
                useColor: true,
                useInkEffect: true,
                useExtraData: false,
                uniforms: ['projectionMatrix']
            }
        });

        //pattern
        shaderName = 'shaderPattern';
        this.loadShaderQueue.push({
            destination: shaderName,
            vert: rootPath + shaderName + '.vert',
            frag: rootPath + shaderName + '.frag',
            options: {
                id: "pattern",
                useTexture: true,
                useColor: true,
                useInkEffect: false,
                useExtraData: false,
                uniforms: ['texture', 'projectionMatrix', 'atlasInfo', 'patternRepeats'],
            }
        });

        //texturedEllipse
        /*
        shaderName = 'shaderTexturedEllipse';
        this.loadShaderQueue.push({
            destination: shaderName,
            vert: rootPath + shaderName + '.vert',
            frag: rootPath + shaderName + '.frag',
            options: {
                id: "textured-ellipse",
                useTexture: true,
                useColor: true,
                useInkEffect: true,
                useExtraData: true,
                uniforms: ['projectionMatrix']
            }
        });

        //gradientEllipse
        shaderName = 'shaderGradientEllipse';
        this.loadShaderQueue.push({
            destination: shaderName,
            vert: rootPath + shaderName + '.vert',
            frag: rootPath + shaderName + '.frag',
            options: {
                id: "gradient-ellipse",
                useTexture: false,
                useColor: true,
                useInkEffect: true,
                useExtraData: true,
                uniforms: ['projectionMatrix']
            }
        });*/

        //start the load process
        this._loadNextShader(callback);
    },

    onFree: function () {
        var gl = this._context;

        //clear any dead images
        this._deleteDeadImages();

        //free shaders
        if (this.shaderBasic != null) {
            this.shaderBasic.free();
            this.shaderBasic = null;
        }

        if (this.shaderTextured != null) {
            this.shaderTextured.free();
            this.shaderTextured = null;
        }

        if (this.shaderGradient != null) {
            this.shaderGradient.free();
            this.shaderGradient = null;
        }

        if (this.shaderGradientEllipse != null) {
            this.shaderGradientEllipse.free();
            this.shaderGradientEllipse = null;
        }

        //free gl buffers
        if (this.batchVertDataBuffer != null) {
            gl.deleteBuffer(this.batchVertDataBuffer);
            this.batchVertDataBuffer = null;
        }

        if (this.batchColorDataBuffer != null) {
            gl.deleteBuffer(this.batchColorDataBuffer);
            this.batchColorDataBuffer = null;
        }

        if (this.batchInkEffectDataBuffer != null) {
            gl.deleteBuffer(this.batchInkEffectDataBuffer);
            this.batchInkEffectDataBuffer = null;
        }

        if (this.batchExtraDataBuffer != null) {
            gl.deleteBuffer(this.batchExtraDataBuffer);
            this.batchExtraDataBuffer = null;
        }
    },

    onResize: function () {
        var gl = this._context;

        //update the viewport
        gl.viewport(0, 0, this.width, this.height);

        //calculate the projection matrix
        this.setProjectionMatrix(0, this.width, 0, this.height);
        this.matrix.scale(this.scaleX, this.scaleY, 1.0);
    },

    onStart: function () {
        if (this.renderSession == 0) {
            //first call to render
            this.batchFlushCount = 0;
        } else {
            //nested call to render, need to flush previous results
            this._flushBatch();
        }

        //increase render session
        this.renderSession += 1
    },

    onFinish: function () {
        this._flushBatch();

        //decrease render session
        this.renderSession -= 1
    },

    onClip: function (x, y, width, height) {
        //only apply the clip if its changed
        var gl = this._context;

        if (x == null) {
            //turn clip off
            if (this.clipEnabled) {
                var gl = this._context;

                //do we need to flush?
                if (!this.batchEmpty) {
                    this._flushBatch();
                }

                this.clipEnabled = false;
                gl.disable(gl.SCISSOR_TEST);
            }

        } else {
            //do we need to flush before applying the clip?
            if (!this.batchEmpty) {
                this._flushBatch();
            }

            //change gl state
            if (!this.clipEnabled) {
                this.clipEnabled = true;
                gl.enable(gl.SCISSOR_TEST);
            }

            //need to reverse y for gl coords
            y = this.height - y - height;

            //set the gl scissor
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(x, y, width, height);
        }
    },

    onImageLoaded: function (image) {
        //html image has been loaded, we need to have this uploaded to the graphics card immediately!
        this.updateImage(image, image.img);
    },

    onFreeImage: function (image) {
        var gl = this._context;

        //need to release the texture?
        if (image.texture != null) {
            image.texture.free();
            image.texture = null;
        }
    },

    //internal
    _loadNextShader: function (callback) {
        //finish now!
        if (this.loadShaderQueue.length == 0) {
            callback.call();
            return;
        }

        //process shader as a whole
        var loadItem = this.loadShaderQueue.pop();

        //vert
        this._loadShader(loadItem.vert, function (success, path, code) {
            if (!success) {
                //failed
                throw new Error("failed to load vert shader '" + path + "' error '"+code+"'");
            } else {
                //success
                loadItem.options.vertexSource = code;
                this._loadShader(loadItem.frag, function (success, path, code) {
                    if (!success) {
                        //failed
                        throw new Error("failed to load frag shader '" + path + "' error '" + code + "'");
                    } else {
                        //success
                        loadItem.options.fragmentSource = code;

                        //now time to create the shader
                        this[loadItem.destination] = new CWebGLRendererShader(this).load(loadItem.options);

                        //finished so we need to load next step
                        this._loadNextShader(callback);
                    }
                }.bind(this));
            }
        }.bind(this));
    },

    _loadShader: function(path, callback) {
        //load new shader
        var request = new XMLHttpRequest();
        request.open('GET', path, true);

        //load event
        request.addEventListener('load', function (event) {
            var code = request.response;
            //check success
            if (request.status != 200) {
                //error
                callback.call(this, false, path, 'error code '+request.status);
            } else {
                //success
                callback.call(this, true, path, code);
            }
        }.bind(this));

        //error event
        request.addEventListener('error', function (event) {
            callback.call(this, false, path, event.target.status);
        }.bind(this));

        //start the load
        request.send();
    },

    _sourceToImage: function (source) {
        if (source == null || source instanceof CImage) {
            //null or fusion image
            return source;

        } else if (source instanceof CWebGLRendererImageBuffer) {
            //render buffer
            return source.getImage();

        } else if (source instanceof CWebGLRendererImageContainer) {
            return source.getImage();

        } else {
            //canvas/image/data, we need to create a temporary image and update it on the fly (try to avoid these calls at all costs)
            //TODO: maybe look to see if this can be removed?
            var image = new CImage();
            image.temporary = true;
            image.updateImage(source, this);
            return image;
        }
    },

    _imageToTexture: function (image) {
        if (image.texture == null) {
            //this wont always generate a texture by calling this as it may already be loaded
            this.updateImage(image, image.img);
        }

        return image.texture;
    },

    _startQuadRender: function (type, useColor, useInkEffect, x, y, width, height, xSpot, ySpot, texture, texCoords, angle, scaleX, scaleY, inkEffect, inkEffectParam, shader, boundingCache) {
        //this prepares two triangles in the batch

        //check if the bounding is within teh clip area
        if (width == 0 || height == 0 || !this.withinClip(x, y, width, height, xSpot, ySpot, angle, scaleX, scaleY, boundingCache)) {
            return false;
        }


        //start batch operation
        this._addBatchOperation(type, 1, texture, inkEffect, inkEffectParam, shader);

        //local vars
        var vertOffset = this.batchLastVertDataOffset;
        var gl = this._context;
        var batchVertData = this.batchVertData[this.currentBufferIndex];

        //save vertex positions
        if (angle == 0.0 && scaleX == 1.0 && scaleY == 1.0) {
            //no rotation or scale so verts are simple!
            x -= xSpot;
            y -= ySpot;

            batchVertData[vertOffset + 0] = x;
            batchVertData[vertOffset + 1] = y;
            batchVertData[vertOffset + 4] = x + width;
            batchVertData[vertOffset + 5] = y + height;
            batchVertData[vertOffset + 8] = x;
            batchVertData[vertOffset + 9] = y + height;

            //triangle2 tl, tr, br
            batchVertData[vertOffset + 12] = x;
            batchVertData[vertOffset + 13] = y;
            batchVertData[vertOffset + 16] = x + width;
            batchVertData[vertOffset + 17] = y;
            batchVertData[vertOffset + 20] = x + width;
            batchVertData[vertOffset + 21] = y + height;
        } else {
            //calculate rotation and scale of each vert
            var radians = ToRadians * angle;
            var cosA = Math.cos(radians);
            var sinA = Math.sin(radians);

            var sp0 = -xSpot * scaleX,
                sp1 = -ySpot * scaleY,
                sp2 = (-xSpot + width) * scaleX,
                sp3 = -ySpot * scaleY,
                sp4 = -xSpot * scaleX,
                sp5 = (-ySpot + height) * scaleY,
                sp6 = (-xSpot + width) * scaleX,
                sp7 = (-ySpot + height) * scaleY;

            //triangle1 tl, br, bl
            batchVertData[vertOffset + 0] = sp0 * cosA + sp1 * sinA + x;
            batchVertData[vertOffset + 1] = -sp0 * sinA + sp1 * cosA + y;
            batchVertData[vertOffset + 4] = sp6 * cosA + sp7 * sinA + x;
            batchVertData[vertOffset + 5] = -sp6 * sinA + sp7 * cosA + y;
            batchVertData[vertOffset + 8] = sp4 * cosA + sp5 * sinA + x;
            batchVertData[vertOffset + 9] = -sp4 * sinA + sp5 * cosA + y;

            //triangle2 tl, tr, br (we can reuse some verts calculated in triangle1)
            batchVertData[vertOffset + 12] = batchVertData[vertOffset + 0];
            batchVertData[vertOffset + 13] = batchVertData[vertOffset + 1];
            batchVertData[vertOffset + 16] = sp2 * cosA + sp3 * sinA + x;
            batchVertData[vertOffset + 17] = -sp2 * sinA + sp3 * cosA + y;
            batchVertData[vertOffset + 20] = batchVertData[vertOffset + 4];
            batchVertData[vertOffset + 21] = batchVertData[vertOffset + 5];
        }

        //save vertex texture coordinates
        if (texture) {
            //triangle1 tl, br, bl
            batchVertData[vertOffset + 2] = texCoords[0];
            batchVertData[vertOffset + 3] = texCoords[1];
            batchVertData[vertOffset + 6] = texCoords[4];
            batchVertData[vertOffset + 7] = texCoords[5];
            batchVertData[vertOffset + 10] = texCoords[6];
            batchVertData[vertOffset + 11] = texCoords[7];

            //triangle2 tl, tr, br
            batchVertData[vertOffset + 14] = texCoords[0];
            batchVertData[vertOffset + 15] = texCoords[1];
            batchVertData[vertOffset + 18] = texCoords[2];
            batchVertData[vertOffset + 19] = texCoords[3];
            batchVertData[vertOffset + 22] = texCoords[4];
            batchVertData[vertOffset + 23] = texCoords[5];
        }

        //save colors
        if (useColor) {
            var colorOffset = this.batchLastColorDataOffset;
            var batchColorData = this.batchColorData[this.currentBufferIndex];

            //traingle1 (tl, br, bl)
            batchColorData[colorOffset + 0] = this.batchRed;
            batchColorData[colorOffset + 1] = this.batchGreen;
            batchColorData[colorOffset + 2] = this.batchBlue;
            batchColorData[colorOffset + 3] = this.batchAlpha * this.globalAlpha;//apply global alpha to vert color data (and do the same below for each vert)

            batchColorData[colorOffset + 4] = this.batchRed;
            batchColorData[colorOffset + 5] = this.batchGreen;
            batchColorData[colorOffset + 6] = this.batchBlue;
            batchColorData[colorOffset + 7] = this.batchAlpha * this.globalAlpha;

            batchColorData[colorOffset + 8] = this.batchRed;
            batchColorData[colorOffset + 9] = this.batchGreen;
            batchColorData[colorOffset + 10] = this.batchBlue;
            batchColorData[colorOffset + 11] = this.batchAlpha * this.globalAlpha;

            //triangle2 (tl, tr, br)
            batchColorData[colorOffset + 12] = this.batchRed;
            batchColorData[colorOffset + 13] = this.batchGreen;
            batchColorData[colorOffset + 14] = this.batchBlue;
            batchColorData[colorOffset + 15] = this.batchAlpha * this.globalAlpha;

            batchColorData[colorOffset + 16] = this.batchRed;
            batchColorData[colorOffset + 17] = this.batchGreen;
            batchColorData[colorOffset + 18] = this.batchBlue;
            batchColorData[colorOffset + 19] = this.batchAlpha * this.globalAlpha;

            batchColorData[colorOffset + 20] = this.batchRed;
            batchColorData[colorOffset + 21] = this.batchGreen;
            batchColorData[colorOffset + 22] = this.batchBlue;
            batchColorData[colorOffset + 23] = this.batchAlpha * this.globalAlpha;
        }

        //save ink effect data
        if (useInkEffect) {
            var inkEffectOffset = this.batchLastInkEffectDataOffset;
            var batchInkEffectData = this.batchInkEffectData[this.currentBufferIndex];

            //traingle1 (tl, br, bl)
            batchInkEffectData[inkEffectOffset + 0] = this.batchInkEffect;
            batchInkEffectData[inkEffectOffset + 1] = this.batchInkEffectParam;

            batchInkEffectData[inkEffectOffset + 2] = this.batchInkEffect;
            batchInkEffectData[inkEffectOffset + 3] = this.batchInkEffectParam;

            batchInkEffectData[inkEffectOffset + 4] = this.batchInkEffect;
            batchInkEffectData[inkEffectOffset + 5] = this.batchInkEffectParam;

            //triangle2 (tl, tr, br)
            batchInkEffectData[inkEffectOffset + 6] = this.batchInkEffect;
            batchInkEffectData[inkEffectOffset + 7] = this.batchInkEffectParam;

            batchInkEffectData[inkEffectOffset + 8] = this.batchInkEffect;
            batchInkEffectData[inkEffectOffset + 9] = this.batchInkEffectParam;

            batchInkEffectData[inkEffectOffset + 10] = this.batchInkEffect;
            batchInkEffectData[inkEffectOffset + 11] = this.batchInkEffectParam;
        }

        //success
        return true;
    },

    _renderImage: function (image, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, subPixelCorrection, texCoords, width, height, boundingCache) {
        //skip if it means the image wont be visible!
        if (image.width == 0 || image.height == 0 || scaleX == 0.0 || scaleY == 0.0) {
            return;
        }

        //get teh texture of the passed in image
        var texture = this._imageToTexture(image);
        if (texture == -1) {
            //skip sorry no texture to render!
            return;
        }

        //get dimensions to render (so calling func can override if it want)
        var width = width || image.width;
        var height = height || image.height;
        if (subPixelCorrection) {
            width += this.dxw;
            height += this.dyw;
        }

        //get tex coords to use (so calling func can override if it want)
        texCoords = texCoords || image.textureCoords;


        //pass the grunt work off to the generic function
        if (!this._startQuadRender(CWebGLRenderer.BATCH_TYPE_IMAGE, true, true, x, y, width, height, image.xSpot, image.ySpot, texture, texCoords, angle, scaleX, scaleY, inkEffect, inkEffectParam, null, boundingCache)) {
            return;
        }
    },

    _calculateGradient: function (color1, color2, vertical) {
        //can we skip this
        if (color1 == this._calculateGradientLastColor1 && color2 == this._calculateGradientLastColor2 && vertical == this._calculateGradientLastVertical) {
            return this._calculateGradientLast;
        }

        //save last values so we can avoid calculations, do this before they are altered
        this._calculateGradientLastColor1 = color1;
        this._calculateGradientLastColor2 = color2;
        this._calculateGradientLastVertical = vertical;

        //process teh colors
        var colors = this._calculateGradientLast;

        var r1 = CServices.getRValueFlash(color1);
        var g1 = CServices.getGValueFlash(color1);
        var b1 = CServices.getBValueFlash(color1);
        var a1 = 255;
        var r2 = CServices.getRValueFlash(color2);
        var g2 = CServices.getGValueFlash(color2);
        var b2 = CServices.getBValueFlash(color2);
        var a2 = 255;

        if (vertical) {
            //top left
            colors[0] = r1;
            colors[1] = g1;
            colors[2] = b1;
            colors[3] = a1;

            //top right
            colors[4] = r1;
            colors[5] = g1;
            colors[6] = b1;
            colors[7] = a1;

            //bottom right
            colors[8] = r2;
            colors[9] = g2;
            colors[10] = b2;
            colors[11] = a2;

            //bottom left
            colors[12] = r2;
            colors[13] = g2;
            colors[14] = b2;
            colors[15] = a2;
        } else {
            //top left
            colors[0] = r1;
            colors[1] = g1;
            colors[2] = b1;
            colors[3] = a1;

            //top right
            colors[4] = r2;
            colors[5] = g2;
            colors[6] = b2;
            colors[7] = a2;

            //bottom right
            colors[8] = r2;
            colors[9] = g2;
            colors[10] = b2;
            colors[11] = a2;

            //bottom left
            colors[12] = r1;
            colors[13] = g1;
            colors[14] = b1;
            colors[15] = a1;
        }

        //chain
        return colors;
    },

    _calculateInkEffect: function (effect, param, shader) {
        //calculate ink effect details
        param = param || 0;


        //can we skip as it hasnt changed from last call?
        if (effect == this._calculateInkEffectLastEffect && param == this._calculateInkEffectLastParam && shader == this._calculateInkEffectLastShader && this.globalAlpha == this._calculateInkEffectLastGlobalAlpha) {
            //chain
            return this._calculateInkEffectLast;
        }

        //save last values so we can avoid calculations, do this before they are altered
        this._calculateInkEffectLastEffect = effect;
        this._calculateInkEffectLastParam = param;
        this._calculateInkEffectLastShader = shader;
        this._calculateInkEffectLastGlobalAlpha = this.globalAlpha;

        //process it
        var newEffect = effect || 0;
        var newRed = 255;
        var newGreen = 255;
        var newBlue = 255;
        var newAlpha = 255;
        var newShader = this.shaderTextured;
        var basicShaderAllowed = true;

        /*
         if ((effect & CRSpr.BOP_RGBAFILTER) != 0) {
         newAlpha = (((effectParam >>> 24) & 0xFF) / 255.0);
         } else if (effectMasked == CRSpr.BOP_BLEND) {
         newAlpha = ((128 - effectParam) / 128.0);
         } else {
         newAlpha = 1.0;
         }
         */

        if ((newEffect & CRSpr.BOP_MASK) == CRSpr.BOP_EFFECTEX) {
            newEffect = CRSpr.BOP_BLEND;

            newAlpha = param >>> 24;

        } else if ((newEffect & CRSpr.BOP_RGBAFILTER) != 0) {
            newEffect = Math.max(newEffect & CRSpr.BOP_MASK, CRSpr.BOP_BLEND);

            basicShaderAllowed = false;

            newRed = (param >>> 16) & 0xFF;
            newGreen = (param >>> 8) & 0xFF;
            newBlue = param & 0xFF;
            newAlpha = param >>> 24;

        } else {
            newEffect &= CRSpr.BOP_MASK;

            if (newEffect == CRSpr.BOP_BLEND) {
                newAlpha = (1.0 - (param / 128.0)) * 255.0;
            }
        }

        //if wer have global alpha applied then we cant use basic shader!
        if (this.globalAlpha != 1.0) {
            //so global alpha causes us to not allow the basic shader because it does not let teh code supply color/alpha vert data.
            basicShaderAllowed = false;
        }

        //check to see if need to handle shader
        if (shader) {
            //we have a shader that has been provided, this will cause a replacement effect mode to be used
            newEffect = Math.max(newEffect & CRSpr.BOP_MASK, CRSpr.BOP_BLEND);
            newShader = shader;
            basicShaderAllowed = false;//dont need this, but it is consistant to change it

        } else if (newEffect == 0 && basicShaderAllowed) {
            //no effect has been provided so use basic as default
            newShader = this.shaderBasic;
        }

        //save details
        var calculated = this._calculateInkEffectLast;
        calculated[0] = newEffect;
        calculated[1] = param;
        calculated[2] = newShader;
        calculated[3] = newRed;
        calculated[4] = newGreen;
        calculated[5] = newBlue;
        calculated[6] = newAlpha;//we are not applying any global alpha value here... that is done when we build the vert data

        //chain
        return calculated;
    },

    _calculateBlend: function (effect) {
        //calculate blend options based on effect passed in. this is called from _addBatchOperation()

        //can we skip as effect param hasnt changed from last call?
        if (effect == this._calculateBlendLastEffect) {
            return this._calculateBlendLast;
        }

        //save last value so we can skip next time
        this._calculateBlendLastEffect = effect;

        //local vars
        var gl = this._context;
        var options = this._calculateBlendLast;

        //what effect are we performing?
        switch (effect) {
            case CRSpr.BOP_COPY:
                options[0] = gl.FUNC_ADD;
                options[1] = gl.FUNC_ADD;
                options[2] = gl.SRC_ALPHA;
                options[3] = gl.ONE_MINUS_SRC_ALPHA;
                break;
            case CRSpr.BOP_BLEND:
            case CRSpr.BOP_BLEND_REPLEACETRANSP:
            case CRSpr.BOP_BLEND_DONTREPLACECOLOR:
            case CRSpr.BOP_OR:
            case CRSpr.BOP_XOR:
                options[0] = gl.FUNC_ADD;
                options[1] = gl.FUNC_ADD;
                options[2] = gl.SRC_ALPHA;
                options[3] = gl.ONE_MINUS_SRC_ALPHA;
                break;
            case CRSpr.BOP_MONO:
                options[0] = gl.FUNC_ADD;
                options[1] = gl.FUNC_ADD;
                options[2] = gl.SRC_ALPHA;
                options[3] = gl.ONE_MINUS_SRC_ALPHA;
                break;
            case CRSpr.BOP_INVERT:
                options[0] = gl.FUNC_ADD;
                options[1] = gl.FUNC_ADD;
                options[2] = gl.SRC_ALPHA;
                options[3] = gl.ONE_MINUS_SRC_ALPHA;
                break;
            case CRSpr.BOP_ADD:
                options[0] = gl.FUNC_ADD;
                options[1] = gl.FUNC_ADD;
                options[2] = gl.SRC_ALPHA;
                options[3] = gl.ONE;
                break;
            case CRSpr.BOP_SUB:
                options[0] = gl.FUNC_REVERSE_SUBTRACT;
                options[1] = gl.FUNC_ADD;
                options[2] = gl.SRC_ALPHA;
                options[3] = gl.ONE;
                break;
            default:
                options[0] = gl.FUNC_ADD;
                options[1] = gl.FUNC_ADD;
                options[2] = gl.SRC_ALPHA;
                options[3] = gl.ONE_MINUS_SRC_ALPHA;
                break;
        }

        //chain
        return options;
    },

    _deleteDeadImages: function () {
        //remove any textures that need freeing
        var images = this.batchFreeImages;
        if (images.length > 0) {
            for (var i = 0; i < images.length; i++) {
                this.onFreeImage(images[i]);
                images[i] = null;
            }
            images.length = 0;
        }
    },

    _flushBatch: function () {
        var flushed = false;

        //is there anything to draw!
        if (!this.batchEmpty) {
            //get local vars
            var gl = this._context;
            var dataView = null;
            var bytes = 0;

            //increase flush count (this number will eventually spill over, so debug only)

            //stae change flags
            var shaderChanged = false;
            var textureChanged = false;

            //apply shader
            if (this.batchShader != this.currentShader) {
                //bind it
                this.batchShader.bind();

                //save so we know what state gl is in
                this.currentShader = this.batchShader;

                //flag so we know teh shader has changed THIS flush
                shaderChanged = true;

            }

            //apply texture
            if (this.batchTexture != this.currentBoundTexture) {
                //bind new texture or unbind old texture
                gl.activeTexture(gl.TEXTURE0);

                this._bindTexture(this.batchTexture);
                this.currentBoundTexture = this.batchTexture;
                textureChanged = true;

            }

            //apply texture smoothing
            if (this.currentBoundTexture != null) {
                if (this.batchTextureSmoothing != this.batchTexture.smoothing) {
                    //save new smoothing state in texture object
                    this.batchTexture.smoothing = this.batchTextureSmoothing;

                    //update the texture params on the GPU
                    if (this.batchTexture.smoothing) {
                        //smooth
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    } else {
                        //rough
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    }
                }
            }

            //apply texture uniform in shader
            if (shaderChanged || textureChanged) {
                //changing which texture slot the shader applies to
                this.currentShader.setTextureSlot(0);
            }

            //apply the blend equation
            if (this.batchBlendEquationA != this.currentBlendEquationA || this.batchBlendEquationB != this.currentBlendEquationB) {
                if (this.batchBlendEquationA == this.batchBlendEquationB) {
                    gl.blendEquation(this.batchBlendEquationA);
                } else {
                    gl.blendEquationSeparate(this.batchBlendEquationA, this.batchBlendEquationB);
                }

                //save so we know what state gl is in
                this.currentBlendEquationA = this.batchBlendEquationA;
                this.currentBlendEquationB = this.batchBlendEquationB;
            }

            //apply blend function
            if (this.batchBlendFunctionA != this.currentBlendFunctionA || this.batchBlendFunctionB != this.currentBlendFunctionB) {
                gl.blendFunc(this.batchBlendFunctionA, this.batchBlendFunctionB);

                //save so we know what state gl is in
                this.currentBlendFunctionA = this.batchBlendFunctionA;
                this.currentBlendFunctionB = this.batchBlendFunctionB;
            }

            //apply projection matrix
            this.matrix.transpose(this.matrixLast);
            gl.uniformMatrix4fv(this.batchShader.uniforms.projectionMatrix, false, this.matrixLast);

            //apply custom uniforms
            var uniformLocations = this.batchShader.uniforms;
            var uniform;
            for (var index = 0; index < this.batchUniformCount; index++) {
                uniform = this.batchUniforms[index];
                if (typeof uniformLocations[uniform.name] != 'undefined') {
                    //what type of uniform?
                    switch (uniform.type) {
                        case CWebGLRenderer.BATCH_UNIFORM_INT_1:
                            gl.uniform1iv(uniformLocations[uniform.name], uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_INT_2:
                            gl.uniform2iv(uniformLocations[uniform.name], uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_INT_3:
                            gl.uniform3iv(uniformLocations[uniform.name], uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_INT_4:
                            gl.uniform4iv(uniformLocations[uniform.name], uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_FLOAT_1:
                            gl.uniform1fv(uniformLocations[uniform.name], uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_FLOAT_2:
                            gl.uniform2fv(uniformLocations[uniform.name], uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_FLOAT_3:
                            gl.uniform3fv(uniformLocations[uniform.name], uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_FLOAT_4:
                            gl.uniform4fv(uniformLocations[uniform.name], uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_MATRIX_2:
                            gl.uniformMatrix2fv(uniformLocations[uniform.name], false, uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_MATRIX_3:
                            gl.uniformMatrix3fv(uniformLocations[uniform.name], false, uniform.values);
                            break;
                        case CWebGLRenderer.BATCH_UNIFORM_MATRIX_4:
                            gl.uniformMatrix4fv(uniformLocations[uniform.name], false, uniform.values);
                            break;
                    }
                }
            }

            //apply vert and texture data, we create a dataView into our javascript data arrays as this will allow us to limit the amount of data that is uploaded to teh GPU. Otherwise we would be uploading the entire this.batchVertData array each flushBatch
            dataView = this.batchVertData[this.currentBufferIndex].subarray(0, this.batchVertCount * this.batchVertDataFloats);

            bytes = this.batchVertDataFloats * 4;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.batchVertDataBuffer[this.currentBufferIndex]);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, dataView);
            gl.vertexAttribPointer(CWebGLRenderer.ATTRIB_VERTEX, 2, gl.FLOAT, false, bytes, 0);

            //apply texture (this must come straight after vert data as we reuse teh bound buffer)
            if (this.currentShader.useTexture) {
                //bind texture coords buffer
                gl.vertexAttribPointer(CWebGLRenderer.ATTRIB_TEXURE_COORDINATES, 2, gl.FLOAT, false, bytes, 8);
            }

            //apply color data
            if (this.currentShader.useColor) {
                //bind color data
                dataView = this.batchColorData[this.currentBufferIndex].subarray(0, this.batchVertCount * this.batchColorDataBytes);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.batchColorDataBuffer[this.currentBufferIndex]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, dataView);
                gl.vertexAttribPointer(CWebGLRenderer.ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, this.batchColorDataBytes, 0);
            }

            //apply ink effect data
            if (this.currentShader.useInkEffect) {
                //bind ink effect data
                dataView = this.batchInkEffectData[this.currentBufferIndex].subarray(0, this.batchVertCount * this.batchInkEffectDataFloats);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.batchInkEffectDataBuffer[this.currentBufferIndex]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, dataView);
                gl.vertexAttribPointer(CWebGLRenderer.ATTRIB_INK_EFFECT, 2, gl.FLOAT, false, this.batchInkEffectDataFloats * 4, 0);
            }

            //apply extra data (not currently used, but would be for stuff like ellipse center, etc)
            if (this.currentShader.useExtraData) {
                dataView = this.batchExtraData[this.currentBufferIndex].subarray(0, this.batchVertCount * this.batchExtraDataFloats);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.batchExtraDataBuffer[this.currentBufferIndex]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, dataView);
                gl.vertexAttribPointer(CWebGLRenderer.ATTRIB_EXTRA_DATA, 4, gl.FLOAT, false, this.batchExtraDataFloats * 4, 0);
            }

            //what type of flush are we doing?
            switch (this.batchType) {
                case CWebGLRenderer.BATCH_TYPE_RECT:
                case CWebGLRenderer.BATCH_TYPE_GRADIENT_RECT:
                case CWebGLRenderer.BATCH_TYPE_GRADIENT_ELLIPSE:
                case CWebGLRenderer.BATCH_TYPE_IMAGE:
                case CWebGLRenderer.BATCH_TYPE_TRIANGLE:
                case CWebGLRenderer.BATCH_TYPE_PATTERN:
                    //draw triangles
                    gl.drawArrays(gl.TRIANGLES, 0, this.batchVertCount);
                    break;
                case CWebGLRenderer.BATCH_TYPE_LINE:
                    //draw lines
                    gl.drawArrays(gl.LINES, 0, this.batchVertCount);
                    break;
            }

            //swap buffer index being used
            this.currentBufferIndex++;
            if (this.currentBufferIndex == CWebGLRenderer.MULTIPLE_BUFFERS) {
                this.currentBufferIndex = 0;
            }

            //reset state
            this.batchEmpty = true;

            //reset counters
            this.batchVertCount = 0;
            this.batchVertDataOffset = 0;
            this.batchColorDataOffset = 0;
            this.batchInkEffectDataOffset = 0;
            this.batchExtraDataOffset = 0;
            this.batchLastVertDataOffset = 0;
            this.batchLastColorDataOffset = 0;
            this.batchLastInkEffectDataOffset = 0;
            this.batchLastExtraDataOffset = 0;
            this.batchUniformCount = 0;

            //set to flushed
            flushed = true;
        }

        //clear dead images
        this._deleteDeadImages();


        //chain flushed result
        return flushed;
    },

    _addBatchOperation: function (type, count, texture, inkEffect, inkEffectParam, shader) {
        var flushed = false;

        //flush the previous batch in various situations
        if (type != this.batchType || this.batchType == CWebGLRenderer.BATCH_TYPE_PATTERN) {
            //flush
            if (!this.batchEmpty && !flushed && this.batchType != CWebGLRenderer.BATCH_TYPE_NONE) {
                flushed = this._flushBatch() || flushed;
            }

            //save new
            this.batchType = type;
        }

        //figure out size in verts of the operation
        var typeVerts = 0;
        switch (type) {
            case CWebGLRenderer.BATCH_TYPE_RECT:
            case CWebGLRenderer.BATCH_TYPE_GRADIENT_RECT:
            case CWebGLRenderer.BATCH_TYPE_GRADIENT_ELLIPSE:
            case CWebGLRenderer.BATCH_TYPE_IMAGE:
            case CWebGLRenderer.BATCH_TYPE_PATTERN:
                typeVerts = 6;
                break;
            case CWebGLRenderer.BATCH_TYPE_TRIANGLE:
                typeVerts = 3;
                break;
            case CWebGLRenderer.BATCH_TYPE_LINE:
                typeVerts = 2;
                break;
        }
        var operationVerts = count * typeVerts;

        //check for batch would overrun
        if (!this.batchEmpty && !flushed && this.batchVertCount + operationVerts > this.batchVertMax) {
            flushed = this._flushBatch() || flushed;
        }

        //set the ink effect (this may cause flush). The resulting data will be dumped into batch vars to use safely until next _addBatchOperation
        flushed = this.setInkEffect(inkEffect, inkEffectParam, shader) || flushed;

        //change texture and texture smoothing (this may cause flush)
        flushed = this._changeBatchTexture(texture, (inkEffect & CRSpr.BOP_SMOOTHING) != 0) || flushed;

        //set none empty batch
        this.batchEmpty = false;

        //remember current data offsets
        this.batchLastVertDataOffset = this.batchVertDataOffset;
        this.batchLastColorDataOffset = this.batchColorDataOffset;
        this.batchLastInkEffectDataOffset = this.batchInkEffectDataOffset;
        this.batchLastExtraDataOffset = this.batchExtraDataOffset;

        //advance counters
        this.batchVertCount += operationVerts;
        this.batchVertDataOffset += (this.batchVertDataFloats * operationVerts);
        this.batchColorDataOffset += (this.batchColorDataBytes * operationVerts);
        this.batchInkEffectDataOffset += (this.batchInkEffectDataFloats * operationVerts);
        this.batchExtraDataOffset += (this.batchExtraDataFloats * operationVerts);

        //chain flushed result
        return flushed;
    },

    _setupNewTexture: function () {
        var gl = this._context;

        //gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        //setting the below to linear blending will have a smoother blend option for scaled sprites, but wont recreate the same functionality of desktop fusion
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    },

    _changeBatchTexture: function (texture, smoothing) {
        //change the current texture
        var flushed = false;

        //do we need to change smoothing on the texture?

        //skip if not changed
        if (texture == this.batchTexture && smoothing == this.batchTextureSmoothing) {
            return flushed;
        }

        //do we need to flush any batch operations that may be affected by this
        if (!this.batchEmpty && !flushed) {
            flushed = this._flushBatch() || flushed;
        }

        //now we are safe to change the saved batch texture
        this.batchTexture = texture;
        this.batchTextureSmoothing = smoothing;

        //chain flushed result
        return flushed;
    },

    _bindTexture: function (texture) {
        //safe way to bind the texture
        var gl = this._context;

        if (texture == null) {
            gl.bindTexture(gl.TEXTURE_2D, null);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        }
    },

    //render api
    clearBackground: function (x, y, width, height, color) {
        return this.renderFilledRect(x, y, width, height, color);
    },

    //render image api
    renderImage: function (source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, boundingCache) {
        //return this.renderSubImage(source, 0, 0, 100, 100, x, y, 100, 100, inkEffect, inkEffectParam);

        //what are we rendering
        var image = this._sourceToImage(source);
        if (image == null) {
            return;
        }

        //now render it using internal method
        this._renderImage(image, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, false, null, null, null, boundingCache);

        //do we need to add this image so that it gets deleted automatically?
        if (image.temporary) {
            //yup! we do this at the end because this._renderImage may cause a flush which would prematurely discard the temp image
            this.batchFreeImages.push(image);
        }
    },

    renderSimpleImage: function (source, x, y, width, height, inkEffect, inkEffectParam, boundingCache) {
        //what are we rendering
        var image = this._sourceToImage(source);
        if (image == null || width == 0 || height == 0) {
            return;
        }

        //get dimensiosn and scale
        var scaleX, scaleY;
        if (width == null || height == null) {
            width = image.width;
            height = image.height;
            scaleX = 1.0;
            scaleY = 1.0;
        } else {
            scaleX = (width * 1.0) / image.width;
            scaleY = (height * 1.0) / image.height;
        }

        //now render it using internal method
        this._renderImage(image, x, y, 0.0, scaleX, scaleY, inkEffect, inkEffectParam, false, null, null, null, boundingCache);

        //do we need to add this image so that it gets deleted automatically?
        if (image.temporary) {
            //yup! we do this at the end because this._renderImage may cause a flush which would prematurely discard the temp image
            this.batchFreeImages.push(image);
        }
    },

    renderSubImage: function (source, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height, inkEffect, inkEffectParam) {
        //draw a sub-rect from the source at the given dimensions

        //what are we rendering
        var image = this._sourceToImage(source);
        if (image == null) {
            return;
        }

        //get tex coords to use
        var texCoords;
        if (sourceX == 0 && sourceY == 0 && sourceWidth == image.width && sourceHeight == image.height) {
            //we can just use teh built in tex coords at it is 1:1
            texCoords = image.textureCoords;
        } else {
            //need to calculate new tex coords
            texCoords = this._calculateTexCoords;

            //get coord range of source
            var coordX = image.textureCoords[0];
            var coordY = image.textureCoords[1];
            var coordWidth = image.textureCoords[2] - coordX;
            var coordHeight = image.textureCoords[5] - coordY;

            texCoords[0] = coordX + ((coordWidth / source.width) * sourceX);
            texCoords[1] = coordY + ((coordHeight / source.height) * sourceY);
            texCoords[4] = texCoords[0] + ((coordWidth / source.width) * sourceWidth);
            texCoords[5] = texCoords[1] + ((coordHeight / source.height) * sourceHeight);
            texCoords[2] = texCoords[4];
            texCoords[3] = texCoords[1];
            texCoords[6] = texCoords[0];
            texCoords[7] = texCoords[5];
        }

        //now render it using internal method
        this._renderImage(image, x, y, 0.0, 1.0, 1.0, inkEffect, inkEffectParam, false, texCoords, width, height, null);

        //do we need to add this image so that it gets deleted automatically?
        if (image.temporary) {
            //yup! we do this at the end because this._renderImage may cause a flush which would prematurely discard the temp image
            this.batchFreeImages.push(image);
        }
    },

    renderImageWithSubPixelCorrection: function (source, x, y, angle, scaleX, scaleY, inkEffect, inkEffectParam, boundingCache) {
        //Original note: This function is used by backdrop objects only, to avoid seams between objects (Limited to backdrop objects as it can affect rendering of small objects)

        //what are we rendering
        var image = this._sourceToImage(source);
        if (image == null) {
            return;
        }

        //now render it using internal method (call using true param to specify sub pixel rendering)
        this._renderImage(image, x, y, 0.0, scaleX, scaleY, inkEffect, inkEffectParam, true, null, null, null, boundingCache);

        //do we need to add this image so that it gets deleted automatically?
        if (image.temporary) {
            //yup! we do this at the end because this._renderImage may cause a flush which would prematurely discard the temp image
            this.batchFreeImages.push(image);
        }
    },

    //render filled shape api
    renderFilledRect: function (x, y, width, height, color, inkEffect, inkEffectParam) {
        if (!this._startQuadRender(CWebGLRenderer.BATCH_TYPE_RECT, false, true, x, y, width, height, 0, 0, null, null, 0.0, 1.0, 1.0, inkEffect, color, this.shaderFilled, null)) {
            return;
        }

        //get color details
        var red = CServices.getRValueFlash(color);
        var green = CServices.getGValueFlash(color);
        var blue = CServices.getBValueFlash(color);
        var alpha = 255;

        if (inkEffect == CRSpr.BOP_BLEND) {
            alpha = inkEffectParam * 2;
        }
        alpha *= this.globalAlpha;

        //save colors
        var data = this.batchColorData[this.currentBufferIndex];
        var offset = this.batchLastColorDataOffset;

        data[offset + 0] = red;
        data[offset + 1] = green;
        data[offset + 2] = blue;
        data[offset + 3] = alpha;

        data[offset + 4] = red;
        data[offset + 5] = green;
        data[offset + 6] = blue;
        data[offset + 7] = alpha;

        data[offset + 8] = red;
        data[offset + 9] = green;
        data[offset + 10] = blue;
        data[offset + 11] = alpha;

        data[offset + 12] = red;
        data[offset + 13] = green;
        data[offset + 14] = blue;
        data[offset + 15] = alpha;

        data[offset + 16] = red;
        data[offset + 17] = green;
        data[offset + 18] = blue;
        data[offset + 19] = alpha;

        data[offset + 20] = red;
        data[offset + 21] = green;
        data[offset + 22] = blue;
        data[offset + 23] = alpha;
    },

    renderRotatedRect: function (x, y, width, height, centerX, centerY, angle, scaleX, scaleY, color, inkEffect, inkEffectParam, boundingCache) {
        if (!this._startQuadRender(CWebGLRenderer.BATCH_TYPE_RECT, false, true, x, y, width, height, centerX, centerY, null, null, angle, scaleX, scaleY, inkEffect, color, this.shaderFilled, boundingCache)) {
            return;
        }

        //get color details
        var red = CServices.getRValueFlash(color);
        var green = CServices.getGValueFlash(color);
        var blue = CServices.getBValueFlash(color);
        var alpha = 255;

        if (inkEffect == CRSpr.BOP_BLEND) {
            alpha = inkEffectParam * 2;
        }
        alpha *= this.globalAlpha;

        //save colors
        var data = this.batchColorData[this.currentBufferIndex];
        var offset = this.batchLastColorDataOffset;

        data[offset + 0] = red;
        data[offset + 1] = green;
        data[offset + 2] = blue;
        data[offset + 3] = alpha;

        data[offset + 4] = red;
        data[offset + 5] = green;
        data[offset + 6] = blue;
        data[offset + 7] = alpha;

        data[offset + 8] = red;
        data[offset + 9] = green;
        data[offset + 10] = blue;
        data[offset + 11] = alpha;

        data[offset + 12] = red;
        data[offset + 13] = green;
        data[offset + 14] = blue;
        data[offset + 15] = alpha;

        data[offset + 16] = red;
        data[offset + 17] = green;
        data[offset + 18] = blue;
        data[offset + 19] = alpha;

        data[offset + 20] = red;
        data[offset + 21] = green;
        data[offset + 22] = blue;
        data[offset + 23] = alpha;
    },

    renderFilledEllipse: function (x, y, width, height, color, inkEffect, inkEffectParam) {
        //return this.renderGradientEllipse(x, y, width, height, color, color, false, inkEffect, inkEffectParam);
        return this.renderGradientRect(x, y, width, height, color, color, false, inkEffect, inkEffectParam);
    },

    renderFilledTriangle: function (x1, y1, x2, y2, x3, y3, color, inkEffect, inkEffectParam) {
        //start batch operation
        this._addBatchOperation(CWebGLRenderer.BATCH_TYPE_TRIANGLE, 1, null, inkEffect, inkEffectParam, this.shaderFilled);

        //get color details
        var red = CServices.getRValueFlash(color);
        var green = CServices.getGValueFlash(color);
        var blue = CServices.getBValueFlash(color);
        var alpha = 255;

        //local vars
        var gl = this._context;

        //save vertex positions
        var data = this.batchVertData[this.currentBufferIndex];
        var offset = this.batchLastVertDataOffset;

        //skip 2,3 and 6,7 as these are texture coords
        data[offset + 0] = x1;
        data[offset + 1] = y1;
        data[offset + 4] = x2;
        data[offset + 5] = y2;
        data[offset + 8] = x3;
        data[offset + 9] = y3;

        //save colors
        data = this.batchColorData[this.currentBufferIndex];
        offset = this.batchLastColorDataOffset;

        data[offset + 0] = red;
        data[offset + 1] = green;
        data[offset + 2] = blue;
        data[offset + 3] = alpha * this.globalAlpha;

        data[offset + 4] = red;
        data[offset + 5] = green;
        data[offset + 6] = blue;
        data[offset + 7] = alpha * this.globalAlpha;

        data[offset + 8] = red;
        data[offset + 9] = green;
        data[offset + 10] = blue;
        data[offset + 11] = alpha * this.globalAlpha;
    },

    //render outline shape api
    renderLine: function (x1, y1, x2, y2, color, thickness, inkEffect, inkEffectParam) {
        //start batch operation
        this._addBatchOperation(CWebGLRenderer.BATCH_TYPE_LINE, 1, null, inkEffect, inkEffectParam, this.shaderFilled);

        //get color details
        var red = CServices.getRValueFlash(color);
        var green = CServices.getGValueFlash(color);
        var blue = CServices.getBValueFlash(color);
        var alpha = 255;

        if (inkEffect == CRSpr.BOP_BLEND) {
            alpha = inkEffectParam * 2;
        }
        alpha *= this.globalAlpha;

        //local vars
        var gl = this._context;

        //save vertex positions
        var data = this.batchVertData[this.currentBufferIndex];
        var offset = this.batchLastVertDataOffset;

        //skip 2,3 and 6,7 as these are texture coords
        data[offset + 0] = x1;
        data[offset + 1] = y1;
        data[offset + 4] = x2;
        data[offset + 5] = y2;

        //save colors
        data = this.batchColorData[this.currentBufferIndex];
        offset = this.batchLastColorDataOffset;

        data[offset + 0] = red;
        data[offset + 1] = green;
        data[offset + 2] = blue;
        data[offset + 3] = alpha;

        data[offset + 4] = red;
        data[offset + 5] = green;
        data[offset + 6] = blue;
        data[offset + 7] = alpha;
    },

    renderOutlineRect: function (x, y, width, height, color, thickness, inkEffect, inkEffectParam) {
        /* TODO: this isn't very efficient */

        //left
        this.renderFilledRect(x, y, thickness, height, color, inkEffect, inkEffectParam);

        //bottom
        this.renderFilledRect(x + thickness, (y + height) - thickness, width - thickness, thickness, color, inkEffect, inkEffectParam);

        //right
        this.renderFilledRect(x + (width - thickness), y, thickness, height - thickness, color, inkEffect, inkEffectParam);

        //top
        this.renderFilledRect(x + thickness, y, width - thickness - thickness, thickness, color, inkEffect, inkEffectParam);
    },

    renderOutlineEllipse: function (x, y, w, h, color, inkEffect, inkEffectParam) {
        var gl = this._context;

        /* TODO: how can this be implemented? */
    },

    //render gradient shape api
    renderGradientRect: function (x, y, width, height, color1, color2, vertical, inkEffect, inkEffectParam) {
        var colors = this._calculateGradient(color1, color2, vertical);

        //pass the grunt work off to the generic function
        if (!this._startQuadRender(CWebGLRenderer.BATCH_TYPE_GRADIENT_RECT, false, true, x, y, width, height, 0.0, 0.0, null, null, 0.0, 1.0, 1.0, inkEffect, inkEffectParam, this.shaderGradient, null)) {
            return;
        }

        //handle color data manually
        var colorOffset = this.batchLastColorDataOffset;
        var batchColorData = this.batchColorData[this.currentBufferIndex];

        //this internally uses a pre-allocated array so we are not wasting garbage!
        var colors = this._calculateGradient(color1, color2, vertical);

        //figure out the alpha if semi transparent is specified
        var alpha = 255;
        if (inkEffect == CRSpr.BOP_BLEND) {
            alpha = inkEffectParam * 2;
        }
        alpha *= this.globalAlpha;

        //traingle1 (tl, br, bl)
        batchColorData[colorOffset + 0] = colors[0];
        batchColorData[colorOffset + 1] = colors[1];
        batchColorData[colorOffset + 2] = colors[2];
        batchColorData[colorOffset + 3] = alpha;//colors[3] * this.globalAlpha;

        batchColorData[colorOffset + 4] = colors[8];
        batchColorData[colorOffset + 5] = colors[9];
        batchColorData[colorOffset + 6] = colors[10];
        batchColorData[colorOffset + 7] = alpha;//colors[11] * this.globalAlpha;

        batchColorData[colorOffset + 8] = colors[12];
        batchColorData[colorOffset + 9] = colors[13];
        batchColorData[colorOffset + 10] = colors[14];
        batchColorData[colorOffset + 11] = alpha;//colors[15] * this.globalAlpha;

        //triangle2 (tl, tr, br)
        batchColorData[colorOffset + 12] = colors[0];
        batchColorData[colorOffset + 13] = colors[1];
        batchColorData[colorOffset + 14] = colors[2];
        batchColorData[colorOffset + 15] = alpha;//colors[3] * this.globalAlpha;

        batchColorData[colorOffset + 16] = colors[4];
        batchColorData[colorOffset + 17] = colors[5];
        batchColorData[colorOffset + 18] = colors[6];
        batchColorData[colorOffset + 19] = alpha;//colors[7] * this.globalAlpha;

        batchColorData[colorOffset + 20] = colors[8];
        batchColorData[colorOffset + 21] = colors[9];
        batchColorData[colorOffset + 22] = colors[10];
        batchColorData[colorOffset + 23] = alpha;//colors[11] * this.globalAlpha;
    },

    renderGradientEllipse: function (x, y, width, height, color1, color2, vertical, inkEffect, inkEffectParam) {
        //TODO: fix this
        return this.renderGradientRect(x, y, width, height, color1, color2, vertical, inkEffect, inkEffectParam);
        /*
         //http://www.java-gaming.org/index.php?topic=35411.0

         //pass the grunt work off to the generic function
         if (!this._startQuadRender(CWebGLRenderer.BATCH_TYPE_GRADIENT_ELLIPSE, false, true, x, y, width, height, 0.0, 0.0, null, null, 0.0, 1.0, 1.0, inkEffect, inkEffectParam, this.shaderGradientEllipse, null)) {
         return;
         }

         //do color data
         var colorOffset = this.batchLastColorDataOffset;
         var batchColorData = this.batchColorData;

         //this internally uses a pre-allocated array so we are not wasting garbage!
         var colors = this._calculateGradient(color1, color2, vertical);

         //traingle1 (tl, br, bl)
         batchColorData[colorOffset + 0] = colors[0];
         batchColorData[colorOffset + 1] = colors[1];
         batchColorData[colorOffset + 2] = colors[2];
         batchColorData[colorOffset + 3] = colors[3] * this.globalAlpha;

         batchColorData[colorOffset + 4] = colors[8];
         batchColorData[colorOffset + 5] = colors[9];
         batchColorData[colorOffset + 6] = colors[10];
         batchColorData[colorOffset + 7] = colors[11] * this.globalAlpha;

         batchColorData[colorOffset + 8] = colors[12];
         batchColorData[colorOffset + 9] = colors[13];
         batchColorData[colorOffset + 10] = colors[14];
         batchColorData[colorOffset + 11] = colors[15] * this.globalAlpha;

         //triangle2 (tl, tr, br)
         batchColorData[colorOffset + 12] = colors[0];
         batchColorData[colorOffset + 13] = colors[1];
         batchColorData[colorOffset + 14] = colors[2];
         batchColorData[colorOffset + 15] = colors[3] * this.globalAlpha;

         batchColorData[colorOffset + 16] = colors[4];
         batchColorData[colorOffset + 17] = colors[5];
         batchColorData[colorOffset + 18] = colors[6];
         batchColorData[colorOffset + 19] = colors[7] * this.globalAlpha;

         batchColorData[colorOffset + 20] = colors[8];
         batchColorData[colorOffset + 21] = colors[9];
         batchColorData[colorOffset + 22] = colors[10];
         batchColorData[colorOffset + 23] = colors[11] * this.globalAlpha;

         //do extra data (ellipse details)
         var extraDataOffset = this.batchLastEllipseDataOffset;
         var batchExtraData = this.batchExtraData;

         //save ellipse data, we have to duplicate data for each vert as we are batching and we can't send data "per ellipse"

         var halfWidth = width / 2.0;
         var halfHeight = height / 2.0;
         var centerX = x + halfWidth;
         var centerY = y + halfHeight;
         var radiusA = halfWidth * halfWidth;
         var radiusB = halfHeight * halfHeight;

         //traingle1 (tl, br, bl)
         batchExtraData[extraDataOffset + 0] = centerX
         batchExtraData[extraDataOffset + 1] = centerY
         batchExtraData[extraDataOffset + 2] = radiusA
         batchExtraData[extraDataOffset + 3] = radiusB

         batchExtraData[extraDataOffset + 4] = centerX
         batchExtraData[extraDataOffset + 5] = centerY
         batchExtraData[extraDataOffset + 6] = radiusA
         batchExtraData[extraDataOffset + 7] = radiusB

         batchExtraData[extraDataOffset + 8] = centerX
         batchExtraData[extraDataOffset + 9] = centerY
         batchExtraData[extraDataOffset + 10] = radiusA
         batchExtraData[extraDataOffset + 11] = radiusB

         //triangle2 (tl, tr, br)
         batchExtraData[extraDataOffset + 12] = centerX
         batchExtraData[extraDataOffset + 13] = centerY
         batchExtraData[extraDataOffset + 14] = radiusA
         batchExtraData[extraDataOffset + 15] = radiusB

         batchExtraData[extraDataOffset + 16] = centerX
         batchExtraData[extraDataOffset + 17] = centerY
         batchExtraData[extraDataOffset + 18] = radiusA
         batchExtraData[extraDataOffset + 19] = radiusB

         batchExtraData[extraDataOffset + 20] = centerX
         batchExtraData[extraDataOffset + 21] = centerY
         batchExtraData[extraDataOffset + 22] = radiusA
         batchExtraData[extraDataOffset + 23] = radiusB

         return;
         */
    },

    //render pattern shape api
    renderPatternRect: function (source, x, y, width, height, inkEffect, inkEffectParam) {
        //skip
        if (width <= 0.0 || height <= 0.0) {
            return;
        }

        //what are we rendering
        var image = this._sourceToImage(source);
        if (image == null) {
            return;
        }

        //skip if it means the image wont be visible!
        if (image.width == 0 || image.height == 0) {
            return;
        }

        //get teh texture of the passed in image
        var texture = this._imageToTexture(image);
        if (texture == -1) {
            //skip sorry no texture to render!
            return;
        }

        //get tex coords
        var texCoords = image.textureCoords;

        //pass the grunt work off to the generic function
        if (!this._startQuadRender(CWebGLRenderer.BATCH_TYPE_PATTERN, true, true, x, y, width, height, 0.0, 0.0, texture, texCoords, 0.0, 1.0, 1.0, inkEffect, inkEffectParam, this.shaderPattern, null)) {
            return;
        }

        //add uniforms required by this shader
        this.addUniform("atlasInfo", CWebGLRenderer.BATCH_UNIFORM_FLOAT_4, texCoords[0], texCoords[1], texCoords[2] - texCoords[0], texCoords[5] - texCoords[1]);
        this.addUniform("patternRepeats", CWebGLRenderer.BATCH_UNIFORM_FLOAT_2, width / image.width, height / image.height);

        //do we need to add this image so that it gets deleted automatically?
        if (image.temporary) {
            //yup! we do this at the end because this._renderImage may cause a flush which would prematurely discard the temp image
            this.batchFreeImages.push(image);
        }
    },

    renderPatternEllipse: function (source, x, y, width, height, inkEffect, inkEffectParam) {
        return this.renderPatternRect(source, x, y, width, height, inkEffect, inkEffectParam);

        /*
        var gl = this._context;

        this.setInkEffect(inkEffect, inkEffectParam, this.shaderTexturedEllipse);

        var startX = x, startY = y, endX = x + w, endY = y + h;

        if (startX < -image.width) {
            startX %= image.width;
        }

        if (startY < -image.height) {
            startY %= image.height;
        }

        //TODO : limit end pos to canvas width?

        w = endX - startX;
        h = endY - startY;

        var texture = image.texture(this);

        if (texture == -1) {
            return;
        }

        var vertices = this.vertices;

        this.batchShader.setTextureSlot(texture);
        this.batchShader.setTexCoords(image.texCoordsBuffer);
        this.batchShader.setEllipseCenter(x + w / 2, y + h / 2, w / 2, h / 2);

        for (var cY = startY; cY < endY; cY += image.height) {
            for (var cX = startX; cX < endX; cX += image.width) {
                vertices[0] = cX;
                vertices[1] = cY;
                vertices[2] = cX + image.width;
                vertices[3] = cY;
                vertices[4] = cX;
                vertices[5] = cY + image.height;
                vertices[6] = cX + image.width;
                vertices[7] = cY + image.height;

                this.batchShader.setVertices();

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        }
        */
    },

    //uniform api
    addUniform(/* name, type, [values or value1, value2, value3] */) {
        //this is for renderer/runtime code to add uniform (named uniform) data to a predefined shader uniform.

        //uses variable arguments
        if (arguments.length < 3) {
            return;
        }

        //get arguments
        var name = arguments[0];
        var type = arguments[1];

        var values;
        switch (type) {
            case CWebGLRenderer.BATCH_UNIFORM_INT_1:
                values = new Int32Int32Array(1);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_INT_2:
                values = new Int32Int32Array(2);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_INT_3:
                values = new Int32Int32Array(3);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_INT_4:
                values = new Int32Int32Array(4);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_FLOAT_1:
                values = new Float32Array(1);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_FLOAT_2:
                values = new Float32Array(2);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_FLOAT_3:
                values = new Float32Array(3);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_FLOAT_4:
                values = new Float32Array(4);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_MATRIX_2:
                values = new Float32Array(4);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_MATRIX_3:
                values = new Float32Array(9);
                break;
            case CWebGLRenderer.BATCH_UNIFORM_MATRIX_4:
                values = new Float32Array(16);
        }

        //fill value array
        if (typeof arguments[2] == 'array') {
            //only grab st argument as array
            for(var index = 0;index < Math.min(arguments[2].length,values.length);index++) {
                values[index] = arguments[2][index];
            }
        } else {
            //get all values
            for(var index = 0;index < Math.min(arguments.length-2,values.length);index++) {
                values[index] = arguments[index+2];
            }
        }

        //check to see if we need to add a new uniform
        var uniform;
        if (this.batchUniformCount == this.batchUniforms.length) {
            //create new
            uniform = {
                name: name,
                type: type,
                values: values,
            };
            this.batchUniforms.push(uniform);
            this.batchUniformCount++;
        } else {
            //reuse
            uniform = this.batchUniforms[this.batchUniformCount];
            uniform.name = name;
            uniform.type = type;
            uniform.values = values;
            this.batchUniformCount++;
        }
    },

    //matrix api
    pushMatrix: function () {
        this.matrix.push();
    },

    popMatrix: function () {
        var flushed = false;

        //do we need to flush? we check this by asking the matrix if the previous matrix in teh stack is different from current
        if (!this.batchEmpty && !flushed && this.matrix.popDiffers()) {
            flushed = this._flushBatch() || flushed;
        }

        //do teh pop
        this.matrix.pop();

        //chain flushed result
        return flushed;
    },

    translateMatrix: function (x, y) {
        //when we change the matrix we have to flush the old draws because we let teh shader do the matrix math instead of javascript. This means that the matrix causes a state change!
        var flushed = false;

        //avoid matrix calculations
        if (x != 0.0 || y != 0.0) {
            //do we need to flush
            if (!this.batchEmpty && !flushed) {
                flushed = this._flushBatch() || flushed;
            }

            //do teh translate
            this.matrix.translate(x, y, 0.0);
        }

        //chain flushed result
        return flushed;
    },

    rotateMatrix: function (radians) {
        //when we change the matrix we have to flush the old draws because we let teh shader do the matrix math instead of javascript. This means that the matrix causes a state change!
        var flushed = false;

        //avoid matrix calculations
        if (radians != 0.0) {
            //do we need to flush
            if (!this.batchEmpty && !flushed) {
                flushed = this._flushBatch() || flushed;
            }

            //do teh rotate
            this.matrix.rotateZ(radians);
        }

        //chain flushed result
        return flushed;
    },

    scaleMatrix: function (x, y) {
        //when we change the matrix we have to flush the old draws because we let teh shader do the matrix math instead of javascript. This means that the matrix causes a state change!
        var flushed = false;

        //avoid matrix calculations
        if (x != 1.0 || y != 1.0) {
            //do we need to flush
            if (!this.batchEmpty && !flushed) {
                flushed = this._flushBatch() || flushed;
            }

            //do the scale
            this.matrix.scale(x, y, 1.0);
        }

        //chain flushed result
        return flushed;
    },

    //state api
    resetEffect: function () {
        //the batch render shouldnt need to reset ink effect but maybe alpha!
        this.setAlpha(1.0);

        /*
         var flushed = false;

         //set empty effect
         flushed = this.setInkEffect(0, 0) || flushed;

         //chain flushed result
         return flushed;
         */
        return false;
    },

    setScale: function (scaleX, scaleY) {
        //this should NOT be called during a render loop


        //call chain
        CRenderer.prototype.setScale.call(this, scaleX, scaleY);

        //call self
        var flushed = false;

        //update the projection matrix
        flushed = this.setProjectionMatrix(0, this.width, 0, this.height) || flushed;

        //apply scale
        this.matrix.scale(scaleX, scaleY, 1.0);

        //chain flushed result
        return flushed;
    },

    setProjectionMatrix: function (left, right, top, bottom) {

        var flushed = false;

        //is it changing?
        if (left != this.currentProjectionLeft || right != this.currentProjectionRight || top != this.currentProjectionTop || bottom != this.currentProjectionBottom) {
            //do we need to flush
            if (!this.batchEmpty && !flushed) {
                flushed = this._flushBatch() || flushed;
            }

            //projection matrix is calculated and applied to all renders in a batch
            this.matrix.ortho(left, right, bottom, top, -1.0, 1.0)
        }

        //chain flushed result
        return flushed;
    },

    bindTexture: function (texture) {
        //this is used for operations wanting to do manual texture binding
        var flushed = false;

        //skip if not changed
        if (texture == this.currentBoundTexture) {
            return flushed;
        }

        //do we need to flush any batch operations that may be affected by this
        if (!this.batchEmpty && !flushed) {
            flushed = this._flushBatch() || flushed;
        }

        //update pointers
        this.batchTexture = null;
        this.currentBoundTexture = texture;

        //bind to gl
        var gl = this._context;
        gl.activeTexture(gl.TEXTURE0);
        this._bindTexture(texture);

        //chain flushed result
        return flushed;
    },

    setShader: function (newShader) {
        var flushed = false;

        //skip if teh shader is the same as before
        if (this.batchShader == newShader) {
            return flushed;
        }

        //avoid going from default to basic when the batch has some queued stuff
        if (!this.batchEmpty && newShader == this.shaderBasic && this.batchShader == this.shaderTextured) {
            //so essentially we stay on the default shader and skip this (this is because default can do the same as basic)
            return flushed;
        }

        //flush (but allow the swap from basic to default without causing a flush!)
        if (!this.batchEmpty && !flushed && this.batchShader != null && (this.batchShader != this.shaderBasic || newShader != this.shaderTextured)) {
            flushed = this._flushBatch() || flushed;
        }

        //save shader
        this.batchShader = newShader;

        //chain flushed result
        return flushed;
    },

    setInkEffect: function (effect, param, shader) {
        var flushed = false;

        //calculate the ink effect options
        var calculated = this._calculateInkEffect(effect, param, shader);

        //set the shader (this may cause a flush)
        flushed = this.setShader(calculated[2]) || flushed;

        //check to see if it makes a change to state
        this.batchInkEffect = calculated[0];
        this.batchInkEffectParam = calculated[1];
        //this.batchShader = calculated[2];//this has already been set via this.setShader() above
        this.batchRed = calculated[3];
        this.batchGreen = calculated[4];
        this.batchBlue = calculated[5];
        this.batchAlpha = calculated[6];

        //set blend options (this may cause a flush)
        var blend = this._calculateBlend(calculated[0]);
        flushed = this.setBlendOptions(blend[0], blend[1], blend[2], blend[3]) || flushed;

        //chain flushed result
        return flushed;
    },

    setBlendOptions: function (newEquationA, newEquationB, newFunctionA, newFunctionB) {
        var flushed = false;

        //check to see if there are changes, we test teh batchBelend... vars because teh currentBlend... vars are used by _flushBatch to keep track of what state it has teh gl context in
        var gl = this._context;
        var changed = false;

        //has anything changed?
        if (newEquationA != this.batchBlendEquationA || newEquationB != this.batchBlendEquationB || newFunctionA != this.batchBlendFunctionA || newFunctionB != this.batchBlendFunctionB) {
            //flush
            if (!flushed && (this.batchBlendEquationA != -1 || this.batchBlendFunctionA != -1)) {
                flushed = this._flushBatch() || flushed;
            }

            //save details
            this.batchBlendEquationA = newEquationA;
            this.batchBlendEquationB = newEquationB;
            this.batchBlendFunctionA = newFunctionA;
            this.batchBlendFunctionB = newFunctionB;
        }

        //chain flushed result
        return flushed;
    },

    //buffer api
    createImageBuffer: function (width, height, renderTarget) {
        //return image buffer in correct context
        return new CWebGLRendererImageBuffer(this, width, height, renderTarget);
    },

    createTextContainer: function (app) {
        return new CWebGLRendererTextContainer(app);
    },

    //image api
    createImageContainer: function (source, width, height) {
        return new CWebGLRendererImageContainer(this, source, width, height);
    },

    updateImage: function (image, source, enforce, sourceWidth, sourceHeight) {
        //warning, this function CAN change the bound texture in webgl
        //changes an existing CImage by applying new image data from the source
        if (image == null) {
            return;
        }

        //mosaic image?
        if (image.mosaicId > 0) {
            //cant change a mosaic with external source
            if (source) {
                throw new Error("Mosaic images cannot be changed");
            }

            //get the CMosaic from the app
            var mosaic = null;
            if (image.app != null) {
                mosaic = image.app.imageBank.mosaics[image.mosaicId];
            }

            //skip if no valid mosaic
            if (mosaic == null) {
                return;
            }

            //update texture details in the CImage
            if (image.texture != mosaic.texture) {
                image.texture = mosaic.texture;
                image.texturePaddedWidth = mosaic.image.texturePaddedWidth;
                image.texturePaddedHeight = mosaic.image.texturePaddedHeight;
                image.textureInnerWidth = mosaic.image.textureInnerWidth;
                image.textureInnerHeight = mosaic.image.textureInnerHeight;
                image._updateTextureCoords();
            }

        } else {
            //single image source this is also where the CImage belonging to a CMosaic will update its texture
            var gl = this._context;
            var newWidth = image.width;
            var newHeight = image.height;
            var newTextureWidth;
            var newTextureHeight;

            //do we have a source we are updating with?
            if (source) {
                newWidth = sourceWidth == null ? source.width : sourceWidth;
                newHeight = sourceHeight == null ? source.height : sourceHeight;
            }

            //texture dimensions (need to make power of 2)
            if (image.texturePow2 == 0) {
                //keep size
                newTextureWidth = newWidth;
                newTextureHeight = newHeight;
            } else {
                //rect/square
                newTextureWidth = 8;
                newTextureHeight = 8;

                while (newTextureWidth < newWidth) {
                    newTextureWidth *= 2;
                }

                while (newTextureHeight < newHeight) {
                    newTextureHeight *= 2;
                }

                //square
                if (image.texturePow2 == 2) {
                    newTextureWidth = Math.max(newTextureWidth, newTextureHeight);
                    newTextureHeight = newTextureWidth;
                }
            }

            //do we need to create the texture
            var newTexture = false;
            if (image.texture == null || newTextureWidth != image.texturePaddedWidth || newTextureHeight != image.texturePaddedHeight) {
                //free old texture
                if (image.texture != null) {
                    image.texture.free();
                    image.texture = null;
                }

                //create texture
                image.texture = new CWebGLRendererTexture(this, gl.createTexture());

                //bind
                gl.activeTexture(gl.TEXTURE0);
                this._bindTexture(image.texture);

                //setup
                this._setupNewTexture();
            } else {
                //the texture is already created so just bind the active texture
                gl.activeTexture(gl.TEXTURE0);
                this._bindTexture(image.texture);
            }

            //copy image data
            if (source) {
                //save link to source ? (or do we not do this because .img is set externally)
                //image.img = source.img;

                //first lets check if the source dimensions match our internal texture dimensions for a direct copy!
                if (newTextureWidth == newWidth && newTextureHeight == newHeight) {
                    //direct copy source data without creating a buffer
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
                } else {
                    //need to create padded buffer

                    //create a padded buffer and draw the source to it
                    if (this.updateImageCanvas == null) {
                        this.updateImageCanvas = document.createElement('canvas');
                    }

                    this.updateImageCanvas.width = newTextureWidth;
                    this.updateImageCanvas.height = newTextureHeight;

                    var context = this.updateImageCanvas.getContext('2d');
                    context.clearRect(0, 0, this.updateImageCanvas.width, this.updateImageCanvas.height);
                    context.drawImage(source, 0, 0);

                    //copy to our texture
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.updateImageCanvas);
                }
            } else if (enforce) {
                //this allocates teh texture on GPU regardless
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newTextureWidth, newTextureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }

            //restore bound texture
            this._bindTexture(this.currentBoundTexture);

            //update details
            image.width = newWidth;
            image.height = newHeight;
            image.texturePaddedWidth = newTextureWidth;
            image.texturePaddedHeight = newTextureHeight;
            image.textureInnerWidth = newWidth;
            image.textureInnerHeight = newWidth;
            image._updateTextureCoords();
        }
    },
};

//setup inheritance using extend
CServices.extend(CRenderer, CWebGLRenderer);