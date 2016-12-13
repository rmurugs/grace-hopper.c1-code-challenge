

# grace-hopper.c1-code-challenge

The REST API captures the weather related measurement from various devices at a given point of time.

## Installtion

	npm install

## Usage

for the default host 'localhost'  and port number '3000':

	npm start

for specified host and port number:

	npm start --host <hostname> --port <portnumber>

## Test

To run the cucumber testing:

	npm test
	
The testing connects to the 'localhost' and port number '3000'. To change the host and port number, please change the information in the ./feaures/stepdefinitions/config.js 
file.
	

## Note


The limited number of scenarios are added in the cucumber testing.
  
The hooks are not added when run the test scenarios. So the server needs to be restarted manually.

To run the each feature separately,  the "Add a measurement" feature has to run first. 

The application is built on Windows machine.




 