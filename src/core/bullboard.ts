import Queue from "bull";
import QueueMQ from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { connection } from "./connection";
import {
  QUEUE_TEST,
  QUEUE_FLOW_TEST,
  QUEUE_FLOW_CHILD_TEST,
  QUEUE_USER,
  QUEUE_USER_PROFILE,
  QUEUE_USER_ACTIONS,
  QUEUE_USER_SEND_MAIL,
} from "../config/constants";

const config = {
  redis: connection,
};
const testQueue = new Queue(QUEUE_TEST, config); // if you have a special connection to redis.
const queueFlowTest = new Queue(QUEUE_FLOW_TEST, config);
const queueFlowChildTest = new Queue(QUEUE_FLOW_CHILD_TEST, config);
const queueUsers = new Queue(QUEUE_USER, config);
const queueUserProfiles = new Queue(QUEUE_USER_PROFILE, config);
const queueUserActions = new Queue(QUEUE_USER_ACTIONS, config);
const queueUserSendMail = new Queue(QUEUE_USER_SEND_MAIL, config);

const serverAdapter = new ExpressAdapter();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullAdapter(testQueue),
    new BullAdapter(queueFlowTest),
    new BullAdapter(queueFlowChildTest),
    new BullAdapter(queueUsers),
    new BullAdapter(queueUserProfiles),
    new BullAdapter(queueUserActions),
    new BullAdapter(queueUserSendMail),
  ],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/queues");

export default serverAdapter.getRouter();
