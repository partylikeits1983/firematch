import { Context } from 'telegraf';
import { User } from '../db-types/User';

import { getCurrentUnixTimestamp } from '../utils/unixTime';

export async function startHandler(ctx: Context, users: Set<number>, connection: any) {
    if (ctx.message && ctx.message.from && ctx.message.chat) {

        users.add(ctx.message.from.id);
        const userRepository = connection.getRepository(User);

        const user = new User();

        user.user_id = Number(ctx.message.from.id);
        user.first_name = ctx.message.from.first_name;
        user.last_name = ctx.message.from.last_name ?? '-';
        user.username = ctx.message.from.username ?? '-';

        user.sign_up_date = getCurrentUnixTimestamp();
        user.last_active = getCurrentUnixTimestamp();

        await userRepository.save(user);
    }
}