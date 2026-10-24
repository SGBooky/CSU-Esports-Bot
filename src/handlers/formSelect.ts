import path from "node:path";
import {
  AttachmentBuilder,
  type StringSelectMenuInteraction,
  MessageFlags,
} from "discord.js";
import { getFormOption, type FormTypeId } from "../config";
import {
  clearPending,
  getSubmissionWindowMinutes,
  setPending,
} from "../pendingSubmissions";

interface FormExample {
  fileName: string;
  instructionLines: string[];
}

const FORM_EXAMPLES: Partial<Record<FormTypeId, FormExample>> = {
  necc_discord_connected: {
    fileName: "necc-discord-linked-example.png",
    instructionLines: [
      "Screenshot of NECC account with Discord linked.",
      "",
      "Example of what to include:",
    ],
  },
  necc_discord_join_screenshot: {
    fileName: "necc-discord-join-example.png",
    instructionLines: [
      "Screenshot of joining the NECC Discord.",
      "",
      "Example of what to include:",
    ],
  },
  dues_paid: {
    fileName: "dues-example.png",
    instructionLines: [
      "Your screenshot must clearly show:",
      "• **Full name**",
      "• **Date/time**",
      "• **Amount paid**",
      "",
      "Example of what to include:",
    ],
  },
  imleague_forms_code: {
    fileName: "imleague-forms-example.png",
    instructionLines: [
      "Screenshot of all 6 IMLeague forms completed (Health History Form Pending Review is okay).",
      "",
      "Example of what to include:",
    ],
  },
};

export async function handleFormSelect(
  interaction: StringSelectMenuInteraction
): Promise<void> {
  if (!interaction.channel?.isDMBased()) {
    await interaction.reply({
      content:
        "Form submissions only work in DMs. Please DM the bot and use **/submit**.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const formType = interaction.values[0] as FormTypeId;
  const option = getFormOption(formType);

  if (!option) {
    await interaction.reply({
      content: "Unknown form type. Please try again.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (!interaction.channelId) {
    await interaction.reply({
      content: "Could not determine this DM. Please try **/submit** again.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  clearPending(interaction.user.id);
  setPending(interaction.user.id, interaction.channelId, formType);

  const minutes = getSubmissionWindowMinutes();
  const example = FORM_EXAMPLES[formType];
  const lines = [
    `You selected **${option.label}**.`,
    "",
    `Upload your screenshot in this DM within **${minutes} minutes**.`,
    "Send an image attachment (PNG, JPG, WEBP, or GIF).",
  ];

  if (example) {
    lines.push("", ...example.instructionLines);
  }

  lines.push(
    "",
    "After you send it, the bot will forward it to the staff review channel and confirm here."
  );

  if (example) {
    const file = new AttachmentBuilder(
      path.join(process.cwd(), "assets", example.fileName),
      { name: example.fileName }
    );

    await interaction.reply({
      content: lines.join("\n"),
      files: [file],
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply({
    content: lines.join("\n"),
    flags: MessageFlags.Ephemeral,
  });
}
