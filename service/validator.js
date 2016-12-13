/**
 *  The validator script contains the data validation functions that are used by the business services. 
 * 
 * 
 */
isDate = function (str) {
	
	var dt = new Date(str);
	return (Object.prototype.toString.call(dt) === "[object Date]" && str.length == 10);  
}

isTime = function(str){
	var dt = new Date(str);
	return (Object.prototype.toString.call(dt) === "[object Date]" && str.length > 10);
}

isNumber =  function(str) {
	var num = Number(str);
	return !isNaN(num);
	
}

module.exports.isDate = isDate;
module.exports.isTime = isTime;
module.exports.isNumber = isNumber;



validStat = function(statStr) {

	var statList = ['average','max','min']; // allowed statistics for reporting

	if (statStr == ""){
		return false;
	}
	statStr = statStr + '';
	var statInput = statStr.split(",");
	
	for (var index in  statInput) {
		if (statList.indexOf(statInput[index]) < 0) {
			return false;
		}
	}
	return true;
} 

module.exports.validStat = validStat;

module.exports.validate =  function (data){
/* this function checks the all the measurement attribute present in the request and also validates the value
 * for the attributes.
 */ 
	
	var valid;
	var isTimestamp = false;
	var isTemp = false;
	var isDewPoint = false;
	var isPrecip = false;
	
	for (var key in data) {
		switch (key){
			case "timestamp":
				isTimestamp = 	isTime(data[key]);
				break;
			case "temperature":
				isTemp = isNumber(data[key]);
				break;
			case "dewPoint":
				isDewPoint = isNumber(data[key]);
				break;
			case "precipitation":
				isPrecip = 	isNumber(data[key]);
				break;
			default :  // checks any custom value for the specfic devices.
				if (!isNumber(data[key])) {
					return false;
					}
				}
		
	}
	return isTimestamp && isTemp && isDewPoint && isPrecip;

}

module.exports.validMetric = function(data){

	// this function is used to validate partial date update.
	var valid;
	var hasTimestamp = false;
	for (var key in data) {
		if (key == "timestamp") {
			valid = isTime(data[key]);
			hasTimestamp = true;
		}
		else {
			valid = isNumber(data[key]);
		}
		if (valid == false){
			return false;
		}
		
	}
	return hasTimestamp;

}

validRange= function(startDt,endDt) {
	return endDt >= startDt;
}
module.exports.validRange = validRange;

