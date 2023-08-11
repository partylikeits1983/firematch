import { Context } from 'telegraf';
import { User } from '../../db-types/User';

import { getUser } from './getUser';
import { handleGenderPoll } from './handleGenderPoll';
import { handlePreferencePoll } from './handlePreferencePoll';

import { handleReturnProfileUpdated } from './handleReturnProfileUpdated';
import { handleGetUserPosition } from './location/handleGetUserPosition';

import { handleUpdateProfileImage } from './handleUpdateProfileImage';
export { handleUpdateProfileImage };

import { handleUserAge } from './handleUserAge';
export { handleUserAge };

import { handleWriteUserLocation } from './location/handleWriteUserLocation';
export { handleWriteUserLocation }

export { handleReturnProfileUpdated };

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
            let success = await handleGetUserPosition(ctx, connection);

            if (!success) {
                await ctx.telegram.sendMessage(pollInfo.userId, 'Your profile has been set!');
                await handleReturnProfileUpdated(ctx, connection, pollInfo.userId);
            }
            // await ctx.telegram.sendMessage(pollInfo.userId, 'Your profile has been set!');
            // await handleReturnProfileUpdated(ctx, connection, pollInfo.userId);
        default:
            console.log('Unknown poll type.');
            break;
    }
}
