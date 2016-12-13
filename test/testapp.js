var rest = require('unirest');


function postMetric(url){
	var fullUrl = url + "/measurements";
	var date = new Date();
	var metric = { "timestamp": date, "temperature":23.7, "dewPoint":11.6, "precipitation":112.2, "etc":1212};
	
	rest.post(fullUrl)
			.headers({"Accept" :"application/json",'Content-type':"application/json"})
			.send(metric)
			.end(function(response){
				console.log(response.body);
			});
}

postMetric("http://localhost:3000");
