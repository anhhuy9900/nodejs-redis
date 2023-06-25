import IORedis from 'ioredis';
import { connection } from './connection';

class Redis {
    public client: any;
    public isConnected: boolean | undefined;

    constructor() {
        this.connect();
    }

    /**
     * Redis connect with server cache
     */
    async connect(): Promise<void> {
        console.log("====== Redis Init =========");
        if (!this.client) {
            await new Promise((resolve, reject) => {
                this.client = new IORedis(connection);

                this.client.on("connect", () => {
                    console.log("Redis was connected");
                    this.isConnected = true;
                    resolve(true);
                });
                this.client.on("error", function(error: Object) {
                    console.log("Redis has error : ", error);
                    reject(error);
                });
            });
        }
    }
    
    public async set(key: string, value: string): Promise<void> {
        this.client.set(key, value, (err: any, reply: any) => {
            return err ? err : reply;
        });
    }

    public async get(key: string): Promise<string> {
        return this.client.get(key, (err: any, reply: any) => {
            return err ? err : reply;
        });
    }

    public async del(key: string): Promise<void> {
        return this.client.del(key, (err: any, reply: any) => {
            return err ? err : reply;
        });
    }

    public async list(pattern: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.client.keys(pattern, (err: any, reply: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }   

    public async quit(): Promise<void> {
        return this.client.quit((err: any, reply: any) => {
            return err ? err : reply;
        });
    }

    public async flushdb(): Promise<void> {
        return this.client.flushdb((err: any, reply: any) => {
            return err ? err : reply;
        });
    }

    public async flushAll(): Promise<void> {
        return this.client.flushall((err: any, reply: any) => {
            return err ? err : reply;
        });
    }

    public async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern, (err: any, reply: string[] | PromiseLike<string[]>) => {
            return err ? err : reply;
        });
    }

    public async exists(key: string): Promise<boolean> {
        return this.client.exists(key, (err: any, reply: number) => {
            return err ? err : reply;
        });
    }

    public async type(key: string): Promise<string> {
        return this.client.type(key, (err: any, reply: string | PromiseLike<string>) => {
            return err ? err : reply;
        });
    }

    public async expire(key: string, seconds: number): Promise<void> {
        return this.client.expire(key, seconds, (err: any, reply: any) => {
            return err ? err : reply;
        });
    }
    
    /**
     * A publisher in a pub/sub system may assume that a subscriber is listening, when in fact it is not.
     * A factory may utilize a pub/sub system where equipment can publish problems or failures to a subscriber that displays and logs those problems. 
     * If the logger fails (crashes), equipment problem publishers won't necessarily receive notice of the logger failure, 
     * and error messages will not be displayed or recorded by any equipment on the pub/sub system
     * @param channel 
     * @param message 
     * @returns 
     */
    public async publish(channel: string, message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            resolve(this.client.publish(channel, message));
        });
    }

    /**
     * subscribe: means that we successfully subscribed to the channel given as the second element in the reply.
     * The third argument represents the number of channels we are currently subscribed to.
     * @param channels 
     */
    public subscribe(channels: string | string[]): any {
        console.log("🚀 ~ file: redis.ts ~ line 127 ~ Redis ~ subscribe ~ channels", channels);
        this.client.subscribe(channels, (err: any, count: any) => {
            if (err) {
                // Just like other commands, subscribe() can fail for some reasons,
                // ex network issues.
                console.error("Failed to subscribe: %s", err.message);
            } else {
                // `count` represents the number of channels this client are currently subscribed to.
                console.log(
                  `Subscribed successfully! This client is currently subscribed to ${count} channels.`
                );
            }
        });
    }

    public onMessage(callback: (channel: string, message: string) => void): any {
        this.client.on('message', (channel: string, message: string) => {
            callback(channel, message);
        });
            
    }

    /**
     * Transaction
     * Most of the time, the transaction commands multi & exec are used together with pipeline. 
     * Therefore, when multi is called, a Pipeline instance is created automatically by default, so you can use multi just like pipeline
     *  redis
        .multi()
        .set("foo", "bar")
        .get("foo")
        .exec((err, results) => {
            // results === [[null, 'OK'], [null, 'bar']]
        });
     * @param args 
     * @returns 
     */
    public multi(...args: any[]): any {
        return this.client.multi(...args);
    }

    /**
     * Redis pipelining is a technique for improving performance by issuing multiple commands at once without waiting for the response to each individual command
     * If you want to send a batch of commands (e.g. > 5), you can use pipelining to queue the commands in memory and then send them to Redis all at once. 
     * This way the performance improves by 50%~300% (See benchmark section).
     * @param args 
     * @returns 
     */
    public pipeline(...args: any[]): any {
        return this.client.pipeline(...args);
    }
}

export default Redis;
