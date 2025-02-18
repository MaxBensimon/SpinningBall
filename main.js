import * as THREE from 'three';
import "./style.css"
import gsap from "gsap"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

// Scene
const scene = new THREE.Scene()

// Texture
const textureLoader = new THREE.TextureLoader()

// Geometry
const torusGeometry = new THREE.TorusGeometry(8, 2, 3, 30, Math.PI * 2)
const sphereGeometry = new THREE.SphereGeometry(4, 16, 16)
const smallSphereGeometry1 = new THREE.SphereGeometry(2, 8, 8)

const skyGeo = new THREE.SphereGeometry(200, 32, 32)

// Material
const material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
})
const torusMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  transparent: true,
  opacity: .75
})

const skyMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load('Textures/skybox3.png'),
  side: THREE.BackSide,
  transparent: true,
  opacity: .75
})

// Mesh
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial)
const sphereMesh = new THREE.Mesh(sphereGeometry, material)
const smallSphereMesh1 = new THREE.Mesh(smallSphereGeometry1, material)
const smallSphereMesh2 = new THREE.Mesh(smallSphereGeometry1, material)
const smallSphereMesh3 = new THREE.Mesh(smallSphereGeometry1, material)

const skybox = new THREE.Mesh(skyGeo, skyMat)

smallSphereMesh1.position.set(-10, 10, -10)
smallSphereMesh2.position.set(20, 0, -5)
smallSphereMesh3.position.set(-15, -10, 10)
torusMesh.rotation.set(90, 0, 0)

scene.add(torusMesh, sphereMesh, smallSphereMesh1, smallSphereMesh2, smallSphereMesh3, skybox)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Light
const light = new THREE.PointLight(0xffffff, 175, 100)
const ambientLight = new THREE.AmbientLight(0x404040, 5)
light.position.set(0, 10, 10)
scene.add(light, ambientLight)

// Camera
var fov = 45
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 300)
camera.position.z = 40
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = .5

// Resizing
window.addEventListener('resize', () =>{
    // Updating the sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Updating the camera as well
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

// Defines a loop that works kind of like unity's Update method
const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
// Calling the loop
loop();

// Timeline - gsap is used to animate and the timeline can synchronise animations across multiple cases of them
const tl = gsap.timeline({defaults: {duration: .5}})
tl.fromTo(sphereMesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo(torusMesh.scale, {z:0, x:0, y:0}, {z:.25, x:1, y:1}) // Note the scaling here!
// Use an array to animate simultaneously 
tl.fromTo(
  [smallSphereMesh1.scale, smallSphereMesh2.scale, smallSphereMesh3.scale], 
  { z: 0, x: 0, y: 0 }, 
  { z: 1, x: 1, y: 1 })
tl.fromTo("nav", {y: "-100%"}, {y: "0%"})
tl.fromTo(".title", {opacity: 0}, {opacity: 1})

// Mouse coloring animation
let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) =>{
  if (mouseDown){
      rgb = [
        Math.round((e.pageX / sizes.width) * 255),
        Math.round((e.pageY / sizes.height) * 255),
        150 // Default blue
      ]

      let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
      gsap.to(sphereMesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
      gsap.to(torusMesh.material.color, {r: newColor.r *.5, g: newColor.g * .5, b: newColor.b})
  }
})