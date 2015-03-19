Number.prototype.toRad = function () { 
  return this * Math.PI / 180;
}

function distanceTwoGeoPoints(lat1, lon1, lat2, lon2) {
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