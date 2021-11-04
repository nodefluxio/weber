#!/bin/bash

if [ ! -z "$1" ]
then
    refresh="$1"
    if [ $refresh == "refresh" ]
    then
        echo "Running migration"
        backend refresh
    fi
fi

echo "Starting server"
backend