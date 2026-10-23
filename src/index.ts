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
import { handleFormSelect } from "./handlers/formSelect";
import { handleScreenshotMessage } from "./handlers/screenshotMessage";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  console.log(`Submissions channel: ${config.submissionsChannelId}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === setupFormsCommand.name) {
        await handleSetupForms(interaction);
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
    if (interaction.isRepliable()) {
      const payload = {
        content: "Something went wrong handling that interaction.",
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
    await handleScreenshotMessage(client, message);
  } catch (error: unknown) {
    console.error("Message handler error:", error);
  }
});

client.login(config.token).catch((error: unknown) => {
  console.error("Failed to log in:", error);
  process.exit(1);
});
