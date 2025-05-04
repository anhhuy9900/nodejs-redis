import express from 'express';
import Redis from '../core';

const redis = new Redis();
const runDelete = async (): Promise<void> => {
    const key = 'test-post-placeholder';
    const isExists = await redis.exists(key);
    const isDeleted = await redis.del(key);
    console.log('REDIS CACHE NEED TO DELETED IS EXISTS :', isExists);
    console.log('DELETE REDIS CACHE SUCCESS:', isDeleted);
}

const checkCacheIsExists = async (): Promise<void> => {
    const key = 'test-post-placeholder';
    const isExists = await redis.exists(key);
    console.log('REDIS CACHE IS EXISTS :', isExists);
}

const testMulti = async (): Promise<void> => {
    redis.multi()
        .set('test-multi', '11111111')
        .expire('test-multi', 10)    
        .get('test-multi')
        .exec((err: Error, results: any) => {
            console.log('EXEC MULTI: ', results);
        })
}

const testPipeline = async (): Promise<void> => {
    const pipeline = redis.pipeline();
    pipeline.set('test-pipeline', '11111111');
    pipeline.expire('test-pipeline', 10);
    pipeline.get('test-pipeline', (err: Error, result: any) => {
        console.log("🚀 ~ pipeline.get ~ result", result);
        // result === 'bar'
    })
    pipeline.exec((_err: Error, results: any) => {
        console.log('EXEC PIPELINE: ', results);
    })
    
    redis.client.commands('redis-cli', ['set', 'test-pipeline1', '11111111'], (err: Error, result: any) => {
    });
}

testPipeline();