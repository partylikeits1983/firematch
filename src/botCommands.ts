import { Telegraf, Context } from 'telegraf';
import { startHandler } from './commands/startHandler';
import { handleMessage } from './commands/messageHandler';

import {
    updateProfile,
    handleUpdateProfile,
    handleUserAge,
    handleUserBio,
} from './commands/setUpProfile';

export function setupBotCommands(
    bot: Telegraf<Context>,
    users: Set<number>,
    connection: any,
) {
    const userState: Map<number, string> = new Map();

    // COMMANDS
    bot.start(async (ctx: Context) => {
        if (ctx.message?.from.id) {
            console.log('HERE');
            userState.set(ctx.message.from.id, 'setting_age');

            await startHandler(ctx, users, connection);
            await updateProfile(ctx);
        }
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
        if (ctx.message?.from.id) {
            console.log(userState.get(ctx.message.from.id));

            // Check if the user is in the age answering state
            if (userState.get(ctx.message?.from?.id) === 'setting_age') {
                let success = await handleUserAge(ctx, connection);

                if (success) {
                    userState.set(ctx.message.from.id, 'writing_bio');
                } else {
                    userState.set(ctx.message.from.id, 'setting_age');
                }

            } else if (userState.get(ctx.message?.from?.id) === 'writing_bio') {
                await handleUserBio(ctx, connection);

                userState.set(ctx.message.from.id, 'getting_location');

            } else if  (userState.get(ctx.message?.from?.id) === 'getting_location') {}
                // await handleUserLocation(ctx, connection);


            } else {
                handleMessage(ctx, users, connection); 
            }
        }
    );

    bot.on('photo', async (ctx: Context) => {
        console.log('photo');
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
