/**
 * This file contains the services to process the request. It contains functions to process the request for statistics.
 * The variable stores the measurement information. It is map object where the key is timestamp and value is measurement information including the timestamp;
 * 
 */

var validator = require('./validator.js');
var logger = require('../util/logger.js');


var measurements = new Map();   // variable to hold all the measurement information.

/*
 * the function prepares the response in JSON format.
 */
function prepareResponse(status,data){
	
	var response = {};
	response = {"status":status, "data":data};
	return response
}

/*
 * The function calculates the sum
 */
function calcSum(metricName,measurement,currentVal) {
	var measurementValue =  measurement[metricName];
	if (currentVal == "") { // first time the current value will be undefined,so assign the new value to current value, so divides by 2 will give correct average
		currentVal = 0
	}
	if (!isNaN(measurementValue)) {
		var total = (parseFloat(measurementValue) + parseFloat(currentVal));
		currentVal =  (parseFloat(measurementValue) + parseFloat(currentVal));
	}
	return currentVal;
}
function calcMin(metricName,measurement,currentVal) {
	
	if (currentVal == "") {
		currentVal = 99999999; // this happens first time set maximum first one will get the minimum value 
	}
	var measurementValue =  measurement[metricName];
	if (!isNaN(measurementValue)) {
		if (parseFloat(measurementValue) < parseFloat(currentVal)  ){
			currentVal = measurementValue;
		}
	}
	return currentVal;
}
function calcMax(metricName,measurement,currentVal) {
	if (currentVal == "") {
		currentVal = -99999999; // this happens first time set prev value is minimum ,  first one will get the maximum value 
	}
	var measurementValue =  measurement[metricName];
	if (!isNaN(measurementValue)) {
		if (parseFloat(measurementValue) > parseFloat(currentVal)  ){
			currentVal = measurementValue;
		}
	}
	return currentVal;
}

