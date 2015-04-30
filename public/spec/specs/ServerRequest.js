describe("ServerRequest", function() {
	
	var TIMEOUT_INTERVAL = 6000; // (ms)
	
	var valid_msg_uuid = null;
	var invalid_msg_uuid = "invalid_uuid";
	
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
	
	describe("'userNearbyMessageFragments' callback", function() {
	  
		var response = null;
		
		beforeAll(function(done) {
			ServerRequest.userNearbyMessageFragments(function(result) {
				response = result;
				done();
			});
		});
		
		it("Petición de fragmentos cercanos a un usuario", function(done) {
			
			expect(response).not.toBeNull();
			expect(response.response.status).toEqual("ok");
			expect(response.request.request.type).toEqual("user_get_nearby_message_fragments");
			expect(response.response.data.fragments.system_fragments).not.toBeUndefined();
			expect(response.response.data.fragments.user_fragments).not.toBeUndefined();
			
			/* Buscando una uuid de mensaje válida */
			for (message in response.response.data.fragments.system_fragments) {
				valid_msg_uuid = response.response.data.fragments.system_fragments[message].message.message.uuid;
				break;
			}
			for (message in response.response.data.fragments.user_fragments) {
				valid_msg_uuid = response.response.data.fragments.user_fragments[message].message.message.uuid;
				break;
			}
			
			done();
		}, TIMEOUT_INTERVAL);
	});
	
	describe("'userCollectedMessageFragments' callback", function() {
	  
		var response = null;
		
		beforeAll(function(done) {
			ServerRequest.userCollectedMessageFragments(valid_msg_uuid, function(result) {
				response = result;
				done();
			});
		});
		
		it("Petición de fragmentos recolectados de un mensaje", function(done) {
			
			expect(response).not.toBeNull();
			expect(response.request.request.type).toEqual("user_get_collected_message_fragments");
			expect(response.response.status).toEqual("ok");
			expect(response.response.data.fragments).not.toBeUndefined();
			
			done();
		}, TIMEOUT_INTERVAL);
	});
	
	describe("'userUnlockMessage' callback", function() {
	  
		var response = null;
		
		beforeAll(function(done) {
			ServerRequest.userUnlockMessage(invalid_msg_uuid, function(result) {
				response = result;
				done();
			});
		});
		
		it("Petición de desbloqueado de un mensaje", function(done) {
			
			expect(response).not.toBeNull();
			expect(response.request.request.type).toEqual("user_unlock_message");
			
			done();
		}, TIMEOUT_INTERVAL);
	});
	
	describe("'userReadMessage' callback", function() {
	  
		var response = null;
		
		beforeAll(function(done) {
			ServerRequest.userReadMessage(invalid_msg_uuid, function(result) {
				response = result;
				done();
			});
		});
		
		it("Petición de lectura de un mensaje", function(done) {
			
			expect(response).not.toBeNull();
			expect(response.request.request.type).toEqual("user_read_message");
			
			done();
		}, TIMEOUT_INTERVAL);
	});
	
	describe("'userAllowedActions' callback", function() {
	  
		var response = null;
		
		beforeAll(function(done) {
			ServerRequest.userAllowedActions(function(result) {
				response = result;
				done();
			});
		});
		
		it("Petición acciones permitidas de un usuario", function(done) {
			
			expect(response).not.toBeNull();
			expect(response.response.status).toEqual("ok");
			expect(response.request.request.type).toEqual("user_allowed_actions");
			expect(response.response.data.allowed_actions).not.toBeUndefined();
			
			done();
		}, TIMEOUT_INTERVAL);
	});
	
	describe("'userProfile' callback", function() {
	  
		var response = null;
		
		beforeAll(function(done) {
			ServerRequest.userProfile(function(result) {
				response = result;
				done();
			});
		});
		
		it("Petición del perfil del usuario", function(done) {
			
			expect(response).not.toBeNull();
			expect(response.response.status).toEqual("ok");
			expect(response.request.request.type).toEqual("user_profile");
			expect(response.response.data.profile).not.toBeUndefined();
			
			done();
		}, TIMEOUT_INTERVAL);
	});
	
});