
function checkPassword() {
	var password = document.getElementById("password").value;
    var strength = 0;
    if (password.length < 8)
    {
        document.getElementById("result").innerHTML="Short";
        document.getElementById("result").className="short";
    }else{
    // contains more than 7 characters
    if (password.length > 7)
    {
        strength += 1;
    }
    // contains upper and lower case values
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) 
    {
        strength += 1;
    }
    // contains a special character
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))
    {
        strength += 1;
    }
    // contains 2 special characters
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/))
    {
        strength += 1;
    }
    if (strength < 2)
    {
        document.getElementById("result").innerHTML="Weak";
        document.getElementById("result").className="weak";
    }
    else if (strength == 2)
    {
        document.getElementById("result").innerHTML="Good";
        document.getElementById("result").className="good";
    }
    else
    {
        document.getElementById("result").innerHTML="Strong";
        document.getElementById("result").className="strong";
    }
}
}
