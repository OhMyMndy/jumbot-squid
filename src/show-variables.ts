const constants = require("./util/constants.ts")
import { REST, Routes } from 'discord.js';
import { GUILD_ID, ROLE_ADMIN_ID, ROLE_HELPER_ID, TICKETS_CATEGORY_ID, DISCORD_TOKEN } from "./util/constants.ts"

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

console.log(constants)

type HasName = {
  name: string
}

const ticketsCategory = await rest.get(Routes.channel(TICKETS_CATEGORY_ID)) as HasName

console.log("Tickets category:", ticketsCategory.name)

const adminRole = await rest.get(Routes.guildRole(GUILD_ID, ROLE_ADMIN_ID)) as HasName
console.log("Admin role: ", adminRole.name)


const helperRole = await rest.get(Routes.guildRole(GUILD_ID, ROLE_HELPER_ID)) as HasName
console.log("Helper role: ", helperRole.name)
