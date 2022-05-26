attribute mediump vec2 position;
attribute mediump vec2 texCoord;
attribute mediump vec4 color;
attribute mediump vec2 inkEffect;

uniform mediump mat4 projectionMatrix;
uniform sampler2D texture;

varying mediump vec2 vTexCoord;
varying mediump vec4 vColor;
varying mediump vec2 vInkEffect;

void main() {
    vColor = color;
    vTexCoord = texCoord;
    vInkEffect = inkEffect;

    gl_Position = vec4(position.xy, 0.0, 1.0) * projectionMatrix;
}