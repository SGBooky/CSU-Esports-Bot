import {
  AttachmentBuilder,
  EmbedBuilder,
  type Client,
  type Message,
  type TextChannel,
} from "discord.js";
import { config, getFormOption } from "../config";
import { clearPending, getPending } from "../pendingSubmissions";

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif)$/i;

function isImageAttachment(url: string, contentType: string | null): boolean {
  if (contentType?.startsWith("image/")) {
    return true;
  }
  return IMAGE_EXTENSIONS.test(url);
}

export async function handleScreenshotMessage(
  client: Client,
  message: Message
): Promise<void> {
  if (message.author.bot || !message.guild) {
    return;
  }

  const pending = getPending(message.author.id);
  if (!pending || pending.channelId !== message.channelId) {
    return;
  }

  const image = message.attachments.find((attachment) =>
    isImageAttachment(attachment.url, attachment.contentType)
  );

  if (!image) {
    await message.reply({
      content:
        "Please attach an image screenshot (PNG, JPG, WEBP, or GIF). Your submission window is still open.",
      allowedMentions: { repliedUser: false },
    });
    return;
  }

  const option = getFormOption(pending.formType);
  if (!option) {
    clearPending(message.author.id);
    return;
  }

  const submissionsChannel = (await client.channels.fetch(
    config.submissionsChannelId
  )) as TextChannel | null;

  if (!submissionsChannel?.isTextBased()) {
    await message.reply(
      "Could not reach the staff submissions channel. Please contact an admin."
    );
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("New form submission")
    .setColor(0x5865f2)
    .addFields(
      { name: "Form type", value: `${option.emoji} ${option.label}`, inline: false },
      {
        name: "Submitted by",
        value: `${message.author} (\`${message.author.tag}\` / \`${message.author.id}\`)`,
        inline: false,
      },
      {
        name: "Source channel",
        value: `<#${message.channelId}>`,
        inline: true,
      },
      {
        name: "Message link",
        value: `[Jump to message](${message.url})`,
        inline: true,
      }
    )
    .setTimestamp(message.createdAt)
    .setFooter({ text: `User ID: ${message.author.id}` });

  const response = await fetch(image.url);
  if (!response.ok) {
    await message.reply(
      "Could not download your screenshot. Please try uploading again."
    );
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const file = new AttachmentBuilder(buffer, {
    name: image.name ?? "screenshot.png",
  });

  await submissionsChannel.send({
    content: `📬 Submission from ${message.author}`,
    embeds: [embed.setImage(`attachment://${file.name}`)],
    files: [file],
  });

  clearPending(message.author.id);

  await message.reply({
    content: `Thanks — your **${option.label}** screenshot was sent to the staff review channel.`,
    allowedMentions: { repliedUser: false },
  });
}
