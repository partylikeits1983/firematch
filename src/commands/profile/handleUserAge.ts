import { Context } from 'telegraf';
import { User } from '../../db-types/User';
import { getUser } from './getUser';

export async function handleUserAge(ctx: Context, connection: any) {
    if (ctx.message?.from.id && ctx.message) {
        const user = await getUser(Number(ctx.message.from.id), connection);

        if (user && ctx.message && 'text' in ctx.message) {
            const potentialAge = parseAge(ctx.message.text);
            if (potentialAge !== null && checkValidAge(potentialAge)) {
                user.age = potentialAge;
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
    return age >= 18 && age <= 100;
}

function parseAge(text: string): number | null {
    const potentialAge = parseInt(text);
    if (!isNaN(potentialAge)) {
        return potentialAge;
    }
    return null;
}
