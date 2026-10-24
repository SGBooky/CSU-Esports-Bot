import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";

export const setupFormsCommand = new SlashCommandBuilder()
  .setName("setup-forms")
  .setDescription("Explain how members submit forms (DM-only)")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function handleSetupForms(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  await interaction.reply({
    content: [
      "Form submissions only work in DMs with the bot.",
      "",
      "1. Open a DM with **CSU Esports**",
      "2. Type `/` and select **submit**",
      "3. Pick a form type and upload the screenshot",
      "",
      "Screenshots are forwarded to the matching staff channel for that form type.",
    ].join("\n"),
    flags: MessageFlags.Ephemeral,
  });
}
