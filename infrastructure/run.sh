#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;
[ -z "$DOMAIN_NAME" ] && echo "DOMAIN_NAME not set" && exit 1;

terraform init
terraform validate
terraform workspace select $STAGE || terraform workspace new $STAGE
terraform apply \
  -var="domain_name=$DOMAIN_NAME" \
  -var-file=./config/$STAGE.tfvars \
  -auto-approve
