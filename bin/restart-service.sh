#!/usr/bin/env bash

SERVICE=$1

eval "./$SERVICE/gradlew -p $SERVICE clean assemble"
docker-compose up -d --build $SERVICE
