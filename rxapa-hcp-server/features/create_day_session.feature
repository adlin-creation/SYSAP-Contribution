Feature: Create Exercise
    As a health care professional, I want to create an exercise day
    session that outlines the exercises as well as the number of series
    for each exercise. Each exercise day session provides guides for a
    patient on what to do in a given day.

    Scenario Outline: Create an exercise day session based on existing exercises
        Given The server application is running
        When I request to create an exercise day session (name: <session_name>, description: <description>, and constraints: <constraints>).
        Then The number of exercise day sessions in the database increases by <number>.

        Examples:
            | session_name | description    | constraints              | number |
            | "First"      | "Day1-Session" | "At least two repitions" | 1      |
