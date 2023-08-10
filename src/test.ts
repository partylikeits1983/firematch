import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// On bot start
bot.start((ctx: Context) => ctx.replyWithPoll('Test Poll', ['Option 1', 'Option 2'],  { is_anonymous: false } ));

// Handle poll answer
bot.on('poll_answer', (ctx: Context) => {
    if (ctx.pollAnswer) {
        console.log("Received poll answer:", ctx.pollAnswer);

        // Check if this is an answer to the first poll
        // Note: For simplicity, you might check the poll_id, but in real-world scenarios, you'll probably want a more reliable method.
        if (ctx.pollAnswer.poll_id /* match the poll ID */) {
            ctx.replyWithPoll('Second Poll', ['Option A', 'Option B']);
        }

        // For further polls, you'd add more conditions or utilize a state management system
    }
});

bot.launch();

console.log('Bot is running...');
