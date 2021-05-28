# Upselling

## Overview

This monorepo is a collection of applications, services, packages, and infrastructure as code comprising the entirety of a Shopify app.

This application plugs into existing Shopify shops and enables shop owners to upsell, cross-sell, and display general popups to customers in order to boost sales and revenue.

## Dependencies

If you are struggling and need help setting anything up, please ask for help.

### Node.js

The Node version is specified in the top-level `.node-version` file; please install and use this version on your system. We are currently using Node 12.x, so we cannot use features from higher versions. For example, optional chaining cannot be used in our Node code.

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

### ngrok

A paid ngrok account is necessary (please bill us, and include your receipt). Alternatively, if you can quickly figure out how to use another local tunneling mechanism, go for it, and please add to this README if you have success.

If using ngrok, configure ngrok per [the docs](https://ngrok.com/docs). Here is an example of how your `~/.ngrok2/ngrok.yml` file should look:

    authtoken: tokenhere
    region: us
    tunnels:
      upselling-shop-api-gateway:
        addr: 4000
        proto: http
        subdomain: chaddjohnson-api
        host_header: localhost:4000
      upselling-shopify-admin:
        addr: 4001
        proto: http
        subdomain: chaddjohnson-shopify-app
        host_header: localhost:4001
      upselling-webhooks-service:
        addr: 4008
        proto: http
        subdomain: chaddjohnson-webhooks
        host_header: localhost:4008

Note that the tunnel names (e.g., `upselling-shop-api-gateway`) must remain unchanged.

Please install the `ngrok` binary. Once installed and configured, ngrok will start automatically via `yarn start`.

## Development

### Setup

1. Clone this repository.
1. Create a top-level `.env` file by copying `.env.example` and filling in values.
1. Create hard links (e.g., `ln ../../.env .`) to the top-level `.env` file within each `applications/` and `services/` subdirectory.
1. Run `yarn start`. This automatically does the following:
   1. Installs dependencies.
   1. Runs Lerna bootstrapping.
   1. Builds packages.
   1. Starts all applications, services, and package build watching.

### Tooling

The following are used:

- Node.js
- React (with Hooks)
- Next.js
- REST
- Lerna
- webpack (v4)
- Emotion
- Mongoose
- Serverless
- Shopify Polaris
- Material UI

### Coding Conventions

- Prettier and ESLint for automatic code formatting.
- kebab-case for names of repositories, applications, packages, and services.
- PascalCase for names of component file and exported components.
- camelCase for variable names.
- camelCase for code file names (except for pages, which must use hyphens).
- Hyphens for image and media file names.
- Default exports are used for modules and components (with the exception of index.js files).

Code consistency is important. In order to maintain consistency, convention changes should be discussed and decisions should be made as a team.

## Deployment

### Setup

Follow steps 1 and 2 under "Integrate your app with EventBridge" in [this tutorial](https://shopify.dev/tutorials/manage-webhook-events-with-eventbridge) to set up an event source for the app in Shopify, and then associate the event source with the event bus in the AWS Console.

### Deploying

Simply push to the appropriate branch.

CircleCI is used for deployment. Deployment is automatic when Git pushes occur to branches corresponding to environments:

- `master` = development environment
- `test` = test environment
- `production` = production environment

All infrastructure will be setup and updated via Terraform with each deployment.

## Infrastructure

Hosting is with AWS. The following AWS services are used:

- API Gateway
- Lambda
- EventBridge
- EC2
- SNS
- SQS
- S3
- CloudFront
- CloudWatch Events
- SES
- SSM
- ACM
- Elasticsearch

All infrastructure is managed via Serverless, Terraform, and Ansible. Linux is used for hosting.

## Architecture

A microservice architecture is used. Please refer to [this diagram](https://docs.google.com/drawings/d/1np6zTOc3GzO-teYaLsM9H3QjxCiMXBwuJRDnnITgji8).

## Requirements

### Internationalization and Localization

Internationalization and localization are used for currencies and dates.

Language localization is not used as we only provide support in English.

### Accessibility

We should always aim for a Lighthouse (Chrome audit) score of >= 90 for accessibility.

_All_ images _must_ have `alt` tags with non-empty values.

### Browser Support

We support the following browsers:

- Google Chrome
- Firefox
- Edge
- Safari
- iOS Safari

We do not support Internet Explorer.

This app must work in the [native Shopify app](https://apps.apple.com/us/app/shopify-ecommerce-business/id371294472).

### Licensing

All licenses are permissive free software licenses imposing minimal restrictions on the use and distribution of covered software.

Run `npx license-checker --summary` to check licenses for dependencies.
