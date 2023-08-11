import { Telegraf, Context } from 'telegraf';
import { startHandler } from './commands/startHandler';
import { handleMessage } from './commands/messageHandler';

import {
    updateProfile,
    handleUpdateProfile,
    handleUserAge,
    handleUserBio,
    handleWriteUserLocation,
    handleUpdateProfileImage
} from './commands/profile/setUpProfile';

import { Polls } from './commands/profile/polls';

export const pollsInstance = new Polls();

export function setupBotCommands(
    bot: Telegraf<Context>,
    users: Set<number>,
    connection: any,
) {
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

    bot.command('users', (ctx: Context) =>
        ctx.reply(`Currently, there are ${users.size} users.`),
    );

    bot.command('data', (ctx: Context) => ctx.reply(`data command`));

    bot.help((ctx: Context) => ctx.reply('How can I help?'));

    bot.command('share_location', async (ctx: Context) => {
        // ctx.reply(`share location command`);
        if (ctx.message?.from.id) {
            await pollsInstance.sendShareLocationPoll(
                ctx,
                ctx.message?.from.id,
            );
        }
    });

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
                let success = await handleUserBio(ctx, connection);
                console.log("HERE post bio")

                if (success) {
                    userState.set(ctx.message.from.id, 'getting_location');
                    await pollsInstance.sendShareLocationPoll(ctx, ctx.message.from.id);

                    // ctx.telegram.sendMessage(ctx.message.from.id, "Your profile has been set!")
                    // 
                } else {
                    // userState.set(ctx.message.from.id, 'getting_location');
                }

            } else if (
                userState.get(ctx.message?.from?.id) === 'getting_location'
            ) {
            }
            // await handleUserLocation(ctx, connection);
        } else {
            handleMessage(ctx, users, connection);
        }
    });

    bot.command('cancel', (ctx: Context) => {
        if (ctx.message?.from.id) {
        userState.set(ctx.message?.from.id, '');
        }
    });

    bot.on('photo', async (ctx: Context) => {
        console.log('photo');
        await ctx.reply("Your photo has been added to your profile!");
        handleUpdateProfileImage(ctx, connection);
    });
    


    bot.on('location', async (ctx: Context) => {
        // Assert that ctx.message is of the required type
        const message = ctx.message as {
            location?: { latitude: number; longitude: number };
        };

        if (message?.location) {
            const userLocation = message.location;
            console.log('Received location:', userLocation);

            // Handle the received location
            await handleWriteUserLocation(ctx, connection, userLocation);
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
