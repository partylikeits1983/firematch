import { Context } from 'telegraf';
import { User } from '../../db-types/User';
import { getUser } from './getUser';

export async function handleGenderPoll(ctx: Context, connection: any) {
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
