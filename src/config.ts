import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  token: requireEnv("DISCORD_TOKEN"),
  clientId: requireEnv("CLIENT_ID"),
  guildId: requireEnv("GUILD_ID"),
  submissionsChannelId: requireEnv("SUBMISSIONS_CHANNEL_ID"),
} as const;

export type FormTypeId =
  | "necc_discord_connected"
  | "necc_discord_join_screenshot"
  | "dues_paid"
  | "imleague_forms_code";

export interface FormOption {
  id: FormTypeId;
  label: string;
  description: string;
  emoji: string;
}

export const FORM_OPTIONS: FormOption[] = [
  {
    id: "necc_discord_connected",
    label: "NECC Discord connected",
    description: "Proof that your Discord is connected to NECC",
    emoji: "🔗",
  },
  {
    id: "necc_discord_join_screenshot",
    label: "Screenshot of joining NECC Discord",
    description: "Screenshot showing you joined the NECC Discord",
    emoji: "📸",
  },
  {
    id: "dues_paid",
    label: "Confirmation of dues paid",
    description: "Screenshot confirming club dues payment",
    emoji: "💵",
  },
  {
    id: "imleague_forms_code",
    label: "Confirmation of IMLeague forms code",
    description: "Screenshot confirming your IMLeague forms code",
    emoji: "📋",
  },
];

export function getFormOption(id: string): FormOption | undefined {
  return FORM_OPTIONS.find((option) => option.id === id);
}
