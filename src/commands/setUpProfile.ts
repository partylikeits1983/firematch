import { Context } from 'telegraf';
import { User } from '../db-types/User';

import { Polls } from './polls';

const pollsInstance = new Polls();

export async function updateProfile(ctx: Context) {
    ctx.reply('Set up your profile');
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
            // another poll
            break;
        default:
            console.log('Unknown poll type.');
            break;
    }
}
