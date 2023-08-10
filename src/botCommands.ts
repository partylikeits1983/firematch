import { Telegraf, Context } from 'telegraf';
import { startHandler } from './commands/startHandler';
import { handleMessage } from './commands/messageHandler';

import { updateProfile, handleUpdateProfile } from './commands/setUpProfile';

export function setupBotCommands(
    bot: Telegraf<Context>,
    users: Set<number>,
    connection: any,
) {
    // COMMANDS
    bot.start(async (ctx: Context) => {
        await startHandler(ctx, users, connection);
        await updateProfile(ctx);
    });



    bot.command('match', (ctx: Context) => ctx.reply(`Match command`));

    bot.command('users', (ctx: Context) =>
        ctx.reply(`Currently, there are ${users.size} users.`),
    );

    bot.command('data', (ctx: Context) => ctx.reply(`data command`));

    bot.help((ctx: Context) => ctx.reply('How can I help?'));

    // POLL HANDLER
    bot.on('poll_answer', async (ctx: Context) => {
        await handleUpdateProfile(ctx, connection);
    });


    // MESSAGE HANDLERS
    bot.on('text', async (ctx: Context) => {
        console.log("text");
        handleMessage(ctx, users, connection);
    });

    bot.on('photo', async (ctx: Context) => {
        console.log("photo")
        handleMessage(ctx, users, connection);
    });

    bot.telegram.setMyCommands([
        { command: 'start', description: 'Start the bot' },
        { command: 'match', description: 'Get sent matches' },
        { command: 'users', description: 'Get help' },
        { command: 'data', description: 'Get analytics' },
        { command: 'help', description: 'Get help' },
    ]);
}
