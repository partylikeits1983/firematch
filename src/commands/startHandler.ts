import { Context } from 'telegraf';
import { User } from '../db-types/User';

import { getCurrentUnixTimestamp } from '../utils/unixTime';

async function startMessage(ctx: Context) {
    ctx.reply('Welcome to Firematch! 🔥');
}

async function handleNewUser(ctx: Context, connection: any) {
    if (ctx.message && ctx.message.from && ctx.message.chat) {
        const userRepository = connection.getRepository(User);

        let user = await userRepository.findOne({
            where: { user_id: Number(ctx.message.from.id) },
        });

        if (!user) {
            user = new User();
            user.user_id = Number(ctx.message.from.id);
            user.sign_up_date = getCurrentUnixTimestamp();
        }

        user.first_name = ctx.message.from.first_name;
        user.last_name = ctx.message.from.last_name ?? '-';
        user.username = ctx.message.from.username ?? '-';
        user.last_active = getCurrentUnixTimestamp();

        await userRepository.save(user);
    }
}

export async function startHandler(
    ctx: Context,
    users: Set<number>,
    connection: any,
) {
    if (ctx.message && ctx.message.from && ctx.message.chat) {
        await startMessage(ctx);

        users.add(ctx.message.from.id);

        handleNewUser(ctx, connection);
    }
}
