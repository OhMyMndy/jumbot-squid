import { URL } from 'node:url';
import { ChannelType, Events, PermissionsBitField } from 'discord.js';
import { loadCommands } from '../util/loaders.ts';
import type { Event } from './index.ts';
import { ROLE_ADMIN_ID, ROLE_HELPER_ID, TICKET_STATUS_OPEN, TICKETS_CATEGORY_ID } from "../util/constants.ts"
import { apiClient } from '../util/helpers.ts';


const client = apiClient

const commands = await loadCommands(new URL('../commands/', import.meta.url));



export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isCommand()) {
			const command = commands.get(interaction.commandName);

			if (!command) {
				throw new Error(`Command '${interaction.commandName}' not found.`);
			}

			await command.execute(interaction);
		}
		if (interaction.isButton()) {
			if (interaction.customId == "open-support-channel" && interaction.member && interaction.guild) {
				await interaction.deferUpdate()
				try {
					let ticket = await client.request({
						resource: "tickets",
						action: "create",
						params: {
							values: {
								username: interaction.member.user.username,
								discord_channel_url: "https://discord.com",
								status: TICKET_STATUS_OPEN
							}
						}
					})
					// TODO: check if channel already exists
					const channel = await interaction.guild?.channels.create({
						name: `ticket-${ticket.data.data.code}`,
						type: ChannelType.GuildText,
						parent: TICKETS_CATEGORY_ID,
						// SEE: https://stackoverflow.com/questions/79434000/discord-js-v14-add-member-to-a-channel
						permissionOverwrites: [
							{
								id: interaction.guild.id,
								deny: [
									PermissionsBitField.Flags.ViewChannel
								],
							},
							{
								id: interaction.applicationId,
								allow: [
									PermissionsBitField.Flags.ViewChannel,
									PermissionsBitField.Flags.SendMessages,
									PermissionsBitField.Flags.SendMessagesInThreads
								]
							}, {
								id: interaction.member.user.id,
								allow: [
									PermissionsBitField.Flags.ViewChannel,
									PermissionsBitField.Flags.SendMessages,
									PermissionsBitField.Flags.SendMessagesInThreads
								]
							},
							{
								// admin
								id: ROLE_ADMIN_ID,
								allow: [
									PermissionsBitField.Flags.SendMessages,
									PermissionsBitField.Flags.SendMessagesInThreads
								]
							},
							{
								// helper
								id: ROLE_HELPER_ID,
								allow: [
									PermissionsBitField.Flags.SendMessages,
									PermissionsBitField.Flags.SendMessagesInThreads
								]
							},
						]
					})
					console.log(`Created support channel for ${interaction.member.user.id} ${interaction.member.user.username}`, channel.id)

					var response = await channel.send("Hi there, this is the template on what for information you need to provide to us")
					ticket = await client.request({
						resource: "tickets",
						action: "update",
						params: {
							filter: {
								id: ticket.data.data.id,
							},
							values: {
								discord_channel_url: channel.url,
								channel_id: channel.id
							}
						}
					})
				} catch (e) {
					console.error(`Error while creating support channel for ${interaction.member.user.id} ${interaction.member.user.username}: `, e)
				}

			}
		}
	},
} satisfies Event<Events.InteractionCreate>;
