import dotenv from 'dotenv';

import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.message.from.first_name}`,
  );
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
