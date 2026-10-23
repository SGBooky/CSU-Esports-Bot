import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { FORM_OPTIONS } from "../config";

export const FORM_SELECT_CUSTOM_ID = "form_type_select";

export function buildFormSelectRow(): ActionRowBuilder<StringSelectMenuBuilder> {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(FORM_SELECT_CUSTOM_ID)
    .setPlaceholder("Select a form type to submit…")
    .addOptions(
      FORM_OPTIONS.map((option) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(option.label)
          .setDescription(option.description)
          .setValue(option.id)
          .setEmoji(option.emoji)
      )
    );

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}
