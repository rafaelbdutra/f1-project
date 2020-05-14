# F1 Data Scraper

## Starting LocalStack
`TMPDIR=/private$TMPDIR docker-compose up`

## S3 commands
- Create bucket
`awslocal s3 mb s3://f1-project`

- List items in bucket
`awslocal s3 ls s3://f1-project`
