import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  Partials,
} from "discord.js";
import { config } from "./config";
import { FORM_SELECT_CUSTOM_ID } from "./components/formSelect";
import { handleSetupForms, setupFormsCommand } from "./commands/setupForms";
import { handleSubmit, submitCommand } from "./commands/submit";
import { handleFormSelect } from "./handlers/formSelect";
import { handleScreenshotMessage } from "./handlers/screenshotMessage";
import { handleDmWelcome } from "./handlers/dmWelcome";
import { getPending } from "./pendingSubmissions";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  for (const [formType, envName] of Object.entries(config.formChannelEnvNames)) {
    try {
      const channelId = config.getSubmissionChannelId(
        formType as keyof typeof config.formChannelEnvNames
      );
      console.log(`Form ${formType} → #${channelId} (${envName})`);
    } catch (error: unknown) {
      console.warn(`Form ${formType} has no channel configured (${envName})`);
    }
  }
  console.log("Members can DM the bot and use /submit to open the form menu.");
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === setupFormsCommand.name) {
        await handleSetupForms(interaction);
      } else if (interaction.commandName === submitCommand.name) {
        await handleSubmit(interaction);
      }
      return;
    }

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === FORM_SELECT_CUSTOM_ID) {
        await handleFormSelect(interaction);
      }
    }
  } catch (error: unknown) {
    console.error("Interaction error:", error);
    const detail =
      error instanceof Error ? error.message : "Unknown error occurred.";
    if (interaction.isRepliable()) {
      const payload = {
        content: `Something went wrong: ${detail}`,
        flags: MessageFlags.Ephemeral as const,
      };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload);
      } else {
        await interaction.reply(payload);
      }
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  try {
    // Pending screenshot upload (DM or server)
    if (getPending(message.author.id)) {
      await handleScreenshotMessage(client, message);
      return;
    }

    // First contact in DMs → show the menu
    if (message.channel.isDMBased()) {
      await handleDmWelcome(message);
    }
  } catch (error: unknown) {
    console.error("Message handler error:", error);
  }
});

client.login(config.token).catch((error: unknown) => {
  console.error("Failed to log in:", error);
  process.exit(1);
});
