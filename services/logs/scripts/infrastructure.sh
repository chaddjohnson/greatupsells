#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;
[ -z "$AWS_REGION" ] && echo "AWS_REGION not set" && exit 1;

terraform init infrastructure
terraform validate infrastructure
terraform workspace select $STAGE infrastructure || { terraform workspace new $STAGE infrastructure && terraform init infrastructure; }
terraform apply -var "region=$AWS_REGION" -auto-approve infrastructure
