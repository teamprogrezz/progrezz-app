ARProgrezz = {};

/* Indicadores de estado */
ARProgrezz.Flags = {
  SUCCESS: 1,
  ERROR: -1,
  WAIT: 0
};

/* Utilidades */
ARProgrezz.Utils = {};
(function(namespace){
  
  var WAIT_DELAY = 100 // (ms)
  
  /* Función de espera de un Callback */
  namespace.waitCallback = function(obj, end_function) {
   
    if (obj.flag == ARProgrezz.Flags.WAIT)
      setTimeout(namespace.waitCallback, WAIT_DELAY, obj, end_function)
    else
      end_function();
  }
  
  /* Función para mostrar texto en pantalla (Mobile Debug) */
  namespace.debugText = function (text) {
	
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
  
})(ARProgrezz.Utils);

/* Visor de realidad aumentada */
ARProgrezz.Viewer = function (settings) {
  
  var scope = this; // Ámbito
  
  /* Ajustes del visor */
  this.settings = {
    mode: 'normal' // 'normal' || 'stereoscopic'
  }
  
  this.inited = false;
  this.onInit = null;
  this.viewerWidth = 0;
  this.viewerHeight = 0;
  
  // TODO Cambiar el rango de visión, para que el máximo corresponda con el área del mensaje del jugador
  var HUMAN_FIELD_OF_VIEW = 70; // (º)
  var MIN_VISION = 0.1, MAX_VISION = 1000;
  var OBJECT_RADIUS = 1;
  
  var real_height = 0;
  
  var ar_video; // Video
  var ar_scene, ar_camera, ar_renderer, ar_player, ar_controls; // Augmented Reality
  
  var objects = []; // Lista de objetos
  
  /* Actualización de ajustes */
  function updateSettings(sets) {
    
    for (s in sets)
      this.settings[s] = sets[s];
  }
  
  /* Inicialización del vídeo del visor */
  function initVideo(onSuccess) {
    
    // Indicador del estado de acceso
    var video = { flag: ARProgrezz.Flags.WAIT };
    
    // Función de acceso al vídeo
    function accessVideo(constraints) {
      
      // Obtención de datos de vídeo
      navigator.getUserMedia (
        
        // Restricciones
        constraints,
        
        // Success Callback
        function(localMediaStream) {
          
          // Creación e inicialización del vídeo
          ar_video = document.createElement('video');
          ar_video.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: -1");
          ar_video.width = window.innerWidth;
          ar_video.height = window.innerHeight;
          ar_video.autoplay = true;
          
          // Callback de carga del vídeo
          ar_video.onloadedmetadata = function() {
            
            // Calculando tamaño del visor de acuerdo al vídeo
            var viewer_ratio = Math.min(ar_video.width / ar_video.videoWidth, ar_video.height / ar_video.videoHeight);
            real_height = ar_video.height();
            scope.viewerWidth = viewer_ratio * ar_video.videoWidth;
            scope.viewerHeight = viewer_ratio * ar_video.videoHeight;
            
            video.flag = ARProgrezz.Flags.SUCCESS;
          }
          
          document.body.appendChild(ar_video);
          
          ar_video.src = window.URL.createObjectURL(localMediaStream);
        },
        
        // Error Callback
        function(err) {
          console.log("Error: " + err);
          video.flag = ARProgrezz.Flags.ERROR;
        }
      );
    }
    
    // Comprobación de soporte de acceso a la cámara de vídeo - getUserMedia
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    
    if (navigator.getUserMedia) {
      
      // TODO Reestructurar en utilidades, llamando a una función, se empleará una función u otra
      // Acceso al vídeo según navegador
      if (navigator.userAgent.toLowerCase().indexOf("chrome") != -1) { // En Chrome se utiliza por defecto la cámara frontal, por lo que se selecciona la trasera de forma manual
        
        MediaStreamTrack.getSources(function(sourceInfos) {
          
          // Seleccionando la cámara trasera del dispositivo
          // TODO Probar en un móvil con doble cámara, y comprobar su correcto funcionamiento
          var videoSource = null;
          for (s in sourceInfos) {
            if (sourceInfos[s].kind === 'video') {
              alert(JSON.stringify(sourceInfos[s]));
              videoSource = sourceInfos[s].id;
            }
          }
          
          accessVideo({video: {optional: [{sourceId: videoSource}]}, audio: false});
        });
      }
      else if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) { // En Firefox el usuario decide que cámara compartir
        accessVideo({video: true, audio: false});
      }
      else { // TODO Contemplar el caso de otros navegadores
        alert (navigator.userAgent); // Quitar alerta
      }
      
      ARProgrezz.Utils.waitCallback(video, onSuccess);
      
      return ARProgrezz.Flags.SUCCESS;
    }
    else {
      alert("Error: No se soporta getUserMedia");
      
      ar_video = document.createElement("img");
      ar_video.width = scope.viewerWidth = window.innerWidth;
      ar_video.height = scope.viewerHeight = real_height = window.innerHeight;
      ar_video.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: -1");
      ar_video.src = 'img/background_video.jpg';
      
      document.body.appendChild(ar_video);
      
      onSuccess();
      
      return ARProgrezz.Flags.ERROR;
    }
  }
  
  /* Inicialización del jugador en la escena de realidad aumentada */
  function initPlayer() {

    if (scope.settings.mode === 'normal') {
      
      // Creación de la cámara que representa la visión del jugador
      ar_camera = new THREE.PerspectiveCamera(HUMAN_FIELD_OF_VIEW, window.innerWidth / window.innerHeight, MIN_VISION, MAX_VISION);
      
      // Creación del controlador de posición y orientación del jugador
      // TODO Cambiar por ARProgrezz.PositionControls, y añadir la geolocalización
      //ar_controls = new ARProgrezz.PositionControls(ar_camera);
      ar_controls = new THREE.DeviceOrientationControls(ar_camera);
      
      return {vision: ar_camera, controls: ar_controls};
    }
    else if (settings.mode === 'stereoscopic') {
      
      // TODO Cambiar en el futuro, para la visión estereoscópica
    }
    else {
      alert("Error: No se reconoce el modo seleccionado (" + ar.settings.mode + ")")
    }
  }
  
  /* Inicialización de la escena de realidad aumentada */
  function initAR(onSuccess) {
    
    // Creación de la escena
    ar_scene = new THREE.Scene();
    
    // Inicializando al jugador
    ar_player = initPlayer();
    
    // Función para la comprobación de soporte de WebGL
    function webglAvailable() { 
      try {
        var canvas = document.createElement( 'canvas' );
        return !!( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); 
      } 
      catch ( e ) { return false; } 
    } 
    
    // Creación del renderizador
    var options = { alpha: true };
    if ( webglAvailable() ) // WebGL soportado -> Renderizador WebGL
      ar_renderer = new THREE.WebGLRenderer(options); 
    else // WebGL no soportado -> Renderizador Canvas
      ar_renderer = new THREE.CanvasRenderer(options);
    
    ar_renderer.domElement.setAttribute("style", "display: block; margin: auto; padding-top: " + Math.trunc((real_height - scope.viewerHeight) / 2.0) + "px;");
    ar_renderer.setSize(scope.viewerWidth, scope.viewerHeight); // TODO Cambiar por variables globales, y ajustar correctamente el tamaño
    ar_renderer.setClearColor( 0x000000, 0 );
    document.body.appendChild(ar_renderer.domElement);
    
    // Continuando con la inicialización
    onSuccess();
  }
  
  /* Actualización de los objetos */
  function updateObjects() {
    
    for (o in objects)
      objects[o].rotation.y += 0.02;
  }
  
  /* Iniciar actualización de la escena */
  function playAnimation() {
    
    function render() {
      requestAnimationFrame(render);
      
      updateObjects();
      
      ar_controls.update();
      ar_renderer.render(ar_scene,ar_camera);
    }
    render();
  }
  
  /* Inicializar visor de realidad aumentada */
  this.initViewer = function(settings) {
    // TODO Comprobación de acceso al giroscopio, y a la geolocalización (y pedir permisos si fuera necesario)
    
    // Actualizando ajustes
    if (settings)
    updateSettings(settings);
    
    // Inicializar vídeo
    initVideo( function () {
      // Inicializar realidad aumentada
      initAR( function() {
        
        // Iniciar actualizado de la escena
        playAnimation();
        
        // Haciendo efectiva la inicialización
        inited = true;
        
        // Función a ejecutar tras la inicialización
        if (scope.onInit)
          scope.onInit()
      });
    });
  }
  
  /* Añadir objeto geolocalizado a la escena del visor */
  this.addObject = function(latitude, longitude) {
    
    // TODO Utilizar la latitud y la longitud para asignar la posición al objeto
    // TODO Dibujar un objeto de verdad y reestructurar esto para que haga lo que debería hacer
    
    var texture = THREE.ImageUtils.loadTexture( 'img/textures/sold_to_spring.jpg' );
		texture.anisotropy = ar_renderer.getMaxAnisotropy();

		var material = new THREE.MeshBasicMaterial( { map: texture } );
    var geometry = new THREE.OctahedronGeometry(OBJECT_RADIUS, 0);
    
    var object = new THREE.Mesh(geometry, material);
    object.position.z = -5;
    
    objects.push(object);
    
    ar_scene.add(object);
  }
  
};