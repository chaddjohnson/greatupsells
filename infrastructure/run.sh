#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;
[ -z "$REDIS_APP_PASSWORD" ] && echo "REDIS_APP_PASSWORD not set" && exit 1;

terraform init
terraform validate
terraform workspace select $STAGE || terraform workspace new $STAGE
terraform apply \
  -var-file=./config/$STAGE.tfvars \
  -var="redis_app_password=$REDIS_APP_PASSWORD" \
  -auto-approve
