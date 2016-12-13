/**
 *  This test script for updating the existing partial measurement using http patch method.  
 */
var assert = require('cucumber-assert');
var rest = require('unirest');
var config = require('./config.js');

var host = config.hostServer
var port = config.portNum;


module.exports = function() {
	
	var url = "http://"+ host + ":" + port
	var fullUrl = url + "/measurements";
	var status = "";
	var data = "";
	var timeStampInfo = ""
	
	this.Given(/^Valid input of measurement for the given "([^"]*)" and data in partial JSON format/, function(timestamp,jsondata,callback){
		timeStampInfo = timestamp;
		data = jsondata;
		callback();
		
		
	});
	
	this.When(/^the data is sent thru http patch method$/, function(callback) {
		
		rest.patch(fullUrl + "/" + timeStampInfo)
		.headers({"Accept" :"application/json",'Content-type':"application/json"})
		.send(data)
		.end(function(response){
			status =response.status; 
			callback();
		});
	});
	this.Then(/^partial measurement updated  successfully status code (\d+)$/, function(arg,callback){
		assert.equal(status,arg,callback,"Expected status 204 , Received " +status);
		callback();
	});
}