var contactList;																											//List of contacts saved inside json file.
$(document).ready(function() {
	var novoList =[];
	$.get("http://localhost:1337/getJSON", function(data) {																	//Get all existing json data
		contactList = data;
		if(data){																											//check if there is any data in json file or is it empty													
			if(data.hasOwnProperty('contacts') && data.contacts.length > 0){												//Check if existing json data is array (do we have multiple contacts in json file)
				for(var i=0; i<data.contacts.length;i++){																	//If so, we populate a list with all of our contacts
					$("#contactList").append('<input type="checkbox" name="contact" value="'+i+'" class="checkDelete">');
					$("#contactList").append('<li id="contact_'+i+'">'+data.contacts[i].lname+'&nbsp'+data.contacts[i].fname+'</li>');
					$("#contactList").append('<input type="button" name="'+i+'" value="Edit/View Details" class="button editButton"><br/>');
				}
			}else if(data.hasOwnProperty('contacts') && data.contacts.length == 0){											//If we have empty contacts array (user deleted all of the contacts) then we have nothing to show,
				$('.buttonDel').css('visibility', 'hidden');																//and we also hide sort and delete contacts buttons.
				$('.buttonSortAsc').css('visibility', 'hidden');
				$('.buttonSortDsc').css('visibility', 'hidden');
				return;																										//Stop further execution. We have no contacts to show and we also hid buttons.
			}else{																											//We have only one Json object inside json file (one contact - not array of contacts.),
				$("#contactList").append('<input type="checkbox" name="contact" value="0" class="checkDelete">');			//so we only output that single contact
				$("#contactList").append('<li id="contact_0">'+data.lname+'&nbsp'+data.fname+'</li>');
				$("#contactList").append('<input type="button" name="0" value="Edit/View details" class="button editButton"><br/>');
				console.log("ovo je u fileu[nije_niz]: ", data);
			}
			$('.buttonSortAsc').css('visibility', 'visible');
			$('.buttonSortDsc').css('visibility', 'visible');
			$('.buttonDel').css('visibility', 'visible');
		}else{																												//Json file is empty
			$('.buttonSortAsc').css('visibility', 'hidden');
			$('.buttonSortDsc').css('visibility', 'hidden');
			$('.buttonDel').css('visibility', 'hidden');
		}
	});
	
	$(".buttonDel").click(function(){																						//Delete contacts checked with checkbox
		var confirmation = confirm("Are you sure you want to delete selected contacts?");
		if(!confirmation) return;
		var checkedValues = $('.checkDelete:checked').map(function() {
			return this.value;
		}).get();
		checkedValues.sort(function(a, b){return a-b});
		if(contactList.hasOwnProperty('contacts')){																			//If we have a list of contacts, we check checked checkbox ID with contact array indexes
			for(var i=contactList.contacts.length - 1; i>=0; i--){															//If we get a match, thats the contact to delete, so we remove it from an array.
				for(var j=0; j<checkedValues.length; j++){
				if(i === parseInt(checkedValues[j])){
					contactList.contacts.splice(i,1);
				}
			}
			}
		}else if(checkedValues.length > 0){																					//If there is only one contact in the list (not an array), and checkbox is checked, delete it.
				contactList="";
		}
		var tmp = JSON.stringify(contactList, null, 4);																		//Write this new data to json file.
		$.post("http://localhost:1337/rewriteJSON", {json: tmp}, function(data) {
			if(data !== "OK") alert("greska!");
		});
		location.reload();																									//Refresh page
	});
	
});	

$("body").on('DOMNodeInserted','.editButton',function(){																	//Open edit contact page, and pass array index of that contact so we know which contact to load.
		$('.editButton').click(function(){ 
            location.assign('edit_view_contact.html?id='+$(this).attr('name'));
        });
});

$(".buttonSortAsc").click(function(){																						//Sort ascending
	sortAlphabetically(contactList, "asc");
});
$(".buttonSortDsc").click(function(){																						//Sort descending
	sortAlphabetically(contactList, "dsc");
});
$(".searchButton").click(function(){																						//Search contacts in the list
	var filteredContacts = [];
	var keywords =[];
	var temp = $("#searchField").val().trim().toLowerCase();																//Get text written in search bar, trim it, make it all lowercase.
	if(!(temp) || temp==""){																								//If we submit empty search bar, nothing happens. We keep sort buttons visible.
		$('.buttonSortAsc').css('visibility', 'visible');
		$('.buttonSortDsc').css('visibility', 'visible');
		return;
	}
	if(temp.indexOf(" ") > -1){																								//If we have multiple words in search bar, extract every word
		keywords = temp.split(" ");
	}else{
		keywords.push(temp);																								//There is only one word written in search bar
	}
	
	if(contactList.hasOwnProperty('contacts') && contactList.contacts.length > 0){											//If we have an array od contacts
		
		$("#contactList").empty();																							//Do not display all contacts (we will display only the ones that match the search)
		for(var i=0; i<contactList.contacts.length;i++){
			for(var j=0; j<keywords.length; j++){																			//Iterate and compare first name and last name of every contact with words from search bar (all lowercase)
				if(contactList.contacts[i].fname.toLowerCase().indexOf(keywords[j]) > -1 || contactList.contacts[i].lname.toLowerCase().indexOf(keywords[j]) > -1){		//If we have a match, display that contact in a list
					$("#contactList").append('<input type="checkbox" name="contact" value="'+i+'" class="checkDelete">');
					$("#contactList").append('<li id="contact_'+i+'">'+contactList.contacts[i].lname+'&nbsp'+contactList.contacts[i].fname+'</li>');
					$("#contactList").append('<input type="button" name="'+i+'" value="Edit/View Details" class="button editButton"><br/>');
					$('.buttonSortAsc').css('visibility', 'hidden');														//I hide sort buttons from searched contacts because it would overwrite all of the existing contacts with those that match the search.
					$('.buttonSortDsc').css('visibility', 'hidden');
				}
			}
		}
	}else{																													//If I have only one contact just display it, there is no point in searching anything...
		return;
	}
});

function sortAlphabetically(contactArray, flag){																			//Function that contains logic for sorting contacts
	if(contactArray.hasOwnProperty('contacts') && contactArray.contacts.length > 0){										//Check if we have a list of contacts
		if(flag === "asc"){																									//We chose to sort contacts ascending
		contactArray.contacts.sort(function(a,b){																			//Simple JS function that sorts 2D array, first by first_name then by last_name
			if (a.lname == b.lname)
				return a.fname < b.fname ? -1 : 1;
			return a.lname < b.lname ? -1 : 1;
		});
		} else{																												//We chose to sort contacts descending
			contactArray.contacts.sort(function(a,b){
			if (a.lname == b.lname)
				return a.fname < b.fname ? 1 : -1;
			return a.lname < b.lname ? 1 : -1;
		});
		}
		var tmp = JSON.stringify(contactArray, null, 4);																	//Write this sorted array to json file.
		$.post("http://localhost:1337/rewriteJSON", {json: tmp}, function(data) {
			if(data !== "OK") alert("greska!");
		});
		location.reload();																									//Reload page, so contacts get read from json file
	}else{																													//If we have only one contacts, no need for sorting
		return;
	}
}