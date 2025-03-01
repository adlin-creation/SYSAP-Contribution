Feature: Create Exercise
    As a health care professional, I want to create an exercise
    that can be used by my patients.

    Background: Application is Running
        Given The server application is running

    Scenario: Create a non-exisitng exercise
        When I request to create an exercise named sit-up
        Then The number of exercises in the database increases by 1
        And A sit-up exercise exists in the database.

    Scenario: Create an existing exercise
        Given A sit-up exercise exists in the database
        When I request to create another exercise named sit-up
        Then The number of exercises in the database does not change.
        And A sit-up exercise exists in the database.
