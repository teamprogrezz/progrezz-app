describe("IDUtils", function() {
	
  it("Acortar UUID de un mensaje", function() {
		
    expect(IDUtils.shortenID("0bb595a3-c2e9-43f4-b481-4d1d311eda55")).toEqual("0BB595A3");
		expect(IDUtils.shortenID("88c4b219-1a9f-4d88-9fbd-b9bb3537a8ef")).toEqual("88C4B219");
  });
	
  it("Acortar UUID de un mensaje con identificador de grupo", function() {
		
    expect(IDUtils.shortenIDGroup("0bb595a3-c2e9-43f4-b481-4d1d311eda55.2")).toEqual("0BB595A3.2");
		expect(IDUtils.shortenIDGroup("88c4b219-1a9f-4d88-9fbd-b9bb3537a8ef.1")).toEqual("88C4B219.1");
  });
		
  it("Eliminar identificador de grupo del UUID acortado de un mensaje", function() {
		
    expect(IDUtils.removeGroup("0BB595A3.2")).toEqual("0BB595A3");
		expect(IDUtils.removeGroup("88C4B219.1")).toEqual("88C4B219");
  });
		
});