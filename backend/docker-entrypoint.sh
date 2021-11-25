#!/bin/bash

if [ ! -z "$1" ]
then
    arg="$1"
    if [ $arg == "refresh" ]
    then
        echo "Running seed and clean-up data"
        backend refresh
    elif [ $arg == "seed" ]
    then
        echo "Running seed data"
        backend seed
    fi
fi

echo "Starting server"
backend