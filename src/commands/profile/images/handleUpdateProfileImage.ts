import { Context } from 'telegraf';

export async function handleUpdateProfileImage(ctx: Context, connection: any) {
    if (ctx.message && 'photo' in ctx.message) {
        console.log('Photo detected');
        const photoArray = ctx.message.photo;
        const highestResolutionPhoto = photoArray[photoArray.length - 1];
        console.log(highestResolutionPhoto.file_id);
    }
}
