import { Events, GuildMemberRoleManager, User } from 'discord.js';
import type { Event } from './index.ts';
import { INKLING_ROLE_ID, SQUID_ROLE_ID } from "../util/constants.ts"

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
				interaction.reply("It seems like Inkling is evolving!")
			} else {
				interaction.reply(`Something went wrong, cannot find user ${user.id} in the Guild ${interaction.guildId}`)
			}
		}
	}
} satisfies Event<Events.InteractionCreate>;
