import * as THREE from 'three'
// ! OBJ
import * as OBJLoader from 'three/examples/jsm/loaders/OBJLoader.js'
import * as MTLLoader from 'three/examples/jsm/loaders/MTLLoader.js'
// ! GLB
import * as GLTFLoader from 'three/examples/jsm/loaders/GLTFLoader'

function init() {

  let scene, camera, renderer
  // ! OBJ
  // let loader, materialLoader
  // ! GLB
  let newLoader
  const prevcoords = {
    init: false,
    coords: []
  }

  function initialiser() {

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    // camera = new THREE.OrthographicCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)

    // ! OBJ
    // loader = new OBJLoader.OBJLoader()
    // materialLoader = new MTLLoader.MTLLoader()

    // ! GLB
    newLoader = new GLTFLoader.GLTFLoader()

    
    // console.log(OBJLoader)

    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setClearColor('gray')
    renderer.shadowMap.enabled = true


    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)


    // GLB LOADER
    newLoader.load(
      'assets/1/room.glb',
      function ( object ) {
        console.log(object)
        object.scene.castShadow = true
        object.scene.receiveShadow = true
        object.scene.children.forEach(item => {
          if (item.type === 'Mesh') {
            item.castShadow = true
            item.receiveShadow = true
          }
        })

        scene.add(object.scene)
      }
    )
    

    // ! OBJ MATERIAL LOADER
    // materialLoader.load(
    //   'assets/2/room.mtl',
    //   function ( loadedMaterial ) {
    //     console.log(loadedMaterial)
    //   }
    // )

    // ! OBJ Loader
    // loader.load(
    //   'assets/2/room.obj',

    //   function ( object ) {
    //     console.log(object)


    //     object.children.forEach(item => {
    //       item.material = new THREE.MeshLambertMaterial( { color: 0xffffff } )
    //       item.castShadow = true
    //       item.receiveShadow = true
    //     })

    //     scene.add( object )
    
    //   })

    //  ! Lights
    const light = new THREE.PointLight( 0x404040, 1.4, 1000 ) // soft white light
    light.position.set(0, 20, 10)
    scene.add( light )

    // const d = 100

    // light.shadow.camera.left = - d
    // light.shadow.camera.right = d
    // light.shadow.camera.top = d
    // light.shadow.camera.bottom = - d

    const skyLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6 )
    scene.add(skyLight)
    // skyLight.position.set()

    camera.position.x = 0.2
    camera.position.z = 2.5
    camera.position.y = 0.7
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function animate() {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    renderer.render(scene, camera)

  }

  function mouseMoveEvent(event) {

    if (!prevcoords.init) {
      prevcoords.coords = [event.clientX, event.clientY]
      prevcoords.init = true
    } else {
      const newCoords = [event.clientX, event.clientY]
      const diff = [newCoords[0] - prevcoords.coords[0], newCoords[1] - prevcoords.coords[1]]
      camera.rotation.x += -(diff[1] / 5000)
      camera.rotation.y += -(diff[0] / 5000)
      prevcoords.coords = [event.clientX, event.clientY]
    }

  }

  
  initialiser()
  animate()
  
  window.addEventListener('mousemove', mouseMoveEvent)
  // window.addEventListener('mousedown', clickEvent)
  // window.addEventListener('mouseup', clickEvent)
  window.addEventListener('resize', onWindowResize, false)

}

window.addEventListener('DOMContentLoaded', init)