FROM node:lts-alpine

ARG ENVIRONMENT

ENV NODE_ENV=$ENVIRONMENT

WORKDIR /home/node/redis-node-app/src

COPY ["package*.json", "/home/node/redis-node-app/"]

RUN npm i

RUN npm i -g pm2

COPY [".", "/home/node/redis-node-app/"]

# CMD ["pm2-runtime", "ecosystem.local.config.js"]

CMD ["npm", "run", "start:dev"]

# CMD ["nodemon", "src/index.ts"]

EXPOSE 3500