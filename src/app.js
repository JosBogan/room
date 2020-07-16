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
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap


    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)


    // GLB LOADER
    newLoader.load(
      'assets/1/room2.glb',
      function ( object ) {
        object.scene.castShadow = true
        object.scene.receiveShadow = true
        traverseCastShadow( object.scene )
        // object.scene.children.forEach(item => {
        //   if (item.type === 'Mesh') {
        //     item.castShadow = true
        //     item.receiveShadow = true
        //   }
        // })
        console.log(object)

        scene.add(object.scene)
      }
    )

    function traverseCastShadow( object ) {
      // if (object.name === 'Area') {
      //   object.castShadow = true
      // }
      if (object.type === 'Mesh') {
        object.castShadow = true
        object.receiveShadow = true
      }
      if (object.type === 'Group') {
        object.children.forEach(item => {
          // object.castShadow = true
          // object.receiveShadow = true
          traverseCastShadow( item )
        })
      }
    }
    

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
    const light = new THREE.SpotLight( 0x404040, 3, 0 ) // soft white light
    light.position.set(6, 2, 5)
    light.castShadow = true
    light.shadow.mapSize.height = 2048 
    light.shadow.mapSize.width = 2048
    // light.shadow.camera.near = 0.01
    // light.shadow.camera.far = 200
    // console.log(light.shadow.getFrustum())
    light.shadow.bias = -0.0004
    scene.add( light )

    var spotLightHelper = new THREE.SpotLightHelper( light )
    scene.add( spotLightHelper )


    const skyLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1 )
    // scene.add(skyLight)
    // skyLight.position.set()


    // ! Real Camera Position
    camera.position.x = 0.2
    camera.position.z = 2
    camera.position.y = 0.7

    // ! Test CAmera Position

    // camera.position.x = -3
    // camera.position.z = 3
    // camera.position.y = 1
    // camera.rotation.y = -1
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