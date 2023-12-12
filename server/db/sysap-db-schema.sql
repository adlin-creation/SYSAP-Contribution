-- Create the exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT
);

-- Insert some sample data
INSERT INTO exercises (name) VALUES ('Push-ups');
INSERT INTO exercises (name) VALUES ('Sit-ups');
INSERT INTO exercises (name) VALUES ('Squats');