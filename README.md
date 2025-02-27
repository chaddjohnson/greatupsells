# Great Upsells

## Overview

This monorepo is a collection of applications, services, packages, and infrastructure as code comprising the entirety of a Shopify app.

This application plugs into existing Shopify shops and enables shop owners to upsell, cross-sell, and display general popups to customers in order to boost sales and revenue.

## Dependencies

If you are struggling and need help setting anything up, please ask for help.

### Node.js

The Node version is specified in the top-level `.node-version` file; please install and use this version on your system.

[nvm](https://github.com/nvm-sh/nvm) and [avn](https://github.com/wbyoung/avn) are recommended for easily managing and using Node versions.

### Yarn

Yarn v4 is used as the package manager. Please install this globally.

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

### ngrok

A paid ngrok account is necessary (please bill us, and include your receipt). Alternatively, if you can quickly figure out how to use another local tunneling mechanism, go for it, and please add to this README if you have success.

If using ngrok, configure ngrok per [the docs](https://ngrok.com/docs). Find your config file's location via `ngrok config check`. Here is an example of how your config file should look:

```
version: "3"
agent:
   authtoken: 3CNHdUUcGwXeZwQ93k78A_36jBEyt7ueo58s8f14189
tunnels:
greatupsells:
   addr: 80
   proto: http
   subdomain: mysubdomain
```

Please follow instructions [here](https://ngrok.com/download) to install the `ngrok` binary and authorize your machine. Once done, ngrok will start automatically with `yarn start`.

## Development

### Setup

1. Clone this repository.
1. Create a top-level `.env` file by copying `.env.example` and fill in values.
1. Create symlinks (e.g., `ln -s ../../.env .`) to the top-level `.env` file within each `applications/` and `services/` subdirectory.
1. Ask Chad to create an AWS IAM account for you and give you your credentials.
1. Add AWS credentials to `~/.aws/credentials`:
   ```
   [greatupsells]
   aws_access_key_id = <your key>
   aws_secret_access_key = <your secret key>
   ```
1. Create `~/.aws/config` if it doesn't exist:
   ```
   [default]
   region = us-east-1
   ```
1. Run `yarn global add lerna`.
1. Run `yarn start` (please note you might need to set `AWS_PROFILE`; e.g., `AWS_PROFILE=greatupsells yarn start`). This automatically does the following:
   1. Installs dependencies.
   1. Runs Lerna bootstrapping.
   1. Builds packages.
   1. Starts all applications, services, and package build watching.
   1. Starts tunnels.
1. Create a Shopify Partners account.
1. Create a development store in your Shopify Partners account.
1. Create a version of the app in your Shopify Partners account.
1. In Shopify under App Setup, configure things as follows:
   1. Set "App URL" to the root of the Shopify Admin application, like so:
      ```
      https://mysubdomain.us.ngrok.io/
      ```
   1. Set "Allowed redirection URL(s)" to include the main Shopify Admin base URL, like so:
      ```
      https://mysubdomain.us.ngrok.io/auth/callback
      ```
1. Install the app by visiting the following URL: https://mysubdomain.us.ngrok.io/auth?shop=YOUR_SHOPIFY_STORE.myshopify.com (e.g., https://mysubdomain.us.ngrok.io/auth?shop=my-test-store.myshopify.com). Alternatively, use the "Test on development store" option for the app in your Shopify Partners account.

Please use the `develop` branch for main development.

### Shopify App Extensions

To initially register all the extension for the Shopify at once:

1. Open a terminal, and change the working directory to `applications/shopify-admin`.
1. Run `yarn shopify app deploy`.
1. Follow the prompts.
1. Verify the extension is now listed under `Extensions` for the app on Shopify Partners.

You will need to run the "deploy" command each time you want to publish a new version of one or more extensions. Further, to publish to different environments (e.g., dev, test, prod), delete the contents of `applications/shopify-admin/shopify.app.toml` locally before running the command.

To run and develop Shopify app extensions locally (such as post-purchase upsells):

1. Run the app with `yarn start` from the top-level project directory.
1. Open another terminal, and change the working directory to `applications/shopify-admin`.
1. Run `yarn extensions:start` to start extensions.
1. Follow instructions on screen.
1. Manually refresh your browser to view updates as there is no fast refresh / live reload available.

### Troubleshooting

#### Ports already in use

Sometimes Node processes hang and become "zombie" processes, and then you receive error messages about ports being in use. To remedy this, try running `killall -9 node`.

#### ngrok not starting

Occasionally ngrok tunnels will fail to start because ngrok is running in the background. In this case, try running `killall -9 ngrok`.

## Package Management

### Adding a shared dependency for all projects

To add a dependency shared by all packages, simply run `yarn add foo -W`. To remove a dependency, run `yarn remove foo -W`.

Note that `lerna add foo` will add `foo` to package.json in all packages and _not_ to the high-level `package.json`.

### Adding dependencies for packages

To add a dependency for an individual package, use the following command:

    lerna add foo --scope application-name

For example:

    lerna add http-status-codes --scope greatupsells-shopify-admin

Please find more examples [here](https://github.com/lerna/lerna/tree/master/commands/add#examples).

### Removing dependencies for packages

Unfortunately [there is no](https://github.com/lerna/lerna/issues/1886) `lerna remove` command. Here are possible workarounds for removing dependencies from individual package:

1. Run `lerna exec 'yarn remove foo' --scope @org-name/application-name`.
1. Manually remove dependencies from `application-name/package.json` and then run `lerna bootstrap --scope @org-name/application-name --force-local`.

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

Loading the Shopify Admin app over ngrok can be extremely slow (even on a fast connection) and can use a lot of bandwidth as traffic is funneled over ngrok. To speed this up, we can bypass ngrok using a local nginx server as follows:

1. Set up nginx locally.
1. Create a server configuration for the Shopify Admin app URL; for example:

```
server {
   listen 80;
   listen 443 ssl;
   server_name localhost mysubdomain.eu.ngrok.io;

   ssl_certificate     /opt/homebrew/etc/ssl/certs/mysubdomain.eu.ngrok.io.crt;
   ssl_certificate_key /opt/homebrew/etc/ssl/private/mysubdomain.eu.ngrok.io.key;

   ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
   ssl_ciphers         HIGH:!aNULL:!MD5;
   ssl_dhparam /opt/homebrew/etc/ssl/certs/dhparam.pem;

   location / {
      proxy_pass http://localhost:4001/;
      proxy_buffering off;
   }

   location /admin-api {
      proxy_pass http://localhost:4005;
      proxy_buffering off;
   }

   location /admin {
      proxy_pass http://localhost:4003;
      proxy_buffering off;
   }

   location /admin/ {
      proxy_pass http://localhost:4003/;
      proxy_buffering off;
   }

   location /logs-api {
      proxy_pass http://localhost:4009;
      proxy_buffering off;
   }

   location /shopify-admin-api {
      proxy_pass http://localhost:4000;
      proxy_buffering off;
   }

   location /shops-api {
      proxy_pass http://localhost:4004;
      proxy_buffering off;
   }

   location /storefront-api {
      proxy_pass http://localhost:4006;
      proxy_buffering off;
   }

   location /webhooks-api {
      proxy_pass http://localhost:4008;
      proxy_buffering off;
   }
}
```

1. Create a self-signed certificate locally (replace `mysubdomain` with your ngrok subdomain name):

   1. Generate a Private Key: `openssl genrsa -out mysubdomain.us.ngrok.io.key 2048`.
   1. Create a Certificate Signing Request (CSR): `openssl req -new -key mysubdomain.us.ngrok.io.key -out mysubdomain.us.ngrok.io.csr -subj "/CN=mysubdomain.us.ngrok.io"`.
   1. Create a configuration file called `mysubdomain.us.ngrok.io.ext` with the following contents:

      ```
      authorityKeyIdentifier=keyid,issuer
      basicConstraints=CA:FALSE
      keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
      subjectAltName = @alt_names

      [alt_names]
      DNS.1 = mysubdomain.us.ngrok.io
      ```

   1. Generate the Self-Signed Certificate: `openssl x509 -req -in mysubdomain.us.ngrok.io.csr -signkey mysubdomain.us.ngrok.io.key -out mysubdomain.us.ngrok.io.crt -days 365 -extfile mysubdomain.us.ngrok.io.ext`.
   1. Install the Self-Signed Certificate in Chrome's Trusted Root CA Store.
      1. MacOS:
         1. Open Keychain Access (cmd + space, type Keychain Access).
         1. Drag and drop mysubdomain.us.ngrok.io.crt into the System keychain (not the login keychain).
         1. Double-click the certificate and expand Trust.
         1. Set "When using this certificate" to "Always Trust".
         1. Restart Chrome.
      1. Windows:
         1. Open Certificate Manager (Win + R, then type certmgr.msc).
         1. Navigate to Trusted Root Certification Authorities → Certificates.
         1. Right-click Certificates, choose Import, and select mysubdomain.us.ngrok.io.crt.
         1. Restart Chrome.
      1. Linux:
         1. Move the certificate to `/usr/local/share/ca-certificates/`: `sudo cp mysubdomain.us.ngrok.io.crt /usr/local/share/ca-certificates/`.
         1. Update the certificate store: `sudo update-ca-certificates`.
         1. Restart Chrome.
   1. Use the certificate and key files in ngnix for `ssl_certificate` and `ssl_certificate_key`, respectively.
   1. Restart nginx.

1. Add the tunnel subdomain to `/etc/hosts` pointing it to `127.0.0.1`; for example: `127.0.0.1 mysubdomain.us.ngrok.io`.

Please note you might need to temporarily disable this by commenting out the entry you added in `/etc/hosts` in order to install the app via OAuth with Shopify.

### Coding Conventions

The following coding conventions are adhered to except in special cases:

- Prettier and ESLint for automatic code formatting.
- kebab-case for names of repositories, applications, packages, and services.
- PascalCase for names of component file and exported components.
- camelCase for variable names.
- camelCase for code file names (except for pages, which must use hyphens).
- snake_case for Terraform resource names.
- Hyphens for image and media file names.
- Hyphens for directory names.
- Default exports are used for modules and components (with the exception of index.js files).
- In general, abide by the Airbnb [JavaScript](https://github.com/airbnb/javascript) and [React](https://airbnb.io/javascript/react/) standards.

Code consistency is important. In order to maintain consistency, convention changes should be openly discussed and decisions made as a team. Please do your best to respect conventions established throughout this code base.

## Deployment

### Setup

1. Create the `greatupsells-infrastructure2` bucket if it does not exist.
1. Create a version of the app in the target Shopify Partners account for the target environment.
1. In Shopify under App Setup, configure things as follows:
   1. Set "App URL" to the root of the Shopify Admin application, like so:
      ```
      https://shopify-admin.greatupsells.com/
      ```
   1. Set "Allowed redirection URL(s)" to include the main Shopify Admin base URL, like so:
      ```
      https://shopify-admin.greatupsells.com/auth/callback
      ```
1. Follow steps 1 and 2 under "Integrate your app with EventBridge" in [this tutorial](https://shopify.dev/tutorials/manage-webhook-events-with-eventbridge) to set up an event source for the app in Shopify, and then associate the event source with the event bus in the AWS Console. Note that rules will be created automatically via Terraform.
1. Create a `ci` IAM account with administrator access.
1. Create a `server` user with the following inline policy:
   ```
   {
      "Version": "2012-10-17",
      "Statement": [
         {
               "Sid": "VisualEditor0",
               "Effect": "Allow",
               "Action": "route53:*",
               "Resource": "*"
         },
         {
               "Sid": "VisualEditor1",
               "Effect": "Allow",
               "Action": "s3:*",
               "Resource": [
                  "arn:aws:s3:::greatupsells-backups",
                  "arn:aws:s3:::greatupsells-backups/*"
               ]
         }
      ]
   }
   ```
1. Set the following in `infrastructure/config/[environment].tfvars`, and commit these changes:
   1. `shopify_admin_app_api_key` (get this from the "App Setup" page under "App credentials")
   1. `shopify_admin_app_api_secret_key` (get this from the "App Setup" page under "App credentials")
   1. `event_bus_arn` (get this in AWS [here](https://console.aws.amazon.com/events/home?region=us-east-1#/partners) under "Partner event source ARN" for region us-east-1)
1. Update `event_bus_name` in `services/webhooks/infrastructure/config/[environment].tfvars`.
1. Configure the following secrets [here](https://github.com/chaddjohnson/greatupsells/settings/secrets/actions) in GitHub:
   1. `AWS_ACCESS_KEY_ID` (key for an administrator user account used by CI)
   1. `AWS_ACCESS_KEY_ID_SERVER` (key for an administrator IAM account)
   1. `AWS_SECRET_ACCESS_KEY` (key for a server IAM account used by CI)
   1. `AWS_SECRET_ACCESS_KEY_SERVER` (key for a server IAM account)
   1. `MONGODB_ROOT_PASSWORD` (the root MongoDB password)
   1. `MONGODB_ADMIN_PASSWORD` (the main admin account MongoDB password)
   1. `MONGODB_APP_PASSWORD` (the app account MongoDB password)
   1. `MONGODB_BACKUP_PASSWORD` (the backup MongoDB password)
   1. `ELASTICSEARCH_ROOT_PASSWORD` (the Elasticsearch "elastic" user password)
   1. `ELASTICSEARCH_APP_PASSWORD` (the Elasticsearch "app" user password)
   1. `PRIVATE_KEY` (an SSH private key for a key pair that has access to the EC2 servers)
   1. `SHOPIFY_CLI_PARTNERS_TOKEN` (a CLI token obtained from the Shopify Partners account)
      1. This should be regenerated every 12 months.
1. In the AWS Console under SES, request a sending limit increase to get the SES account out of "sandbox" mode.
1. Trigger deployments in the order shown below.
1. Add name servers to domain registrar settings once `infrastructure` setup has run.

### Triggering

Simply push to the appropriate branch.

GitHub Actions is used for deployment. Deployment is automatic when Git pushes occur to branches corresponding to environments:

- `test`
- `production`

Initial deployments should occur in the following order:

1. `infrastructure`
1. `services/logs`
1. `services/shops-api`
1. `services/webhooks`
1. `services/email`
1. `services/shopify-admin-api`
1. `services/admin-api`
1. `services/storefront-api`
1. `applications/shopify-admin`
1. `applications/storefront`
1. `applications/admin`

The easiest way to accomplish this is to initially run Terraform for each service from your local machine. For each service, from its directory, run the following:

    AWS_PROFILE=greatupsells STAGE=test ./run.sh

Be sure to pass in whatever environment variables are needed by the script.

To run for `infrastructure` locally, you'll need to temporarily plug variables into files in `./infrastructure/region/services-server/roles` similarly to how `workflows/infrastructure.yml` does (note that these files are ignored by Git). You will also need to install the server private and public keys at `~/.ssh/greatupsells/[test|production]/id_rsa` and `~/.ssh/greatupsells/[test|production]/id_rsa.pub`.

Unfortunately you will likely have to fight with the top-level `infrastructure` piece to get Terraform to successfully run.

- One thing you will need to do is disable security before the MongoDB "Create MongoDB root user" task runs by manually editing `/etc/mongod.conf` on the server, then re-run Ansible, then remove this:

  ```
  security:
    authorization: "disabled"
  ```

  Then stop MongoDB and restart without authentication:

  ```
  sudo systemctl stop mongod
  sudo mongod --dbpath /var/lib/mongodb --port 27017 --bind_ip 127.0.0.1 --replSet rs0 --noauth
  ```

  Finally, log in:

  ```
  mongosh --port 27017
  ```

  Initiate the replicaset:

  ```
  rs.initiate()
  ```

  and create the user:

  ```
  use admin
  db.createUser({
    user: "root",
    pwd: "your_secure_password",
    roles: [{ role: "root", db: "admin" }]
  })
  ```

  Once done, re-enable authorization and restart `mongod`:

  ```
  sudo systemctl restart mongod
  ```

  You might also need to fix file ownership:

  ```
  sudo chown -R mongodb:mongodb /var/lib/mongodb
  sudo chown -R mongodb:mongodb /var/log/mongodb
  sudo chmod -R 700 /var/lib/mongodb
  sudo chmod -R 755 /var/log/mongodb
  sudo systemctl restart mongod
  ```

  Then re-run Ansible.

## Destruction

Run the following from the project root:

    AWS_PROFILE=greatupsells STAGE=test yarn destroy

## Infrastructure

All infrastructure is managed via Serverless, Terraform, and Ansible with each deployment. Linux and AWS are used for hosting. The following AWS services are used:

- Lambda
- API Gateway
- EC2
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
