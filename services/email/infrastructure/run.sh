#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;

terraform init
terraform validate
terraform workspace select $STAGE || terraform workspace new $STAGE
terraform apply -auto-approve
