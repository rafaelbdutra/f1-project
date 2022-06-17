#!/usr/bin/env bash

ENV=$1
COMPOSE_FILES='-f docker-compose.yml'

if [[ ! -z $ENV ]]
then
  COMPOSE_FILES="$COMPOSE_FILES -f docker-compose-$ENV.yml"
fi

### build services
./gradlew clean assemble

### docker-compose
docker-compose build --no-cache && docker-compose $COMPOSE_FILES up
