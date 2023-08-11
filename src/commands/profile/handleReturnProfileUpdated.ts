import { Context } from 'telegraf';
// import { User } from '../../db-types/User';
// import { getUser } from './getUser';

export async function handleReturnProfileUpdated(
    ctx: Context,
    connection: any,

) {
    console.log("inside handle return profile updated");
    console.log(ctx.message);

    // const user = await getUser(Number(ctx.message.from.user), connection);

    
    console.log(ctx);
}
