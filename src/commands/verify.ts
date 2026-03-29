import type { Command } from './index.ts';
import { ApplicationCommandOptionType } from 'discord.js';


export default {
	data: {
		name: 'verify',
		description: 'Verify user!',
		options: [
			{
				name: "username",
				type: ApplicationCommandOptionType.User,
				description: "Username to lookup",
				// autocomplete: true,
				required: true
			}
		]
	},
	async execute(interaction) {
		await interaction.reply('Check')
		const reply = await interaction.fetchReply();
		console.log(reply)
	},
} satisfies Command;
