import * as THREE from 'three'

// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
// import { EffectComposer } from './jsm/postprocessing/EffectComposer.js'

// ! OBJ
// import * as OBJLoader from 'three/examples/jsm/loaders/OBJLoader.js'
// import * as MTLLoader from 'three/examples/jsm/loaders/MTLLoader.js'
// ! GLB
import * as GLTFLoader from 'three/examples/jsm/loaders/GLTFLoader'
import * as RGBELoader from 'three/examples/jsm/loaders/RGBELoader'

function init() {

  let scene, camera, renderer
  // ! OBJ
  // let loader, materialLoader
  // ! GLB
  let newLoader
  let hdrLoader
  const prevcoords = {
    init: false,
    coords: []
  }
  const mouse = new THREE.Vector2()
  let outlinePass, selectedObjects, composer
  const raycaster = new THREE.Raycaster()

  function initialiser() {

    // ! Outline

    // const params = {
    //   edgeStrength: 10,
    //   edgeGlow: 0.0,
    //   edgeThickness: 1,
    //   pulsePeriod: 0,
    //   rotate: false,
    //   usePatternTexture: false
    // }

    // composer = new EffectComposer( renderer )

    // var renderPass = new RenderPass( scene, camera )
    // composer.addPass( renderPass )

    // outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera )
    // composer.addPass( outlinePass )


    // ! OUTLINE END


    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    // camera = new THREE.OrthographicCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)


    // ! GLB
    newLoader = new GLTFLoader.GLTFLoader()

    hdrLoader = new RGBELoader.RGBELoader()



    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setClearColor('gray')
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap


    // renderer.toneMapping = THREE.ReinhardToneMapping
    // renderer.toneMapping = THREE.CineonToneMapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping


    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)


    const pmremGenerator = new THREE.PMREMGenerator( renderer )
    pmremGenerator.compileEquirectangularShader()

    hdrLoader.setDataType( THREE.UnsignedByteType) 
    hdrLoader.load(
      'assets/hdri/photo_studio.hdr',
      function (texture, textureData) {
        console.log(texture, textureData)

        const envMap = pmremGenerator.fromEquirectangular( texture ).texture

        scene.background = envMap
        scene.environment = envMap

        texture.dispose()
        pmremGenerator.dispose()
            

      }
    )

    // GLB LOADER
    newLoader.load(
      'assets/1/room.glb',
      function ( object ) {
        object.scene.traverse( function (item) {
          if (item instanceof THREE.Mesh) {
            item.castShadow = true
            item.receiveShadow = true
            // var edges = new THREE.EdgesGeometry( item.geometry )
            // var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) )
            // scene.add( line )
          }
        } )

        console.log(object)

        scene.add(object.scene)
      }
    )
    

    //  ! Lights
    const light = new THREE.SpotLight( 0x404040, 4, 0 ) // soft white light
    light.position.set(3.5, 2, 3.5)
    light.castShadow = true
    light.shadow.mapSize.height = 4096 
    light.shadow.mapSize.width = 4096
    // light.shadow.camera.top = 100
    // light.shadow.camera.bottom = 100
    // light.shadow.camera.near = 2
    // light.shadow.camera.far = 500
    // light.shadow.bias = -0.00001
    scene.add( light )

    var spotLightHelper = new THREE.SpotLightHelper( light )
    scene.add( spotLightHelper )



    // ! Real Camera Position
    camera.position.x = 0.2
    camera.position.z = 2
    camera.position.y = 0.7

    // ! Test CAmera Position

    // camera.position.x = -5
    // camera.position.z = 7
    // camera.position.y = 2
    // camera.rotation.y = -0.5

    // ! Camera Test 2

    // camera.position.x = -1
    // camera.position.z = 0
    // camera.position.y = 2
    // camera.rotation.x = 5
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function animate() {
    requestAnimationFrame(animate)
    // THREE.Raycaster.setFromCamera(mouse)
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    renderer.render(scene, camera)

  }

  function addSelectedObject( object ) {

    selectedObjects = []
    selectedObjects.push( object )

  }

  function mouseMoveEvent(event) {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    // console.log(scene)

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children[2].children, true)
    // console.log()

    // if ( intersects.length > 0 ) {

    // } else {

    // outlinePass.selectedObjects = [];

    // }
    console.log(intersects[0].object)
    var edges = new THREE.EdgesGeometry( intersects[0].object.geometry )
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x00ffff, linewidth: 10 } ) )
    scene.add( line )

    
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