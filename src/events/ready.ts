import { Events } from 'discord.js';
import type { Event } from './index.ts';

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log('Intents:', client.options.intents.toArray());


		const channel = client.channels.cache.get('1469018777369972769');

		if (!channel) {
			console.log('Channel not in cache — bot cannot see it');
			return;
		}


	},
} satisfies Event<Events.ClientReady>;
