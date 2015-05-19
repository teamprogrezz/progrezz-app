var ServerWebSocket = {};
(function(namespace) {
  
  var SERVER_WS_URL = (window.location.protocol === "https:"? "wss:" : "ws:") + "//" + window.location.host + "/dev/api/websocket";
  console.log(SERVER_WS_URL);
  ProgrezzWS.DEFAULT.URL = SERVER_WS_URL;

  var DEFAULT_ERROR_FUNCTION = function(error) { 
    alert("Error: No se ha podido establecer comunicación con el servidor");
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
    request_json.request.data.user_id = LocalStorage.getUserID();
    request_json.request.data.latitude = latitude;
    request_json.request.data.longitude = longitude;     
    
    ws.send(request_json);
  }
  
})(ServerWebSocket);