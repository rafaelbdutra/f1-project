#!/usr/bin/env bash

SERVICE=$1

eval "./services/$SERVICE/gradlew -p services/$SERVICE clean assemble"
docker-compose up -d --build $SERVICE
