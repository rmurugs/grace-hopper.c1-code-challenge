
 
function  log(level,msg) {
	var dt = new Date();
	console.log(dt.toLocaleString() +'\t'+ level +'\t' + msg);
}


var  info = function(msg){
	log("INFO",msg);
}
var  error = function(msg){
	log("ERROR",msg);
}
var  debug = function(msg){
	log("DEBUG",msg);
}

module.exports.info = info;
module.exports.error = error;
module.exports.debug=debug;
