![API-seed](https://bitbucket.org/anzemur/api-seed/raw/15d25e8f43f330b1bc2b464b13609d5d5fa4fff7/assets/logo-small.png)

API-seed is a framework/tool that helps developers develop their APIs better and faster.


## Installation
### First you need to clone this repository: 

```bash
$ git clone https://{bitbucket_username}@bitbucket.org/spproject/api-seed.git
```

### If you want to run API-seed you must have install all of the following prerequisites:
* [npm](https://www.npmjs.com/) 
* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com)
* [Redis](https://redis.io)
* [Docker](https://www.docker.com/)

### How to install the prerequisites:

#### Node.js and npm
* [Node.js + npm installation](https://nodejs.org/en/download/)

#### Docker
* [Download docker desktop](https://www.docker.com/products/docker-desktop)

#### MongoDB

Install latest MongoDB docker image.
```bash
$ docker run --name api-seed-mongo -d -i -t -p 27017:27017 mongo
```

#### Redis

Install latest Redis docker image.

```bash
$ docker run --name api-seed-redis -d -i -t -p 6379:6379 redis redis-server --appendonly yes
```

### Create `.env` file in root directory with variables:

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
They are not necessary but each scope of them unlocks functions the framework allows.

### Intstall dependecies: 

```bash
$ npm install
```

### After the dependecies are installed run the app with command:
```bash
$ npm run start
```







