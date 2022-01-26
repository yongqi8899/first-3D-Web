import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import SoundReactor from './SoundReactor'

import LoadingController from "./LoadingController"
import MyGUI from '../utils/MyGUI'
class Pillards {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.texLoader = new THREE.TextureLoader(LoadingController)
        this.params = {
            waveSpeed:1,
            subDiv:2,
            pillardSize: .2
        }
    }

    init(scene) {
        this.scene = scene
        this.upVec = new THREE.Vector3(0,1,0)
        const bTex = this.texLoader.load('./assets/textures/bTex.png')
        const gTex = this.texLoader.load('./assets/textures/gTex.png')
        this.gMatCap =  new THREE.MeshMatcapMaterial({matcap:gTex}) 
        this.bMatCap =  new THREE.MeshMatcapMaterial({matcap:bTex}) 
        this.pillard
        this.pillards= new THREE.Group()
        this.modelLoader.load('./assets/models/Pillards.glb', (glb )=>{ 
            glb.scene.traverse(child=>{
                if(child.name == "base"){
                  this.pillard = child
                  child.material =  this.bMatCap
                }
                if(child.name == "Cylinder"){
                    child.material =  this.gMatCap 
                  }
            })
            this.computerPositions()
           
        })
        const sphereFolder = MyGUI.addFolder('Sphere Pillards')
        sphereFolder.open()
        sphereFolder.add(this.params, "waveSpeed", 0.001, 3).name('wave Speed')
        sphereFolder.add(this.params, "subDiv", 1, 5).step(1).name('Ico Subdivisions').onChange(this.computerPositions)
        sphereFolder.add(this.params, "pillardSize", 0.01,1).name('Pill Size').onChange(this.computerPositions)
    }

    computerPositions(){
        let ico
        this.scene.traverse(child =>{
            if(child.name == 'ico'){
                ico = child
            }
        })
        if(ico)
        this.scene.remove(ico)

        const sphereGeom = new THREE.IcosahedronGeometry(2,this.params.subDiv)
        const sphereMat = this.gMatCap
        const sphere = new THREE.Mesh(sphereGeom,sphereMat)
        sphere.name = 'ico'
        // const sphere = new THREE.Mesh(sphereGeom,new THREE.MeshNormalMaterial({wireframe:true}))
        this.scene.add(sphere)
        this.pillards.clear()
        let verArray=[]
        for(let i=0; i<sphereGeom.attributes.position.array.length; i+=3){
            const x = sphereGeom.attributes.position.array[i]
            const y = sphereGeom.attributes.position.array[i+1]
            const z = sphereGeom.attributes.position.array[i+2]
            verArray.push({
                x:x,
                y:y,
                z:z,
            })
        }
        let pillPos = []
        for(let i=0; i<verArray.length; i++){
            let existsFlag = false
            for(let j=0; j<pillPos.length; j++){
                if(pillPos[j].x== verArray[i].x && pillPos[j].y == verArray[i].y && pillPos[j].z== verArray[i].z){
                    existsFlag = true
                }
            }
            if(!existsFlag){
                pillPos.push({
                    x: verArray[i].x,
                    y: verArray[i].y,
                    z: verArray[i].z,
                })
                const c = this.pillard.clone()
                 const posVec = new THREE.Vector3(verArray[i].x, verArray[i].y, verArray[i].z)
                 c.position.copy(posVec) 
                 c.scale.multiplyScalar(this.params.pillardSize)
                 c.quaternion.setFromUnitVectors(this.upVec,posVec.normalize())
               
               
                this.pillards.add(c)
            }
        }
        this.scene.add(this.pillards)
    }
    update() {
        if (SoundReactor.playFlag) {
            let i = 0
            while (i < this.pillards.children.length) {
                this.pillards.children[i].children[0].position.y = SoundReactor.fdata[i] / 255 * 4
                i++
            }
        } else {
            let i = 0
            while (i < this.pillards.children.length) {
                this.pillards.children[i].children[0].position.y = (Math.sin(Date.now() * 0.01 * this.params.waveSpeed + this.pillards.children[i].position.x) + 1) * 1.5
                i++
            }
        }
    }

    bind() {
        this.computerPositions = this.computerPositions.bind(this)
    }
}

const _instance = new Pillards()
export default _instance