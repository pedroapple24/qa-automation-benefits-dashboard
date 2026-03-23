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

  Scenario: [BUG-POST-001] POST should not silently override client-provided id
    Given I have valid employee data with a custom id
    When I send a POST request to create the employee
    Then the response id should match the submitted id

  Scenario: [BUG-POST-003] POST should not silently override client-provided salary
    Given I have valid employee data with salary 75000
    When I send a POST request to create the employee
    Then the response salary should be 75000

  Scenario: [BUG-POST-004] POST should reject a past expiration date
    Given I have valid employee data with a past expiration date
    When I send a POST request to create the employee
    Then the response status should be 400

  Scenario: [BUG-POST-005] POST should reject a single character lastName
    Given I have valid employee data with lastName "M"
    When I send a POST request to create the employee
    Then the response status should be 400

  Scenario: [BUG-POST-006] Second POST with identical data should return 409
    Given I have valid employee data
    When I send a POST request to create the employee
    And I send a second POST request with the same employee data
    Then the second response status should be 409


