import { Context } from 'telegraf';
import { User } from '../../../db-types/User';
import { getUser } from '../getUser';

export async function handleWriteUserLocation(
    ctx: Context,
    connection: any,
    location: { latitude: number; longitude: number },
) {
    if (ctx.message?.from.id) {
        const userId = Number(ctx.message.from.id);
        const user = await getUser(userId, connection);

        if (user) {
            const pointString = `(${location.latitude}, ${location.longitude})`;

            user.geolocation = pointString;

            await connection.getRepository(User).save(user);

            return true;
        }
    }

    return false;
}
