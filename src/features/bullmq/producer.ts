import { BullMQ } from '../../core/bullmq';
import { QUEUE_TEST } from '../../config/constants';

const bullMQ = new BullMQ();
(async() => {
    await bullMQ.getQueue(QUEUE_TEST);
    await bullMQ.setQueue(QUEUE_TEST);
    await bullMQ.addQueue('test-1', {
        jobId: 'huy111112222',
        id: '1232324423',
        title: 'test-post-placeholder-3',
        content: 'test-post-placeholder-3',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    }, { 
       delay: 5000
    });
    // const job = await bullMQ.getJob('10');
    //console.log('job', job);
})();