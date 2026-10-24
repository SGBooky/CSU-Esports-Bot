import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export type FormTypeId =
  | "necc_discord_connected"
  | "necc_discord_join_screenshot"
  | "dues_paid"
  | "imleague_forms_code";

const FORM_CHANNEL_ENV: Record<FormTypeId, string> = {
  necc_discord_connected: "CHANNEL_NECC_DISCORD_CONNECTED",
  necc_discord_join_screenshot: "CHANNEL_NECC_DISCORD_JOIN",
  dues_paid: "CHANNEL_DUES_PAID",
  imleague_forms_code: "CHANNEL_IMLEAGUE_FORMS",
};

function resolveFormChannelId(formType: FormTypeId): string {
  return requireEnv(FORM_CHANNEL_ENV[formType]);
}

export const config = {
  token: requireEnv("DISCORD_TOKEN"),
  clientId: requireEnv("CLIENT_ID"),
  guildId: requireEnv("GUILD_ID"),
  getSubmissionChannelId: resolveFormChannelId,
  formChannelEnvNames: FORM_CHANNEL_ENV,
} as const;

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
    label: "Confirmation of IMLeague forms",
    description: "Screenshot confirming your IMLeague forms",
    emoji: "📋",
  },
];

export function getFormOption(id: string): FormOption | undefined {
  return FORM_OPTIONS.find((option) => option.id === id);
}
