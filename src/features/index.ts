import express from 'express';
import bodyParser from 'body-parser';
import TestPostPlaceholder from './ioredis/cache/test-post-placeholder';
import TestBullMQ from './bullmq';
import UserBullMQ from './bullmq/user';
import rBayApp from './rbay';

const routes = express.Router();

routes.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
routes.use(bodyParser.json());
routes.use('/placeholder', TestPostPlaceholder);
routes.use('/user', UserBullMQ);
routes.use('/bullmq', TestBullMQ);
routes.use('/rbay', rBayApp);


export default routes;