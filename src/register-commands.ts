import { REST, Routes } from "discord.js";
import { config } from "./config";
import { setupFormsCommand } from "./commands/setupForms";
import { submitCommand } from "./commands/submit";

async function main(): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(config.token);

  // /submit is global + DM-only; /setup-forms stays guild-only for admins
  console.log("Registering global slash commands (DM /submit)…");
  await rest.put(Routes.applicationCommands(config.clientId), {
    body: [submitCommand.toJSON()],
  });

  console.log("Registering guild slash commands for", config.guildId);
  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: [setupFormsCommand.toJSON()] }
  );

  console.log("Slash commands registered: /submit (DMs only), /setup-forms (server)");
}

main().catch((error: unknown) => {
  console.error("Failed to register commands:", error);
  process.exit(1);
});
