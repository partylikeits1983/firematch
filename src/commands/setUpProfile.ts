import { Context } from 'telegraf';
import { User } from '../db-types/User';

import { Polls } from './polls';

const pollsInstance = new Polls();

export async function updateProfile(ctx: Context) {
    ctx.reply('Lets set up your profile!');
    if (ctx.message && ctx.message.from) {
        await pollsInstance.sendGenderPoll(ctx, ctx.message.from.id);
    } else {
        console.error('Context message or message.from is undefined.');
    }
}

async function getUser(
    userId: number,
    connection: any,
): Promise<User | undefined> {
    const userRepository = connection.getRepository(User);
    return await userRepository.findOne({
        where: { user_id: userId },
    });
}

async function handleGenderPoll(ctx: Context, connection: any) {
    if (!ctx.pollAnswer) {
        console.log('No poll answer in context.');
        return;
    }

    const user = await getUser(Number(ctx.pollAnswer.user.id), connection);

    if (user) {
        user.gender = ctx.pollAnswer.option_ids[0] === 0 ? 'Male' : 'Female';
        await connection.getRepository(User).save(user);
    }
}

async function handlePreferencePoll(ctx: Context, connection: any) {
    if (!ctx.pollAnswer) {
        console.log('No poll answer in context.');
        return;
    }

    const user = await getUser(Number(ctx.pollAnswer.user.id), connection);

    if (user) {
        user.preference = ctx.pollAnswer.option_ids[0] === 0 ? 'Men' : 'Women';
        await connection.getRepository(User).save(user);
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
                user.age = Number(ctx.message.text);
                await connection.getRepository(User).save(user);
                ctx.reply('Write a short bio about yourself');
                return true;
            } else {
                ctx.reply('Invalid Age');
                return false;
            }
        }
    }
}

export async function handleUserBio(ctx: Context, connection: any) {
    if (ctx.message?.from.id && ctx.message) {
        const user = await getUser(Number(ctx.message.from.id), connection);

        console.log('IN BIO');
        if (user && ctx.message && 'text' in ctx.message) {
            user.bio = ctx.message.text;
            await connection.getRepository(User).save(user);
            // ctx.reply('Share location for more precise matches?');
            pollsInstance.sendShareLocationPoll(ctx, ctx.message.from.id);
            // ctx.reply('Share location for more precise matches?');

            return true;
        }
    }
}

export async function handleUserLocation(ctx: Context, connection: any) {
    if (ctx.message?.from.id && ctx.message) {
        const user = await getUser(Number(ctx.message.from.id), connection);

        console.log('IN BIO');
        if (user && ctx.message && 'text' in ctx.message) {
            // user.bio = ctx.message.text;
            // await connection.getRepository(User).save(user);
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
        case 'Share Location':
            await pollsInstance.sendShareLocationPoll(ctx, pollInfo.userId);
        default:
            console.log('Unknown poll type.');
            break;
    }
}
