function smallpic(contactNum) {
	document.getElementById("initial").src=""
	if(contactNum==1){
		document.getElementById("thumbnail1").src="./amun.jpg"
		document.getElementById("initial").src="./amun.jpg"
	}else if(contactNum==2){
		document.getElementById("thumbnail2").src="./morrill.jpg"
		document.getElementById("initial").src="./morrill.jpg"
	}else if(contactNum==3){
		document.getElementById("thumbnail3").src="./Shepherd.jpg"
		document.getElementById("initial").src="./Shepherd.jpg"
	}else if(contactNum==4){
		document.getElementById("thumbnail4").src="./coffman.jpg"
		document.getElementById("initial").src="./coffman.jpg"
	}else if(contactNum==5){
		document.getElementById("thumbnail5").src="./keller.jpg"
		document.getElementById("initial").src="./keller.jpg"
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

