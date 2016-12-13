Feature: Delete  measurement
	I want to be able to delete the incorrect or invalid  measurement for a specific time

	Scenario: Update a measurement with valid input
		Given  	Valid input time "2015-09-01T16:30:00.000Z"
		When 	the data is sent thru http delete method
		Then  	measurement deleted successfully

