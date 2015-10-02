
var WAIT_DELAY = 100; // ms

var websocket;
var websocket_opened = false;

$(document).ready(function(){
  
  // Apertura de websocket y realización de petición
  websocket = ServerWebSocket.openWebSocket(
    function(event) { // onOpen
      websocket_opened = true;
    }
  );
  
  setTimeout(waitingWebSocket, WAIT_DELAY);
  function waitingWebSocket() {
    
    if (websocket_opened) {
      // Iniciando el visor
      initViewer();
    }
    else {
      setTimeout(waitingWebSocket, WAIT_DELAY);
    }
  }
  
});

/* Incialización del visor */
function initViewer() {
  
  navigator.geolocation.getCurrentPosition(function(position) {
    
    // Función que actualiza las coordenadas del usuario en el servidor
    ServerWebSocket.updateUserLocation(
      websocket,
      position.coords.latitude,
      position.coords.longitude,
      function(event) { // onResponse
        
        // Crear el visor
        createViewer();
      }
    );

    // Petición y localización de los fragmentos cercanos en un radio alrededor del usuario
    function createViewer() {
      ServerRequest.userNearbyMessageFragments(
        
        function(response_json) {
          alert("Respuesta de petición de mensajes");
          var ARViewer = new ARProgrezz.Viewer(); // Construyendo el visor   
  alert("Solicitud de creación del visor enviada");
          ARViewer.onInit = function() { // onInit del visor - Adición de los objetos
      alert("Visor inicializado");
            $.each(response_json.response.data.fragments.system_fragments, function(key, content) {
              
              var options = {
                coords: { latitude: content.geolocation.latitude, longitude: content.geolocation.longitude },
                type: 'basic',
                onSelect: function() {
                  ServerRequest.collectFragment(key, function() {
                    alert(">> Fragmento del Sistema Capturado <<");
                  });
                },
                collectable: true
              }
              alert("Añadiendo objeto del sistema");
              ARViewer.addObject(options);
              alert("Objeto añadido");
            });
            
            $.each(response_json.response.data.fragments.user_fragments, function(key, content) {
              
              var options = {
                coords: { latitude: content.geolocation.latitude, longitude: content.geolocation.longitude },
                type: 'basic',
                onSelect: function() {
                  ServerRequest.collectFragment(key, function() {
                    alert(">> Fragmento de '" + content.message.author.author_alias + "' capturado <<");
                  });
                },
                collectable: true
              }
              alert("Añadiendo objeto de alguien");
              ARViewer.addObject(options);
              alert("Objeto añadido");
            });
            alert("Objetos añadidos");
          };
          
          ServerRequest.userAllowedActions(function(json_response) {
            alert("Respuesta de acciones del usuario");
            ARViewer.initViewer({range: json_response.response.data.allowed_actions.collect_fragment.radius * 1000}); // Iniciando el visor
            alert("Solicitud de inicialización del visor enviada");
          });
        }
      );
    }
  });

}
