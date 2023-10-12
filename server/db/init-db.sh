DB_DIR="./db"
DB_NAME="sysap.db"
DB_SCHEMA="sysap-db-schema.sql"

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
    touch "$DB_DIR/$DB_NAME"

    echo "Initializing database..."
    # Try running with sqlite3 first
    if command -v sqlite3 &> /dev/null; then
        sqlite3 "$DB_DIR/$DB_NAME" < "$DB_DIR/$DB_SCHEMA"
    else
        # Try running with sqlite if sqlite3 is not available
        if command -v sqlite &> /dev/null; then
            sqlite "$DB_DIR/$DB_NAME" < "$DB_DIR/$DB_SCHEMA"
        else
            echo "Error: Neither 'sqlite3' nor 'sqlite' found. Please install SQLite."
            exit 1
        fi
    fi
fi
