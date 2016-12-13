Feature: Get  measurement
	I want to be able to get the measurement for a  specific time

	Scenario: Get the measurement for  valid input
		Given  	To get input time "2015-09-01T16:20:00.000Z"
		When 	the data is sent thru http get method
		Then  	measurement retrieved  successfully, temperature should be "27.5"

