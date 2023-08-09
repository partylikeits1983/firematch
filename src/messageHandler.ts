import { Context } from 'telegraf';

export function handleMessage(ctx: Context, users: Set<number>) {
  if (ctx.message && ctx.message.from && ctx.message.chat) {
    // Save user ID when they send a message to the bot
    users.add(ctx.message.from.id);

    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Hello ${ctx.message.from.first_name}`,
    );
  }
}
