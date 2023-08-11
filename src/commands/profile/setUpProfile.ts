import { Context } from 'telegraf';
import { User } from '../../db-types/User';

import { getUser } from './getUser';
import { handleGenderPoll } from './handleGenderPoll';
import { handlePreferencePoll } from './handlePreferencePoll';

import { handleReturnProfileUpdated } from './handleReturnProfileUpdated';
import { handleGetUserPosition } from './handleGetUserPosition';

import { handleUpdateProfileImage } from './handleUpdateProfileImage';
export { handleUpdateProfileImage };

import { handleUserAge } from './handleUserAge';
export { handleUserAge };

// const pollsInstance = new Polls();
import { pollsInstance } from '../../botCommands';

export async function updateProfile(ctx: Context) {
    await ctx.reply('Lets set up your profile!');
    if (ctx.message && ctx.message.from) {
        await pollsInstance.sendGenderPoll(ctx, ctx.message.from.id);
    } else {
        console.error('Context message or message.from is undefined.');
    }
}

export async function handleUserBio(ctx: Context, connection: any) {
    if (ctx.message?.from.id && ctx.message) {
        const user = await getUser(Number(ctx.message.from.id), connection);

        if (user && ctx.message && 'text' in ctx.message) {
            user.bio = ctx.message.text;
            await connection.getRepository(User).save(user);
            return true;
        }
    }
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
            await ctx.telegram.sendMessage(pollInfo.userId, 'Your profile has been set!');

            await handleReturnProfileUpdated(ctx, pollInfo.userId);
        default:

            console.log('Unknown poll type.');
            break;
    }
}
