
var WAIT_DELAY = 100 // ms

var websocket;
var websocket_opened = false;

var viewer; // Visor de realidad aumentada

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
    else
      setTimeout(waitingWebSocket, WAIT_DELAY);
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
          
          var ARViewer = new ARProgrezz.Viewer(); // Construyendo el visor   
  
          ARViewer.onInit = function() { // onInit del visor - Adición de los objetos
      
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
              
            });
            
            $.each(response_json.response.data.fragments.user_fragments, function(key, content) {
              
              var options = {
                coords: { latitude: content.geolocation.latitude, longitude: content.geolocation.longitude },
                type: 'basic',
                onSelect: function() {
                  ServerRequest.collectFragment(key, function() {
                    alert(">> Fragmento de " + content.message.author.author_alias + " Capturado <<");
                  });
                },
                collectable: true
              }
              ARViewer.addObject(options);
            });
          };
          
          ARViewer.initViewer(); // Iniciando el visor
        }
      );
    }
  });

}