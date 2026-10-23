import {
  type StringSelectMenuInteraction,
  MessageFlags,
} from "discord.js";
import { getFormOption, type FormTypeId } from "../config";
import {
  clearPending,
  getSubmissionWindowMinutes,
  setPending,
} from "../pendingSubmissions";

export async function handleFormSelect(
  interaction: StringSelectMenuInteraction
): Promise<void> {
  const formType = interaction.values[0] as FormTypeId;
  const option = getFormOption(formType);

  if (!option) {
    await interaction.reply({
      content: "Unknown form type. Please try again.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  clearPending(interaction.user.id);
  setPending(interaction.user.id, interaction.channelId, formType);

  const minutes = getSubmissionWindowMinutes();

  await interaction.reply({
    content: [
      `You selected **${option.label}**.`,
      "",
      `Upload your screenshot in this channel within **${minutes} minutes**.`,
      "Send an image attachment (PNG, JPG, or WEBP).",
      "",
      "After you send it, the bot will forward it to the staff review channel and confirm here.",
    ].join("\n"),
    flags: MessageFlags.Ephemeral,
  });
}
