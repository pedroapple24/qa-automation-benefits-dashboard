@api
Feature: Create Employee

  Scenario: Successfully create a new employee
    Given I have valid employee data
    When I send a POST request to create the employee
    Then the response status should be 200
    And the response body should contain the employee firstName and lastName
    And the response body should contain the employee dependants and salary
    And the response should include calculated fields gross benefitsCost and net

  Scenario Outline: Net Pay is calculated correctly based on business rules
    Given I have valid employee data with <dependants> dependants
    When I send a POST request to create the employee
    Then the response status should be 200
    And the response gross pay should be "<grossPay>"
    And the response benefits cost should be "<benefitsCost>"
    And the response net pay should be "<netPay>"

    Examples:
      | dependants | grossPay | benefitsCost | netPay  |
      | 0          | 2000.00  | 38.46        | 1961.54 |
      | 1          | 2000.00  | 57.69        | 1942.31 |
      | 2          | 2000.00  | 76.92        | 1923.08 |


