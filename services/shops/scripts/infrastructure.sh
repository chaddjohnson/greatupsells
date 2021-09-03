#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;

terraform -chdir=./infrastructure init
terraform validate infrastructure
terraform workspace select $STAGE infrastructure || { terraform workspace new $STAGE infrastructure && terraform init infrastructure; }
terraform apply -var-file=config/$STAGE.tfvars -auto-approve infrastructure
