var MapTools = {};
(function(namespace){
  
  namespace.Utils = {};
  
  namespace.Vision = {

    USER_RADIUS: 800, // m
    POINT_RADIUS: 30, // m
    MAP_MAX_ZOOM: 18,
    VIEW_DEFAULT_ZOOM: 16,
    VIEW_FRAGMENTS_DEFAULT_ZOOM: 15,
    FRAGMENT_NOISE_LATITUDE: 0,
    FRAGMENT_NOISE_LONGITUDE: 0
  }
  
  namespace.Colors = {
    
    USER_COLOR: "#04f",
    USER_FILL_COLOR: "#04f",
    USER_RANGE_COLOR: "#077",
    USER_RANGE_FILL_COLOR: "#0ff",
    FOUND_FRAGMENT_COLOR: "#0f4",
    SYSTEM_FRAGMENT_COLOR: "#f22",
    USER_FRAGMENT_COLOR: "#fa0",
    MESSAGE_FRAGMENT_COLOR: "#f70"
  };
  
  namespace.Opacity = {
    
    USER_OPACITY: 0.8,
    USER_FILL_OPACITY: 0.5,
    USER_RANGE_OPACITY: 0.8,
    USER_RANGE_FILL_OPACITY: 0.2,
    FRAGMENT_OPACITY: 0.8,
    FRAGMENT_FILL_OPACITY: 0.6,
    FRAGMENT_BINDING_OPACITY: 0.4,
    FRAGMENT_BINDING_FILL_OPACITY: 0.2
  };
  
  namespace.Weight = {
    
    USER_WEIGHT: 3,
    FRAGMENT_WEIGHT: 3,
    FRAGMENT_BINDING_WEIGHT: 3
  };
  
  // Generar un color aleatorio
  namespace.Colors.getRandomSeedColor = function(seed) {
    
    var srand = new Math.seedrandom(seed);
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    
    for (var i = 0; i < 6; i++ )
      color += letters[Math.floor(srand() * 16)];
      
    return color;
  }
  
  // Obtención del tamaño disponible para el mapa
  namespace.Utils.getRealContentHeight = function() {
    return ($(window).height() - $("#header").outerHeight());
  }
  
  // Actualizar rango del usuario
  namespace.Vision.updateUserRange = function (range) {
    namespace.Vision.USER_RADIUS = range * 1000;
  }
  
  // Actualizar ruido
  namespace.Vision.updateNoise = function (noise) {
    namespace.Vision.FRAGMENT_NOISE_LATITUDE = noise.latitude;
    namespace.Vision.FRAGMENT_NOISE_LONGITUDE = noise.longitude;
  }
  
  // Obtener coordenadas aleatorias, de acuerdo al ruido
  namespace.Vision.getRandomNoiseCoords = function(latitude, longitude, seed) {
    
    var srand = new Math.seedrandom(seed);
    var new_lat = latitude + srand() * namespace.Vision.FRAGMENT_NOISE_LATITUDE * (srand() > 0.5? 1 : -1);
    var new_lon = longitude + srand() * namespace.Vision.FRAGMENT_NOISE_LONGITUDE * (srand() > 0.5? 1 : -1);
    
    return [new_lat, new_lon];
  }
  
  // Obtener coordenadas de la esquina inferior izquierda, de acuerdo al ruido
  namespace.Vision.getSouthWestCoords = function(latitude, longitude) {
    
    return [latitude - namespace.Vision.FRAGMENT_NOISE_LATITUDE, longitude - namespace.Vision.FRAGMENT_NOISE_LONGITUDE]
  }
  
  // Obtener coordenadas de la esquina superior derecha, de acuerdo al ruido
  namespace.Vision.getNorthEastCoords = function (latitude, longitude) {
    
    return [latitude + namespace.Vision.FRAGMENT_NOISE_LATITUDE, longitude + namespace.Vision.FRAGMENT_NOISE_LONGITUDE]
  }
  
  // Dibujar un rango
  namespace.Vision.drawRange = function(map, latitude, longitude, radius, options) {
    
    L.circle([latitude, longitude], radius, options).addTo(map);
  }
  
  // Ubicar al usuario con Leaflet Control
  namespace.Vision.locateUserLeafletControl = function(map, alias) {
    
    var lc = L.control.locate({
      icon: 'fa fa-map-marker',
      setView: false,
      markerClass: L.circleMarker,
      strings: {
        title: "Posición actual",
        popup: alias,
        outsideMapBoundsMsg: "Posición actual"
      },
      locateOptions: {
        maxZoom: 16
      }
    }).addTo(map);

    lc.start();
  }
  
  // Ubicar al usuario manualmente
  namespace.Vision.locateUser = function (map, latitude, longitude, title, message) {
    L.circleMarker([latitude, longitude], {
      color: namespace.Colors.USER_COLOR,
      fillColor: namespace.Colors.USER_FILL_COLOR,
      opacity: namespace.Opacity.USER_OPACITY,
      fillOpacity: namespace.Opacity.USER_FILL_OPACITY,
      weight: namespace.Weight.USER_WEIGHT
    }).bindPopup("<b>"+title+"</b><br>"+message).addTo(map);
  }
  
  // TODO Añadir animación si es posible a este área
  // Adición del área con ruido de un fragmento no encontrado al mapa
  namespace.Vision.drawFragmentArea = function(map, latitude, longitude, color, title, message) {
    
    L.rectangle(
      [ 
        namespace.Vision.getSouthWestCoords(latitude, longitude), 
        namespace.Vision.getNorthEastCoords(latitude, longitude)
      ],
      {
        color: color,
        opacity: namespace.Opacity.FRAGMENT_OPACITY,
        fillOpacity: namespace.Opacity.FRAGMENT_FILL_OPACITY,
        weight: namespace.Weight.FRAGMENT_WEIGHT
      }
    ).bindPopup("<b>"+title+"</b><br>"+message).addTo(map);
  }
  
  // Adición de fragmento ya encontrado al mapa
  namespace.Vision.drawFragmentPoint = function(map, latitude, longitude, color, title, message) {
    
    L.circle([latitude, longitude], namespace.Vision.POINT_RADIUS,
      {
        color: namespace.Colors.FOUND_FRAGMENT_COLOR,
        fillColor: color,
        opacity: namespace.Opacity.FRAGMENT_OPACITY,
        fillOpacity: namespace.Opacity.FRAGMENT_FILL_OPACITY,
        weight: namespace.Weight.FRAGMENT_WEIGHT
      }
    ).bindPopup("<b>"+title+"</b><br>"+message).addTo(map);
  }
  
  // Dibujar polígono que unen los puntos en grupos de 3
  namespace.Vision.drawBindingTriangles = function(map, coords, seed, color) {
    
    if(!color)
      var color = MapTools.Colors.getRandomSeedColor(seed);
    
    var options = {
      color: color,
      fillColor: color,
      weight: namespace.Weight.FRAGMENT_BINDING_WEIGHT,
      opacity: namespace.Opacity.FRAGMENT_BINDING_OPACITY,
      fillOpacity: namespace.Opacity.FRAGMENT_BINDING_FILL_OPACITY,
      clickable: false
    }
    
    if (coords.length > 3)
      for (var i = 0; i < coords.length - 2; i++)
        for (var j = i + 1; j < coords.length - 1; j++)
          for (var k = j + 1; k < coords.length; k++)
            L.polygon([coords[i], coords[j], coords[k]], options).addTo(map);
    else
      L.polygon(coords, options).addTo(map);
  }
  
  // Redimensionar el mapa de acuerdo al espacio disponible
  namespace.Utils.resizeMap = function() {
    
    // Función de redimensionado del mapa
    var mapa = $('#map');
    function resizeMap() {
      mapa.attr("style", "height: " + namespace.Utils.getRealContentHeight() + "px; " + "margin-top:" + $("#header").outerHeight() + "px;");
    }
    
    // Redimensionar mapa por primera vez y cada vez que se redimensione la ventana
    resizeMap();
    $(window).resize(function() {
      resizeMap();
    });
  }
  
  // Creación del mapa y adición del pie de página
  namespace.Utils.initMap = function() {
    
    // Mapa
    var map = L.map('map');
  
    // Pie de página
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Progrezz Map. Data © OpenStreetMap',
      maxZoom: MapTools.Vision.MAP_MAX_ZOOM
    }).addTo(map);
    
    return map;
  }
  
})(MapTools);