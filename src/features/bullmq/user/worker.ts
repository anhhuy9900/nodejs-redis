import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../../core/bullmq';
import { QUEUE_USER, QUEUE_USER_PROFILE, QUEUE_USER_SEND_MAIL } from '../../../config/constants';

const bullMQ = new BullMQ();
(async() => {
    console.log('QUEUE_USER - WORKER: ', QUEUE_USER);
    
    const workerUser = await bullMQ.runWorker({
        queueName: QUEUE_USER,
        onJob: (job: Job) => {
            console.log('QUEUE_USER - onJob - job: ', job.data);
            if (job.data.status === false) {
                job.updateProgress(50);
                //throw new Error('FAILED JOB QUEUE_USER');
            }
        },
        onProgress: (job: Job) => {
            console.log('QUEUE_USER - onProgress - job: ', job.data);
            // if (job.data.status === false) {
            //     job.updateProgress(100);
            //     //throw new Error('FAILED JOB QUEUE_USER');
            // }
        },
        onCompleted: async (job: Job) => {
            console.log('QUEUE_USER - onCompleted - job: ', job.data);
            job.updateProgress(100);
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

            //add flow tree
            const userTree = await bullMQ.addFlowProducer({
                name: "Create User Actions",
                queueName: QUEUE_USER,
                data: {
                    title: "Create User profile and send mail to user",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                children: [
                  {
                    queueName: QUEUE_USER_PROFILE,
                    name: "Create User Profile",
                    data: {
                        ...job.data,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                  },
                  {
                    queueName: QUEUE_USER_SEND_MAIL,
                    name: "Send mail to user",
                    data: {
                        email: job.data.email,
                        subject: 'Create User',
                        from: 'admin@email.com',
                        to: 'test@email.com',
                        createdAt: new Date(),
                    }
                  },
                ],
              });
        }
    });

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
            job.updateProgress(100);
        }
    });

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
            job.updateProgress(100);
        }
    });
})();