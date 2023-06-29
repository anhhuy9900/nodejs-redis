import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../../../core/bullmq';
import { QUEUE_USER_SEND_MAIL } from '../../../../config/constants';

const bullMQ = new BullMQ();
export const UserSendMailConsumer = async() => {
    console.log('QUEUE_USER_SEND_MAIL - WORKER: ', QUEUE_USER_SEND_MAIL);
    
    // User send mail worker
    return await bullMQ.runWorker({
        queueName: QUEUE_USER_SEND_MAIL,
        onJob: (job: Job) => {
            console.log('QUEUE_USER_SEND_MAIL - onJob - job: ', job.data);
        },
        onProgress: (job: Job) => {
            job.updateProgress(50);
            console.log('QUEUE_USER_SEND_MAIL - onProgress - job: ', job.data);
            if (!job.data.status) {
                
                //throw new Error('FAILED JOB QUEUE_USER_SEND_MAIL');
            }
            job.updateProgress(100);
        },
        onCompleted: (job: Job) => {
            console.log('QUEUE_USER_SEND_MAIL - onCompleted - job: ', job.data);
            
        }
    });
};