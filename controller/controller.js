/**
 *  The controller receives the request, invokes the business services and returns the response to the client. The controller processes the response 
 *  from the business services and set the appropriate status code to client. 
 */
var weather = require("../service/weather.js")
var logger = require('../util/logger.js');

// This is mapping for the endpoint and corresponding actions.
var weatherActions = [
                     {
                    	 "method": "GET",
                    	 "path" : "/measurements",
                    	 "action": function(req) {
                    		 dateTime = req.params.date;
                    		 return weather.getMeasurement(dateTime);
                    	 }
                    	 
                    	 
                     },
                     
                     {
                    	 "method": "POST",
                    	 "path" : "/measurements",
                    	 "action": function(req) {
                    		 return weather.addMeasurement(req.body);
                    	 }
                    	 
                    	 
                     },
                     
                     {
                    	 "method": "PUT",
                    	 "path" : "/measurements",
                    	 "action": function(req) {
                    		 dateTime = req.params.timestamp;
                    		 return weather.updateMeasurement(dateTime,req.body);
                    	 }
                    	 
                    	 
                     },
                     
                     {
                    	 "method": "PATCH",
                    	 "path" : "/measurements",
                    	 "action": function(req) {
                    		 dateTime = req.params.timestamp;
                    		 return weather.updatePartial(dateTime,req.body);
                    	 }
                    	 
                    	 
                     },
                     {
                    	 "method": "DELETE",
                    	 "path" : "/measurements",
                    	 "action": function(req) {
                    		 dateTime = req.params.timestamp;
                    		 return weather.deleteMeasurement(dateTime);
                    	 }
                    	 
                     } ,
                     {
                    	 "method": "GET",
                    	 "path" : "/stats",
                    	 "action": function(req) {
                    		 var statList = req.query.stat;
                    		 var metricList = req.query.metric;
                    		 var fromDateTime = req.query.fromDateTime;
                    		 var toDateTime = req.query.toDateTime;
                    		 return weather.getStats(statList,metricList,fromDateTime,toDateTime);
                    	 }
                     }
                     ]


module.exports =  {
	
	/*
	 *  It receives the requests and finds out the corresponding the actions. It then invokes the action 
	 *  to process the request.  
	 */
	handleRequest : function(req,resp) {
		var method = req.method;
		var path = req.path.trim();
		var model = null;
		logger.info("Request for endpoint " + path + ", Method is " + method);
		for (var i=0;i<weatherActions.length; ++i) {  // looping the mapper to get the action.
			var actionConfig = weatherActions[i];
			if (actionConfig.method == method && path.startsWith(actionConfig.path)){
				model = actionConfig.action;
				break;
			}
		}
		if (model == null) { // endpoint does not exists 
			logger.error("Response for endpoint " + path + ", Method " + method + " is 404");
			resp.status(404).send("");
		}
		else {
			var response = model(req,resp);
			// process the status from the business service and set appropriate the status and response.
			switch (response.status) {
				case  "OK": 
					logger.info("Successful response for endpoint " + path + ", Method " + method );
					resp.status(200).send(response.data);
					break;
				case "BADDATA":
					logger.error("Invalid data  for endpoint " + path + ", Method " + method );
					resp.status(400).send(response.data);
					break;
				case "NODATA":
					logger.error("No data  for endpoint " + path + ", Method " + method );
					resp.status(404).send("");
					break;
				case "MISMATCH":
					logger.error("Mismatch data  for endpoint " + path + ", Method " + method );
					resp.status(409).send("");
					break;
				case "PARTIAL":
					logger.info("Partial update for endpoint " + path + ", Method " + method );
					resp.status(204).send(response.data);
					break;
				default:
					logger.error("Invalid error for endpoint " + path + ", Method " + method );
					resp.status(500).send(response.data);
				
			}
			
		}	
	}

	
};
