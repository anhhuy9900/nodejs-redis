import { BullMQ } from "../../core/bullmq";
import { QUEUE_FLOW_TEST, QUEUE_FLOW_CHILD_TEST } from "../../config/constants";

const bullMQ = new BullMQ();
(async () => {
  const tree: any = await bullMQ.addFlowProducer({
    name: "Root parent flow test",
    queueName: QUEUE_FLOW_TEST,
    data: {
        title: "root parent flow test",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    children: [
      {
        name: "Test child queue test",
        data: {
          id: "1232324423",
          title: "test-flow-child-1",
          content: "test-post-child-1",
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        queueName: QUEUE_FLOW_CHILD_TEST,
      },
    ],
  });

  const { job } = tree;

  const getFlowTree = await bullMQ.getFlowProducer({
    id: job.id,
    queueName: job.queue.name,
  });

  console.log("getFlowTree: ", getFlowTree);
  if (getFlowTree.children) {
    getFlowTree.children.forEach((child) => {
      console.log("getFlowTree - child: ", child.job);
      child.job.updateProgress(100);
    });
  }
})();
