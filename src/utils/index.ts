import { randomBytes } from 'crypto';
import { createHash } from 'crypto';

export const genId = () => {
	return randomBytes(3).toString('hex');
};

export const hash = (key: string) => {
	return createHash('sha1').update(key).digest('hex');
};

export const createImageUrl = () => {
	return `https://realrealreal-redis.s3.amazonaws.com/${~~(Math.random() * 198) + 1}.jpg`;
};
