attribute vec4 position;
attribute vec2 texCoord;
attribute vec4 color;

varying mediump vec2 texCoordinate;
varying highp vec2 pPos;

uniform sampler2D texture;
uniform mat3 projectionMatrix;
uniform mediump int inkEffect;
uniform mediump float inkParam;

uniform highp vec2 centerpos;
uniform highp vec2 radius;

void main() {
    texCoordinate = texCoord;
    pPos = position.xy;
    gl_Position = vec4(position.xy, 0, 1) * projectionMatrix;
}