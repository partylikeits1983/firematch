import dotenv from 'dotenv';
import readline from 'readline';  // for reading terminal input
import { Telegraf, Context } from 'telegraf';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// Store all users that activated the bot
let users: Set<number> = new Set();

bot.on('text', async (ctx) => {
  // Save user ID when they send a message to the bot
  users.add(ctx.message.from.id);

  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.message.from.first_name}`,
  );
});

// Set up a readline interface for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  // Send a message to all users when you type a message in the terminal
  users.forEach(userId => {
    bot.telegram.sendMessage(userId, input);
  });
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  rl.close();  // Close the readline interface
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  rl.close();  // Close the readline interface
});
