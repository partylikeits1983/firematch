import { Context } from 'telegraf';
import { User } from '../db-types/User';

import { getCurrentUnixTimestamp } from '../utils/unixTime';

async function updateProfile(ctx: Context) {
    ctx.reply('Set up your profile');
    ctx.replyWithPoll('Your Gender', ['Male', 'Female'], { is_anonymous: false });
}

export async function handleUpdateProfile(ctx: Context) {   
}


export async function setUpProfile(
    ctx: Context,
    users: Set<number>,
    connection: any,
) {
    if (ctx.message && ctx.message.from && ctx.message.chat) {
        // await startMessage(ctx);

        await updateProfile(ctx);

        users.add(ctx.message.from.id);

    }
}
