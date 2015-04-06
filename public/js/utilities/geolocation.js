Number.prototype.toRad = function () { 
  return this * Math.PI / 180;
}

var GeolocationUtils = {};
(function(namespace){
  
  namespace.startWatchPosition = function(success) {
    
    navigator.geolocation.watchPosition(
      success,
      function() {
        alert("No se ha podido reconocer la ubicación del dispositivo"); 
      },
      {
        enableHighAccuracy: GeolocationUtils.Config.ENABLE_HIGH_ACCURACY,
        timeout: GeolocationUtils.Config.TIMEOUT,
        maximumAge: GeolocationUtils.Config.MAXIMUM_AGE
      }
    );
  }
  
  namespace.Config = {
    
    ENABLE_HIGH_ACCURACY: false,
    TIMEOUT: 5000, // ms
    MAXIMUM_AGE: 2000 // ms
  }
  
  namespace.distanceTwoGeoPoints = function(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radio medio de la tierra (km)
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();
    var a = Math.pow(Math.sin(dLat/2), 2) + Math.pow(Math.sin(dLon/2), 2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c * 1000; // Distancia (m)
    return d;
  }

})(GeolocationUtils);