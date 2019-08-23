![API-seed](https://bitbucket.org/anzemur/api-seed/raw/15d25e8f43f330b1bc2b464b13609d5d5fa4fff7/assets/logo-small.png)

API-seed is a framework/tool that helps developers develop their APIs better and faster.

Install latest MongoDB docker image.
```bash
$ docker run --name api-seed-mongo -d -i -t -p 27017:27017 mongo
```

Install latest Redis docker image.

```bash
$ docker run --name api-seed-redis -d -i -t -p 6379:6379 redis redis-server --appendonly yes
```


```bash
JWT_SECRET=
ENV=dev
DB_HOST=localhost
DB_NAME=api-seed-dev
TEST_DB_HOST=localhost
TEST_DB_NAME=api-seed-test
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
API_VERSION=v1
SMTP_HOST=
SMTP_PORT=
SMTP_USE_SSL=
SMTP_USERNAME=
SMTP_PASSWORD=
USE_ADMIN_CONSOLE=true
FB_CLIENT_ID=
FB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
```