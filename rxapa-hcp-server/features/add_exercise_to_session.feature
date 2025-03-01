Feature: Create Component
    As a health care professional, I want to add exercises to exisitng
    day sessions so that patients can view the assigned exercises
    for a paticular day session

    Scenario Outline: Add an exercise to a day session
        Given The server application is running
        And The following exercises exist:
            | exercise_name | description          | instructional_video          |
            | Sit-Up        | Sit-Up Description   | Sit-Up instructional video   |
            | Press-Up      | Press-Up Description | Press-Up instructional video |
        And The following day sessions exist:
            | day_session_name | day_session_description    | day_session_constraints |
            | First            | First Session Description  | At least one exercise   |
            | Second           | Second Session Description | At least one exercise   |
        And The following components exist:
            | day_session_name | exercise_name | rank | required | number_of_series |
            | First            | Press-Up      | 1    | true     | 2                |
        When I request to add an exercise (name: <exercise_name>) to a day session (name: <day_session_name>).
        Then The number of components in the database increases by <number>.
        And The new component refers to exercise (<exercise_name>) is <result>.
        And The new component refers to day session (<day_session_name>) is <result>.

        Examples:
            | exercise_name | exercise_description   | exercise_instructional_video    | day_session_name | day_session_description | day_session_constraints  | number | result  |
            | "Sit-Up"      | "Sit-Up Description"   | "Sit-Up instructional video"    | "First"          | "Day1-Session"          | "At least two repitions" | 1      | "true"  |
            | "Press-Up"    | "Press-Up Description" | "SPress-Up instructional video" | "First"          | "Day1-Session"          | "At least two repitions" | 0      | "false" |

