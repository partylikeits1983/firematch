import { Context, Markup } from 'telegraf';
import { User } from '../../db-types/User';
import { getUser } from './getUser';

// pls edit this ...
export async function handleGetUserPosition(ctx: Context, connection: any) {
    if (!ctx.pollAnswer) {
        console.log('No poll answer in context.');
        return;
    }
    const user = await getUser(Number(ctx.pollAnswer.user.id), connection);

    if (user) {
        user.share_location = ctx.pollAnswer.option_ids[0] === 0 ? true : false;

        if (user.share_location) {
            await connection.getRepository(User).save(user);

            const keyboard = Markup.keyboard([
                Markup.button.locationRequest('📍 Send location'),
            ]).resize();

            ctx.telegram.sendMessage(
                ctx.pollAnswer.user.id,
                'Share location, or /skip_location_share',
                keyboard,
            );
        } else {
            ctx.telegram.sendMessage(
                ctx.pollAnswer.user.id,
                'You can share you location later by typing /share_location',
            );
        }
    } else {
        if (ctx.message?.from.id) {
            const userId = Number(ctx.message.from.id);
            const user = await getUser(userId, connection);

            if (user) {
                // moscow coordinates
                const pointString = `(${55.7558}, ${37.6173})`;

                user.geolocation = pointString;

                await connection.getRepository(User).save(user);
            }
        }
        // if no push location as Null
    }
}
