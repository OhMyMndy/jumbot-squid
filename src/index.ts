import process from 'node:process';
import { URL } from 'node:url';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { loadEvents } from './util/loaders.ts';

// Initialize the client
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions
	],
	partials: [
		Partials.Message,   // allow uncached messages
		Partials.Channel,   // allow uncached channels
		Partials.Reaction,  // allow uncached reactions
	],
});

// Load the events and commands
const events = await loadEvents(new URL('events/', import.meta.url));


// Register the event handlers
for (const event of events) {
	console.log(`Registering ${event.name}`)
	client[event.once ? 'once' : 'on'](event.name, async (...args) => {
		try {
			console.log(`Event ${event.name} ${typeof (event)}`)
			await event.execute(...args);
		} catch (error) {
			console.error(`Error executing event ${String(event.name)}:`, error);
		}
	});
}
client.on('error', console.error);


client.on('raw', (data) => {
	console.log('raw event:', data.t);
});

// Login to the client
void client.login(process.env.DISCORD_TOKEN);
