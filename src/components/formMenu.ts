import { EmbedBuilder } from "discord.js";
import { FORM_OPTIONS } from "../config";
import { buildFormSelectRow } from "./formSelect";

export function buildFormMenuPayload(): {
  embeds: EmbedBuilder[];
  components: ReturnType<typeof buildFormSelectRow>[];
} {
  const formList = FORM_OPTIONS.map(
    (option) => `${option.emoji} **${option.label}** — ${option.description}`
  ).join("\n");

  const embed = new EmbedBuilder()
    .setTitle("NECC Form Submissions")
    .setDescription(
      [
        "Use the dropdown below to choose which form you are submitting.",
        "Then upload a screenshot here when the bot asks for it.",
        "",
        formList,
      ].join("\n")
    )
    .setColor(0x5865f2);

  return {
    embeds: [embed],
    components: [buildFormSelectRow()],
  };
}
