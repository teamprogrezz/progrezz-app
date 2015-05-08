$(document).ready(function(){
  
  ServerRequest.loggedIn(function(json_response) {
    
    // Comprobando autenticación
    if (json_response.response.status == 'ok') {
      
      LocalStorage.setUserID(json_response.response.data.user.user_id); // Almacenando ID del usuario
      
      // Ocultando panel de autenticación, y mostrando el logo y el menú de herramientas
      $("#authentication-panel").addClass("hidden");
      $("#button-menu").removeClass("hidden");
      $("#progrezz-logo").removeClass("hidden");
    }
  });
});