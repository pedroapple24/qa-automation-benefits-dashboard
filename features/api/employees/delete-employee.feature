@api
Feature: Delete Employee

  Scenario: Successfully delete an employee
    Given an employee exists in the system
    When I send a DELETE request with the employee ID
    Then the response status should be 200

  Scenario: [BUG-DELETE-001] DELETE with non-existent employee ID should return 404
    When I send a DELETE request with a non-existent employee ID
    Then the response status should be 404
