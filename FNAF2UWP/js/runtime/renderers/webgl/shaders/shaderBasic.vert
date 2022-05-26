attribute vec2 position;
attribute vec2 texCoord;

uniform mediump mat4 projectionMatrix;
varying mediump vec2 texCoordinate;

void main() {
    texCoordinate = texCoord;
    gl_Position = vec4(position.xy, 0, 1) * projectionMatrix;
}