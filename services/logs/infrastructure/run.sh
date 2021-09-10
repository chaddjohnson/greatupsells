#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;

terraform init
terraform validate
terraform workspace select $STAGE || terraform workspace new $STAGE
terraform apply \
  -var="mongodb_app_password=$MONGODB_APP_PASSWORD" \
  -var-file=./config/$STAGE.tfvars \
  -auto-approve
