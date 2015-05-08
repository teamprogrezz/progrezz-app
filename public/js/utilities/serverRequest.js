var ServerRequest = {};
(function(namespace) {
  // TODO Cambiar el user_id para no hacerlo a mano, en todas las peticiones (autentificación)
  var SERVER_REST_URL = "http://progrezz-server.herokuapp.com/dev/api/rest";
  RESTRequest.DEFAULT.REQUEST_URL = SERVER_REST_URL;
  
  var DEFAULT_ERROR_FUNCTION = function(error) { 
    alert("Error al comunicarse con el servidor");
  }

  /* Peticiones REST */
  namespace.userMessages = function(onComplete, onError) {
    
    'use strict';
    
    // Inicialización
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_get_messages";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );
  }
  
  namespace.userNearbyMessageFragments = function(onComplete, onError) {
    
    'use strict';
    
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_get_nearby_message_fragments";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );
  }
  
  namespace.userCollectedMessageFragments = function(msg_uuid, onComplete, onError) {
    
    'use strict';
        
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_get_collected_message_fragments";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    request_json.request.data.msg_uuid = msg_uuid;
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );
  }
  
  namespace.userUnlockMessage = function(msg_uuid, onComplete, onError) {
    
    'use strict';
    
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_unlock_message";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    request_json.request.data.msg_uuid = msg_uuid;
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );   
  }
  
  namespace.userReadMessage = function(msg_uuid, onComplete, onError) {
    
    'use strict';
    
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_read_message";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    request_json.request.data.msg_uuid = msg_uuid;
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );   
  }
  
  namespace.userAllowedActions = function(onComplete, onError) {
    
    'use strict';
    
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_allowed_actions";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );   
  }
  
  namespace.userProfile = function(onComplete, onError) {
    
    'use strict';
    
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_profile";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );   
  }
  
  namespace.userProfile = function(onComplete, onError) {
    
    'use strict';
    
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_profile";
    request_json.request.data.user_id = "cristogr.93@gmail.com";
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );   
  }
  
  namespace.loggedIn = function(onComplete, onError) {
    
    'use strict';
    
    var request = new RESTRequest();
    var request_json = RESTRequest.getTemplateRequest();
    
    // Tipo de petición y usuario
    request_json.request.type = "user_who_am_i";
    
    // Funciones de completado, error y finalización
    request.onComplete = onComplete;
    request.onError = onError || DEFAULT_ERROR_FUNCTION;
    
    // Efectuando la petición
    request.request( request_json );   
  }
  
})(ServerRequest);