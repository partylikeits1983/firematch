import { Context } from 'telegraf';
import { User } from '../db-types/User';

class Polls {
    private pollsMap: Map<string, {type: string, userId: number}> = new Map();

    async sendGenderPoll(ctx: Context, userId: number) {
        const poll = await ctx.telegram.sendPoll(userId, 'Your Gender', ['Male', 'Female'], { is_anonymous: false });

        if (poll) {
            this.pollsMap.set(poll.poll.id, {type: 'Your Gender', userId: userId});
        }

        return poll;
    }

    async sendPreferencePoll(ctx: Context, userId: number) {
        const poll = await ctx.telegram.sendPoll(userId, 'Your preference (who you want to meet)', ['Guys', 'Girls'], { is_anonymous: false });

        if (poll) {
            console.log("here");
            this.pollsMap.set(poll.poll.id, {type: 'Your preference (who you want to meet)', userId: userId});

            
            console.log(this.pollsMap.get(poll.poll.id));

        }

        return poll;
    }

    getPollInfo(pollId: string): {type: string, userId: number} | undefined {
        return this.pollsMap.get(pollId);
    }
}


const pollsInstance = new Polls();

export async function updateProfile(ctx: Context) {
    ctx.reply('Set up your profile');
    if (ctx.message && ctx.message.from) {
        await pollsInstance.sendGenderPoll(ctx, ctx.message.from.id);
    } else {
        console.error('Context message or message.from is undefined.');
    }
}


async function getUser(userId: number, connection: any): Promise<User | undefined> {
    const userRepository = connection.getRepository(User);
    return await userRepository.findOne({
        where: { user_id: userId },
    });
}

async function handleGenderPoll(ctx: Context, connection: any) {
    if (!ctx.pollAnswer) {
        console.log("No poll answer in context.");
        return;
    }

    const user = await getUser(Number(ctx.pollAnswer.user.id), connection);

    if (user) {
        user.gender = ctx.pollAnswer.option_ids[0] === 0 ? 'Male' : 'Female';
        await connection.getRepository(User).save(user);
        console.log("WRITE SUCESS")
    }
}

async function handlePreferencePoll(ctx: Context, connection: any) {
    if (!ctx.pollAnswer) {
        console.log("No poll answer in context.");
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
        console.log("No poll answer in context.");
        return;
    }

    console.log("HERE");
    console.log(ctx.pollAnswer.poll_id);
    const pollInfo = pollsInstance.getPollInfo(ctx.pollAnswer.poll_id);

    console.log(pollInfo);

    if (!pollInfo) {
        console.log("Poll info not found.");
        return;
    }


    switch(pollInfo.type) {
        case 'Your Gender':
            await handleGenderPoll(ctx, connection);
            await pollsInstance.sendPreferencePoll(ctx, pollInfo.userId);
            break;
        case 'Your preference (who you want to meet)':
            await handlePreferencePoll(ctx, connection);
            // another poll
            break;
        default:
            console.log("Unknown poll type.");
            break;
    }
}