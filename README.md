# api-seed

API-seed is a framework that helps developers develop their APIs better and faster.

docker run --name api-seed-mongo -d -i -t -p 27017:27017 mongo
docker run --name api-seed-redis -d -i -t -p 6379:6379 redis redis-server --appendonly yes

JWT_SECRET=
ENV=dev
DB_HOST=localhost
DB_NAME=api-seed-dev
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
API_VERSION=v1
SMTP_HOST=
SMTP_PORT=
SMTP_USE_SSL=
SMTP_USERNAME=
SMTP_PASSWORD=
