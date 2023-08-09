import dotenv from 'dotenv';
import { Telegraf, Context } from 'telegraf';

import "reflect-metadata";

import { createDatabaseConnection, closeDatabaseConnection } from './db-connect';

// import { User } from "./db-types/User";

import { handleMessage } from './commands/messageHandler';
import { startHandler } from './commands/startHandler';
import { sendTerminalMessageToAll } from './notifications/broadcast';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// CREATE CONNECTION 

let connection: any;

// USERS SET 
let users: Set<number> = new Set();


// COMMANDS 
bot.start(async (ctx: Context) => {
  ctx.reply('Welcome to Firematch!');
  await startHandler(ctx, users, connection);
});

bot.command('match', (ctx: Context) =>
  ctx.reply(`Match command`),
);

bot.command('users', (ctx: Context) =>
  ctx.reply(`Currently, there are ${users.size} users.`),
);

bot.command('data', (ctx: Context) =>
  ctx.reply(`data command`),
);

bot.help((ctx: Context) => ctx.reply('How can I help?'));

// MESSAGE HANDLERS 
bot.on('text', async (ctx: Context) => {
  handleMessage(ctx, users, connection);
});

bot.on('photo', async (ctx: Context) => {
  handleMessage(ctx, users, connection);
});

// BROADCAST MESSAGE TO ALL USERS
sendTerminalMessageToAll(bot, users);

bot.telegram.setMyCommands([
  { command: 'start', description: 'Start the bot' },
  { command: 'match', description: 'Get sent matches' },
  { command: 'users', description: 'Get help' },
  { command: 'data', description: 'Get analytics' },
  { command: 'help', description: 'Get help' },
]);

async function startBot() {
  await createDatabaseConnection();
  bot.launch();
  console.log("Bot started successfully!");
}
startBot();

// Enable graceful stop
process.once('SIGINT', async () => {
  await closeDatabaseConnection();
  bot.stop('SIGINT');
});

process.once('SIGTERM', async () => {
  await closeDatabaseConnection();
  bot.stop('SIGTERM');
});

