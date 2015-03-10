$(document).ready(function(){
  
  //TODO Reestructurar, poniendo en común las funciones de los mapas
  // Mapa
  var map = L.map('map');
  
  // Pie de página
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Progrezz Map. Data © OpenStreetMap',
    maxZoom: 18
  }).addTo(map);

  // Ubicar al jugador
  var lc = L.control.locate({
    icon: 'fa fa-map-marker',
    setView: false,
    markerClass: L.circleMarker,
    strings: {
      title: "cristogr.93@gmal.com", // TODO Poner el alias del jugador
      popup: "Posición actual",
      outsideMapBoundsMsg: "Posición actual"
    },
    locateOptions: {
      maxZoom: 16
    }
  }).addTo(map);

  lc.start();
  
  // Petición de los fragmentos obtenidos
  ServerRequest.userCollectedMessageFragments(
    LocalStorage.getSelectedMessageUUID(),
    function(json_response) {
      
      var msg_uuid = LocalStorage.getSelectedMessageUUID();
      var head_fragment_uuid = shortenID(msg_uuid);
      var fragment_coordinates = [];
      
      // Almacenando la geolocalización
      json_response.response.data.fragments[msg_uuid].forEach(function(fragment) {
        fragment_coordinates.push([fragment.geolocation.latitude, fragment.geolocation.longitude]);
      })
      
      // Vista sobre el primer fragmento
      map.setView(fragment_coordinates[0], 14);
      
      // Polígono
      var polygon = L.polygon(fragment_coordinates).addTo(map);
      
      // Añadiendo fragmentos al mapa
      json_response.response.data.fragments[msg_uuid].forEach(function(fragment) {
        addPOI(map, fragment.geolocation.latitude, fragment.geolocation.longitude, "Fragmento", head_fragment_uuid + "." + fragment.fragment_index);
      })
    }
  );

  // Función de redimensionado del mapa
  var mapa = $('#map');
  function resizeMap() {
    mapa.attr("style", "height: " + getRealContentHeight() + "px; " + "margin-top:" + $("#header").outerHeight() + "px;");
  }
  
  // Redimensionar mapa por primera vez y cada vez que se redimensione la ventana
  resizeMap();
  $(window).resize(function() {
    resizeMap();
  });
  
});

// Obtención del tamaño disponible para el mapa
function getRealContentHeight() {
  return ($(window).height() - $("#header").outerHeight());
}

// Adición de un fragmento al mapa
function addPOI (map, latitude, longitude, title, message){
  
  L.circleMarker([latitude, longitude], {
    color: '#f70',
    fillColor: '#fb0',
    fillOpacity: 0.8,
  }).bindPopup("<b>"+title+"</b><br>"+message).addTo(map);
}
