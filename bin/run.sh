#!/usr/bin/env bash


gradleCmd() {
	local SERVICE_FOLDER=$1
	echo "./$SERVICE_FOLDER/gradlew -p $SERVICE_FOLDER clean assemble"
}

### build drivers-service
SERVICE=drivers-service
`gradleCmd $SERVICE`

### docker-compose

docker-compose build && docker-compose up