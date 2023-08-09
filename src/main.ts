import dotenv from 'dotenv';
import { Telegraf, Context } from 'telegraf';

import "reflect-metadata";
import {DataSource} from "typeorm";
import 'reflect-metadata';

import { User } from "./dbtypes/User";


import { handleMessage } from './messageHandler';
import { sendTerminalMessageToAll } from './broadcast';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// CREATE CONNECTION 
const connectionString = process.env.NEON_CONNECTION_STRING as string;

let dataSource: DataSource;
let connection: any;

async function createDatabaseConnection() {
  try {
    dataSource = new DataSource({
      type: 'postgres', // Switching from 'better-sqlite3' to 'postgres'
      url: connectionString,
      entities: [User], // Add your entities here
  });

      connection = await dataSource.initialize();
      console.log("Database connection established successfully!");

  } catch (error) {
      console.error("Error establishing database connection:", error);
      process.exit(1);  // Exit the process if the connection fails
  }
}

// USERS SET 
let users: Set<number> = new Set();


// COMMANDS 
bot.start((ctx: Context) => ctx.reply('Welcome Firematch!'));

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

async function closeDatabaseConnection() {
  try {
      if (connection) {
          // If there's a close or disconnect method, use it
          await connection.close();  // This is just a generic example, adjust based on your library's documentation
          console.log("Database connection closed successfully!");
      }
  } catch (error) {
      console.error("Error closing database connection:", error);
  }
}
