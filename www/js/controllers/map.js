var USER_RADIUS = 1000 // m
var FRAGMENT_RADIUS = 40 // m

$(document).ready(function(){
  navigator.geolocation.getCurrentPosition(function(position) {
  
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
      setView: true,
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
    
    // Dibujar rango de visión del usuario
    // TODO Poner el rango en función del nivel del jugador
    //TODO Hacer que se vaya actualizando con el tiempo
    L.circle([position.coords.latitude, position.coords.longitude], USER_RADIUS, {
      color: '#077',
      fillColor: '#0ff',
      fillOpacity: 0.2,
    }).addTo(map);
 
    
    // Petición de los fragmentos obtenidos en un radio alrededor
    //TODO Colocar áreas de fragmentos cercanos no encontrados en el mapa
    //TODO Añadir que cada cierto tiempo se pidan los fragmentos

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