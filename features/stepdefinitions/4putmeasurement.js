/**
 *  This test script for updating the existing measurement using http put method.  
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
	
	this.Given(/^Valid input of measurement for the given "([^"]*)" and data in JSON format/, function(timestamp,jsondata,callback){
		timeStampInfo = timestamp;
		data = jsondata;
		callback();
		
		
	});
	
	this.When(/^the data is sent thru http put method$/, function(callback) {
		rest.put(fullUrl + "/" + timeStampInfo)
		.headers({"Accept" :"application/json",'Content-type':"application/json"})
		.send(data)
		.end(function(response){
			status =response.status; 
			callback();
		});
	});
	this.Then(/^measurement updated successfully$/, function(callback){
		assert.equal(status,"200",callback,"Expected status 200 , Received " +status);
		callback();
	});
}