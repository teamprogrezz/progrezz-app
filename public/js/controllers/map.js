
var WAIT_DELAY = 100 // ms
var UPDATE_DELAY = 2000 // ms
var MAX_DISTANCE = 50 // m
var MAX_TIME = 12000 // ms

var timer;
var last_latitude, last_longitude;
var updating = false;
var first_update = true;

var progrezz_map;
var main_layer;

var websocket;
var websocket_opened = false;

$(document).ready(function(){
  
  // Mapa y pie de página
  progrezz_map = MapTools.Utils.initMap();
  
  // Redimensionado del mapa
  MapTools.Utils.resizeMap();
  
  // Comprobación de que se soporta la geolocalización
  if (!("geolocation" in navigator)) {
    alert("Geolocalización no soportada");
    return; 
  }
  
  // Obtención del alias del jugador
  ServerRequest.userProfile(function(response_json) {
    LocalStorage.setUserAlias(response_json.response.data.profile.info.alias);
  });
  
  // Apertura de websocket y realización de petición
  websocket = ServerWebSocket.openWebSocket(
    function(event) { // onOpen
      websocket_opened = true;
    }
  );
  
  setTimeout(waitingWebSocket, WAIT_DELAY);
  function waitingWebSocket() {
    
    if (websocket_opened) {
      // Actualizando mapa e iniciando temporizador
      updateMap();
      setInterval(updateMap, UPDATE_DELAY);
    }
    else
      setTimeout(waitingWebSocket, WAIT_DELAY);
  }

});
  
