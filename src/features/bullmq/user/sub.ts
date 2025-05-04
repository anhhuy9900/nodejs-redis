import {
    Job
  } from "bullmq";
import { BullMQ } from '../../../core/bullmq';
import { QUEUE_USER } from '../../../config/constants';

(async() => {
    const bullMQ = new BullMQ();
    const queueEvents = await bullMQ.getQueueEvents(QUEUE_USER);
    queueEvents.on("waiting", async (job) => {
        console.log("QUEUE_USER waiting painting: ", job.jobId);
        const getJob = await bullMQ.getJob(job.jobId);
        console.log("QUEUE_USER waiting getJob: ", getJob);
        job
    });
})();