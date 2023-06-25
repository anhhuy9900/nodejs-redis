import Redis from '../../../../core';
import { channel } from './constant';

const subscribe = async () => {
    const redis = new Redis();
    await redis.subscribe([channel]);
    await redis.onMessage((channel, msg) => {
        console.log(`Received from ${channel}  => MESSAGE: ${msg}`);
    });
}

subscribe();