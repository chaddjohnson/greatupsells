#!/bin/bash

[ -z "$STAGE" ] && echo "STAGE not set" && exit 1;

export TF_VAR_public_key="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCnkoPruNE0pOOwjEUYrK/PSyey/HsArdbJnkuFtwZCVW0BHJ5oEewbKqktN6ZmPfthK9ePWWqRnRQjD5hEE0MauevcPKn+4EYdq3el4oBBrzqRzM2kMRiuIQ+IC3qc+XQY6IkYHsBuxSMtGEdIua3I8wVp49qOOjRysgaBLFeMaOke5SxsSl4hHj454NrwbDb5Ys8fswh/Qu6WygYIh2dVqRUqwwW2av4jZbucr6erUm46gzSf3vBCAJ/rMqTs68AOaGheQHrZZwc8ABk87IsPqYQiJh8s8JUREFjGC9Z0erUnvvF2FT9WeCLKji5lvvd9tv30KElczcnOpvga+VWCNBsVa00QG+CY9FtZiVL+shHKzUGBrt/x9/arEgUZbXFHIQrFtTS4vPA5T4HfU2VH4ZE3PH4zC/nb95cbZf2xoHQ+79XQW8pkJahA1RNBrkbdWnKNTQRRkuQEviCzv4JMIVLeSCTe1aJhzW2VD66Vm48zAzH4mD8yX0QgVzm1QA8="
export TF_VAR_shopify_admin_app_api_secret_key="16a8b6bca86a07d708e6e7dbd9616f02"

terraform init
terraform validate
terraform workspace select $STAGE || terraform workspace new $STAGE
terraform apply -var-file=./config/$STAGE.tfvars -auto-approve
