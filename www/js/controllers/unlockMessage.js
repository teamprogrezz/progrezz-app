
var END_TIME = 1000 // Tiempo de espera tras finalización (ms)

$(document).ready(function() {
  $(".unlockButtonPlus").click( function() { // Evento de pulsación
    
    /* Ocultando el documento */
    $("#fastclick").hide();
    
    /* Creación del canvas */
    $("<canvas/>", {"id":"gameview"}).attr({ width: window.innerWidth, height: window.innerHeight }).appendTo("body");
    
    /* Iniciar juego de desbloqueo */
    LinkSnake.init(
      function() { // Función de victoria
      
        console.log("Victoria");
        
        setTimeout(function() {
          window.location.href = "../index.html";
        }, END_TIME);
        
        // Petición de desbloqueado de mensaje
        ServerRequest.userChangeMessageStatus(
          LocalStorage.getSelectedMessageUUID,
          "unread",
          function(response_json) {}
        );
        
      },
      function() { // Función de derrota
        setTimeout(function() {
          $("#gameview").remove();
          $("#fastclick").show();
        }, END_TIME);
      }, // TODO Poner estos parámetros globales, y tener en cuenta que el numero de fragmentos es el del mensaje
      1, 16, 10, 0, "gameview"
    );
    
  })
});