var ARProgrezz = {};
(function(ar){

  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }
  
  var ar_video;

  var ar_scene, ar_camera, ar_renderer;

  ar.init = function() {
    
    // TODO Crear el video desde aquí
    console.log("Solicitud de vídeo");
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
      navigator.getUserMedia (
        
        //constraints
        {video: true, audio: false},

        // successCallback
        function(localMediaStream) {
          console.log("Cámara Permitida");

          ar_video = document.querySelector('video');
          ar_video.width = window.innerWidth;
          ar_video.height = window.innerHeight;
          ar_video.src = window.URL.createObjectURL(localMediaStream);
          ar_video.autoplay = true;
          
          // TODO Arreglar lo de innerWidht e innerHeight, que no funciona con el maldito canvas
          ar.drawCube();
          console.log("Vídeo cargado");
        },
        
        // errorCallback
        function(err) {
          console.log("Error: " + err);
        }

      );
    }
    else {
      alert("No se soporta getUserMedia"); 
      // TODO Alternativa para cuando no se soporte getUserMedia, y tener cuidado que el cubo se dibuja a partir del tamaño del video
    }

    
    if (window.DeviceOrientationEvent) {
      
      window.addEventListener('deviceorientation', function(event) {
        
        ar_camera.rotation.x = -(event.gamma.toRad());
        ar_camera.rotation.y = event.beta.toRad();
        ar_camera.rotation.z = event.alpha.toRad();
        debugText(event.alpha.toFixed(2) + " " + event.beta.toFixed(2) + " " + event.gamma.toFixed(2));
      }, false);
    }
    else {
      alert("No se soporta el acceso al giroscopio"); 
    }
  }
  
  ar.drawCube = function() {
    
    ar_scene = new THREE.Scene();
    ar_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    function webglAvailable() { 
      try { 
        var canvas = document.createElement( 'canvas' );
        /*canvas.setAttribute("style", "position: absolute;");
        canvas.setAttribute("width", window.innerWidth);
        canvas.setAttribute("height", window.innerHeight);*/
        return !!( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); 
      } 
      catch ( e ) { return false; } 
    } 
    
    if ( webglAvailable() ) { 
      ar_renderer = new THREE.WebGLRenderer( { alpha: true } ); 
    } 
    else { 
      ar_renderer = new THREE.CanvasRenderer( { alpha: true } ); 
    }
    
    ar_renderer.setSize(ar_video.width, ar_video.height);
    debugText(ar_video.width + " " + ar_video.height);
    ar_renderer.setClearColor( 0x000000, 0 );

    document.body.appendChild(ar_renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh(geometry, material);
    ar_scene.add(cube);

    ar_camera.position.z = 5;

    function render() {
      requestAnimationFrame(render); 
      ar_renderer.render(ar_scene,ar_camera);
    }

    render();
  }
  
  function debugText(text) {
    
    var p = document.querySelector("p");
    if(!p) {
      p = document.createElement("p");
      document.body.appendChild(p);
    }
    else {
      p.removeChild(p.childNodes[0]);
    }
    var n_text = document.createTextNode(text);
    p.appendChild(n_text);
  }
  
})(ARProgrezz);