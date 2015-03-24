var IDUtils = {};
(function(namespace){

  namespace.shortenID = function (id) {
    
    return id.split("-")[0].toUpperCase();
  }

  namespace.removeGroup = function(id) {
    
    return id.split(".")[0]; 
  }
  
  namespace.shortenIDGroup = function(id) {
    
    return namespace.shortenID(id) + "." + id.split(".").pop();
  }

})(IDUtils);