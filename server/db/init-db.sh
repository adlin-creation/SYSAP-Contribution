#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/db"

DB_DIR="$SCRIPT_DIR/../src/db"
DB_NAME="goldfit.db"
DB_SCHEMA="goldfit-db-schema.sql"
DB_SCHEMA_DIR="$SCRIPT_DIR"

# Reset the database if it already exists
if [ "$1" = "--reset" ] || [ "$1" = "-r" ]; then
    echo "Resetting database..."
    if [ -f "$DB_DIR/$DB_NAME" ]; then
        rm "$DB_DIR/$DB_NAME"
    fi
fi

# Create the db file if it doesn't exist
if [ ! -f "$DB_DIR/$DB_NAME" ]; then
    echo "Creating database..."
    
    # Use sqlite3 to create and initialize the database
    if command -v sqlite3 &> /dev/null; then
        sqlite3 "$DB_DIR/$DB_NAME" < "$DB_SCHEMA_DIR/$DB_SCHEMA"
        echo "Database created successfully."
    else
        echo "Error: 'sqlite3' not found. Please install SQLite."
        exit 1
    fi
fi