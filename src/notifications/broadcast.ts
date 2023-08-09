import readline from 'readline';
import { Telegraf } from 'telegraf';

export function sendTerminalMessageToAll(bot: Telegraf, users: Set<number>) {
  // Set up a readline interface for terminal input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (input) => {
    // Send a message to all users when you type a message in the terminal
    users.forEach((userId) => {
      bot.telegram.sendMessage(userId, input);
    });
  });

  // Close the readline interface on bot termination
  process.once('SIGINT', () => rl.close());
  process.once('SIGTERM', () => rl.close());
}
