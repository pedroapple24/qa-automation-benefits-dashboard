@api
Feature: Update Employee

  Scenario: Successfully update an existing employee salary and dependants
    Given an employee exists in the system
    When I send a PUT request with updated salary 5200 and dependants 6
    Then the response status should be 200
    And the response body should reflect the updated salary and dependants
    And the response should include calculated fields gross benefitsCost and net
