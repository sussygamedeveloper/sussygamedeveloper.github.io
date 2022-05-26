uniform sampler2D texture;
        
varying mediump vec2 vTexCoord;
varying mediump vec4 vColor;
varying mediump vec2 vInkEffect;

void main() {
    //blend texture color with rgb
    mediump vec4 fColor = texture2D(texture, vTexCoord) * vColor;

    //apply ink effect
    if(vInkEffect.x == 2.0) {
        //INVERT
        fColor.rgb = vec3(1,1,1)-fColor.rgb;
    }
    else if(vInkEffect.x == 10.0) {
        //MONO
        mediump float mono = 0.3125*fColor.r + 0.5625*fColor.g + 0.125*fColor.b;
        fColor.rgb = vec3(mono,mono,mono);
    }

    //apply teh color
    gl_FragColor = fColor;
}