import {
    Job,
  } from "bullmq";
import { BullMQ } from '../../core/bullmq';
import { QUEUE_TEST, QUEUE_FLOW_CHILD_TEST } from '../../config/constants';

(async() => {
    const bullMQ = new BullMQ();
    // const worker = await bullMQ.runWorker(QUEUE_FLOW_CHILD_TEST, async (job) => {
    //     console.log('getWorker - job: ', job.data)}
    // );
    //console.log('worker: ', worker);

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
})();