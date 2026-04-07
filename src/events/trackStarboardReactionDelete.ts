import { Events, MessageReaction, } from 'discord.js';
import type { Event } from './index.ts';
import trackStarboardReactionAdd from './trackStarboardReactionAdd.ts';

export default {
	name: Events.MessageReactionRemove,
	async execute(interaction) {
		await trackStarboardReactionAdd.execute(interaction)
	}
} satisfies Event<Events.MessageReactionRemove>;
