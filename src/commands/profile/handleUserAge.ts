import { Context } from 'telegraf';
import { User } from '../../db-types/User';
import { getUser } from './getUser';

export async function handleUserAge(ctx: Context, connection: any) {
    if (ctx.message?.from.id && ctx.message) {
        const user = await getUser(Number(ctx.message.from.id), connection);

        if (user && ctx.message && 'text' in ctx.message) {
            if (checkValidAge(Number(ctx.message.text))) {
                user.age = Number(parseInt(String(ctx.message.text)));
                await connection.getRepository(User).save(user);
                ctx.reply('Write a short bio about yourself');
                return true;
            } else {
                ctx.reply('Invalid Age (18-100)');
                return false;
            }
        }
    }
}

function checkValidAge(age: number) {
    if (age < 18) {
        return false;
    }
    if (age > 100) {
        return false;
    }
    return true;
}
