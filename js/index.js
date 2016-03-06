/*
cd c:\Program Files (x86)\Ampps\www\respons\js
*/


var express = require('express'),														//Initialize nodejs framework
   bodyParser = require('body-parser'),
   fs = require('fs'),
   app = express();
   
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(1337);

app.all('*', function(req, res, next) {													//Required beacause we use port to transfer data (different domain) - CORS
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});

app.post('/writeJSON', function (req, res) {											//Write to json file.
	
   if (!req.body.json) return res.status(400).end('Bad request');
   var oldData = fs.readFileSync('savedData.json', 'utf8');								//get current json data from file (existing contacts)
   if(oldData.length > 2){																//check if there is any json already written in file (if there is then append new data to it) - new data is new contact user adds to his list.
		if(oldData.indexOf('contacts') > -1 && oldData.indexOf('[]') == -1){			//Check if existing json data in json file is array and is not empty. Then we append new contact to that array
			oldData = oldData.replace("]}","");
			
			oldData = oldData.replace("]\n}","");
			oldData = oldData +", ";
			fs.writeFile('savedData.json', oldData+req.body.json+"]}", function (err) {			// write old JSON data (alredy existing contacts) + new Json data (newly added contact) to file
       if (err) res.status(500).end('Server error');

       res.status(200).end('OK');
   
   });
		}else if(oldData.indexOf('[]') > -1){													//If user erases all contacts from JSON file, he gets an empty JSON array in file. This is easily checked by looking for [] in JSON file
			fs.writeFile('savedData.json', req.body.json, function (err) {						//If we do have an empty array in JSON file we simply overwrite it with new JSON data
       if (err) res.status(500).end('Server error');

       res.status(200).end('OK');
   
   });
		}else{																					//If we have only one user in JSON file, then it is written as JSON object, not as json array,
			oldData = '{"contacts":['+oldData+", ";												//so by adding a new user to it, we want to convert it to json array.
			fs.writeFile('savedData.json', oldData+req.body.json+"]}", function (err) {
       if (err) res.status(500).end('Server error');

       res.status(200).end('OK');
   
   });
		}
   
}else{																					//If there is no old json data in file, we dont have to append new data to it. We simply write new data to a file.
	fs.writeFile('savedData.json', req.body.json, function (err) {
       if (err) res.status(500).end('Server error');

       res.status(200).end('OK');
   
   });
}
});

app.post('/rewriteJSON', function (req, res) {										//Completely rewrite all existing data in json file with new data.
	if (!req.body.json) return res.status(400).end('Bad request');
	fs.writeFile('savedData.json', req.body.json, function (err) {
       if (err) res.status(500).end('Server error');
       res.status(200).end('OK');
   });
});

app.get('/getJSON', function (req, res) {												// Read json file
   res.setHeader('content-type', 'application/json');
   fs.createReadStream('./savedData.json').pipe(res);
});