Feature: Update  measurement
	In order to correct the measurement
	I want to be able to update measurement of several metrics at a specific time

	Scenario: Update a measurement with valid input
		Given 	Valid input of measurement for the given "2015-09-01T16:00:00.000Z" and data in JSON format
		"""json
		{ "timestamp": "2015-09-01T16:00:00.000Z", 
		"temperature":27.1, 
		"dewPoint":16.7, 
		"precipitation":15.2 
		}
		"""
		When 	the data is sent thru http put method
		Then  	measurement updated successfully

