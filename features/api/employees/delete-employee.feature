@api
Feature: Delete Employee

  Scenario: Successfully delete an employee
    Given an employee exists in the system
    When I send a DELETE request with the employee ID
    Then the response status should be 200
