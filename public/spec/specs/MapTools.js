describe("MapTools", function() {
	
	var TIMEOUT_INTERVAL = 5000; // (ms)
	
	it("Generación de un color aleatorio (con semilla)", function() {
		
		var seed = "test_seed";
		var color_seed = MapTools.Colors.getRandomSeedColor(seed);
		
		expect(MapTools.Colors.getRandomSeedColor(seed)).toEqual(color_seed);
		expect(color_seed).toMatch(/#(\d|[ABCDEF]){6}/);
	});

	it("Obtención de tamaño disponible para el mapa", function() {
		
		expect(MapTools.Utils.getRealContentHeight() <= $(window).height()).toBeTruthy();
	});
	
	it("Actualización del rango del usuario", function() {
		
		var range = Math.floor((Math.random() * 100) + 1); // (km)
		
		MapTools.Vision.updateUserRange(range);
		expect(MapTools.Vision.USER_RADIUS).toEqual(range * 1000); // (m)
	});
	
	it("Actualización de la cantidad de ruido de los fragmentos", function() {
		
		var noise = { latitude: Math.random(), longitude: Math.random() };

		MapTools.Vision.updateNoise(noise);

		expect(MapTools.Vision.FRAGMENT_NOISE_LATITUDE).toEqual(noise.latitude);
		expect(MapTools.Vision.FRAGMENT_NOISE_LONGITUDE).toEqual(noise.longitude);
	});
	
	it("Generación de coordenadas aleatorias (de acuerdo al ruido)", function() {
		
	});
	
	it("Obtención de coordenadas de la esquina inferior izquierda (de acuerdo al ruido)", function() {
		
	});
	
	it("Obtención de coordenadas de la esquina superior derecha (de acuerdo al ruido)", function() {
		
	});
	
  it("Inicializar mapa", function() {
		
	});
	
  it("Redimensionar el mapa de acuerdo al espacio disponible", function() {
		
	});
	
	it("Dibujar rango de visión en un mapa", function() {
		
	});
	
	it("Ubicar al usuario con Leaflet Control", function() {
		
	});
	
  it("Ubicar al usuario de forma manual", function() {
		
	});
	
  it("Dibujar área con ruido de fragmento no encontrado", function() {
		
	});
	
  it("Dibujar punto de fragmento encontrado", function() {
		
	});
	
  it("Dibujar polígono de conexión entre fragmentos de un mismo mensaje", function() {
		
	});
	
	describe("'userMessages' callback", function() {
	  
		var response = null;
		
		beforeAll(function(done) {
			ServerRequest.userMessages(function(result) {
				response = result;
				done();
			});
		});
		
		it("Petición de mensajes de un usuario", function(done) {
			
			expect(response).not.toBeNull();
			expect(response.response.status).toEqual("ok");
			expect(response.request.request.type).toEqual("user_get_messages");
			expect(response.response.data.completed_messages).not.toBeUndefined();
			expect(response.response.data.fragmented_messages).not.toBeUndefined();
			
			done();
		}, TIMEOUT_INTERVAL);
	});
});