import type { Message } from "discord.js";
import { getPending } from "../pendingSubmissions";

/** When someone DMs the bot without /submit, tell them how to start. */
export async function handleDmWelcome(message: Message): Promise<void> {
  if (message.author.bot || !message.channel.isDMBased()) {
    return;
  }

  // Don't interrupt someone who already picked a form and is uploading
  if (getPending(message.author.id)) {
    return;
  }

  await message.reply({
    content:
      "To submit a form screenshot, type `/` and select **submit** from the command list (under CSU Esports).",
    allowedMentions: { repliedUser: false },
  });
}
