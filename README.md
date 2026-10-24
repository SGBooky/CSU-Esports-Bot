# NECC Forms Discord Bot

TypeScript Discord bot that lets members pick one of four form types from a dropdown, upload a screenshot, and forwards that submission to a staff review channel.

## Form types

1. NECC Discord connected
2. Screenshot of joining the NECC Discord
3. Confirmation of dues paid
4. Confirmation of IMLeague forms

## How it works

**Preferred (DMs):**
1. Members open a DM with the bot (or use `/submit`).
2. They choose a form type from the dropdown.
3. They upload a screenshot in the DM within 5 minutes.
4. The bot posts it to your staff submissions channel.

**Optional (server channel):** An admin can still run `/setup-forms` to post the same menu in a channel.

## Setup

### 1. Create the Discord application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**.
2. Under **Bot**, create a bot and copy the token.
3. Enable **Message Content Intent** under Bot → Privileged Gateway Intents.
4. Copy the **Application ID** (Client ID) from the General Information page.

### 2. Invite the bot

Use this URL (replace `YOUR_CLIENT_ID`):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147560448&scope=bot%20applications.commands
```

That grants: View Channels, Send Messages, Embed Links, Attach Files, Read Message History, Use Application Commands.

### 3. Collect IDs

With **Developer Mode** on (Discord Settings → Advanced):

- Right-click your server → **Copy Server ID** → `GUILD_ID`
- Right-click each staff channel → **Copy Channel ID** → set in `.env`:
  - `CHANNEL_NECC_DISCORD_CONNECTED` → `#discord-bot-necc-account`
  - `CHANNEL_NECC_DISCORD_JOIN` → `#discord-bot-necc-discord`
  - `CHANNEL_DUES_PAID` → `#discord-bot-dues`
  - `CHANNEL_IMLEAGUE_FORMS` → `#discord-bot-imleagues`

### 4. Configure the project

```bash
npm install
copy .env.example .env
```

Edit `.env` with your token and IDs.

### 5. Register commands and run

```bash
npm run register-commands
npm run dev
```

For production:

```bash
npm run build
npm start
```

### 6. Post the menu

In the member submission channel, run:

```
/setup-forms
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled bot |
| `npm run register-commands` | Register `/setup-forms` for your guild |

## Notes

- Only users with **Manage Server** can run `/setup-forms`.
- Each member can have one pending upload at a time; choosing again replaces it.
- Pending uploads expire after 5 minutes.
