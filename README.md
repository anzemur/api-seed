![API-seed](https://bitbucket.org/anzemur/api-seed/raw/15d25e8f43f330b1bc2b464b13609d5d5fa4fff7/assets/logo-small.png)

API-seed is a template for the development of backend systems in Node.js.

## Contents

API-seed includes different middlewares, modules and serivces that can be used with minimum configuration.

* ### Authentication
  Template offers three ways of authentication:
  * Local auth
  * Google auth
  * Facebook auth

* ### Authorization
  Routes authorization middleware based on user's roles.

* ### Rate limiting
  Per route middleware that allows rate limiting by user's ID or IP address.

* ### Cahce
  Request caching globaly or per user, using Redis key-value database.

* ### Logging
  Error, info and access (route) local logging. Logs are available in `./logs` directory after app start up. For every request a log document is created in database with all of relavant information about request and its response.

* ### Error handling
  Error handling middleware.

* ### Request body validation
  Request body validation middleware.

* ### Analytics module
  API analytics module -> usage, devices, requests browsing, response times...

* ### Admin module
  Admin module allows user managment and some on the fly middleware managment via admin console or API.

* ### Users module
  Users CRUD operations, forgotten password, registration, change password, change email, change username...

* ### Mailing service
  Service for sending transactional emails.

* ### Data seed
  Data seed for adding data to database.

* ### Tests
  Template is already test covered, as it should be in future use.

* ### Admin console
  Server side rendered admin console with users managment, analytics and API admin settings.

![admin-console](https://bitbucket.org/anzemur/api-seed/raw/b137cddbf38cf42b784b7e73c320f7c095c95fc0/assets/admin-console.gif)

## Installation

### First you need to clone this repository: 

```bash
$ git clone https://{bitbucket_username}@bitbucket.org/anzemur/api-seed.git
```

### 1. Local installation

#### If you want to run API-seed locally you must install all of the following prerequisites:
* [npm](https://www.npmjs.com/) 
* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com)
* [Redis](https://redis.io)
* [Docker](https://www.docker.com/)

#### How to install the prerequisites:

##### Node.js and npm
* [Node.js + npm installation](https://nodejs.org/en/download/)

##### Docker
* [Download docker desktop](https://www.docker.com/products/docker-desktop)

##### MongoDB

Install latest MongoDB docker image.
```bash
$ docker run --name api-seed-mongo -d -i -t -p 27017:27017 mongo
```

##### Redis

Install latest Redis docker image.

```bash
$ docker run --name api-seed-redis -d -i -t -p 6379:6379 redis redis-server --appendonly yes
```

#### Create `.env` file in root directory with variables or add them to OS's enviroment:

```bash
JWT_SECRET=notasecret
ENV=dev
DB_HOST=localhost
DB_NAME=api-seed-dev
TEST_DB_HOST=localhost
TEST_DB_NAME=api-seed-test
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
API_VERSION=v1
USE_ADMIN_CONSOLE=true
SMTP_HOST=
SMTP_PORT=
SMTP_USE_SSL=
SMTP_USERNAME=
SMTP_PASSWORD=
FB_CLIENT_ID=
FB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
```
Empty variables are exposure sensitive so they should be set by the user.
They are not necessary but each scope of them unlocks functions the framework offers.

#### Intstall dependecies: 

```bash
$ npm install
```

#### After the dependecies are installed run the app with command:
```bash
$ npm run start
```

#### You can run tests with command:
```bash
$ npm run test
```

#### And you can run data seed with command:
```bash
$ npm run seed
```

### 2. Using Docker

You need to install Docker and set enviroment variables to your enviroment.

#### Crete docker image:
```bash
$ docker build -t api-seed .
```

#### Start the image by running:
```bash
$ docker-compose up
```
