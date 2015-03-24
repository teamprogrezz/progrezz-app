$(document).ready(function(){

  // Mapa y pie de página
  var map = MapTools.Utils.initMap();
  
  // Ubicar al usuario
  ServerRequest.userProfile(function(response_json) {

    MapTools.Vision.locateUserLeafletControl(map, response_json.response.data.profile.info.alias);
  });
  
  // Petición de los fragmentos obtenidos
  ServerRequest.userCollectedMessageFragments(
    LocalStorage.getSelectedMessageUUID(),
    function(json_response) {
      
      var msg_uuid = LocalStorage.getSelectedMessageUUID();
      var head_fragment_uuid = IDUtils.shortenID(msg_uuid);
      var fragment_coordinates = [];
      
      // Almacenando la geolocalización
      json_response.response.data.fragments[msg_uuid].forEach(function(fragment) {
        fragment_coordinates.push([fragment.geolocation.latitude, fragment.geolocation.longitude]);
      })
      
      // Vista sobre el primer fragmento
      map.setView(fragment_coordinates[0], MapTools.Vision.VIEW_FRAGMENTS_DEFAULT_ZOOM);
      
      // Poligonos
      MapTools.Vision.drawBindingTriangles(map, fragment_coordinates, null, MapTools.Colors.MESSAGE_FRAGMENT_COLOR);
      
      // Añadiendo fragmentos al mapa
      json_response.response.data.fragments[msg_uuid].forEach(function(fragment) {
        MapTools.Vision.drawFragmentPoint(map, fragment.geolocation.latitude, fragment.geolocation.longitude, MapTools.Colors.MESSAGE_FRAGMENT_COLOR, "Fragmento", head_fragment_uuid + "." + fragment.fragment_index);
      })
    }
  );

  
  // Redimensionado del mapa
  MapTools.Utils.resizeMap();
  
});