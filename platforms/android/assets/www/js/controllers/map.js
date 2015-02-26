$(document).ready(function(){
	  var map = L.map('map'); 

    var lc = L.control.locate({
      icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow, fa-map-marker, ...
      locateOptions: {
          maxZoom: 16
       }
    }).addTo(map);

    lc.start();

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Progrezz Map. Data © OpenStreetMap',
          maxZoom: 18
    }).addTo(map);

    addPOI(map, 43.290634, -2.862387, "Fragmento", "5PPQGT.1");
    addPOI(map, 43.292219, -2.860081, "Fragmento", "7UF323.4");
    addPOI(map, 43.293360, -2.863009, "Fragmento", "5PPQGT.3");
    addPOI(map, 43.292555, -2.864672, "Fragmento", "7862FM.1");


    /* ADJUTS HEIGHT MAP AUTOMATICALLY */
    //Definimos la función que calculara el alto
    function getRealContentHeight() {
      /*var header = $.mobile.activePage.find("div[data-role='header']:visible");
      var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
      var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");*/
      var header = $("#header");

      var viewport_height = $(window).height();

      var content_height = viewport_height - header.outerHeight();

      return content_height;
    }

    //en este caso el div con id "mapa es el elemento que queremos modificar su alto
    var mapa = $('#map');
    //En algunos casos no acaba de calcular bien los pixeles, con este valor corregimos le error
    var ajuste = 0; 

    //Creamos una función que hará los ajustes en la pagina
    function redimensionarMapa(){
      mapa.height(getRealContentHeight() - ajuste);
    }

    //Añadimos el evento para que cada vez que se cambie de tamaño la pantalla se ejecute la funcion de ajuste
    $( window ).resize(function() {
      redimensionarMapa();
    });

    //ejecutamos la función por primera vez al cargar la pagina
    redimensionarMapa();

});

function addPOI (map, latitude, longitude, title, message){
   L.circle([latitude, longitude], 20, {
    color: '#f70',
    fillColor: '#fb0',
    fillOpacity: 0.5,
    className: 'fragmentPOI'
   }).bindPopup("<b>"+title+"</b><br>"+message).addTo(map);
}





