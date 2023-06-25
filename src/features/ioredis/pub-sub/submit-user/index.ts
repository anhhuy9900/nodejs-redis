import express from 'express';
import Redis from '../../../../core';
import { channel } from './constant';

const app = express.Router();
const redis = new Redis();

app.post("/publish", async (req, res) => {
    try {
        console.log("🚀 publish - user ~ req: ", req.body);
        const body = JSON.stringify(req.body);
        redis.publish(channel, body);
        //res.header("Content-Type",'application/json');
        res.status(200).send(body);	
    } catch(err: any) {
        console.log("🚀 ~ ioredis/pub-user ~ err: ", err);
        res.status(500).send({message: err.message});
    }
});

export default app;

