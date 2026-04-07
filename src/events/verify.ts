import { ContainerBuilder, Events, GuildMemberRoleManager, MessageFlags, User } from 'discord.js';
import type { Event } from './index.ts';
import { INKLING_ROLE_ID, JUMBO_SQUID_ID, ONLY_SQUIDS_ID, ROLE_HELPER_ID, SQUID_ROLE_ID, GUILD_ID } from "../util/constants.ts"

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
			if (interaction.guildId != GUILD_ID) {
				console.log("Wrong guild ID for verify")
				return
			}
			if (interaction.isCommand() && interaction.commandName != "verify") return
			if (interaction.isCommand() && interaction.isChatInputCommand() && interaction.member && interaction.guild) {
				const rolesManager = interaction.member.roles as GuildMemberRoleManager
				if (!rolesManager.cache.get(ROLE_HELPER_ID) && !rolesManager.cache.get(JUMBO_SQUID_ID)) {
					await interaction.reply({
						content: "You cannot use this command, **Helper Squid** or **Jumbo Squid** role are required",
						flags: MessageFlags.Ephemeral
					})
					return
				}

				let user = interaction.options.getUser("username") as User

				let guildMember = interaction.guild.members.cache.get(user.id)
				if (guildMember) {
					if (guildMember.roles instanceof GuildMemberRoleManager) {
						if (!guildMember.roles.cache.get(SQUID_ROLE_ID)) {
							await guildMember.roles.add(SQUID_ROLE_ID)
						}
						await guildMember.roles.remove(INKLING_ROLE_ID)
					}
					await interaction.reply({
						content: "Inkling is evolving",
						flags: MessageFlags.Ephemeral
					})

					let member = interaction.guild?.members.cache.get(interaction.user.id)
					const message = new ContainerBuilder().setAccentColor(0x0099ff)
						.addTextDisplayComponents((textDisplay) =>
							textDisplay.setContent(
								`**Huh... what's happening?**\n\nIt seems like an **Inkling** is evolving!\n\n${user} has evolved from :seedling: **Inkling** to :droplet: **Squid**!\n\n` +
								`Welcome to the members area of the clan! We think you're a good fit and provide pleasant vibes. :blue_heart:\n\n` +
								`What colour heart would you like to have in-game?\n\n` +
								`<:Trialist:1487854250892722336> Trialist <:Saviour:1487854264754765997> Saviour <:Pure:1487854185000210472> Pure <:Oracle:1487854136698474686> Oracle\n` +
								`<:Medic:1487854112606261340> Medic <:Hero:1487854196681343136> Hero <:Epic:1487854209284968498> Epic <:Defiler:1487854223495528849> Defiler\n\n` +
								`-# Verified by ${member?.nickname ?? interaction.user.globalName} and the Squiddie team.`
							),
						)
					const squidsChannel = interaction.client.channels.cache.get(ONLY_SQUIDS_ID)
					if (squidsChannel && squidsChannel.isSendable()) {
						await squidsChannel.send({
							components: [message],
							flags: MessageFlags.IsComponentsV2,
						})
					} else {
						await interaction.editReply("Cannot find squids channel")
					}
				} else {
					await interaction.editReply({
						content: `Something went wrong, cannot find user ${user.id} in the Guild ${interaction.guildId}`,
					})
				}
			} else if (interaction.isCommand()) {
				await interaction.reply({
					content: `Member or Guild is empty...`,
					flags: MessageFlags.Ephemeral
				})
			}
		} catch (e) {
			console.log("Error in verify")
			console.error(e)
		}
	}
} satisfies Event<Events.InteractionCreate>;
