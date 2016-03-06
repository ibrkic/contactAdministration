$(document).ready(function() {
	var ajaxreq;
	function Contact(fname, lname, title, gender, phone, mobile, address, email, desc){							//Contact model from JSON format
		fnameCap = fname.substring(0,1).toUpperCase();
		fnameLow = fname.substring(1).toLowerCase();
		lnameCap = lname.substring(0,1).toUpperCase();
		lnameLow = lname.substring(1).toLowerCase();
		this.fname = fnameCap+fnameLow;
		this.lname = lnameCap+lnameLow;
		this.title = title;
		this.gender = gender;
		this.phone = phone;
		this.mobile = mobile;
		this.address = address;
		this.email = email;
		this.desc = desc;
	}

	$('#formaAdd').submit(function(e) {																		//Add new contact, create object
		e.preventDefault();
		var fname_val = $(".firstname").val();
		var lname_val = $(".lastname").val();
		var title_val = $(".title").val();
		var gender_val = $("input[type='radio'][name='gender']:checked").val();
		var phone_val = $(".phone").val();
		var mobile_val = $(".mobile").val();
		var address_val = $(".address").val();
		var email_val = $(".email").val();
		var desc_val = $(".description").val();

		var obj = new Contact(fname_val, lname_val, title_val, gender_val, phone_val, mobile_val, address_val, email_val, desc_val);
		objToJson(obj);
		location.assign('index.html');
	});
	
	function objToJson(objdata){																			//save Contact object to json file
		var tmp = JSON.stringify(objdata, null, 4);

		$.post("http://localhost:1337/writeJSON", {json: tmp}, function(data) {
			if(data !== "OK") alert("greska!");
		});
	}
});