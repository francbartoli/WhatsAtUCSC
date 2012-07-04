// may need to re-write as a function that returns latLng?

$('#deptList').delegate('a', 'click', function() {
		//do click stuff here
		// build up the changePage data
		//alert($(this).attr("map-coordinates")); // just what we need
		var latLng = $(this).attr("map-coordinates");
		alert(latLng);
	});