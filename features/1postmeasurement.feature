Feature: Add a measurement
	In order to have source information to examine later
	I want to be able to capture a measurement of several metrics at a specific time

	Scenario: Add a measurement with valid input
   	Given I have submitted new measurements as follows:
      | timestamp                  | temperature | dewPoint | precipitation |
      | 2015-09-01T16:00:00.000Z | 27.1        | 16.7     | 0             |
      | 2015-09-01T16:10:00.000Z | 27.3        | 16.9     | 0             |
      | 2015-09-01T16:20:00.000Z | 27.5        | 17.1     | 0             |
      | 2015-09-01T16:30:00.000Z | 27.4        | 17.3     | 0             |
      | 2015-09-01T16:40:00.000Z | 27.2        | 17.2     | 0             |
      | 2015-09-02T16:00:00.000Z | 28.1        | 18.3     | 0             |
		When 	the data is sent thru http post method
		Then  	measurement added successfully:
			| stat |
			| 200 |
			| 200 |
			| 200 |
			| 200 |
			| 200 |
			| 200 |

	
		
	

 