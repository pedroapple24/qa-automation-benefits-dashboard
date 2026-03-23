@api
Feature: Get Employee by ID

  Scenario: Successfully retrieve an employee by ID
    Given an employee exists in the system
    When I send a GET request with the employee ID
    Then the response status should be 200
    And the response body should match the created employee

  Scenario: [BUG-GET-006] GET with non-existent employee ID should return 404
    When I send a GET request with a non-existent employee ID
    Then the response status should be 404
