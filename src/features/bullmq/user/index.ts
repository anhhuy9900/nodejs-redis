import express from 'express';
import { faker } from '@faker-js/faker';
import { BullMQ } from '../../../core/bullmq';
import { QUEUE_USER, QUEUE_USER_PROFILE, QUEUE_USER_SEND_MAIL } from '../../../config/constants';


const app = express.Router();
let queue: BullMQ;
// (async() => {
    
// })();

const getQueue =  async() => {
    const bullMQ = new BullMQ();
    queue = await bullMQ.getQueue(QUEUE_USER);
    await queue.setQueue(QUEUE_USER);
    return queue;
}

app.post("/create", async (req, res) => {
    try {
        const bullMQ = await getQueue();
        queue = await bullMQ.getQueue(QUEUE_USER);
        console.log("🚀 create - user ~ req: ", req.body);
        const body = req.body;
        await queue.addQueue(QUEUE_USER, {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            delay: 2000,
            attempts: 2
        });
        return res.status(200).send(body);	
    } catch(err: any) {
        console.log("🚀 ~ ioredis/pub-user ~ err: ", err);
        res.status(500).send({message: err.message});
    }
});

app.post("/create-multi", async (req, res) => {
    try {
        const body = req.body;
        const data = [...Array(5)].map((item) => ({
            name: QUEUE_USER,
            data: {
                fullName: faker.name.fullName(),
                email: faker.internet.email().toLowerCase().trim(),
                age: 32,
                address: faker.address.streetAddress(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            opts: {
                lifo: true
            }
        }));
        const queue = await getQueue();
        await queue.addBulk(data);

        return res.status(200).send(body);	
    } catch(err: any) {
        console.log("🚀 ~ ioredis/pub-user ~ err: ", err);
        res.status(500).send({message: err.message});
    }
});

app.post("/create-flow", async (req, res) => {
    try {
        console.log("🚀 create - user ~ req: ", req.body);
        const bullMQ = new BullMQ();
        const body = req.body;
        const data = {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        //add flow tree
        const userTree = await bullMQ.addFlowProducer({
            name: "Create User",
            queueName: QUEUE_USER,
            data: {
                title: "Create User profile and send mail to user",
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            children: [
              {
                queueName: QUEUE_USER_PROFILE,
                name: "Create User Profile",
                data: {
                    ...data,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
              },
              {
                queueName: QUEUE_USER_SEND_MAIL,
                name: "Send mail to user",
                data: {
                    email: data.email,
                    subject: 'Create User',
                    from: 'admin@email.com',
                    to: 'test@email.com',
                    createdAt: new Date(),
                }
              },
            ],
          });
        return res.status(200).send(body);	
    } catch(err: any) {
        console.log("🚀 ~ ioredis/pub-user ~ err: ", err);
        res.status(500).send({message: err.message});
    }
});

export default app;

