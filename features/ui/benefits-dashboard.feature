@ui
Feature: Paylocity Benefits Dashboard UI

  Background:
    Given I navigate to the Paylocity login page

  Scenario: Successful login to the Benefits Dashboard
    When I enter valid credentials
    And I click the Log In button
    Then I should see the Paylocity Benefits Dashboard title and the URL should contain "/Prod/Benefits"

  Scenario: Benefits Dashboard table displays all required columns
    When I enter valid credentials
    And I click the Log In button
    Then the dashboard table should display all required columns

  Scenario: Benefits Dashboard Add Employee button is visible
    When I enter valid credentials
    And I click the Log In button
    Then the Add Employee button should be visible

  Scenario: Login fails when no credentials are provided
    When I click the Log In button
    Then I should see validation errors for missing credentials

  Scenario: Successfully log out and validate login page is shown
    When I enter valid credentials
    And I click the Log In button
    And I log out of the application
    Then the url should contain "Account/LogIn"

  Scenario: [BUG-UI-001] Dashboard should not be accessible without authentication
    When I enter valid credentials
    And I click the Log In button
    And I log out of the application
    And I go back in the browser
    Then the url should contain "Account/LogIn"

  Scenario: [BUG-UI-Dash-002] Unrealistic dependants count should trigger a validation warning
    When I enter valid credentials
    And I click the Log In button
    And I click the Add Employee button
    And I fill in the Add Employee form with 28 dependants
    Then a validation warning should be shown for the dependants field
