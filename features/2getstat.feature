Feature: Get measurement statistics
  In order to understand trends of measurements
  I want to be able to get statistics over specified periods of time

Scenario: Get stats for a well-reported metric
    Given I get stats with parameters:
      | param        | value                    |
      | stat         | min                      |
      | stat         | max                      |
      | stat         | average                  |
      | metric       | temperature              |
      | fromDateTime | 2015-09-01T16:00:00.000Z |
      | toDateTime   | 2015-09-01T17:00:00.000Z |
    When I get the stats using http  
    Then the response has a status code of 200
    And the response body is an array of:
      | metric        | stat      | value |
      | temperature | min     | 27.1  |
      | temperature | max     | 27.5  |
      | temperature | average | 27.3  |
