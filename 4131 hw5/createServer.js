
const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

const port = 9001;
http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if(req.url === '/'){
    indexPage(req,res);
  }
  else if(req.url === '/index.html'){
    indexPage(req,res);
  }
  else if(req.url === '/contacts.html'){
	  contactsPage(req, res);
  }
  else if(req.url === '/stock.html'){
	  stockPage(req, res);
  }
  else if(req.url === '/addContact.html'){
	  addContactPage(req, res);
  }
  else if(req.url === '/getcontacts'){
	contactsjson(req, res);
  }
  else if(req.url === '/postContactEntry'){
	var reqBody = '';// server starts receiving the form data
	req.on('data', function(data) {
		reqBody += data;
	});// server has received all the form data
	
	req.on('end', function() {
		addContact(req, res, reqBody);
	});
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end("404 Not Found");
  }
}).listen(port);


function indexPage(req, res) {
  fs.readFile('client/index.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function contactsPage(req, res){
	fs.readFile('client/contacts.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function stockPage(req, res){
	fs.readFile('client/stock.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function addContactPage(req, res){
	fs.readFile('client/addContact.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
  
function contactsjson(req, res) {
  fs.readFile('contacts.json', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.write(html);
    res.end();
  });
}

function addContact(req, res, reqBody) {
	var postObj = qs.parse(reqBody);
	var name = postObj.name;
	var category = postObj.category;
	var location = postObj.location;
	var contact = postObj.contact;
	var email = postObj.email;
	var website_name = postObj.website_name;
	var website_url = postObj.website_url;
	
	var jsonObj={};
	jsonObj["name"] = name;
	jsonObj["category"] = category;
	jsonObj["location"] = location;
	jsonObj["contact"] = contact;
	jsonObj["email"] = email;
	jsonObj["website_name"] = website_name;
	jsonObj["website_url"] = website_url;
	
	//Read in the contacts.jsonfile, store in variable named (fileJsonString)
	fs.readFile('contacts.json', function(err, fileJsonString) {
    if(err) {
      throw err;
    }
    var fileJson = JSON.parse(fileJsonString);// objectify the string
    
    //next, appendjsonObj onto end of array in fileJson
    fileJson['contacts'].push(jsonObj);
    
    //stringify fileJson intofileJsonString
    var outstring = JSON.stringify(fileJson)
    fs.writeFile('contacts.json', outstring, function(err, fileJsonString) {
    if(err) {
		throw err;
		}
    }); 
     
    //redirect
    res.writeHead(302,{
		'Location':'/contacts.html'
		});
	res.end();
	});
}

