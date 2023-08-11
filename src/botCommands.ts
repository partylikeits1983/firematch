import { Telegraf, Context } from 'telegraf';
import { startHandler } from './commands/startHandler';
import { handleMessage } from './commands/messageHandler';

import {
    updateProfile,
    handleUpdateProfile,
    handleUserAge,
    handleUserBio,
    handleWriteUserLocation,
    handleUpdateProfileImage,
    handleReturnProfileUpdated,
} from './commands/profile/setUpProfile';

import { Polls } from './commands/profile/polls';

export const pollsInstance = new Polls();

export function setupBotCommands(bot: Telegraf<Context>, users: Set<number>, connection: any) {
    const userState: Map<number, string> = new Map();

    // COMMANDS
    bot.start(async (ctx: Context) => {
        if (ctx.message?.from.id) {
            userState.set(ctx.message.from.id, 'setting_age');

            await startHandler(ctx, users, connection);
        }
    });

    bot.command('create_profile', async (ctx: Context) => {
        if (ctx.message?.from.id) {
            userState.set(ctx.message.from.id, 'setting_age');
            await updateProfile(ctx);
        }
    });

    bot.command('match', (ctx: Context) => ctx.reply(`Match command`));

    bot.command('users', (ctx: Context) => ctx.reply(`Currently, there are ${users.size} users.`));

    bot.command('data', (ctx: Context) => ctx.reply(`data command`));

    bot.help((ctx: Context) => ctx.reply('How can I help?'));

    bot.command('share_location', async (ctx: Context) => {
        // ctx.reply(`share location command`);
        if (ctx.message?.from.id) {
            await pollsInstance.sendShareLocationPoll(ctx, ctx.message?.from.id);
        }
    });

    // POLL HANDLER
    bot.on('poll_answer', async (ctx: Context) => {
        await handleUpdateProfile(ctx, connection);
    });

    // MESSAGE HANDLERS

    bot.command('skip_location_share', async (ctx: Context) => {
        if (ctx.message?.from.id) {
            userState.set(ctx.message?.from.id, '');

            await ctx.sendMessage('Your profile has been set!');
            await handleReturnProfileUpdated(ctx, connection, ctx.message.from.id);
        }
    });

    bot.command('update_bio', async (ctx: Context) => {
        if (ctx.message?.from.id) {
            await ctx.sendMessage('Send you bio:');
            userState.set(ctx.message?.from.id, 'update_bio');
        }

        /*         if (userState.get(ctx.message?.from?.id) === 'update_bio') {}
        await handleUserBio(ctx, connection);

        await ctx.sendMessage('Your bio has been updated!');
        await handleReturnProfileUpdated(ctx, connection, ctx.message.from.id); */
    });

    bot.command('cancel', (ctx: Context) => {
        if (ctx.message?.from.id) {
            userState.set(ctx.message?.from.id, '');
        }
    });

    bot.on('photo', async (ctx: Context) => {
        console.log('photo');
        await ctx.reply('Your photo has been added to your profile!');
        handleUpdateProfileImage(ctx, connection);
    });

    bot.on('location', async (ctx: Context) => {
        // Assert that ctx.message is of the required type
        const message = ctx.message as {
            location?: { latitude: number; longitude: number };
        };

        console.log('in location');
        console.log(ctx.message);

        if (message?.location && ctx.message?.from.id) {
            const userLocation = message.location;
            console.log('Received location:', userLocation);

            // Handle the received location
            await handleWriteUserLocation(ctx, connection, userLocation);

            await ctx.sendMessage('Your profile has been set!');
            await handleReturnProfileUpdated(ctx, connection, ctx.message.from.id);
        }
    });

    bot.on('text', async (ctx: Context) => {
        if (ctx.message?.from.id) {
            if (userState.get(ctx.message?.from?.id) === 'setting_age') {
                let success = await handleUserAge(ctx, connection);

                if (success) {
                    userState.set(ctx.message.from.id, 'writing_bio');
                } else {
                    userState.set(ctx.message.from.id, 'setting_age');
                }
            } else if (userState.get(ctx.message?.from?.id) === 'writing_bio') {
                let success = await handleUserBio(ctx, connection);

                if (success) {
                    userState.set(ctx.message.from.id, 'getting_location');
                    await pollsInstance.sendShareLocationPoll(ctx, ctx.message.from.id);
                }
            } else if (userState.get(ctx.message?.from?.id) === 'update_bio') {
                await handleUserBio(ctx, connection);

                await ctx.sendMessage('Your bio has been updated!');
                await handleReturnProfileUpdated(ctx, connection, ctx.message.from.id);
            }
        } else {
            handleMessage(ctx, users, connection);
        }
    });

    bot.telegram.setMyCommands([
        { command: 'start', description: 'Start the bot' },
        {
            command: 'skip_location_share',
            description: 'skip sharing location',
        },
        { command: 'match', description: 'Get sent matches' },
        {
            command: 'users',
            description: 'see how many users in your location',
        },

        { command: 'update_bio', description: 'Update your bio' },

        { command: 'set_location', description: 'Update your location' },
        { command: 'update_profile', description: 'Update your profile' },
        {
            command: 'update_profile_pics',
            description: 'Update your profile images',
        },

        { command: 'data', description: 'Get analytics' },
        { command: 'help', description: 'Get help' },
        { command: 'cancel', description: 'cancel current operation' },
    ]);
}
