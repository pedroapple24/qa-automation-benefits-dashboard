@api
Feature: Update Employee

  Scenario: Successfully update an existing employee salary and dependants
    Given an employee exists in the system
    When I send a PUT request with updated salary 5200 and dependants 6
    Then the response status should be 200
    And the response body should reflect the updated salary and dependants
    And the response should include calculated fields gross benefitsCost and net

  Scenario: [BUG-PUT-001] PUT should not accept custom salary to alter gross calculation
    Given an employee exists in the system
    When I send a PUT request with updated salary 50000 and dependants 0
    Then the response gross pay should be "2000.00"

  Scenario: [BUG-PUT-002] PUT should reject placeholder username "string"
    Given an employee exists in the system
    When I send a PUT request with username "string"
    Then the response status should be 400

  Scenario: [BUG-PUT-003] PUT with non-existent id should return 404 not create a new record
    When I send a PUT request with a non-existent employee id
    Then the response status should be 404
