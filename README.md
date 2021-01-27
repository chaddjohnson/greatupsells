# Upselling

## Overview

This monorepo is a collection of applications, services, packages, and infrastructure as code comprising the entirety of a Shopify app.

This application plugs into existing Shopify shops and enables shop owners to upsell, cross-sell, and display general offers to customers in order to boost sales and revenue.

## Dependencies

If you are struggling and need help setting anything up, please ask for help.

### Node.js

The Node version is specified in .node-version files. As of 2020, AWS Lambda only supports up to Node 12.x, and so we cannot use features from higher versions. For example, optional chaining cannot be used.

[nvm](https://github.com/nvm-sh/nvm) and [avn](https://github.com/wbyoung/avn) are recommended for easily managing and using Node versions.

### Yarn

Yarn is used as the package manager. Please install this globally.

### Lerna

[Lerna](https://lerna.js.org/) is used to manage this monorepo. Lerna is installed automatically when installing dependencies.

### MongoDB

Version 4.2 or higher is required as multi-document transactions on replica sets are used. Please only used features supported by 4.6 and lower.

If upgrading from 3.x to 4.x, it might be easiest to dump your databases one by one, remove your MongoDB data directory, upgrade MongoDB, and then restore your databases.

To dump a database:

    mongodump --archive --uri mongodb://localhost:27017/database-name | gzip -9 -c > database-name.gz

And to restore a database:

    mongorestore --gzip --archive=database-name.gz

During development, a local replica set is required as transactions are used. Please follow [this gist](https://gist.github.com/davisford/bb37079900888c44d2bbcb2c52a5d6e8) for setup instructions. Alternatively, you can use [run-rs](https://www.npmjs.com/package/run-rs).

Please note that server infrastructure is managed at the organization level and therefore potentially used by other applications.

## Development

### Setup

1. Clone this repository.
1. Create a top-level `.env` file by copying `.env.example` and filling in values.
1. Create hard links (e.g., `ln ../../.env .`) to the top-level `.env` file within each `applications/` and `services/` subdirectory.
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop).
1. Run Docker Desktop.
1. Run `yarn docker`. This will start LocalStack (allowing you to run AWS services locally).
1. Run `yarn start`. This automatically does the following:
    1. Installs dependencies.
    1. Runs Lerna bootstrapping.
    1. Builds packages.
    1. Starts all applications, services, and package build watching.

### Tooling

The following are used:

* Node.js
* React (with Hooks)
* Next.js
* REST
* Apollo Server (AWS Lambda integration)
* Lerna
* webpack (v4)
* Emotion
* Mongoose
* Serverless
* Shopify Polaris
* Material UI

### Coding Conventions

* PascalCase for component file names and exported components.
* camelCase for variable names.
* camelCase for code file names (except for pages, which must use hyphens).
* Prettier and ESLint for code formatting.
* Hyphens for image and media file names.
* Default exports are used for modules and components (with the exception of index.js files).

## Deployment

### Setup

Follow steps 1 and 2 under "Integrate your app with EventBridge" in [this tutorial](https://shopify.dev/tutorials/manage-webhook-events-with-eventbridge) to set up an event source for the app in Shopify, and then associate the event source with the event bus in the AWS Console.

### Deploying

Simply push to the appropriate branch.

CircleCI is used for deployment. Deployment is automatic when Git pushes occur to branches corresponding to environments:

* `master` = development environment
* `test` = test environment
* `production` = production environment

All infrastructure will be setup and updated via Terraform with each deployment.

## Infrastructure

Hosting is with AWS. The following AWS services are used:

* API Gateway
* Lambda
* EventBridge
* EC2
* SNS
* SQS
* S3
* CloudFront
* CloudWatch Events
* SES
* SSM
* Elasticsearch (via EC2)
* ACM

All infrastructure is managed via Serverless, Terraform, and Ansible.

Linux is used for hosting.

## Architecture

A microservice architecture is used. Please refer to [this diagram](https://docs.google.com/drawings/d/1np6zTOc3GzO-teYaLsM9H3QjxCiMXBwuJRDnnITgji8).

## Requirements

### Internationalization and Localization

Internationalization and localization are used for currencies and dates. Language localization is not used as we only provide support in English.

### Accessibility

We should always aim for a Lighthouse (Chrome audit) score of >= 90 for accessibility.

All images *must* have `alt` tags with non-empty values.

### Browser Support

We support the following browsers:

* Google Chrome
* Firefox
* Edge
* Safari
* iOS Safari

We do not support Internet Explorer.

This app must work in the [native Shopify app](https://apps.apple.com/us/app/shopify-ecommerce-business/id371294472).

### Licensing

All licenses are permissive free software licenses imposing minimal restrictions on the use and distribution of covered software.

Run `npx license-checker --summary` to check licenses for dependencies.
