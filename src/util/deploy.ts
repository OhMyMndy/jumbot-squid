import process from 'node:process';
import { URL } from 'node:url';
import { API } from '@discordjs/core/http-only';
import { REST, Routes } from 'discord.js';
import { loadCommands } from './loaders.ts';
import { APPLICATION_ID, GUILD_ID } from './constants.ts';

const commands = await loadCommands(new URL('../commands/', import.meta.url));
const commandData = [...commands.values()].map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
const api = new API(rest);

const result = await api.applicationCommands.bulkOverwriteGlobalCommands(APPLICATION_ID, commandData);

console.log(result)
console.log(`Successfully registered ${result.length} commands.`);

const data = await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID), { body: commandData });
console.log(data)
