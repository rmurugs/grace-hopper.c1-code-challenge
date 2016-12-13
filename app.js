/**
 * New node file
 */
var server = require('./router/endpoint.js');
var host = "localhost";
var port = 3000;
if (process.argv.length != 4) {
	console.log("Usage: npm start --host <host> --port <port>" )
	console.log("host and port are not passed, so default host is localhost and port is 3000");
}
else {
	var host = process.argv[2];
	var port = process.argv[3];
	
}

startServer(host,port);

