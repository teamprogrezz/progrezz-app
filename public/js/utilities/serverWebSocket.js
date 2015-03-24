var ServerWebSocket = {};
(function(namespace) {
  // TODO Cambiar el user_id para no hacerlo a mano, en todas las peticiones (autentificación)
  var SERVER_WS_URL = "ws://progrezz-server.herokuapp.com/dev/api/websocket";
  ProgrezzWS.DEFAULT.URL = SERVER_WS_URL;
  
  var DEFAULT_ERROR_FUNCTION = function(error) { 
    alert("Error al comunicarse con el servidor");
  }

  /* WebSocket */
  namespace.openWebSocket = function (onOpen, onError) {
    
    'use strict';
    
    var ws = new ProgrezzWS();
    
    ws.onOpen = onOpen;
    ws.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    ws.open(SERVER_WS_URL);
    
    return ws;
  }
  
  namespace.updateUserLocation = function(ws, latitude, longitude, onResponse) {
    
    'use strict';
    
    ws.onResponse = onResponse;
    
    var request_json = ProgrezzWS.getTemplateRequest();
    
    request_json.request.type = "user_update_geolocation";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    request_json.request.data.latitude = latitude;
    request_json.request.data.longitude = longitude;     
    
    ws.send(request_json);
  }
  
})(ServerWebSocket);