@api
Feature: Get Employee by ID

  Scenario: Successfully retrieve an employee by ID
    Given an employee exists in the system
    When I send a GET request with the employee ID
    Then the response status should be 200
    And the response body should match the created employee
