@api
Feature: Get All Employees

  Scenario: Successfully retrieve all employees
    Given an employee exists in the system
    When I send a GET request to retrieve all employees
    Then the response status should be 200
    And the response should return a list of employees
    And each employee should have the required fields

  Scenario: [BUG-GET-002] Response should not expose username in employee records
    Given an employee exists in the system
    When I send a GET request to retrieve all employees
    Then no employee record should contain a username field

  Scenario: [BUG-GET-003] Response should not expose expiration in employee records
    Given an employee exists in the system
    When I send a GET request to retrieve all employees
    Then no employee record should contain an expiration field

  Scenario: [BUG-GET-004] Monetary fields should have at most 2 decimal places
    Given an employee exists in the system
    When I send a GET request to retrieve all employees
    Then benefitsCost and net should have at most 2 decimal places
