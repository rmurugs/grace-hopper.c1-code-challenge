var assert = require('cucumber-assert');
var rest = require('unirest');
var config = require('./config.js');

var host = config.hostServer
var port = config.portNum;

module.exports = function() {

	var url = "http://"+ host + ":" + port
	var fullUrl = url + "/stats";
	var queryParam ="";
	var status = "";
	var data  = "";
	
	this.Given(/^I get stats with parameters:$/, function(dataTable,callback){
		dataList = dataTable.hashes();
		var queryStr =""
		for (var i=0;i<dataList.length;++i){
			queryStr = queryStr + dataList[i].param + "=" + dataList[i].value +"&";
		}
		queryParam=queryStr;
		callback();
	});
	
       this.When(/^I get the stats using http$/, function (callback) {
    	   rest.get(fullUrl + "?" + queryParam)
   			.headers({"Accept" :"application/json",'Content-type':"application/json"})
   			.send(data)
   			.end(function(response){
   				status =response.status;
   				data = response.body;
   			callback();
   			});
         
       });


       this.Then(/^the response has a status code of (\d+)$/, function (arg1, callback) {
    	  assert.equal(status,"200",callback,"Expected status 200 , Received " +status);
         callback();
       });


       this.Then(/^the response body is an array of:$/, function (table, callback) {
    	 assert.deepEqual(data,table.hashes(),callback,"Array are not matching");  
         callback();
       });
}