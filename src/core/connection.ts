import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '../config/constants';
export interface RedisConnection { 
    host: string;
    port: number | undefined;
    password?: string;
    maxRetriesPerRequest?: number | null;
};

//const redisUrl = 'redis://localhost:6379';
export const connection: RedisConnection = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    maxRetriesPerRequest: null,
};

