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
      upselling-shopify-admin-api-gateway:
        addr: 4000
        proto: http
        subdomain: chaddjohnson-api
      upselling-shopify-admin:
        addr: 4001
        proto: http
        subdomain: chaddjohnson-shopify-app
      upselling-webhooks-service:
        addr: 4008
        proto: http
        subdomain: chaddjohnson-webhooks

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
- React (with hooks)
- Next.js
- REST
- Lerna
- webpack
- Styled Components
- Mongoose
- Serverless
- Shopify Polaris
- Material UI

### Speed Improvement

Loading the Shopify Admin app over ngrok can be slow. To speed this up, we can bypass ngrok using a local nginx server as follows:

1. Set up nginx locally.
2. Create server configurations for each subdomain; for example:

   ```
   server {
       listen 80;
       listen 443 ssl;
       server_name example.ngrok.io;

       ssl_certificate     /usr/local/etc/ssl/certs/self-signed.crt;
       ssl_certificate_key /usr/local/etc/ssl/private/self-signed.key;

       ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
       ssl_ciphers         HIGH:!aNULL:!MD5;
       ssl_dhparam /usr/local/etc/ssl/certs/dhparam.pem;

       location / {
           proxy_pass http://127.0.0.1:3000/;
       }
   }
   ```

3. Create a self-signed certificate locally following [this tutorial](https://blog.cpming.top/p/create-self-signed-ssl-certificate-for-nginx). Change all instances of "test.cpming.top" to "\*.ngrok.io". use "2048" instead of "128" for the `openssl dhparam` command.
4. Add the tunnel subdomains to /etc/hosts pointing them to 127.0.0.1; for example: `127.0.0.1 example.ngrok.io`.
5. Add a `prefix` parameter to the `shopifyAuth()` function call (the default export of `@shopify/koa-shopify-auth`): `prefix: 'https://example.ngrok.io'`.

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

### Deployment

Simply push to the appropriate branch.

GitHub Actions is used for deployment. Deployment is automatic when Git pushes occur to branches corresponding to environments:

- `test`
- `production`

Initial deployments should occur in the following order:

1. `infrastructure`
1. `services/logs`
1. `services/shops`
1. `services/webhooks`
1. `services/email`
1. `services/shop-api-gateway`
1. `services/admin-api-gateway`
1. `services/storefront-api-gateway`
1. `applications/shopify-admin`
1. `applications/shopify-storefront`
1. `applications/admin`

## Infrastructure

All infrastructure is managed via Serverless, Terraform, and Ansible with each deployment. Linux is used for hosting.

AWS is used for hosting. The following AWS services are used:

- Lambda
- API Gateway
- EC2
- SNS
- SQS
- S3
- EventBridge
- CloudFront
- CloudWatch Events
- SES
- SSM
- Elasticsearch
- ACM

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

Internet Explorer is not supported.

This app must work within the [native Shopify app](https://apps.apple.com/us/app/shopify-ecommerce-business/id371294472).

### Licensing

All licenses are permissive free software licenses imposing minimal restrictions on the use and distribution of covered software. Run `npx license-checker --summary` to check licenses for dependencies.
