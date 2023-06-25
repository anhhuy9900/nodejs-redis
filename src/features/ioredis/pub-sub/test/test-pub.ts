import reader from 'readline-sync';
import Redis from '../../../../core';
const sleep = (sec: number) => new Promise(resolve => setTimeout(resolve, sec * 1000));
const testPublish = async () => {
    const redis = new Redis();
    // await sleep(4);
    // redis.publish('test', 'huy');
    // await sleep(8);
    // redis.publish('test', 'sdgdsgsd22222');
    // console.log('TEST PUBLISH MESSAGE');
    while(true) {
        let input = reader.question("Data: ");
        if (input === 'exit') {
            process.exit(0);
        }
        let messages: string[] | string = input;
        switch (input) {
            case 'm':
                messages = ['test 1', 'test 2', 'test 3', 'test 4', 'test 5'];
                break;
        }
        try {
            await redis.publish('test_1', 'Test received from channel test_1');
            if (Array.isArray(messages)) {
                for (let message of messages) {
                    await redis.publish('test', message);
                }
            } else {
                await redis.publish('test', input);
            }
            console.log('TEST PUBLISH MESSAGE');
        } catch (error) {
            console.log("Caught publish while sending:", error);
        }
    }
}
testPublish();

