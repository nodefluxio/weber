#!/bin/bash

if [ ! -z "$1" ]
then
    arg="$1"
    if [ $arg == "refresh" ]
    then
        echo "Running seed and clean-up data"
        backend refresh
    elif [ $arg == "seed" ] # Use this if we have a new/changed seed and don't want to delete the data
    then
        echo "Running seed data"
        backend seed
    elif [ $arg == "migrate" ] # Use this if we have a new/changed schema and don't want to delete the data
    then
        echo "Running migration"
        backend migrate
    fi
fi

echo "Starting server"
backend