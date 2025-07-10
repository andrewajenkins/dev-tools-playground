Feature: User Login
  As a user
  I want to login to the QA Sandbox application
  So that I can access the project dashboard

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter username "testuser" and password "password123"
    And I click the login button
    Then I should be redirected to the dashboard page
    And I should see the project list

  Scenario: Login with empty credentials
    When I click the login button
    Then I should see validation errors
    And I should remain on the login page

  Scenario: Login form validation
    When I enter username "a" and password "b"
    And I click the login button
    Then I should be redirected to the dashboard page 