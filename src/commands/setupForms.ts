import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { buildFormSelectRow } from "../components/formSelect";
import { FORM_OPTIONS } from "../config";

export const setupFormsCommand = new SlashCommandBuilder()
  .setName("setup-forms")
  .setDescription("Post the form submission dropdown in this channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function handleSetupForms(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  if (!interaction.channel?.isTextBased() || interaction.channel.isDMBased()) {
    await interaction.reply({
      content: "This command can only be used in a server text channel.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const formList = FORM_OPTIONS.map(
    (option) => `${option.emoji} **${option.label}** — ${option.description}`
  ).join("\n");

  const embed = new EmbedBuilder()
    .setTitle("NECC Form Submissions")
    .setDescription(
      [
        "Use the dropdown below to choose which form you are submitting.",
        "Then upload a screenshot in this channel when the bot asks for it.",
        "",
        formList,
      ].join("\n")
    )
    .setColor(0x5865f2);

  await interaction.channel.send({
    embeds: [embed],
    components: [buildFormSelectRow()],
  });

  await interaction.reply({
    content: "Form submission menu posted in this channel.",
    flags: MessageFlags.Ephemeral,
  });
}
