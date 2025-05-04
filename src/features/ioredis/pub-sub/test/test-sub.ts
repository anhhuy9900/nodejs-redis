import express from 'express';
import axios from 'axios';
import ioredis from 'ioredis';
import Redis from '../../../../core';

const testSubscribe = async () => {
    const redis = new Redis();
    await redis.subscribe(['test', 'test_1']);
    await redis.onMessage((channel, msg) => {
        console.log(`Received from ${channel}  => MESSAGE: ${msg}`);
    });
}

testSubscribe();