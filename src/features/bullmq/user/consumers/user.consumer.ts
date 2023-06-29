import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../../../core/bullmq';
import { QUEUE_USER, QUEUE_USER_PROFILE, QUEUE_USER_SEND_MAIL } from '../../../../config/constants';

const bullMQ = new BullMQ();
export const UserConsumer = async() => {
    console.log('QUEUE_USER - WORKER: ', QUEUE_USER);
    
    return await bullMQ.runWorker({
        queueName: QUEUE_USER,
        onJob: (job: Job) => {
            console.log('QUEUE_USER - onJob - job: ', job.data);
        },
        onProgress: (job: Job) => {
            job.updateProgress(50);
            console.log('QUEUE_USER - onProgress - job: ', job.data);
            // if (job.data.status === false) {
            //     job.updateProgress(100);
            //     //throw new Error('FAILED JOB QUEUE_USER');
            // }
            job.updateProgress(100);
        },
        onCompleted: async (job: Job) => {
            console.log('QUEUE_USER - onCompleted - job: ', job.data);
            
            // const queue = await bullMQ.getQueue(QUEUE_USER_PROFILE);
            // await queue.setQueue(QUEUE_USER_PROFILE);
            // await queue.addQueue(QUEUE_USER_PROFILE, {
            //     ...job.data,
            //     createdAt: new Date(),
            //     updatedAt: new Date(),
            // }, {
            //     delay: 1000,
            //     attempts: 2
            // });
        }
    });
};