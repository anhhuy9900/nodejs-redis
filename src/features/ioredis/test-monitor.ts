import Redis from '../../core';
(async() => {
    const redis = new Redis();
    const monitor = await redis.client.monitor();
    monitor.on("MONITOR: ", console.log);
    // Any other tasks
    monitor.disconnect();
})();