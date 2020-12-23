#!/bin/bash

# Ensure background processes stop on script exit for all shells.
trap "exit" INT TERM ERR
trap "kill 0" EXIT

# Check if LocalStack Docker container is available.

LOCALSTACK_CONTAINER_ID=`docker ps -aqf "name=localstack"`

# Attach to LocalStacak Docker container if available, and skip infrastructure setup.
if [ -z "$LOCALSTACK_CONTAINER_ID" ]
then
  # Run localstack to simulate AWS locally.
  SERVICES=sns,sqs,ssm TMPDIR=/private$TMPDIR docker-compose up &

  # Wait for LocalStack to start.
  sleep 15

  # Set up infrastructure locally.
  ./scripts/infrastructure.sh
fi

# Bootstrap and start.
yarn bootstrap
lerna run start --parallel --scope=upselling-logs-service

# Wait until all background processes finish.
wait
