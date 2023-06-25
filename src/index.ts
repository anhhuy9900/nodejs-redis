import express from 'express';
import featureRoutes from './features';
import bullBoard from './core/bullboard';
import Redis from './core';
import { APP_PORT } from './config/constants';

(async() => {
    console.log('INIT PROJECT');
    const redis = new Redis();
    await redis.connect();
    const app = express();
    app.use('/feature', featureRoutes);
    app.use('/bullmq/queues', bullBoard);
    app.get("/", async (req, res) => {
        res.status(200).send("Welcome to Nodejs-redis home page");
    });

    app.listen(APP_PORT, async () => {
        console.log(`Running on ${APP_PORT}...`);
        console.log(`For the BullBoard UI, open http://localhost:${APP_PORT}/queues`);
        console.log('Nodejs-redis server started');
    });
})();





