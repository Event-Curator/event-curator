#!/bin/bash

. ../server/.env

for i in {100..110}; do
    curl -X GET -s -o test.${i} https://www.eventbriteapi.com/v3/categories/${I}/?token=${API_EVENTBRITE_KEY}
done