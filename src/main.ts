import dotenv from 'dotenv';
import { Telegraf, Context } from 'telegraf';

import "reflect-metadata";

import { createDatabaseConnection, closeDatabaseConnection } from './dbConnect';


import { sendTerminalMessageToAll } from './notifications/broadcast';

import { setupBotCommands } from './botCommands';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// CREATE CONNECTION 
let connection: any;

// USERS SET 
let users: Set<number> = new Set();


function initialize() {
  // COMMANDS 
  setupBotCommands(bot, users, connection);

  // BROADCAST MESSAGE TO ALL USERS
  sendTerminalMessageToAll(bot, users);
}

async function startBot() {
  connection = await createDatabaseConnection();

  initialize();
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

