import { REST, Routes } from "discord.js";
import { config } from "./config";
import { setupFormsCommand } from "./commands/setupForms";

async function main(): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(config.token);

  const body = [setupFormsCommand.toJSON()];

  console.log("Registering slash commands for guild", config.guildId);
  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
    body,
  });
  console.log("Slash commands registered: /setup-forms");
}

main().catch((error: unknown) => {
  console.error("Failed to register commands:", error);
  process.exit(1);
});
