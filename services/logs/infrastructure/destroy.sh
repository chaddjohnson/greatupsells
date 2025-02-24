#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;
[ -z "$MONGODB_APP_PASSWORD" ] && echo "MONGODB_APP_PASSWORD not set" && exit 1;
[ -z "$ELASTICSEARCH_APP_PASSWORD" ] && echo "ELASTICSEARCH_APP_PASSWORD not set" && exit 1;

aws s3 sync s3://greatupsells-infrastructure/serverless/logs-service . --region us-east-1

(cd .. && serverless remove --stage $STAGE --region us-east-1) || true

# if [ "$STAGE" = "production" ]; then
#   (cd .. serverless remove --stage $STAGE --region eu-west-1) || true
#   (cd .. serverless remove --stage $STAGE --region ap-northeast-1) || true
# fi

terraform init
terraform workspace select $STAGE
terraform destroy \
  -var-file=./config/$STAGE.tfvars \
  -var="mongodb_app_password=$MONGODB_APP_PASSWORD" \
  -var="elasticsearch_app_password=$ELASTICSEARCH_APP_PASSWORD" \
  -auto-approve || true
