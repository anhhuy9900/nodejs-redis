import { Queue, Worker, Job, JobData, QueueEvents, JobNode, WorkerOptions } from "bullmq";

export interface BulkDataQueue {
    name: string;
    data: JobData | object | string;
    opt?: WorkerOptions
}

export interface WorkerBody {
  queueName: string,
  onJob?: (job: Job) => void,
  onCompleted?: (job: Job) => void,
  onProgress?: (job: Job) => void,
  onWaiting?: (job: Job) => void,
  onFailed?: (job: Job) =>void
}

export interface FlowProducerChildren {
    name: string,
    data: object,
    queueName: string,
    children?: FlowProducerChildren[],
}
export type FlowProducerParams = {
    //root-job
    name: string;
    queueName: string;
    data: object;
    children?: FlowProducerChildren[];
}

export type GetFlowProducerParams = {
    id: string;
    queueName: string;
    depth?: number; // get only the first level of children
    maxChildren?: number; // get only 2 children per node
}

export interface IBullMQ {
  queue: Queue;
  worker: Worker;
  queueEvents: QueueEvents;
  setQueue(queueName: string): Promise<this>;
  getQueue(queueName: string): Promise<this>;
  addQueue(queueName: string, data: JobData, config?: object): Promise<Job>;
  addBulk(bulkDataQueue: BulkDataQueue[]): Promise<Job[]>;
  removeQueue(queueName?: string): Promise<void>;
  obliterateQueue(): Promise<void>;
  runWorker(body: WorkerBody): Promise<Worker>;
  getQueueEvents(queueEventsName: string): Promise<QueueEvents>;
  addFlowProducer(params: FlowProducerParams): Promise<object>;
  getFlowProducer(params: GetFlowProducerParams): Promise<JobNode>;
}
