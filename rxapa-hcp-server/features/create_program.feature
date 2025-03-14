@create-program
Feature: Program creation

  Scenario: Creating a new program with valid data
    Given I am logged in as a user
    When I submit a valid program creation form
    Then I should see a success message

  Scenario: Creating a program with missing required fields
    Given I am logged in as a user
    When I submit an incomplete program creation form
    Then I should see an error message indicating the missing fields
