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
