import { BullMQ } from '../../core/bullmq';
import { QUEUE_TEST } from '../../config/constants';

(async() => {
    const bullMQ = new BullMQ();
    await bullMQ.getQueueEvents(QUEUE_TEST);
})();