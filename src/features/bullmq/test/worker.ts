import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../../core/bullmq';
import { QUEUE_TEST } from '../../../config/constants';

export default async() => {
    const bullMQ = new BullMQ();
    //Test flow tree
    const worker = await bullMQ.runWorker({
        queueName: QUEUE_TEST,
        onJob: (job: Job) => {
            console.log('QUEUE_TEST - onJob - job: ', job.data);
        },
        onProgress: (job: Job) => {
            console.log('QUEUE_TEST - onProgress - job: ', job.data);
            if (!job.data.status) {
                //job.updateProgress(50);
                //throw new Error('FAILED JOB QUEUE_TEST');
            }
        },
        onCompleted: async (job) => {
            console.log('QUEUE_TEST - onCompleted - job: ', job.data);
        },
        
    });
};