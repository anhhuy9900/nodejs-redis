import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../../core/bullmq';
import { QUEUE_USER_PROFILE } from '../../../config/constants';

const bullMQ = new BullMQ();
(async() => {
    console.log('QUEUE_USER_PROFILE - WORKER: ', QUEUE_USER_PROFILE);
    
    //User profile worker
    const workerUserProfile = await bullMQ.runWorker({
        queueName: QUEUE_USER_PROFILE,
        onJob: (job: Job) => {
            console.log('QUEUE_USER_PROFILE - onJob - job: ', job.data);
        },
        onProgress: (job: Job) => {
            console.log('QUEUE_USER_PROFILE - onProgress - job: ', job.data);
            if (!job.data.status) {
                //job.updateProgress(50);
                //throw new Error('FAILED JOB QUEUE_USER_PROFILE');
            }
        },
        onCompleted: (job: Job) => {
            console.log('QUEUE_USER_PROFILE - onCompleted - job: ', job.data);
            //job.updateProgress(100);
        }
    });
})();