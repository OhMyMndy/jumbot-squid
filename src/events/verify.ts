import { ContainerBuilder, Events, GuildMemberRoleManager, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, User } from 'discord.js';
import type { Event } from './index.ts';
import { INKLING_ROLE_ID, ONLY_SQUIDS_ID, SQUID_ROLE_ID } from "../util/constants.ts"

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isCommand() && interaction.commandName != "verify") return;
		if (interaction.isCommand() && interaction.isChatInputCommand()) {
			let user = interaction.options.getUser("username") as User

			let guildMember = interaction.guild?.members.cache.get(user.id)
			if (guildMember) {
				if (guildMember.roles instanceof GuildMemberRoleManager) {
					if (!guildMember.roles.cache.get(SQUID_ROLE_ID)) {
						await guildMember.roles.add(SQUID_ROLE_ID)
					}
					await guildMember.roles.remove(INKLING_ROLE_ID)
				}
				interaction.reply({
					content: "Inkling is evolving",
					flags: MessageFlags.Ephemeral
				})
				const message = new ContainerBuilder().setAccentColor(0x0099ff)
					.addTextDisplayComponents((textDisplay) =>
						textDisplay.setContent(
							`**Huh... what's happening?**\n\nIt seems like an **Inkling** is evolving!\n\n${user} has evolved from :seedling: **Inkling** to :droplet: **Squid**!\n\n` +
							`Welcome to the members area of the clan! We think you're a good fit and provide pleasant vibes. :blue_heart:\n\n` +
							`What colour heart would you like to have in-game?\n\n` +
							`<:Trialist:1487854250892722336> Trialist <:Saviour:1487854264754765997> Saviour <:Pure:1487854185000210472> Pure <:Oracle:1487854136698474686> Oracle\n` +
							`<:Medic:1487854112606261340> Medic <:Hero:1487854196681343136> Hero <:Epic:1487854209284968498> Epic <:Defiler:1487854223495528849> Defiler`
						),
					)
				const squidsChannel = interaction.client.channels.cache.get(ONLY_SQUIDS_ID)
				if (squidsChannel && squidsChannel.isSendable()) {
					squidsChannel.send({
						components: [message],
						flags: MessageFlags.IsComponentsV2,
					})
				} else {
					interaction.editReply("Cannot find squids channel")
				}
			} else {
				interaction.reply({
					content: `Something went wrong, cannot find user ${user.id} in the Guild ${interaction.guildId}`,
					flags: MessageFlags.Ephemeral
				})
			}
		}
	}
} satisfies Event<Events.InteractionCreate>;
