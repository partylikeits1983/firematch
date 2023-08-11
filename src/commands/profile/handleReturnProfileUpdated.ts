import { Context } from 'telegraf';
import { getUser } from './getUser';

import { getCityFromGeoLocation } from '../../utils/getNearestCity';

export async function handleReturnProfileUpdated(ctx: Context, connection: any, userId: number) {
    const user = await getUser(userId, connection);

    await ctx.telegram.sendMessage(userId, "Here's your profile: ");

    if (user) {
        console.log('user');
        console.log(user);

        console.log(getCityFromGeoLocation(user.geolocation));

        const locationString = getCityFromGeoLocation(user.geolocation);

        const message = `
Name: ${user.first_name}

Gender: ${user.gender}
Age: ${user.age}
Preference: ${user.preference}

Geolocation: ${locationString}
Bio: ${user.bio}`;

        await ctx.telegram.sendMessage(userId, message);
    } else {
        await ctx.telegram.sendMessage(userId, "Sorry, we couldn't find your profile data.");
    }
}
