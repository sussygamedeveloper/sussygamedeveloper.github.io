// CWebGLRendererShader object
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

//for future reference, the CWebGLRendererShader() object is not an individual shader, it is actually both the vert and frag shaders combined

function CWebGLRendererShader(renderer, script) {
    this.renderer = renderer;
    this.uniforms = {};

    this.currentTexture = -1;

    this.program = null;
    this.vertexShader = null;
    this.fragmentShader = null;

    this.useTexture = false;
    this.useColor = false;
    this.useInkEffect = false;
    this.useExtraData = false;
};

CWebGLRendererShader.prototype = {
    load: function (options) {
        //build options
        options = CServices.merge({
            id: "",
            vertexSource: "",
            fragmentSource: "",
            useTexture: false,
            useColor: false,
            useInkEffect: false,
            useExtraData: false,
            uniforms: []
        }, options);

        //save certain options
        this.id = options.id;
        this.useTexture = options.useTexture;
        this.useColor = options.useColor;
        this.useInkEffect = options.useInkEffect;
        this.useExtraData = options.useExtraData;

        //local vars
        var gl = this.renderer._context;

        //create shader program
        this.program = gl.createProgram()

        //compile shaders
        this.vertexShader = this.compile(options.vertexSource, gl.VERTEX_SHADER);
        this.fragmentShader = this.compile(options.fragmentSource, gl.FRAGMENT_SHADER);

        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);

        //setup all attrbitues the shader will use. It is not ideal to hard code this structure but we have now added data1 and data2 to cover other circumstances

        //vertex
        gl.bindAttribLocation(this.program, CWebGLRenderer.ATTRIB_VERTEX, 'position');

        //tex coords
        if (options.useTexture) {
            gl.bindAttribLocation(this.program, CWebGLRenderer.ATTRIB_TEXURE_COORDINATES, 'texCoord');
        }

        //color
        if (options.useColor) {
            gl.bindAttribLocation(this.program, CWebGLRenderer.ATTRIB_COLOR, 'color');
        }

        //ink effect
        if (options.useInkEffect) {
            gl.bindAttribLocation(this.program, CWebGLRenderer.ATTRIB_INK_EFFECT, 'inkEffect');
        }

        //data
        if (options.useExtraData) {
            gl.bindAttribLocation(this.program, CWebGLRenderer.ATTRIB_EXTRA_DATA, 'extraData');
        }

        //link shader and check for errors
        gl.linkProgram(this.program);
        if (gl.getProgramParameter(this.program, gl.LINK_STATUS) == 0) {
            var lastError = gl.getProgramInfoLog(this.program);
            console.log("Error in program linking:" + lastError);
            throw new Error("Error linking shader program");
        }

        //validate shader and check for errors
        gl.validateProgram(this.program);
        if (gl.getProgramParameter(this.program, gl.VALIDATE_STATUS) == 0) {
            console.log("Error in program linking:" + lastError);
            throw new Error("CWebGLRendererShader program did not validate");
        }

        //create and store all uniform locations
        for (var i = 0; i < options.uniforms.length; ++i) {
            var uniform = options.uniforms[i];
            this.uniforms[uniform] = gl.getUniformLocation(this.program, uniform);
        }

        //chain
        return this;
    },

    free: function () {
        var gl = this.renderer._context;

        //free shaders
        if (this.vertexShader != null) {
            gl.detachShader(this.program, this.vertexShader);
            gl.deleteShader(this.vertexShader);
            this.vertexShader = null;
        }

        if (this.fragmentShader != null) {
            gl.detachShader(this.program, this.fragmentShader);
            gl.deleteShader(this.fragmentShader);
            this.fragmentShader = null;
        }

        //free program
        if (this.program != null) {
            gl.deleteProgram(this.program);
            this.program = null;
        }
    },

    compile: function (source, type) {
        //local vars
        var gl = this.renderer._context;

        //create teh shader and check for errors
        var shader = gl.createShader(type);
        if (!shader) {
            throw new Error("Error creating shader");
        }

        //set the shader source
        gl.shaderSource(shader, source);

        //compile and check for errors
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0) {
            console.log(gl.getShaderInfoLog(shader));
            throw new Error("Error compiling shader");
        }

        //chain
        return shader;
    },

    bind: function () {
        //this will bind the shader to the gl context
        var gl = this.renderer._context;

        //set the active shader program
        gl.useProgram(this.program);

        //enable vertex attribute
        gl.enableVertexAttribArray(CWebGLRenderer.ATTRIB_VERTEX);

        //enable texture coordinate attribute
        if (this.useTexture) {
            gl.enableVertexAttribArray(CWebGLRenderer.ATTRIB_TEXURE_COORDINATES);
        } else {
            gl.disableVertexAttribArray(CWebGLRenderer.ATTRIB_TEXURE_COORDINATES);
        }

        //enable color attribute
        if (this.useColor) {
            gl.enableVertexAttribArray(CWebGLRenderer.ATTRIB_COLOR);
        } else {
            gl.disableVertexAttribArray(CWebGLRenderer.ATTRIB_COLOR);
        }

        //enable color attribute
        if (this.useInkEffect) {
            gl.enableVertexAttribArray(CWebGLRenderer.ATTRIB_INK_EFFECT);
        } else {
            gl.disableVertexAttribArray(CWebGLRenderer.ATTRIB_INK_EFFECT);
        }

        //enable data attrbibutes
        if (this.useExtraData) {
            gl.enableVertexAttribArray(CWebGLRenderer.ATTRIB_EXTRA_DATA);
        } else {
            gl.disableVertexAttribArray(CWebGLRenderer.ATTRIB_EXTRA_DATA);
        }
    },

    setTextureSlot: function (slot) {
        //only change it if it has changed! (unifrom is persistant across executions)
        if (slot != this.currentTexture) {
            var gl = this.renderer._context;
            gl.uniform1i(this.uniforms.texture, slot);

            this.currentTexture = slot;
        }
    },
};
