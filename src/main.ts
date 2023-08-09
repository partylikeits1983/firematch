import dotenv from 'dotenv';
import { Telegraf, Context } from 'telegraf';
import { handleMessage } from './messageHandler';  // Import our functions from the separated module
import { sendTerminalMessageToAll } from './broadcast';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

let users: Set<number> = new Set();

bot.start((ctx: Context) => ctx.reply('Welcome Firematch!'));
bot.help((ctx: Context) => ctx.reply('How can I help?'));
bot.command('users', (ctx: Context) => ctx.reply(`Currently, there are ${users.size} users.`));

bot.on('text', async (ctx: Context) => {
  handleMessage(ctx, users);
});

sendTerminalMessageToAll(bot, users);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
