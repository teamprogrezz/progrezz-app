describe("LocalStorage", function() {
	
	it("Asignar y obtener UUID del mensaje seleccionado", function() {
		
		var test_uuid = "test_uuid" + Math.floor((Math.random() * 100) + 1);
		
		LocalStorage.setSelectedMessageUUID(test_uuid);
		expect(LocalStorage.getSelectedMessageUUID()).toEqual(test_uuid);
  });
	
	it("Asignar y obtener el alias del usuario", function() {
		
		var test_alias = "test_alias" + Math.floor((Math.random() * 100) + 1);
		
		LocalStorage.setUserAlias(test_alias);
		expect(LocalStorage.getUserAlias()).toEqual(test_alias);
  });
	
	it("Almacenado y gestión de la lista de mensajes del usuario", function() {
		
		var test_list = {
			type: "json",
			completed_messages: {
				uuid_cm_1: {
					message: { content: "Contenido mensaje completo 1", total_fragments: 3 },
					status: { status: "locked" }
				},
				uuid_cm_2: {
					message: { content: "Contenido mensaje completo 2", total_fragments: 1 },
					status: { status: "read" }
				}
			},
			fragmented_messages: {
				uuid_fm_1: {
					message: { total_fragments: 4 },
					fragments: [0, 3, 1]
				},
				uuid_fm_2: {
					message: { total_fragments: 2 },
					fragments: [1]
				}
			}
		};
		
		LocalStorage.setUserMessageList(test_list);
		expect(LocalStorage.getCompletedMessageNumberFragments("uuid_cm_1")).toEqual(3);
		expect(LocalStorage.getCompletedMessageStatus("uuid_cm_2")).toEqual("read");
		expect(LocalStorage.getCompletedMessageContent("uuid_cm_1")).toEqual("Contenido mensaje completo 1");
		expect(LocalStorage.fragmentAlreadyFound("uuid_cm_2", 0)).toBe(true);
		expect(LocalStorage.fragmentAlreadyFound("uuid_fm_1", 3)).toBe(true);
		expect(LocalStorage.fragmentAlreadyFound("uuid_fm_2", 0)).toBe(false);
  });
	
});