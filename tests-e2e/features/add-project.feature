Feature: Add New Project
  As a user
  I want to add new projects to the system
  So that I can track additional project information

  Background:
    Given I am logged in to the application
    And I am on the add project page

  Scenario: Successfully add a new project
    When I enter project name "Test Project Alpha"
    And I select status "On Track"
    And I enter lead name "John Doe"
    And I click the create project button
    Then I should see a success message
    And I should be redirected to the dashboard page
    And I should see the new project in the project list

  Scenario: Form validation for required fields
    When I click the create project button
    Then I should see validation errors for required fields
    And I should remain on the add project page

  Scenario: Form validation for minimum length
    When I enter project name "AB"
    And I enter lead name "X"
    And I click the create project button
    Then I should see validation errors for minimum length
    And I should remain on the add project page

  Scenario: Cancel adding project
    When I click the cancel button
    Then I should be redirected to the dashboard page
    And no new project should be created 