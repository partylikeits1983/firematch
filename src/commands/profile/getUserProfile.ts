import { Context } from 'telegraf';
import { getUser } from './getUser';

import { getCityFromGeoLocation } from '../../utils/getNearestCity';

export async function getUserProfile(ctx: Context, connection: any, userId: number) {
    const user = await getUser(userId, connection);

    if (!user?.photo_ids[0]) {
        return;
    }

    await ctx.telegram.sendPhoto(userId, user?.photo_ids[0]);

    // await ctx.telegram.sendMessage(userId, "Here's your profile:", { parse_mode: 'Markdown' });

    if (user) {
        const locationString = getCityFromGeoLocation(user.geolocation);

        const message = `**Name**: ${user.first_name}
**Gender**: ${user.gender}
**Age**: ${user.age}
**Preference**: ${user.preference}

**Geolocation**: ${locationString}
**Bio**: ${user.bio}`;

        await ctx.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
    } else {
        await ctx.telegram.sendMessage(userId, "Sorry, we couldn't find your profile data.", {
            parse_mode: 'Markdown',
        });
    }
}
