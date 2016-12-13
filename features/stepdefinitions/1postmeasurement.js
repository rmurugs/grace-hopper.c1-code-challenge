/**
 * This test script for adding new measurement using http post method. Few test scenarios are added. 
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
	var data = [];
	
	this.Given(/^I have submitted new measurements as follows:$/, function(dataTable,callback){
		dataList = dataTable.hashes();
		for (var i=0;i<dataList.length;++i){
			var measurement  = {"timestamp":dataList[i].timestamp,
					"temperature":dataList[i].temperature,
					"dewPoint":dataList[i].dewPoint,
					"precipitation":dataList[i].precipitation};
			data.push(measurement);
			
		}
		callback();
		
		
		
		
		
	});
	this.When(/^the data is sent thru http post method$/, function(callback) {
		
		for (var i in data) {
			rest.post(fullUrl)
			.headers({"Accept" :"application/json",'Content-type':"application/json"})
			.send(data[i])
			.end(function(response){
				status =response.status; 
				callback();
			});
		}
	});
	this.Then(/^measurement added successfully:$/, function(dataTable,callback){
		assert.equal(status,"200",callback,"Expected status 200 , Received " +status);
		callback();
	});
	
   
}