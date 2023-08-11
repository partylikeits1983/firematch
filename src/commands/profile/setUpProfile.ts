import { Context, Markup } from 'telegraf';
import { User } from '../../db-types/User';

import { Polls } from '../polls';

import { getUser } from './getUser';
import { handleGenderPoll } from './handleGenderPoll';
import { handlePreferencePoll } from './handlePreferencePoll';

const pollsInstance = new Polls();

export async function updateProfile(ctx: Context) {
    ctx.reply('Lets set up your profile!');
    if (ctx.message && ctx.message.from) {
        await pollsInstance.sendGenderPoll(ctx, ctx.message.from.id);
    } else {
        console.error('Context message or message.from is undefined.');
    }
}

function checkValidAge(age: number) {
    if (age < 18) {
        return false;
    }
    if (age > 100) {
        return false;
    }
    return true;
}

export async function handleUserAge(ctx: Context, connection: any) {
    if (ctx.message?.from.id && ctx.message) {
        const user = await getUser(Number(ctx.message.from.id), connection);

        if (user && ctx.message && 'text' in ctx.message) {
            if (checkValidAge(Number(ctx.message.text))) {
                user.age = Number(parseInt(String(ctx.message.text)));
                await connection.getRepository(User).save(user);
                ctx.reply('Write a short bio about yourself');
                return true;
            } else {
                ctx.reply('Invalid Age (18-100)');
                return false;
            }
        }
    }
}

export async function handleUserBio(ctx: Context, connection: any) {
    if (ctx.message?.from.id && ctx.message) {
        const user = await getUser(Number(ctx.message.from.id), connection);

        if (user && ctx.message && 'text' in ctx.message) {
            user.bio = ctx.message.text;
            await connection.getRepository(User).save(user);
            pollsInstance.sendShareLocationPoll(ctx, ctx.message.from.id);
            // ctx.reply('Share location for more precise matches?');
            return true;
        }
    }
}

// pls edit this ...
export async function handleGetUserPosition(ctx: Context, connection: any) {
    if (!ctx.pollAnswer) {
        console.log('No poll answer in context.');
        return;
    }
    const user = await getUser(Number(ctx.pollAnswer.user.id), connection);

    if (user) {
        user.share_location = ctx.pollAnswer.option_ids[0] === 0 ? true : false;

        if (user.share_location) {
            await connection.getRepository(User).save(user);

            const keyboard = Markup.keyboard([
                Markup.button.locationRequest('📍 Send location'),
            ]).resize();
    
            ctx.telegram.sendMessage(
                ctx.pollAnswer.user.id,
                'Share location, or /skip_location_share',
                keyboard,
            );
        } else {
            ctx.telegram.sendMessage(
                ctx.pollAnswer.user.id,
                'You can share you location later by typing /share_location'
            ); 
        }


    } else {
        if (ctx.message?.from.id) {
            const userId = Number(ctx.message.from.id);
            const user = await getUser(userId, connection);

            if (user) {
                // moscow coordinates
                const pointString = `(${55.7558}, ${37.6173})`;

                user.geolocation = pointString;

                await connection.getRepository(User).save(user);
            }
        }
        // if no push location as Null
    }
}


export async function handleReturnProfileUpdated(ctx: Context, connection: any) {
    // const user = await getUser(Number(ctx.message.from.user), connection);

    console.log(ctx);
    
}


export async function handleWriteUserLocation(
    ctx: Context,
    connection: any,
    location: { latitude: number; longitude: number },
) {
    if (ctx.message?.from.id) {
        const userId = Number(ctx.message.from.id);
        const user = await getUser(userId, connection);

        if (user) {
            const pointString = `(${location.longitude}, ${location.latitude})`;

            user.geolocation = pointString;

            await connection.getRepository(User).save(user);

            return true;
        }
    }

    return false;
}

export async function handleUpdateProfile(ctx: Context, connection: any) {
    if (!ctx.pollAnswer) {
        console.log('No poll answer in context.');
        return;
    }
    const pollInfo = pollsInstance.getPollInfo(ctx.pollAnswer.poll_id);

    if (!pollInfo) {
        console.log('Poll info not found.');
        return;
    }

    switch (pollInfo.type) {
        case 'Your Gender':
            await handleGenderPoll(ctx, connection);
            await pollsInstance.sendPreferencePoll(ctx, pollInfo.userId);
            break;
        case 'Your preference (who you want to meet)':
            await handlePreferencePoll(ctx, connection);
            await pollsInstance.sendAgeMessage(ctx, pollInfo.userId);
            break;
        case 'Share location for more precise matches?':
            await handleGetUserPosition(ctx, connection);
        // await pollsInstance.sendShareLocationPoll(ctx, pollInfo.userId);
        default:
            await handleReturnProfileUpdated(ctx, pollInfo.userId);

            console.log('Unknown poll type.');
            break;
    }
}
