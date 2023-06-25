import express from 'express';
import axios from 'axios';
import Redis from '../../../core';

const app = express.Router();
const cacheKey = "test-post-placeholder";

app.get("/get-post", async (req, res) => {
    try {
        const redis = new Redis();
        let data = await redis.get(cacheKey);
        console.log("🚀 ~ file: test-post-placeholder.ts ~ OLD DATA : ", data);
        if(!data) {
            const resData = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
            data = resData.data;
            await redis.set(cacheKey, JSON.stringify(data));
        }

        console.log("🚀 ~ file: test-post-placeholder.ts ~ NEW DATA: ", JSON.stringify(data[0], null, 2));
        try {
            data = JSON.stringify(JSON.parse(data), null, 2);
        } catch (error) {

        }
        res.header("Content-Type",'application/json');
        res.status(200).send(data);	
    } catch(err: any) {
        console.log("🚀 ~ file: test-post-placeholder.ts ~ line 25 ~ app.get ~ err", err);
        res.status(500).send({message: err.message});
    }
});

app.get("/del-post", async (req, res) => {
    try {
        const redis = new Redis();
        let data = await redis.get(cacheKey);
        console.log("🚀 ~ fDELETED POST PLACEHOLDER ~ data", data);
        if(data) {
            await redis.del(cacheKey);
        }
        res.status(200).send("DELETED POST PLACEHOLDER");	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

export default app;