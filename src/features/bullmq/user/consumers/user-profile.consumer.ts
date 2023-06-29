import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../../../core/bullmq';
import { QUEUE_USER_PROFILE } from '../../../../config/constants';

const bullMQ = new BullMQ();
export const UserProfileConsumer = async() => {
    console.log('QUEUE_USER_PROFILE - WORKER: ', QUEUE_USER_PROFILE);
    
    //User profile worker
    return await bullMQ.runWorker({
        queueName: QUEUE_USER_PROFILE,
        onJob: (job: Job) => {
            console.log('QUEUE_USER_PROFILE - onJob - job: ', job.data);
        },
        onProgress: (job: Job) => {
            job.updateProgress(50);
            console.log('QUEUE_USER_PROFILE - onProgress - job: ', job.data);
            if (!job.data.status) {
                
                //throw new Error('FAILED JOB QUEUE_USER_PROFILE');
            }
            job.updateProgress(100);
        },
        onCompleted: (job: Job) => {
            console.log('QUEUE_USER_PROFILE - onCompleted - job: ', job.data);
        }
    });
};