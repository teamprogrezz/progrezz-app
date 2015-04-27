describe("GeolocationUtils", function() {
	
  it("Distancia (m) entre dos puntos geolocalizados (latitud y longitud), con precisión de dos decimales", function() {
		
    expect(GeolocationUtils.distanceTwoGeoPoints(28.485287, -16.316679, 28.107347, -15.442029)).toBeCloseTo(95390.84478230208, 2); // Tenerife - Gran Canaria */
		expect(GeolocationUtils.distanceTwoGeoPoints(43.250559, -2.922101, -18.099865, 48.757288)).toBeCloseTo(8617791.242889987, 2); // Bilbao - Madagascar
		expect(GeolocationUtils.distanceTwoGeoPoints(35.759032, 139.679058, -34.763081, -58.384376)).toBeCloseTo(18373624.595922272, 2); // Japón - Argentina
  });
	
	var TIMEOUT_INTERVAL = 10000; // (ms)
	
	describe("'startWatchPosition' callback", function() {
		
		var position = null;
		
		beforeAll(function(done) {
			GeolocationUtils.startWatchPosition(function(event) {
				position = event;
				done();
			});
		});
		
		it("Acceso a la monitorización de la geolocalización", function(done) {
			expect(position).not.toBeNull();
			expect(position.coords.latitude).not.toBeUndefined();
			expect(position.coords.longitude).not.toBeUndefined();
			done();
		}, TIMEOUT_INTERVAL);
	});
	
});