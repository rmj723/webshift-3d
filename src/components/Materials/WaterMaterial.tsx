import { Object3DNode } from "@react-three/fiber";
import { ShaderMaterial, Texture, Vector2 } from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waterMaterial: Object3DNode<WaterMaterial, typeof WaterMaterial>;
    }
  }
}

export class WaterMaterial extends ShaderMaterial {
  constructor(map: Texture) {
    super();
    this.uniforms = {
      tex: { value: map },
      time: { value: 0 },
      resolution: { value: new Vector2() },
    };

    this.vertexShader = `
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    void main() {
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `;

    this.fragmentShader = `
    uniform sampler2D tex;
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;
    
    void main() {
      float dist = length(vUv);
      float angle = atan(vUv.y, vUv.x) + time * 0.1;
      float ripple = cos(dist * 10.0 + time * 2.0) * 0.01;
      vec2 offset = vec2(cos(angle), sin(angle)) * ripple;
      vec4 color = texture2D(tex, vUv + offset );
      
      gl_FragColor = color;
    }`;
  }
}
