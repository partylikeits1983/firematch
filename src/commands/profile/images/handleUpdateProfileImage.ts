import { Context } from 'telegraf';
import { User } from '../../../db-types/User';
import { getUser } from '../getUser';

export async function handleUpdateProfileImage(ctx: Context, connection: any) {
    if (ctx.message && 'photo' in ctx.message && ctx.message.from?.id) {
        const photoArray = ctx.message.photo;

        if (photoArray && photoArray.length > 0) {
            // Extract all fileIds from the photoArray
            const fileIds = photoArray.map(photo => photo.file_id);

            // Deduplicate using a Set
            const uniqueFileIds = [...new Set(fileIds)];

            // Log unique fileIds
            console.log('Unique File IDs:', uniqueFileIds);

            // Retrieve the user from the database
            const user = await getUser(Number(ctx.message.from.id), connection);

            if (user) {
                // Clear out the pre-existing fileIds and replace with new fileIds
                user.photo_ids = fileIds;

                // Save the updated user back to the database
                await connection.getRepository(User).save(user);

                console.log('All File IDs saved to the database:', fileIds);
            }
        }
    }
}
