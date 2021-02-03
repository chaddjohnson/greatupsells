#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;

terraform init infrastructure
terraform validate infrastructure
terraform workspace select $STAGE infrastructure || { terraform workspace new $STAGE infrastructure && terraform init infrastructure; }
terraform apply -auto-approve infrastructure
