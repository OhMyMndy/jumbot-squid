import { EmbedBuilder, Events, MessageReaction } from 'discord.js';
import type { Event } from './index.ts';
import { updateStarboard } from '../services/starboardService.ts';
import { GUILD_ID, STARBOARD_CHANNEL_ID, STARBOARD_LISTENING_CHANNEL_IDS, STARBOARD_LISTENING_EMOJI_IDS } from '../util/constants.ts';

export default {
	name: Events.MessageReactionAdd,
	async execute(interaction) {
		if (interaction.partial) {
			await interaction.fetch()
		}
		if (interaction.message.guildId != GUILD_ID) {
			console.log("Wrong guild ID for trackStarboardReactionAdd")
			return
		}
		console.log("trackStarboardReactionAdd")

		if (!STARBOARD_LISTENING_CHANNEL_IDS.includes(interaction.message.channelId)) {
			console.log(`Wrong channel ${interaction.message.channelId}`)
			return
		}
		const reactions = interaction.message.reactions.cache as Map<String, MessageReaction>
		for (let reaction of reactions.values()) {
			console.log(`Emoji: ${reaction.emoji.name} ${reaction.emoji.identifier}`)
			if (!STARBOARD_LISTENING_EMOJI_IDS.includes(reaction.emoji.identifier)) {
				console.log(`Not listening to emoji ${reaction.emoji.name}`)
				continue
			}
			let theReaction = await updateStarboard(interaction.message.channelId, interaction.message.id as String, interaction.message.guildId as String, reaction.emoji.identifier, reaction.count)
			if (theReaction && theReaction.count >= 5) {
				let starboardChannel = interaction.client.channels.cache.get(STARBOARD_CHANNEL_ID)
				if (starboardChannel && starboardChannel.isSendable()) {
					let postedMessage = await starboardChannel.messages.fetch(theReaction.posted_message_id)
					let channel = interaction.client.channels.cache.get(theReaction.channel_id)
					if (channel && channel.isSendable()) {
						let message = await channel?.messages.fetch(theReaction.message_id)
						console.log("message", interaction.message.toJSON())
						if (interaction.message.partial) {
							await interaction.message.fetch()
						}
						if (message.author.partial) {
							await message.author.fetch()
						}
						let member = interaction.message.guild?.members.cache.get(message.author.id)
						let emojiId = reaction.emoji.identifier.includes(":") ? `<:${reaction.emoji.identifier}>` : reaction.emoji.identifier
						const embed = new EmbedBuilder()
							.setAuthor({ name: member?.nickname ?? message.author?.displayName ?? '-', iconURL: message.author?.avatarURL() ?? 'https://i.imgur.com/AfFp7pu.png' })
							.addFields(
								{ name: "", value: '>>> ' + interaction.message.content + '' },
								{ name: "", value: `${decodeURIComponent(emojiId)} x ${reaction.count}` }
							)

						if (interaction.message.attachments.first() != undefined) {
							embed.setImage(interaction.message.attachments.first()?.url as string)
						}

						if (postedMessage && !postedMessage.id) {
							postedMessage = await starboardChannel.send({ embeds: [embed], })
							await updateStarboard(interaction.message.channelId as String, interaction.message.id as String, interaction.message.guildId as String, reaction.emoji.identifier, reaction.count, postedMessage.id)
						} else {
							await postedMessage.edit({ embeds: [embed], });
						}
					}
				} else {
					console.log("Channel not found at trackStarboardReactionAdd")
				}

			} else {
				console.log("reaction count low")
			}
		}
	}
} satisfies Event<Events.MessageReactionAdd>;
