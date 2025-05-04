# Nodejs Redis

The source code to practice with Redis's features in nodejs
- The project using typescript with nodejs
- Using BullMQ library for queue management
- Using Express to build RestAPI
- Write a service to connect ioredis lib for practice with cache

## Getting Started
- Run project with nodemon
    - npm run start:dev
- Build project
    - npm run build

- The URLs in project
    - APP_PORT: set value in file .env
    - Project URL
        - http://localhost:APP_PORT
    - Board BullMQ URL
        - http://localhost:APP_PORT/queues

### Dependencies

* axios
* express
* typescript
* ioredis
* bullmq
* bull

### Installing

* npm install
* npm install --save-dev package-name


## Guideline

* https://nodejs.org/api/
* https://docs.bullmq.io/


#### COMMAND LINE TO PRACTICE
- HSET cars#a1 name 'fast car' color red year 1950
- FT.CREATE idx:cars ON HASH PREFIX 1 cars# SCHEMA name TEXT year NUMERIC color TAG