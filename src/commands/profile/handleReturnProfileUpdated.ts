import { Context } from 'telegraf';
// import { User } from '../../db-types/User';
// import { getUser } from './getUser';

export async function handleReturnProfileUpdated(
    ctx: Context,
    connection: any,
) {
    // const user = await getUser(Number(ctx.message.from.user), connection);

    console.log(ctx);
}
