#!/usr/bin/env bash


gradleCmd() {
	local SERVICE_FOLDER=$1
	echo "./$SERVICE_FOLDER/gradlew -p $SERVICE_FOLDER clean assemble"
}

### build drivers-service
`gradleCmd drivers-service`

### build race-control-service
`gradleCmd race-control-service`

### docker-compose
docker-compose build --no-cache && docker-compose up
