
// the functions below interacts with the google maps api

// all the variables related to the mapping functionality
centerLatLng = {lat: 44.9727, lng: -93.2354}

function initMap() 
{

	map = new google.maps.Map(document.getElementById('form_map'), {
			center: centerLatLng,
			zoom: 14,
		});

	var geocoder = new google.maps.Geocoder()

	google.maps.event.addListener(map, 'click', function(event){
		geocoder.geocode(
			function(results,status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						document.getElementById("location").value = results[0]
					}
				}
			}
		)
	})

}
