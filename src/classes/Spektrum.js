import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import LoadingController from "./LoadingController"
import spektrumFrag from '../shaders/spektrum.frag'
import spektrumVert from '../shaders/spektrum.vert'
import MyGUI from '../utils/MyGUI'

class Spektrum {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.texLoader = new THREE.TextureLoader(LoadingController)
    }

    init(scene) {
        this.scene = scene

        this.uniforms = {
            uMatCap:{
                value:this.texLoader.load('assets/textures/bTex.png')
            },
            uSpecterSize:{
                value:0.8
            },
            uWaveBorder:{
                value:0.3
            },
            uWaveSpeed:{
                value:0.1
            },
            uBorderColor:{
                value: new THREE.Color("hsl(287,80%,80%)")
            },
            uTime:{
                value:0
            }
        }

        const shaderFolder = MyGUI.addFolder("Spectrum Folder")
        shaderFolder.open()
        shaderFolder.add(this.uniforms.uSpecterSize, "value",-1,1).name("Specter Size")
        shaderFolder.add(this.uniforms.uWaveBorder, "value",0,1).name("Wave Border")
        shaderFolder.add(this.uniforms.uWaveSpeed, "value",0,1).name("Wave Speed")
        this.shaderMat = new THREE.ShaderMaterial({
            fragmentShader:spektrumFrag,
            vertexShader:spektrumVert,
            uniforms:this.uniforms,
            transparent:true
        })
        this.modelLoader.load('./assets/models/spektrum.glb', (glb )=>{  glb.scene.traverse(child=>{
            if(child instanceof THREE.Mesh)
            child.material = this.shaderMat
            child.scale.multiplyScalar(1.7)
            child.position.y = -1

        })

            this.scene.add(glb.scene)
        })

    }

    update() {
        this.uniforms.uTime.value+=1
    }

    bind() {

    }
}

const _instance = new Spektrum()
export default _instance