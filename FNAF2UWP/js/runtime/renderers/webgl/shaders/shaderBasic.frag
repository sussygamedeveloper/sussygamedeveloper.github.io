varying mediump vec2 texCoordinate;
uniform sampler2D texture;

void main() {
    //apply the color
    gl_FragColor = texture2D(texture, texCoordinate);
}