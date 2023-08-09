import { Context } from 'telegraf';
import { User } from './dbtypes/User';

import { getCurrentUnixTimestamp } from './utils/unixTime';

export async function handleMessage(ctx: Context, users: Set<number>, connection: any) {
 if (ctx.message && ctx.message.from && ctx.message.chat) {

    // Save user ID when they send a message to the bot
    users.add(ctx.message.from.id);




    if ('text' in ctx.message) {
      // Respond with a greeting
      ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Hello ${ctx.message.from.first_name}`,
      );

      ctx.telegram.sendPhoto(
        ctx.message.chat.id, // Replace with the recipient's chat ID
       "AgACAgEAAxkBAANyZNNy5Ehaw7mYQB9nCajz42joq1sAAtirMRvSNZhGHZQn-jWpm8gBAAMCAAN5AAMwBA" 
      );
    }

    // If the message contains a photo
    if (ctx.message && 'photo' in ctx.message) {
      console.log('Photo detected');
      const photoArray = ctx.message.photo;
      const highestResolutionPhoto = photoArray[photoArray.length - 1];
      console.log(highestResolutionPhoto.file_id);
  }
  }
  // AgACAgEAAxkBAANyZNNy5Ehaw7mYQB9nCajz42joq1sAAtirMRvSNZhGHZQn-jWpm8gBAAMCAAN5AAMwBA
}

/*  
      // Forward the received message back to the sender
      ctx.telegram.forwardMessage(
        ctx.message.chat.id,        // The chat where the message will be forwarded to
        ctx.message.chat.id,        // The chat from which the message will be forwarded
        ctx.message.message_id      // Message identifier in the chat specified in from_chat_id
      );
*/