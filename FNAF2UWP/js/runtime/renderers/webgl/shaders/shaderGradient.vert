attribute mediump vec2 position;
attribute mediump vec4 color;
attribute mediump vec2 inkEffect;

uniform mediump mat4 projectionMatrix;

varying mediump vec4 vColor;

void main() {
    vColor = color;

    if(inkEffect.x == 2.0) {
        //INVERT
        vColor.rgb = vec3(1,1,1)-vColor.rgb;
    }
    else if(inkEffect.x == 10.0) {
        //MONO
        mediump float mono = 0.3125*vColor.r + 0.5625*vColor.g + 0.125*vColor.b;
        vColor.rgb = vec3(mono,mono,mono);
    }

    gl_Position = vec4(position.xy, 0.0, 1.0) * projectionMatrix;
}