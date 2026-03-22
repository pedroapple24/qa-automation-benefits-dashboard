@api
Feature: Get All Employees

  Scenario: Successfully retrieve all employees
    Given an employee exists in the system
    When I send a GET request to retrieve all employees
    Then the response status should be 200
    And the response should return a list of employees
    And each employee should have the required fields