function updateMap() {
  
  if (updating)
    return;
  updating = true;
  // TODO Arreglar para que no pida la maldita geolocalización todo el rato
  navigator.geolocation.getCurrentPosition(function(position) {
    
    // Comprobación de actualización necesaria
    if (!first_update && (new Date().getTime()) - timer < MAX_TIME && GeolocationUtils.distanceTwoGeoPoints(last_latitude, last_longitude, position.coords.latitude, position.coords.longitude) < MAX_DISTANCE) {
      updating = false;
      return;
    }
    
    // Actualizando información
    last_latitude = position.coords.latitude;
    last_longitude = position.coords.longitude;
    timer = (new Date().getTime());
    
    // Inicializando buffers
    var buffer_user_layer = L.layerGroup();
    var buffer_fragment_layer = L.layerGroup();
    
    // Función que actualiza las coordenadas del usuario en el servidor
    ServerWebSocket.updateUserLocation(
      websocket,
      position.coords.latitude,
      position.coords.longitude,
      function(event) { // onResponse
        
        // Ubicar al usuario y los fragmentos
        locateObjects();
      }
    );

    // Petición y localización de los fragmentos cercanos en un radio alrededor del usuario
    function locateObjects() {
      ServerRequest.userAllowedActions(
        function(response_json) {
          
          MapTools.Vision.updateUserRange(response_json.response.data.allowed_actions.search_nearby_fragments.radius);
          MapTools.Vision.updateNoise(response_json.response.data.allowed_actions.search_nearby_fragments.noise);
          
          ServerRequest.userNearbyMessageFragments(
            function(response_json) {
              
              // Ubicar los fragmentos cercanos
              locateFragments(response_json.response.data.fragments);
              
              // Ubicar al usuario
              locateUser();
              
              // Finalizando
              endUpdate();
            }
          );
        }
      );
    }
    
    // Enum para los índices de la información de los fragmentos
    var INDEX = {
      FRAGMENT: 0,
      COORDS: 1,
      FOUND: 2,
      LAT: 0,
      LON: 1
    }
    
    // Ubicar al usuario
    function locateUser() {
      
      // Dibujar rango de visión del usuario
      MapTools.Vision.drawRange(
        buffer_user_layer, 
        position.coords.latitude, 
        position.coords.longitude, 
        MapTools.Vision.USER_RADIUS, 
        {
          color: MapTools.Colors.USER_RANGE_COLOR,
          fillColor: MapTools.Colors.USER_RANGE_FILL_COLOR,
          opacity: MapTools.Opacity.USER_RANGE_OPACITY,
          fillOpacity: MapTools.Opacity.USER_RANGE_FILL_OPACITY
        }
      );
      
      // Centrar Vista
      if (first_update)
        progrezz_map.setView([position.coords.latitude, position.coords.longitude], MapTools.Vision.VIEW_DEFAULT_ZOOM);
      
      // Ubicar usuario
      MapTools.Vision.locateUser(buffer_user_layer, position.coords.latitude, position.coords.longitude, LocalStorage.getUserAlias(), 'Posición actual');
    }

    // Estructurar la información (coordenadas, mensaje y duplicado al que pertenecen) de los fragmentos
    function structureFragmentsInfo(fragments) {
      
      var info = {};
      
      $.each(fragments, function(key, content) {
        
        // Comprobación de que el fragmento se encuentra dentro del círculo
        if (GeolocationUtils.distanceTwoGeoPoints(content.geolocation.latitude, content.geolocation.longitude, position.coords.latitude, position.coords.longitude) > MapTools.Vision.USER_RADIUS)
          return;
        
        // UUID del mensaje, con el duplicado al que pertenece
        var message_id = content.message.message.uuid + "." + content.group_index;
        
        // Si no existe ningún fragmento con el mismo mensaje y duplicado, se crea
        if (info[message_id] == null)
          info[message_id] = [[],[],[]];
        
        // Se añade la información del fragmento a la lista del mismo mensaje
        var found = LocalStorage.fragmentAlreadyFound(content.message.message.uuid, content.fragment_index);
        if (found) // Se establecen las coordenadas, añadiendo ruido en función de si ha sido encontrado o no
          info[message_id][INDEX.COORDS].push([content.geolocation.latitude, content.geolocation.longitude]);
        else
          info[message_id][INDEX.COORDS].push(MapTools.Vision.getRandomNoiseCoords(content.geolocation.latitude, content.geolocation.longitude, key));
        
        info[message_id][INDEX.FOUND].push(found);
        info[message_id][INDEX.FRAGMENT].push(content.fragment_index);
      });
      
      return info;
    }

    // Dibujar fragmentos y polígonos en el mapa
    function drawFragments(messages, type_color) {
      
      // Añadir fragmentos al mapa, conectando sus nodos con polígonos
      $.each(messages, function(key, fragments_info) {
        
        // Dibujado de los triángulos que unen los fragmentos de un color aleatorio
        MapTools.Vision.drawBindingTriangles(buffer_fragment_layer, fragments_info[INDEX.COORDS], key);
        
        // Dibujado de todos los fragmentos
        var msg_uuid = IDUtils.removeGroup(key);
        var msg_short_uuid = IDUtils.shortenIDGroup(key);
        var title = "#" + msg_short_uuid;
        for(var f = 0; f < fragments_info[INDEX.FRAGMENT].length; ++f)
          if (fragments_info[INDEX.FOUND][f])
            MapTools.Vision.drawFragmentPoint(
              buffer_fragment_layer, 
              fragments_info[INDEX.COORDS][f][INDEX.LAT], 
              fragments_info[INDEX.COORDS][f][INDEX.LON],
              type_color,
              title,
              "Fragmento " + fragments_info[INDEX.FRAGMENT][f]
            );
          else
            MapTools.Vision.drawFragmentArea(
              buffer_fragment_layer, 
              fragments_info[INDEX.COORDS][f][INDEX.LAT], 
              fragments_info[INDEX.COORDS][f][INDEX.LON],
              type_color,
              title,
              "Fragmento " + fragments_info[INDEX.FRAGMENT][f]
            );
      });
    }

    // Ubicar fragmentos en el mapa
    function locateFragments(fragments) {

      // Obtener coordenadas de los fragmentos, asociados al mensaje que pertenecen
      var system_messages = structureFragmentsInfo(fragments.system_fragments);
      var user_messages = structureFragmentsInfo(fragments.user_fragments);

      // Dibujado de áreas de fragmentos, y polígonos
      drawFragments(system_messages, MapTools.Colors.SYSTEM_FRAGMENT_COLOR);
      drawFragments(user_messages, MapTools.Colors.USER_FRAGMENT_COLOR);
    }
    
    function endUpdate() {
      
      buffer_user_layer.addTo(progrezz_map);
      buffer_fragment_layer.addTo(progrezz_map);
      
      if(!first_update) {
        progrezz_map.removeLayer(user_layer);
        progrezz_map.removeLayer(fragment_layer);
      }
      else
        first_update = false;
      
      user_layer = buffer_user_layer;
      fragment_layer = buffer_fragment_layer;
      
      updating = false;
    }
    
  },
  function() {
    alert("No se ha podido reconocer la ubicación del dispositivo"); 
  },
  {
    enableHighAccuracy: GeolocationUtils.Config.ENABLE_HIGH_ACCURACY,
    timeout: GeolocationUtils.Config.TIMEOUT,
    maximumAge: GeolocationUtils.Config.MAXIMUM_AGE
  });
}