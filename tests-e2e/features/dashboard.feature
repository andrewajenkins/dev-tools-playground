Feature: Project Dashboard
  As a user
  I want to view and manage projects on the dashboard
  So that I can track project status and information

  Background:
    Given I am logged in to the application
    And I am on the dashboard page

  Scenario: View project list
    Then I should see the project table
    And I should see project data loaded
    And I should see pagination controls

  Scenario: Search and filter projects
    When I enter "test" in the search filter
    Then I should see filtered project results
    And I should see projects matching the search term

  Scenario: Navigate to add project page
    When I click the "Add Project" button
    Then I should be redirected to the add project page

  @flaky
  Scenario: Verify exact project count on first page
    # INTENTIONAL FLAKY TEST: This test checks exact count which may vary due to API delays
    Then I should see exactly 20 projects on the first page
    And the project count should be stable across refreshes

  Scenario: Dynamic button ID testing
    # This scenario tests the intentional UI flaw (dynamic button ID)
    Then I should see the "Add Project" button with a dynamic ID
    And the button ID should contain "add-project-btn-"
    And the button should be clickable regardless of ID changes 