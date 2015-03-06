$(document).ready(function() {
  $(".unlockButtonPlus").click( function() {
    
    $("#fastclick").hide();
    
    /* Creación del canvas */
    $("<canvas/>", {"id":"gameview"}).attr({ width: window.innerWidth, height: window.innerHeight }).appendTo("body");
    
    /* Iniciar juego de desbloqueo */
    init_link_snake(
      function() { // Victoria
      
        console.log("Victoria"); // TODO Desbloquear mensaje
      },
      function() { // Derrota
      
        $("#gameview").remove();
        $("#fastclick").show();
      },
      5, 16, 10, 0, "gameview"
    );
    
  })
});