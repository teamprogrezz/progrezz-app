/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */
Number.prototype.toRad = function () { 
  return this * Math.PI / 180;
}
THREE.DeviceOrientationControls = function ( object ) {

  var scope = this;
  this.first_time = true;
  this.updating = false;
  this.originLatitude = 0;
  this.originLongitude = 0;
  this.currentLatitude = 0;
  this.currentLongitude = 0;

  this.object = object;
  this.object.rotation.reorder( "YXZ" );

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  var onDeviceOrientationChangeEvent = function ( event ) {

    scope.deviceOrientation = event;

  };

  var onScreenOrientationChangeEvent = function () {

    scope.screenOrientation = window.orientation || 0;

  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = function () {

    var zee = new THREE.Vector3( 0, 0, 1 );

    var euler = new THREE.Euler();

    var q0 = new THREE.Quaternion();

    var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

    return function ( quaternion, alpha, beta, gamma, orient ) {

      euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler( euler );                               // orient the device

      quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

      quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

    }

  }();
  
 /*function distanceTwoLats (lat1, lat2) {
    var R = 6371; // Radio medio de la tierra (km)
    var dLat = (lat2 - lat1).toRad();
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    var a = Math.pow(Math.sin(dLat/2), 2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c * 1000; // Distancia (m)
    return d;
  }
  
  function distanceTwoLongs (lon1, lon2) {
    var R = 6371; // Radio medio de la tierra (km)
    var dLon = (lon2 - lon1).toRad();
    var a = Math.pow(Math.sin(dLon/2), 2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c * 1000; // Distancia (m)
    return d;
  }
  
  function updateObject() {
    
    // TODO Revisar para cuando cruces el meridiano y ecuador y esas cosas, no liarla
    if(scope.originLatitude < scope.currentLatitude)  {
      object.position.setX(distanceTwoLats(scope.originLatitude, scope.currentLatitude));
    }
    else {
      object.position.setX(-distanceTwoLats(scope.originLatitude, scope.currentLatitude));
    }
    if(scope.originLongitude < scope.currentLongitude)  {
      object.position.setZ(distanceTwoLongs(scope.originLongitude, scope.currentLongitude));
    }
    else {
      object.position.setZ(-distanceTwoLongs(scope.originLongitude, scope.currentLongitude));
    }
  }
  
  this.getObjectX = function(latitude) {
    return distanceTwoLats(scope.originLatitude, latitude) * ((scope.originLatitude < latitude)? 1 : -1);
  };
  
  this.getObjectZ = function(longitude) {
    return distanceTwoLongs(scope.originLongitude, longitude) * ((scope.originLongitude < longitude)? 1 : -1);
  };*/

  this.connect = function() {
    
    // TODO Hay que esperar a que se ejecute por primera vez
    /*navigator.geolocation.watchPosition(
      function(pos) {
        alert("Aquí :D")
        if (scope.updating)
          return;
        
        scope.updating = true;
        alert("Aquí :D")
        if (scope.first_time) {
          alert("Aquí :D")
          scope.originLatitude = scope.currentLatitude = pos.coords.latitude;
          scope.originLongitude = scope.currentLongitude = pos.coords.longitude;
          scope.first_time = false;
        }
        else {
          scope.currentLatitude = pos.coords.latitude;
          scope.currentLongitude = pos.coords.longitude;
        }
        
        updateObject();
        
        scope.updating = false;
      },
      function() {
        alert("No se ha podido T.T"); 
      }
    );
    
    waitFor();

    function data() {
      
      alert(scope.originLatitude + " " + scope.originLongitude + "\n" + scope.currentLatitude + " " + scope.currentLongitude + "\n" + object.position.x + " " + object.position.z);
    }
    
    function cont() {
      onScreenOrientationChangeEvent(); // run once on load
  
      window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
      window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
  
      scope.enabled = true;
      
      setInterval(data ,5000);
    }
    
    function waitFor() {
      
      if (scope.first_time)
        setTimeout(waitFor, 400);
      else
        cont();
    }*/
    
    onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = true;
  };

  this.disconnect = function() {

    window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = false;

  };

  this.update = function () {

    if ( scope.enabled === false ) return;

    var alpha  = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha.toFixed(5) ) : 0; // Z
    var beta   = scope.deviceOrientation.beta  ? THREE.Math.degToRad( scope.deviceOrientation.beta.toFixed(5) ) : 0; // X'
    var gamma  = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma.toFixed(5) ) : 0; // Y''
    var orient = scope.screenOrientation       ? THREE.Math.degToRad( scope.screenOrientation       ) : 0; // O

    setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

  };

  this.connect();

};
