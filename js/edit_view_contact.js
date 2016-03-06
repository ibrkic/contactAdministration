var id;
var contactList;
$(document).ready(function() {
	var query = window.location.search.substring(1);																			//Get contact ID to view his details from url
	var params = query.split('=');
	 id = params[1];
	
	$.get("http://localhost:1337/getJSON", function(data) {																		//Read all contacts from Json file
		contactList = data;
			if(data.hasOwnProperty('contacts') && data.contacts.length > 0){													//DO we have an array of contacts, if so, find the one that matches the ID
				for(var i=0; i<data.contacts.length;i++){
					if(i == id){
						$('.firstname').val(data.contacts[i].fname);
						$('.lastname').val(data.contacts[i].lname);
						$('.title').val(data.contacts[i].title);
						data.contacts[i].gender == 'male' ? $("#male").prop("checked", true) : $("#female").prop("checked", true);
						$('.phone').val(data.contacts[i].phone);
						$('.mobile').val(data.contacts[i].mobile);
						$('.address').val(data.contacts[i].address);
						$('.email').val(data.contacts[i].email);
						$('.description').val(data.contacts[i].desc);
					}
				}
			}else{																												//If we have only one contact in json file, thats our contact...
				$('.firstname').val(data.fname);
				$('.lastname').val(data.lname);
				$('.title').val(data.title);
				data.gender == 'male' ? $("#male").prop("checked", true) : $("#female").prop("checked", true);
				$('.phone').val(data.phone);
				$('.mobile').val(data.mobile);
				$('.address').val(data.address);
				$('.email').val(data.email);
				$('.description').val(data.desc);
			}	
	});
});

$('#formaEdit').submit(function(e) {																							//If we decide to edit our contacts information...
		e.preventDefault();
		if(contactList.hasOwnProperty('contacts')){
			contactList.contacts[id].fname = $('.firstname').val();
			contactList.contacts[id].lname = $('.lastname').val();
			contactList.contacts[id].title = $('.title').val();
			contactList.contacts[id].gender = $("input[type='radio'][name='gender']:checked").val();
			contactList.contacts[id].phone = $('.phone').val();
			contactList.contacts[id].mobile = $('.mobile').val();
			contactList.contacts[id].address = $('.address').val();
			contactList.contacts[id].email = $('.email').val();
			contactList.contacts[id].desc = $('.description').val();
		}else{
			contactList.fname = $('.firstname').val();
			contactList.lname = $('.lastname').val();
			contactList.title = $('.title').val();
			contactList.gender = $("input[type='radio'][name='gender']:checked").val();
			contactList.phone = $('.phone').val();
			contactList.mobile = $('.mobile').val();
			contactList.address = $('.address').val();
			contactList.email = $('.email').val();
			contactList.desc = $('.description').val();
		}
		var tmp = JSON.stringify(contactList, null, 4);
		$.post("http://localhost:1337/rewriteJSON", {json: tmp}, function(data) {												//Save our edited contact to json file.
			if(data !== "OK") alert("greska!");
		});
		location.assign('index.html');
});