#!/bin/bash

# Ensure background processes stop on script exit for all shells.
trap "exit" INT TERM ERR
trap "kill 0" EXIT

# Check if LocalStack Docker container is available.
LOCALSTACK_CONTAINER_ID=`docker ps -aqf "name=localstack"`

# Stop and remove the container if it exists.
if [ ! -z "$LOCALSTACK_CONTAINER_ID" ]
then
  docker stop $LOCALSTACK_CONTAINER_ID > /dev/null
  docker rm $LOCALSTACK_CONTAINER_ID > /dev/null
fi

# Run localstack to simulate AWS locally.
SERVICES=s3,sns,sqs,ssm TMPDIR=/private$TMPDIR docker-compose up &

# Wait for LocalStack to start.
sleep 15

# Set up infrastructure locally.
./scripts/infrastructure.sh

# Bootstrap and start.
yarn bootstrap
lerna run start --parallel --scope={@neatowebsolutions/*,upselling-shopify-admin,upselling-shopify-storefront,upselling-logs-service,upselling-shop-api-gateway,upselling-shops-service,upselling-storefront-api-gateway}

# Wait until all background processes finish.
wait
