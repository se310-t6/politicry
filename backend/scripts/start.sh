#!/usr/bin/env bash

# wait for postgres to start
until PGPASSWORD="$DB_PASSWORD" psql -h "politicry-db" -U "politicry" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
>&2 echo "Postgres is up - continuing"

# initalise the database
>&2 echo "Initialising the database"
flask db stamp head
flask db migrate
flask db upgrade

# start the api
waitress-serve --port ${PORT} --host ${HOST} --call src:create_app
