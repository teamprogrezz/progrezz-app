
var END_TIME = 1000 // Tiempo de espera tras finalización (ms)

$(document).ready(function() {
  $(".unlockButtonPlus").click( function() {
    
    $("#fastclick").hide();
    
    /* Creación del canvas */
    $("<canvas/>", {"id":"gameview"}).attr({ width: window.innerWidth, height: window.innerHeight }).appendTo("body");
    
    /* Iniciar juego de desbloqueo */
    init_link_snake(
      function() { // Función de victoria
      
        console.log("Victoria"); // TODO Desbloquear mensaje
      },
      function() { // Función de derrota
        setTimeout(function() {
          $("#gameview").remove();
          $("#fastclick").show();
        }, END_TIME);
      },
      5, 16, 10, 0, "gameview"
    );
    
  })
});