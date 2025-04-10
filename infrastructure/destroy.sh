#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;

terraform init
terraform workspace select $STAGE
terraform destroy \
  -var-file=./config/$STAGE.tfvars \
  -auto-approve
