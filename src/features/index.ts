import express from 'express';
import bodyParser from 'body-parser';
import TestPostPlaceholder from './ioredis/cache/test-post-placeholder';
import TestBullMQ from './bullmq';
import UserBullMQ from './bullmq/user';

const routes = express.Router();

routes.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
routes.use(bodyParser.json());
routes.use('/redis/placeholder', TestPostPlaceholder);
routes.use('/redis/bullmq/user', UserBullMQ);
routes.use('/redis/bullmq', TestBullMQ);


export default routes;