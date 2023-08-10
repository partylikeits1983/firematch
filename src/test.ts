import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx: Context) => {
    ctx.replyWithPoll('Test Poll', ['Option 1', 'Option 2'], { is_anonymous: false });
});

bot.on('poll_answer', (ctx: Context) => {
    console.log("Received poll answer:", ctx.pollAnswer);
});

bot.launch();

console.log('Bot is running...');
