/* Phonegap */
var app = {

  // Application Constructor
  initialize: function() {
      this.bindEvents();
  },

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {

    window.navigator.geolocation.getCurrentPosition(function(location) {
      console.log('Location from Phonegap');
      init();
    });
  }
};

app.initialize();