Feature: Update  partial measurement
	In case of issue with Raspberry 
	I want to be able to update partial measurement of measurement

	Scenario: Update partial a measurement with valid input
		Given 	Valid input of measurement for the given "2015-09-01T16:00:00.000Z" and data in partial JSON format
		"""json
		{ "timestamp": "2015-09-01T16:00:00.000Z", 
		"precipitation":12.3 
		}
		"""
		When 	the data is sent thru http patch method
		Then  	partial measurement updated  successfully status code 204
		

