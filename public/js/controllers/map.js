var FRAGMENT_RADIUS = 40 // m
var USER_RADIUS = 1000 // m TODO Cambiar cuando el puto pesado de dani tenga de una vez lo que necesito para seguir trabajando

$(document).ready(function(){
  navigator.geolocation.getCurrentPosition(function(position) {
    
    // Mapa
    var map = L.map('map');
     
    // Pie de página
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Progrezz Map. Data © OpenStreetMap',
      maxZoom: 18
    }).addTo(map);
    
    // Dibujar rango de visión del usuario
    // TODO Poner el rango en función del nivel del jugador
    //TODO Hacer que se vaya actualizando con el tiempo
    L.circle([position.coords.latitude, position.coords.longitude], USER_RADIUS, {
      color: '#077',
      fillColor: '#0ff',
      fillOpacity: 0.2,
    }).addTo(map);
    
    // Actualizar posición en el servidor
    // TODO poner esto como una función y ejecutar cada cierto tiempo (5s)
    // TODO añadirlo como petición en serverRequest.js
    var ws = new ProgrezzWS();
    /* Called when the websocket is being opened. */
    ws.onOpen = function(event) {
      // Do whatever
      console.log("Connected");
      var request_json = ProgrezzWS.getTemplateRequest();

      // Tipo de petición y usuario
      request_json.request.type = "user_update_geolocation";
      // TODO Cambiar el user_id para no hacerlo a mano (autentificación)
      request_json.request.data.user_id = "cristogr.93@gmail.com";
      request_json.request.data.latitude = position.coords.latitude;
      request_json.request.data.longitude = position.coords.longitude;     
      ws.send(request_json);
    }

    /* Called when the websocket is being closed. */
    ws.onClose   = function(event) {
      // Do whatever
      console.log("Disconnected");
    }

    /* This will be called when some error occurs.*/
    ws.onError   = function(error) {
      // Do whatever (use ProgrezzWS.StringifyError() to stringify the error).
      console.log("<span style='color: red'>" + ProgrezzWS.StringifyError(error) + "</span>");
    }

    /* This is the most important method! It will be called as a callback when the server respond us with some information. A JSON object should always be recieved. */
    ws.onMessage = function(msg_json) {
      if(msg_json.response.data.message == "Connection established.")
        return;
        
      console.log("Respuesta obtenida");
      // Petición de los fragmentos cercanos en un radio alrededor del usuario
      //TODO Colocar áreas de fragmentos cercanos no encontrados en el mapa
      //TODO Añadir que cada cierto tiempo se pidan los fragmentos ( por tiempo (10 s), y por distancia (50 m) )
      //TODO Tener en cuenta que los mensajes se pasan en un cuadrado, eliminar los sobrantes.
      ServerRequest.userNearbyMessageFragments(function(response_json) {
        
        /* Obtener coordenadas de los fragmentos, asociados al mensaje que pertenecen */
        var message_uuid;
        var system_messages = {};
        var user_messages = {};
        // TODO Cambiar los indices de los arrays por enums, que esto es un lío: system_messages = { uuid_msg_1: [[ind_f1, ind_f2],[[lat_f1, long_f1], [lat_f2, long_f2]]] }
        $.each(response_json.response.data.fragments.system_fragments, function(key, content) {
          
          // Comprobación de que el fragmento se encuentra dentro del círculo
          if (distanceTwoGeoPoints(content.geolocation.latitude, content.geolocation.longitude, position.coords.latitude, position.coords.longitude) > USER_RADIUS)
            return;
          message_uuid = content.message.message.uuid + "." + content.group_index;
          if (system_messages[message_uuid] == null)
            system_messages[message_uuid] = [[],[]];
          system_messages[message_uuid][0].push(content.fragment_index);
          system_messages[message_uuid][1].push([content.geolocation.latitude, content.geolocation.longitude]);
        });
        
        $.each(response_json.response.data.fragments.user_fragments, function(key, content) {
           
          // Comprobación de que el fragmento se encuentra dentro del círculo
          if (distanceTwoGeoPoints(content.geolocation.latitude, content.geolocation.longitude, position.coords.latitude, position.coords.longitude) > USER_RADIUS)
            return;
          message_uuid = content.message.message.uuid + "." + content.group_index;
          if (user_messages[message_uuid] == null)
            user_messages[message_uuid] = [[],[]];
          user_messages[message_uuid][0].push(content.fragment_index);
          user_messages[message_uuid][1].push([content.geolocation.latitude, content.geolocation.longitude]);
        });
        
        // TODO Añadir área un poco movida, en lugar de los fragmentos
        // TODO Poner los colores generalizados, y los de ariba tambien, y funciones para crear polígonos quizas, y para generalizar esto, con lo de mensajes del sistema y usuarios, y meter esto dentro de
        // una función, y llamarla cada rato y esas cosas
        // TODO Pintar de otro color los circulos de los fragmentos conseguidos, con borde verde o algo así, y cambiar el color de los fragmentos del sistema y del usuario.
        /* Añadir fragmentos al mapa, conectando sus nodos con polígonos */
        $.each(system_messages, function(key, fragments_info) {
          
          // TODO Poner esto como una función, shortenIDWithGroup o algo asi
          var msg_short_uuid = shortenID(key) + "." + key.split(".").pop();
          var color = getRandomColor();
          //TODO Poner esto como una función
          // Crear polígonos por grupos de 3
          if (fragments_info[0].length > 3)
            for (var i = 0; i < fragments_info[0].length - 2; i++)
              for (var j = i + 1; j < fragments_info[0].length - 1; j++)
                for (var k = j + 1; k < fragments_info[0].length; k++)
                  L.polygon([fragments_info[1][i], fragments_info[1][j], fragments_info[1][k]], {color: color, width: 3, fillOpacity: 0.2, clickable: false}).addTo(map);
          else
            L.polygon(fragments_info[1], {color: color, width: 3, fillOpacity: 0.2, clickable: false}).addTo(map);
          
          for(f in fragments_info[0]) {
            if (LocalStorage.fragmentAlreadyFound(key.split(".")[0], fragments_info[0][f]))
              addPOI(map, fragments_info[1][f][0], fragments_info[1][f][1], '#0f4', '#f22', "#" + msg_short_uuid, "Fragmento " + fragments_info[0][f]);
            else
              addPOI(map, fragments_info[1][f][0], fragments_info[1][f][1], '#f22', '#f22', "#" + msg_short_uuid, "Fragmento " + fragments_info[0][f]);
          }
        });
        
        $.each(user_messages, function(key, fragments_info) {
          
          var msg_short_uuid = shortenID(key) + "." + key.split(".").pop(); 
          var color = getRandomColor();
          //TODO Poner esto como una función
          // Crear polígonos por grupos de 3
          if (fragments_info[0].length > 3)
            for (var i = 0; i < fragments_info[0].length - 2; i++)
              for (var j = i + 1; j < fragments_info[0].length - 1; j++)
                for (var k = j + 1; k < fragments_info[0].length - 1; k++)
                  L.polygon([fragments_info[1][i], fragments_info[1][j], fragments_info[1][k]], {color: color, width: 3, fillOpacity: 0.2, clickable: false}).addTo(map);
          else
            L.polygon(fragments_info[1], {color: color, width: 3, fillOpacity: 0.2, clickable: false}).addTo(map);
            
          for(f in fragments_info[0]) {
            if (LocalStorage.fragmentAlreadyFound(key.split(".")[0], fragments_info[0][f]))
              addPOI(map, fragments_info[1][f][0], fragments_info[1][f][1], '#0f4', '#fa0', "#" + msg_short_uuid, "Fragmento " + fragments_info[0][f]);
            else
              addPOI(map, fragments_info[1][f][0], fragments_info[1][f][1], '#fa0', '#fa0', "#" + msg_short_uuid, "Fragmento " + fragments_info[0][f]);
          }
        });
        
        // Ubicar al jugador
        //TODO Actualizar cuando se haga cada cierto tiempo la actualización de las coordenadas
        map.setView([position.coords.latitude, position.coords.longitude], 16);
        addPOI(map, position.coords.latitude, position.coords.longitude, '#04f', '#04f', 'cristogr.93@gmail.com', 'Posición actual');
      });

    }
    
    ws.open('ws://progrezz-server.herokuapp.com/dev/api/websocket');

    //ws.close(); // TODO Cerrar a su debido momento
    

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

// Generar un color aleatorio
// TODO Añadir esta funcion a utilidades
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Adición de un fragmento al mapa
// TODO Esta funcion y la siguiente, y la de los mensajes incompletos, reestructurar en algun lado
function addPOI (map, latitude, longitude, color, fill_color, title, message){
  
  L.circleMarker([latitude, longitude], {
    color: color,
    fillColor: fill_color,
    fillOpacity: 0.8,
    opacity: 1,
    weight: 3
  }).bindPopup("<b>"+title+"</b><br>"+message).addTo(map);
}