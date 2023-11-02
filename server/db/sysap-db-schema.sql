CREATE TABLE User (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  familyName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  programName TEXT
);