varying mediump vec4 vColor;
varying mediump vec4 vExtraData;

uniform mediump mat4 projectionMatrix;

void main() {
    //render rect for now
    mediump vec4 fExtraData = vExtraData;
    gl_FragColor = vColor;
}