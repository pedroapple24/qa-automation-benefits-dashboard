@ui
Feature: Add Employee Modal

  Background:
    Given I navigate to the Paylocity login page
    And I enter valid credentials
    And I click the Log In button

  Scenario: Add Employee modal displays all required elements
    When I click the Add Employee button
    Then the Add Employee modal should display all required elements

  Scenario: Successfully create an employee
    When I click the Add Employee button
    And I fill in the Add Employee form with factory-generated data
    Then the new employee should appear in the dashboard table

  Scenario Outline: Net Pay is calculated correctly based on business rules
    When I click the Add Employee button
    And I fill in the Add Employee form with <dependants> dependants
    Then the employee row should show Gross Pay "<grossPay>", Benefits Cost "<benefitsCost>", and Net Pay "<netPay>"

    Examples:
      | dependants | grossPay | benefitsCost | netPay  |
      | 0          | 2000.00  | 38.46        | 1961.54 |
      | 1          | 2000.00  | 57.69        | 1942.31 |
      | 2          | 2000.00  | 76.92        | 1923.08 |

  Scenario: Edit an existing employee and validate updated info is shown
    When I click the Add Employee button
    And I fill in the Add Employee form with factory-generated data
    And the new employee should appear in the dashboard table
    When I click the edit button for the created employee
    And I update the employee with new factory-generated data
    Then the updated employee info should appear in the dashboard table

  Scenario: Delete an existing employee and validate it is removed from the table
    When I click the Add Employee button
    And I fill in the Add Employee form with factory-generated data
    And the new employee should appear in the dashboard table
    When I click the delete button for the created employee
    And I confirm the delete
    Then the employee should no longer appear in the dashboard table



