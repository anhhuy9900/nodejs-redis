import {
  Queue,
  Worker,
  Job,
  JobData,
  QueueEvents,
  FlowProducer,
  JobNode,
} from "bullmq";
import IORedis from 'ioredis';
import {
  IBullMQ,
  BulkDataQueue,
  FlowProducerParams,
  GetFlowProducerParams,
  WorkerBody
} from "./bullmq.interfaces";
import { connection as redisConnection, RedisConnection } from '../connection';

export interface IQueueConfig {
  connection: any,
  defaultJobOptions: {
    attempts: number,
    backoff: number,
  },
}

export class BullMQ implements IBullMQ {
  public queue: any;
  public queueScheduler: any;
  public worker: any;
  public queueEvents: any;
  public redis: any;
  public flow: any;
  protected connection: any;
  protected queueConfig: IQueueConfig;

  constructor() {
    this.initial();
    this.queueConfig = {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 5,
        backoff: 500,
      },
    };
  }

  async initial() {    
    this.connection = new IORedis(redisConnection);
    this.connection.on("connect", () => {
        console.log("BullMQ - Redis was connected");
    });
    this.connection.on("error", function(error: Object) {
        console.log("BullMQ - Redis has error : ", error);
    });

    //if (this.connection) {
      // this.queue = new Queue("", {
      //   connection: this.connection,
      //   defaultJobOptions: {
      //     attempts: 5,
      //     backoff: 500,
      //   },
      // });
      // this.queueScheduler = new QueueScheduler("", { connection: this.connection });
      // this.worker = new Worker("", async (job) => {}, {
      //   connection: this.connection,
      // });
      // this.queueEvents = new QueueEvents("", { connection: this.connection });
      // this.flow = new FlowProducer({ connection: this.connection });
    //}
  }

  async setQueue(queueName: string): Promise<this> {
    console.log('========= BullMQ - setQueue ====== ')
    this.queue = new Queue(queueName, { connection: this.connection });
    return this;
  }

  /**
   * !Delayed jobs will only be processed if there is at least one QueueScheduler instance configured in the Queue
   * !https://docs.bullmq.io/guide/jobs/delayed
   * @param queueName 
   * @returns 
   */
  async getQueue(queueName: string): Promise<this> {
    console.log('========= BullMQ - getQueue ====== ')    
    this.queue = new Queue(queueName, { ...this.queueConfig });
    return this;
  }

  async addQueue(
    queueName: string,
    data: JobData | object | string,
    config?: object
  ): Promise<Job | any> {
    console.log('========= BullMQ - addQueue ====== ')    
    const queue = new Queue(queueName, { ...this.queueConfig });
    queue.add(queueName, data, config);
    return queue;
  }

  async addBulk(bulkDataQueue: BulkDataQueue[]): Promise<Job[]> {
    // const jobs = await queue.addBulk([
    //     { name, data: { paint: 'car' } },
    //     { name, data: { paint: 'house' } },
    //     { name, data: { paint: 'boat' } },
    //   ]);
    console.log('========= BullMQ - addBulk ====== ')
    const queue = new Queue('', { ...this.queueConfig });
    return queue.addBulk(bulkDataQueue);
  }

  //Removes all jobs that are waiting or delayed, but not active, completed or failed.
  async removeQueue(queueName: string): Promise<void> {
    console.log('========= BullMQ - removeQueue ====== ')
    const queue = new Queue(queueName, { ...this.queueConfig });
    await queue.drain();
  }

  // Completely obliterates a queue and all of its contents.
  async obliterateQueue(): Promise<void> {
    await this.queue.obliterate();
  }

  async runWorker({
    queueName,
    onJob = (_job: Job) => {},
    onCompleted = (_job: Job) => {},
    onProgress = (_job: Job) => {},
    onWaiting = (_job: Job) => {},
    onFailed = (_job: Job) => {}
  }: WorkerBody): Promise<Worker> {
    console.log('========= BullMQ - runWorker ======')
    this.worker = new Worker(
      queueName,
      async (job) => {
        console.log("Job worker init: ", job.id);
        onJob(job);
      },
      { connection: this.connection, concurrency: 10, runRetryDelay: 2000 }
    );
    this.worker.on("completed", (job: Job) => {
      console.log("Job worker completed with job: ", job.id);
      onCompleted(job);
    });
    this.worker.on("progress", (job: Job) => {
      console.log("Job worker progress with job: ", job.id);
      onProgress(job);
    });
    this.worker.on("waiting", (job: Job) => {
      console.log("Job worker waiting with job: ", job.id);
      onWaiting(job);
    });
    this.worker.on("failed", (job: Job) => {
      console.log("Job worker failed with job: ", job.id);
       onFailed(job);
    });
    return this.worker;
  }

  async getQueueEvents(queueEventsName: string): Promise<QueueEvents> {
    console.log('========= BullMQ - getQueueEvents ======')
    this.queueEvents = new QueueEvents(queueEventsName, {
      connection: this.connection
    });
    this.queueEvents.on("completed", (job: Job) => {
      console.log("getQueueEvents completed painting: ", job);
    });

    this.queueEvents.on("failed", () => {
      console.error("getQueueEvents error painting", this.failedReason);
    });

    this.queueEvents.on("waiting", (job: Job) => {
      console.log("getQueueEvents waiting painting: ", job);
    });

    this.queueEvents.on("active", (job: Job) => {
      console.log("getQueueEvents active painting: ", job);
    });

    this.queueEvents.on("stalled", (job: Job) => {
      console.log("getQueueEvents stalled painting: ", job);
    });

    this.queueEvents.on("progress", (job: Job) => {
      console.log("getQueueEvents progress painting: ", job);
    });

    this.queueEvents.on("paused", () => {
      console.log("getQueueEvents paused painting: ");
    });

    this.queueEvents.on("delayed", (job: Job) => {
      console.log("getQueueEvents delayed painting: ", job);
    });

    return this.queueEvents;
  }

  async getJob(id: string): Promise<Job<any> | undefined> {
    console.log('========= BullMQ - getJob ======')
    return this.queue.getJob(id);
  }

  async addFlowProducer(params: FlowProducerParams): Promise<JobNode> {
    console.log('========= BullMQ - addFlowProducer ======')
    // const flow = new FlowProducer({ connection: this.connection });

    const originalTree = await this.flow.add(params);
    return originalTree;
  }

  async getFlowProducer(params: GetFlowProducerParams): Promise<JobNode> {
    console.log('========= BullMQ - getFlowProducer ======')
    const tree = await this.flow.getFlow(params);
    return tree;
  }

  private failedReason(arg0: string, failedReason: any) {
    throw new Error("Function not implemented.");
  }
}
