import * as THREE from "three"

const _instance = new THREE.LoadingManager()
_instance.onProgress = function (url, loaded, total){
    console.log(url, loaded, total)
}

export default _instance