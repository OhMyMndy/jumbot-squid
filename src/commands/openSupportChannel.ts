import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import type { Command } from './index.ts';

export default {
	data: {
		name: 'open-support-channel',
		description: 'Post the open support channel message',
		// guildId: "1469018776702947433"
	},
	async execute(interaction) {
		// await interaction.reply('Here is how and what', catch );
		const openTicketButton = new ButtonBuilder()
			.setCustomId("open-support-channel")
			.setLabel("Open support channel")
			.setStyle(ButtonStyle.Primary)

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(openTicketButton)
		// const row = new DataRow


		await interaction.reply({
			content: "What do you want to do?",
			components: [row]
		})
	},
} satisfies Command;
