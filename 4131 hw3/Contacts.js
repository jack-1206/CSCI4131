function smallpic(contactNum) {
				if(contactNum==1){
					document.getElementById("thumbnail1").src="./amun.jpg"
					document.getElementById("thumbnail22").src=""	
					document.getElementById("thumbnail33").src=""	
					document.getElementById("thumbnail44").src=""	
					document.getElementById("thumbnail55").src=""	
					document.getElementById("thumbnail11").src="./amun.jpg"
				}else if(contactNum==2){
					document.getElementById("thumbnail2").src="./morrill.jpg"
					document.getElementById("thumbnail11").src=""	
					document.getElementById("thumbnail33").src=""	
					document.getElementById("thumbnail44").src=""	
					document.getElementById("thumbnail55").src=""	
					document.getElementById("thumbnail22").src="./morrill.jpg"
				}else if(contactNum==3){
					document.getElementById("thumbnail3").src="./Shepherd.jpg"
					document.getElementById("thumbnail11").src=""	
					document.getElementById("thumbnail22").src=""	
					document.getElementById("thumbnail44").src=""	
					document.getElementById("thumbnail55").src=""	
					document.getElementById("thumbnail33").src="./Shepherd.jpg"
				}else if(contactNum==4){
					document.getElementById("thumbnail4").src="./coffman.jpg"
					document.getElementById("thumbnail11").src=""	
					document.getElementById("thumbnail22").src=""	
					document.getElementById("thumbnail33").src=""	
					document.getElementById("thumbnail55").src=""
					document.getElementById("thumbnail44").src="./coffman.jpg"
				}else if(contactNum==5){
					document.getElementById("thumbnail5").src="./keller.jpg"
					document.getElementById("thumbnail11").src=""	
					document.getElementById("thumbnail22").src=""	
					document.getElementById("thumbnail33").src=""	
					document.getElementById("thumbnail44").src=""
					document.getElementById("thumbnail55").src="./keller.jpg"
				}
			}

function dissapear(num) {
	if(num==1){
		document.getElementById("thumbnail1").src=""
	}else if(num==2){
		document.getElementById("thumbnail2").src=""
	}else if(num==3){
		document.getElementById("thumbnail3").src=""
	}else if(num==4){
		document.getElementById("thumbnail4").src=""
	}else if(num==5){
		document.getElementById("thumbnail5").src=""
	}
}

var i=0;
function switchpic(){
	var pic;
	if (i==0){
		pic="./amun.jpg";
		i++;
	}else if(i==1){
		pic="./morrill.jpg";
		i++;
	}else if(i==2){
		pic="./Shepherd.jpg";
		i++;
	}else if(i==3){
		pic="./coffman.jpg";
		i++;
	}else if(i==4){
		pic="./keller.jpg";
		i=0;
	}
	document.getElementById("image").src=pic;
	document.getElementById("image").className="largepic";
}

var rot=1;
var is_rotating=1;
var timer=null;
function rotate_little(){
	document.getElementById("image").style.transform="rotatez("+rot+"deg)";
	rot++;
}

function rotatePic(){
	if (is_rotating){
		timer = setInterval(rotate_little,9);
	}else{
		clearInterval(timer);
	}
	is_rotating = !is_rotating;
}

let map;
let infowindow;
let geocoder;
function myMap(){
var addresses = document.getElementsByClassName('addr')
	var rows = document.getElementsByClassName('controw')
	directionsService = new google.maps.DirectionsService()
	directionsRenderer = new google.maps.DirectionsRenderer()

	map = new google.maps.Map(document.getElementById('googleMap'), 
		{
			center: new google.maps.LatLng(44.9727,-93.23540000000003),
			zoom: 14,
		}
		);
		var geocoder = new google.maps.Geocoder()
		var contTable = document.getElementById('contTable')
		var name,row,col;
		for (var i = 1; row = contTable.rows[i]; i++){
			for (var j = 0; col = row.cells[j]; j++){
				if (j == 0){
				name = col.innerHTML
				}
				if (j == 2){
					createMarker(map, geocoder, name, col.innerHTML)
				}
			}
		}
}
function createMarker(map, geocoder, name, address){
	geocoder.geocode({address: address},(results, status) => {
		if (status == "OK") {
			var marker = new google.maps.Marker({
				position: results[0].geometry.location,
				map: map,
				animation: google.maps.Animation.DROP,
			});
			infowindow = new google.maps.InfoWindow({
			    
			});

			google.maps.even.addListener(marker,'click',() =>{
				infowindow.setContent('<p>' + name + '</p>' + '<p>' + address + '</p>'); 
			    infowindow.open(map, marker)
			})
		} 
	}
	);
}

/*other = document.getElementById("other_places");
function search_Place(){
	const position={lat:44.9727,lng:-93.23540000000003};
	infowindow = new google.maps.infoWindow();
	map = new google.maps.Map(document.getElementById("googleMap"),{
		request.location:postion,
		zoom:14
	});
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request,(request,status) => {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
			createnewMarker(results[i]);
		}
	}
    });
}

function createnewMarker(place){
	if(!place.geometry || !place.geometry.location) return;
	const marker = new google.maps.Marker){
		map,
		position: place.geometry.location,
	});
	google.maps.event.addListener(marker, "click", () => {
		infowindow.setContent(place.name || "");
		infowindow.open(map,marker);
	});
}*/



