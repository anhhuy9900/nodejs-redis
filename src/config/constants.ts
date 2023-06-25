import dotenv from 'dotenv';
import path from 'path';

const config = dotenv.config({ path: path.resolve(__dirname, '../../.env') }).parsed;

export const APP_PORT = config ? config.PORT : 3000;
// REDIS
export const REDIS_HOST = config ? config.REDIS_HOST : 'localhost';
export const REDIS_PORT: any = config ? config.REDIS_PORT : 6379;
export const REDIS_PASSWORD = config ? config.REDIS_PASSWORD : '';

export const QUEUE_TEST = config ? config.QUEUE_TEST : '';
export const QUEUE_FLOW_TEST = config ? config.QUEUE_FLOW_TEST : '';
export const QUEUE_FLOW_CHILD_TEST = config ? config.QUEUE_FLOW_CHILD_TEST : '';
export const QUEUE_USER = config ? config.QUEUE_USER : '';
export const QUEUE_USER_PROFILE = config ? config.QUEUE_USER_PROFILE : '';
export const QUEUE_USER_SEND_MAIL = config ? config.QUEUE_USER_SEND_MAIL : '';
export const QUEUE_USER_ACTIONS = 'user-actions';