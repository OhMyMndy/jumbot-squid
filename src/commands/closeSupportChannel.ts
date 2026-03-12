import { ROLE_ADMIN_ID, ROLE_HELPER_ID, TICKET_STATUS_CLOSED } from '../util/constants.ts';
import { apiClient } from '../util/helpers.ts';
import type { Command } from './index.ts';
const client = apiClient

export default {
	data: {
		name: 'close',
		description: 'Close an open ticket channel',
	},
	async execute(interaction) {
		console.log("channel id", interaction.channelId)
		const isAdmin = interaction.member?.roles in [ROLE_ADMIN_ID, ROLE_HELPER_ID]
		if (isAdmin) {
			interaction.reply("Only admin and helpers can use this")
			return
		}
		let ticket = await client.request({
			resource: "tickets",
			action: "get",
			params: {
				filter: {
					channel_id: interaction.channelId
				},
			}
		})
		if (ticket.data.data) {
			const messages = (await interaction.channel?.messages.fetch())?.map(function (message) {
				return {
					"author": message.author.username,
					"author_id": message.author.id,
					"content": message.content,
					"createdAt": message.createdAt
				}
			}).reverse() || []
			// console.log(messages)
			ticket = await client.request({
				resource: "tickets",
				action: "update",
				params: {
					filter: {
						id: ticket.data.data.id,
					},
					values: {
						status_id: TICKET_STATUS_CLOSED,
						conversation: JSON.stringify(messages)
					}
				}
			})
			await interaction.reply(`Closed channel ticket ${ticket.data.data.id}`)
			await interaction.channel?.delete()
			console.log("close channel ticket", ticket.data.data)
		}
	},
} satisfies Command;
