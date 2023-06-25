import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../../core/bullmq';
import { QUEUE_USER_SEND_MAIL } from '../../../config/constants';

const bullMQ = new BullMQ();
(async() => {
    console.log('QUEUE_USER_SEND_MAIL - WORKER: ', QUEUE_USER_SEND_MAIL);
    
    // User send mail worker
    const workerUserSendMail = await bullMQ.runWorker({
        queueName: QUEUE_USER_SEND_MAIL,
        onJob: (job: Job) => {
            console.log('QUEUE_USER_SEND_MAIL - onJob - job: ', job.data);
        },
        onProgress: (job: Job) => {
            console.log('QUEUE_USER_SEND_MAIL - onProgress - job: ', job.data);
            if (!job.data.status) {
                //job.updateProgress(50);
                //throw new Error('FAILED JOB QUEUE_USER_SEND_MAIL');
            }
        },
        onCompleted: (job: Job) => {
            console.log('QUEUE_USER_SEND_MAIL - onCompleted - job: ', job.data);
            //job.updateProgress(100);
        }
    });
})();