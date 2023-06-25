import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '../config/constants';
export interface RedisConnection { 
    host: string;
    port: number | undefined;
    password?: string;
    maxRetriesPerRequest?: number | null;
};

export const connection: RedisConnection = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    // maxRetriesPerRequest: null,
};
console.log('====== REDIS connection =======> ', connection)

//const redisUrl = 'redis://localhost:6379';