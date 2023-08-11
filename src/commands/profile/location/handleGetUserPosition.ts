import { Context, Markup } from 'telegraf';
import { User } from '../../../db-types/User';
import { getUser } from '../getUser';

export async function handleGetUserPosition(ctx: Context, connection: any) {
    if (!ctx.pollAnswer) {
        console.log('missing data.');
        return false;
    }

    const userId = ctx.pollAnswer.user.id;
    const user = await getUser(Number(userId), connection);

    // Check if the user selected skip
    if (ctx.pollAnswer.option_ids[0] == 2) {
        await ctx.telegram.sendMessage(
            ctx.pollAnswer.user.id,
            'You can always share your location later with the command /share_location',
        );
        return false;
    }

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
            return true;
        } else {
            ctx.telegram.sendMessage(
                ctx.pollAnswer.user.id,
                'You can share your location later by typing /share_location',
            );
            return false;
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
