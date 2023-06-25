import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../../core/bullmq';
import { QUEUE_USER, QUEUE_USER_PROFILE, QUEUE_USER_SEND_MAIL, QUEUE_USER_ACTIONS } from '../../../config/constants';

const bullMQ = new BullMQ();
(async() => {
    console.log('================== USER FLOW TREE WORKER  ==================');
    const workerUser = await bullMQ.runWorker({
        queueName: QUEUE_USER,
        onJob: (job: Job) => {
            console.log('USER FLOW TREE WORKER - onJob - job: ', job.data);
            if (job.data.status === false) {
                job.updateProgress(50);
                //throw new Error('FAILED JOB QUEUE_USER');
            }
        },
        onProgress: (job: Job) => {
            console.log('USER FLOW TREE WORKER - onProgress - job: ', job.data);
            // if (job.data.status === false) {
            //     job.updateProgress(100);
            //     //throw new Error('FAILED JOB QUEUE_USER');
            // }
        },
        onCompleted: async (job: Job) => {
            console.log('USER FLOW TREE WORKER - onCompleted - job: ', job.data);

            //add flow tree
            const userTree = await bullMQ.addFlowProducer({
                name: "Create User Actions",
                queueName: QUEUE_USER_ACTIONS,
                data: {},
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
})();