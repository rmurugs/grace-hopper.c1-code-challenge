/**
 * All the endpoints are defined here. The express libraries are used to listen the port and process all the requests.  The body-parser lib is
 * used to json object in the request body.
 */


var express = require('express');
var bodyParser = require('body-parser')
var app  = new express();
var logger = require('../util/logger.js');
		
	
startServer = function(host,port) {
	
	
	//controller object will handle all requests and takes appropriate action on those request.	
	var controller = require('../controller/controller.js');
	
	
	app.use(bodyParser.json());
	
	// interceptor for all the request.
	app.all('*', function (req, res, next) {
		  logger.info('Interceptor code to handle security and others....');
		  next() 
	});
	
	// ===== EndPoints declarations start===================
	app.post("/measurements",function(req,resp){
		controller.handleRequest(req,resp);
	});
	
	app.put("/measurements/:timestamp", function(req,resp){
		controller.handleRequest(req,resp);
	});
	app.patch("/measurements/:timestamp", function(req,resp){
		controller.handleRequest(req,resp);
	});
	app.get("/measurements/:date", function(req,resp){
		controller.handleRequest(req,resp);
	});
	
	app.delete("/measurements/:timestamp", function(req,resp){
		controller.handleRequest(req,resp);
	});
	app.get("/stats", function(req,resp){
		controller.handleRequest(req,resp);
	});
	
	// 
	app.listen(port,host,function() {
		logger.info("Listening the port "+ port);
	});
	

	
}
stopServer  = function(){
	
	app.close();
	logger.info('Server stopped....');
}
module.export = { startServer : startServer,
				  stopServer : stopServer};

