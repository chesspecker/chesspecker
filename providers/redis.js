import IORedis from 'ioredis';
import {redisConfig} from '../config/config.js';

export default function createClient(task) {
	const redisClient = new IORedis(redisConfig.uri);
	redisClient.on('error', error => console.log('Redis Client Error', error));
	redisClient.on('connect', () => console.log(`Redis ready for ${task}`));
	return redisClient;
}
