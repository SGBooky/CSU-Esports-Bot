import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { buildFormMenuPayload } from "../components/formMenu";

export const submitCommand = new SlashCommandBuilder()
  .setName("submit")
  .setDescription("Opens the form submission menu")
  .setContexts(InteractionContextType.BotDM)
  .setIntegrationTypes(ApplicationIntegrationType.GuildInstall);

export async function handleSubmit(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  if (interaction.inGuild()) {
    await interaction.reply({
      content:
        "Form submissions only work in DMs. Please DM the bot and use **/submit**.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply(buildFormMenuPayload());
}