module.exports ={
	
		/*
		 * Adding new measurement 
		 */
	addMeasurement :function(metric) {
		var returnValue = {};
		try {
			if (validator.validate(metric)) {
				var timeStamp = metric.timestamp;
				measurements.set(timeStamp,metric);
				returnValue = prepareResponse("OK","");
			}
			else {
				returnValue = prepareResponse("BADDATA","Invalid Request"); // can be tailored the message to send to the client 
			} 
		}
		catch (e){  // can be tailored the message to send to the client, for now, we are sending the message from error object
			logger.error(e);
			returnValue = prepareResponse("ERROR",e.message);
			
		}
		return returnValue;
	},
	
	updateMeasurement : function(timeStamp,metric){
		var returnValue = {};
		try {
			if (validator.validate(metric) && validator.isTime(timeStamp) && timeStamp == metric["timestamp"]) {
				if (measurements.has(timeStamp)){  // the metric is not available to update 
					measurements.set(timeStamp,metric);
					returnValue = prepareResponse("OK","");
				}
				else {  
					returnValue = prepareResponse("NODATA",'');
				}
			}
			else {
				if  (timeStamp != metric["timestamp"]) {
					returnValue = prepareResponse("MISMATCH",'');
				}
				else  { 
					returnValue = prepareResponse("BADDATA","Invalid Request");
				}
			}
		}
		catch (e){
			logger.error(e);
			returnValue = prepareResponse("ERROR",e.message);
		}
		return returnValue;
		
	}	,
	
	/*
	 * function to get the measurement, it returns zero, one or more than one depends on the request data.
	 */
	getMeasurement : function(arg){
		
		var returnValue = {};
		
		try {
			if (isTime(arg)) {  // get information for a timestamp
				if (measurements.has(arg)) {
					var measurement = measurements.get(arg);
					returnValue = prepareResponse("OK",measurement);
				}
				else {
					returnValue = prepareResponse("NODATA",'');
				}
			}
			else if (isDate(arg)) { // get information for a date.
			//
				var arrayOfMeasurement = [];
				
				measurements.forEach(function(value,key,map){
				
					var metricDate = key.substr(0,10);   // get the date portion from the timestamp
					if (arg == metricDate ) {
						arrayOfMeasurement.push(value);
					}
					
				})
				if (arrayOfMeasurement.length > 0) {
					returnValue = prepareResponse("OK",arrayOfMeasurement);
					}
				else {
					returnValue = prepareResponse("NODATA",'');
				}
			}
			else {
				returnValue = prepareResponse("BADDATA","Invalid Request");
			}
		}
		catch (e){
			logger.error(e);
			returnValue = prepareResponse("ERROR",e.message);
		}
		return returnValue;
		
	},
	/*
	 * updating the partial measurement information. This will replace fully the existing measurement even the existing one has complete measurement.
	 */
	updatePartial : function(timeStamp,metric){
		var returnValue = {};
		try {
			if (validator.validMetric(metric) && validator.isTime(timeStamp) && timeStamp == metric["timestamp"] ) {
				if (measurements.has(timeStamp)){
					var currentMetric = measurements.get(timeStamp);
					for (var attr in metric) { //updating the available values
						currentMetric[attr] = metric[attr];
					}
					returnValue = prepareResponse("PARTIAL","");
				}
				else{ 
					returnValue = prepareResponse("NODATA",'');
				}
				
			}
			else {
				if  (timeStamp != metric["timestamp"]) {
					returnValue = prepareResponse("MISMATCH",'');
				}
				else  { 
					returnValue = prepareResponse("BADDATA","Invalid Request");
				}
			}
		}
		catch(e) {
			logger.error(e);
			returnValue = prepareResponse("ERROR",e.message);
		}
		return returnValue;
	},

	/*
	 * deleting the existing measurement.
	 */
	deleteMeasurement : function(timeStamp){
		var returnValue = {};
		try {
			if ( validator.isTime(timeStamp) ) {
				measurements.delete(timeStamp);
				returnValue = prepareResponse("OK","");
			}
			else {
				returnValue = prepareResponse("BADDATA","Invalid Request");
			}
		}
		catch(e) {
			logger.error(e);
			returnValue = prepareResponse("ERROR",e.message);
		}
		return returnValue;
	},
	/*
	 *  The function gets the statistical information for a range of dates. It loops thru measurements to filter the data based
	 *  on the date range. It also goes thru each metric and each stat type to calculate them. The output is json object that
	 *  has one metric value and one computation type.
	 */
	getStats: function(stats,metric,startDateTime,endDateTime){
		var returnValue = {};
		try {
			stats = stats +'';  // to convert to string			
			if (validator.isTime(startDateTime) &&  validator.isTime(endDateTime) && validator.validRange(startDateTime,endDateTime) & validator.validStat(stats) ) {
				var arrayStats = [];
				var statType = stats.split(",");
				var metricList = metric.split(",");
				
				measurements.forEach(function(value,key,map){
					if ( key >= startDateTime && key < endDateTime) {
						for (statIndex in statType) {
							for (item in metricList) {
								var metricName = metricList[item];
								
								if (value[metricName] == undefined) {  // metric is not availble.
									continue;
								} 
								var statFound = false;
								var statInfo = {};
								var statValue ="" ;
								// check the json object in the array list and if so get the current computed value.
								for (i=0;i<arrayStats.length;++i) {    
									if (arrayStats[i].stat == statType[statIndex] && arrayStats[i].metric == metricList[item]) {
										statInfo = arrayStats[i];
										statFound = true;
										statValue = statInfo.value;
									}  
								}
								
								switch (statType[statIndex]) {
								case 'average':
									statValue = calcSum(metricList[item],value,statValue);
									if ( statFound ){ // counting the occurance
										statInfo.count = statInfo.count+1;
										
									}
									else {
										statInfo.count = 1;
									}
									break;
								case 'max':
									statValue = calcMax(metricList[item],value,statValue);
									break;
								case 'min':
									statValue = calcMin(metricList[item],value,statValue);
									break;
								}
								
								statInfo.metric = metricList[item];
								statInfo.stat = statType[statIndex];
								statInfo.value = statValue;
								
								
								if (!statFound) { //if statInfo is not in the array list, then add it to the array 
									arrayStats.push(statInfo);
								}
								
							}
							
						}
					}
				});
				// calculate the average
				for (var i in arrayStats ) {
					if (arrayStats[i].stat == 'average') {
						arrayStats[i].value = parseFloat(arrayStats[i].value)/parseFloat(arrayStats[i].count) + '';
						delete arrayStats[i].count;
					}
				}
				returnValue = prepareResponse("OK",arrayStats);
			}
			else {
				returnValue = prepareResponse("BADDATA","Invalid Request");
			}
		}
		catch(e) {
			logger.error(e);
			returnValue = prepareResponse("ERROR",e.message);
		}
		return returnValue;
	}
}