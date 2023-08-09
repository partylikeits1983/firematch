import dotenv from 'dotenv';
import { Telegraf, Context } from 'telegraf';
import { handleMessage } from './messageHandler';  // Import our functions from the separated module
import { sendTerminalMessageToAll } from './broadcast';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// Store all users that activated the bot
let users: Set<number> = new Set();

bot.on('text', async (ctx: Context) => {
  handleMessage(ctx, users);
});

sendTerminalMessageToAll(bot, users);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
