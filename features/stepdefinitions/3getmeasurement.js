/**
 *  This test script for getting the  measurement for a given date or time using http get method. Few test scenarios are added. 
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
	var timeStamp = "";
	

    this.Given(/^To get input time "([^"]*)"$/, function (time, callback) {
    	timeStamp = time;
    	callback();
    });

    this.When(/^the data is sent thru http get method$/, function (callback)
{
    	rest.get(fullUrl + "/" + timeStamp)
		.headers({"Accept" :"application/json",'Content-type':"application/json"})
		.send()
		.end(function(response){
			data =response.body; 
			callback();
		});
    });


    this.Then(/^measurement retrieved  successfully, temperature should be "([^"]*)"$/, function (temp, callback) {
    	assert.equal(data.temperature,temp,callback,"Expected temperature " + temp + " , Received " +data.temperature);
    	callback();
    });


	   
   
}