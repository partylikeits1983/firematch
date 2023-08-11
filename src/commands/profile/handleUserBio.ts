import { Context } from 'telegraf';
import { User } from '../../db-types/User';
import { getUser } from './getUser';

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
