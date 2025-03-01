# RxAPA Admin Application

This application allows health care propfessionals to define exercise program for their clients. This repository references two submodules (git repository) - the application server and the frontend application.

## Getting Started

Clone the repository to a directory of your choice with the following steps:

```
git clone https://gitlab.info.uqam.ca/rx-apa/sysap.git

```

## Run the Application with Docker Compose

Following the follwoing steps to run the application with docker compose:

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (if not already installed in your machine)
2. Start the Docker Desktop
3. Create env folder in the root directory, i.e., sysap
4. Create db.env file in the env folder, i.e., sysap/env/db.env, and then copy the code below and provide your database credentials to initialize the variables.

```
POSTGRES_PASSWORD=''
POSTGRES_USER=''
POSTGRES_DB=''
PGDATA='/var/lib/postgresql/data/pgdata'


```

5. Create server.env file in the env folder, i.e., sysap/env/server.env, and then copy the code below and provide your database credentials to establish connection with the databse.

```
# The name of the database
DATABASE_NAME=''

# The username to access the database
DATABASE_USER=''


# The username to access the database
DATABASEL_USER=''

# The password to access the databse
DATABASE_PASSWORD=''

# The host of the application, e.g., localhost
DATABASE_HOST='postgres'

# The server port (Optional), port 80 connects with the frontend
PORT=

```

```
4. Development Mode - Run the Docker comman `docker-compose up --build` at the root directory (sysap) to start the application
5. Development Mode - Run the Docker comman `docker-compose -f docker-compose.prod.yaml up --build` at the root directory (sysap) to start the application

```
