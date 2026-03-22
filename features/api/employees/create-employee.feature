@api
Feature: Create Employee

  Scenario: Successfully create a new employee
    Given I have valid employee data
    When I send a POST request to create the employee
    Then the response status should be 200
    And the response body should contain the employee firstName and lastName
    And the response body should contain the employee dependants and salary
    And the response should include calculated fields gross benefitsCost and net
