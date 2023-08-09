import { Context } from 'telegraf';
import { User } from './dbtypes/User';

import { getCurrentUnixTimestamp } from './utils/unixTime';

export async function startHandler(ctx: Context, users: Set<number>, connection: any) {
    if (ctx.message && ctx.message.from && ctx.message.chat) {
        console.log("NEW USER");

        users.add(ctx.message.from.id);

        const userRepository = connection.getRepository(User);

        const user = new User();

        console.log(ctx.message.from.id);
        
        user.user_id = Number(ctx.message.from.id);
        user.first_name = ctx.message.from.first_name;
        user.last_name = ctx.message.from.last_name ?? '-';
        user.username = ctx.message.from.username ?? '-';

        user.sign_up_date = getCurrentUnixTimestamp();
        user.last_active = getCurrentUnixTimestamp();

        console.log(user.user_id);

        await userRepository.save(user);
    }
}