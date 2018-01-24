// takes a sense and adds a sky
// https://threejs.org/examples/webgl_shaders_sky.html

var THREE = require('three')
THREE.Sky = require('./three-sky')

function addSky (scene) {
  var camera, controls, scene, renderer;
  var sky, sunSphere;
  
  initSky();
  
  function initSky() {
    sky = new THREE.Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

    sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry( 20000, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    scene.add( sunSphere );

    // options
    var effectController  = {
      turbidity: 10,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      luminance: 1,
      inclination: 0.49, // elevation / inclination
      azimuth: 0.25, // Facing front,
      sun: ! true
    };
    var distance = 400000;
    function guiChanged() {
      var uniforms = sky.material.uniforms;
      uniforms.turbidity.value = effectController.turbidity;
      uniforms.rayleigh.value = effectController.rayleigh;
      uniforms.luminance.value = effectController.luminance;
      uniforms.mieCoefficient.value = effectController.mieCoefficient;
      uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
      var theta = Math.PI * ( effectController.inclination - 0.5 );
      var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
      sunSphere.position.x = distance * Math.cos( phi );
      sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
      sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
      sunSphere.visible = effectController.sun;
      uniforms.sunPosition.value.copy( sunSphere.position );
    }
    guiChanged();
  }
}

module.exports = addSky
