# f1-project

## Run project
From root folder run `./bin/run.sh`

## MongoDB
To access a mongo db run
```
docker exec -ti f1-project_drivers-mongodb_1 mongo f1-project --username f1-app -p
```

### MongoDB operations
- Show drivers: `db.drivers.find()`
- Remove all drivers: `db.drivers.remove({})`