import { Telegraf, Context, Markup } from 'telegraf';
import dotenv from 'dotenv';



dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx) => {
    const keyboard = Markup.keyboard([
        Markup.button.locationRequest('📍 Send location')
    ]).resize();

    ctx.reply('Would you like to share your location?', keyboard);
});

bot.launch();

console.log('Bot is running...');
