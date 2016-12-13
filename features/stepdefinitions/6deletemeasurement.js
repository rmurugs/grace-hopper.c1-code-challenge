/**
 *  This test script for deleting the existing partial measurement using http delete method.  This test script will run at the end, so we can 
 *  verify update and stat API.
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
	var timeStampInfo = ""
	
	this.Given(/^Valid input time "([^"]*)"$/, function(timestamp,callback){
		timeStampInfo = timestamp;
		callback();
		
		
	});
	
	this.When(/^the data is sent thru http delete method$/, function(callback) {
		
		rest.delete(fullUrl + "/" + timeStampInfo)
		.headers({"Accept" :"application/json",'Content-type':"application/json"})
		.send()
		.end(function(response){
			status =response.status; 
			callback();
		});
	});
	this.Then(/^measurement deleted successfully$/, function(callback){
		assert.equal(status,"200",callback,"Expected status 200 , Received " +status);
		callback();
	});
}