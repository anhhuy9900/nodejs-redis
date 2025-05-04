import express from 'express';
import { faker } from '@faker-js/faker';
import { BullMQ } from '../../core/bullmq';
import { QUEUE_USER } from '../../config/constants';


const app = express.Router();
let queue: BullMQ;


app.get("/getJobCounts", async (req, res) => {
    try {
        const bullMQ = new BullMQ();
        queue = await bullMQ.getQueue(QUEUE_USER);
        await queue.setQueue(QUEUE_USER);
        const counts = await queue.queue.getJobCounts('wait', 'completed', 'failed');
        return res.status(200).send(counts);	
    } catch(err: unknown) {
        if (err instanceof Error) err = err.message
        res.status(500).send({message: err});
    }
});

app.get("/getJobsCompleted", async (req, res) => {
    try {
        const bullMQ = new BullMQ();
        queue = await bullMQ.getQueue(QUEUE_USER);
        await queue.setQueue(QUEUE_USER);
        const completed = await queue.queue.getJobs(['completed'], 0, 100, true);
        return res.status(200).send(completed);	
    } catch(err: any) {
        console.log("🚀 ~ getJobsCompleted ~ err: ", err);
        res.status(500).send({message: err.message});
    }
});

app.delete("/removeJob", async (req, res) => {
    try {
        const bullMQ = new BullMQ();
        queue = await bullMQ.getQueue(QUEUE_USER);
        await queue.setQueue(QUEUE_USER);
        const { jobId } = req.body
        const job = await queue.getJob(jobId);
        const removed = await job?.remove();
        return res.status(200).send(removed);	
    } catch(err: any) {
        console.log("🚀 ~ removeJob ~ err: ", err);
        res.status(500).send({message: err.message});
    }
});

app.post("/moveToDelayed", async (req, res) => {
    try {
        const bullMQ = new BullMQ();
        queue = await bullMQ.getQueue(QUEUE_USER);
        await queue.setQueue(QUEUE_USER);
        const { jobId } = req.body
        const job = await queue.getJob(jobId);
        const moved =  await job?.moveToDelayed(50000);
        // const moved = await job?.moveToActive();
        return res.status(200).send(moved);	
    } catch(err: any) {
        console.log("🚀 ~ removeJob ~ err: ", err);
        res.status(500).send({message: err.message});
    }
});

export default app;

