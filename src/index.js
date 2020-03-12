import _ from 'lodash';
import './styles.css';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const filePaths = {
  crab: '/Elbow_Crab.obj',
  helmet: '/helmet.obj',
  napolean: '/napolean.obj',
  alexander: '/alexander.obj',
  alex: '/alexander.glb'
};

const modelRefs = {
  crab: null,
  helmet: null,
  napolean: null,
  alexander: null,
  alex: null
};

const urls = [
  '/textures/nx.jpeg', 
  '/textures/ny.jpeg', 
  '/textures/nz.jpeg', 
  '/textures/px.jpeg', 
  '/textures/py.jpeg', 
  '/textures/pz.jpeg'
];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
const renderer = new THREE.WebGLRenderer({ alpha: true });
const pivot = new THREE.Group();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild( renderer.domElement );

const reflectionCube = new THREE.CubeTextureLoader().load(urls);
reflectionCube.encoding = THREE.sRGBEncoding;
reflectionCube.flipY = false;

const material = new THREE.MeshLambertMaterial({
  color: 'white',
  emissive: 0x606060,
  reflectivity: 0.3,
  refractionRatio: 0.5,
  envMap: reflectionCube,
});

const light = new THREE.DirectionalLight('white', 1);
// const light = new THREE.AmbientLight(0x404040);
light.position.set(-1, 2, 4);
camera.add(light);

scene.add(camera);

// const loader = new OBJLoader();
// loader.load(filePaths.alexander, function (object) {
//     object.traverse(function(child) {
//       if (child instanceof THREE.Mesh) {
//           child.material = material;
//           console.log(child.material);
//       }
//     });

//     modelRefs.alexander = object;

//     const box = new THREE.Box3().setFromObject( modelRefs.alexander );
//     box.center( modelRefs.alexander.position );
//     modelRefs.alexander.position.multiplyScalar( - 1 );

//     scene.add(modelRefs.alexander);
//     scene.add(pivot);
//     pivot.add(modelRefs.alexander);
//   }, 
//   (xhr) => { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );}, 
//   (error) => {console.log( 'An error happened: ' + error );}
//   );

function assignMultipleProps(values, source) {
  Object.keys(values).forEach(key => {
    source[key] = values[key];
  });
}

const loader = new GLTFLoader();
loader.load(filePaths.alex, function (gltf) {
  modelRefs.alex = gltf.scene;

  modelRefs.alex.traverse(function(child) {
      if (child instanceof THREE.Mesh) {

          var material = new THREE.MeshStandardMaterial({
            emissive: new THREE.Color( 0x666666 ),
            metalness: 0.5,
            roughness: 0.1,
            envMapIntensity: 1.0,
            envMap: reflectionCube,
            transparent: true,
            opacity: 1
          });
        
          scene.add(modelRefs.alex)

          child.material = material;
          child.material.flatShading = true;
          child.material.needsUpdate = true;
      }
    });

    const box = new THREE.Box3().setFromObject( modelRefs.alex );
    box.getCenter( modelRefs.alex.position );
    modelRefs.alex.position.multiplyScalar( - 1 );

    scene.add(modelRefs.alex);
    scene.add(pivot);
    pivot.add(modelRefs.alex);
  }, 
  (xhr) => { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );}, 
  (error) => {console.log( 'An error happened: ' + error );}
  );

camera.position.z = 130;

function animate() {
    requestAnimationFrame( animate ); 
    
    pivot.rotation.x += 0.005;
    pivot.rotation.y += 0.009;

	renderer.render( scene, camera );
}

animate();