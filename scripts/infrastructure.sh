#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1
[ -z "$AWS_REGION" ] && echo "AWS_REGION not set" && exit 1

# Remove old Terraform state.
find . -type d -name ".terraform" -exec rm -rf {} +
find . -type d -name "terraform.tfstate.d" -exec rm -rf {} +

# Set up infrastructure in order based on dependency.
lerna run infrastructure --stream --scope=upselling-logs-service
# lerna run infrastructure --stream --scope=upselling-shop-api-gateway
# lerna run infrastructure --stream --scope=upselling-storefront-api-gateway
# lerna run infrastructure --stream --scope=upselling-admin-api-gateway
# lerna run infrastructure --stream --scope=upselling-shopify-admin
# lerna run infrastructure --stream --scope=upselling-webhooks-service
