import { Client, TextChannel, ThreadChannel } from "discord.js";
import { chatCommand, chatHandler } from "./commands/chat.js";
import env from "./env.js";

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "chat") {
    if (interaction.channel instanceof TextChannel) {
      const title = interaction.options.getString("title");
      const channel = interaction.channel;
      const thread = await channel.threads.create({
        name: title || "New Chat",
      });
      interaction.reply({
        content: `新規スレッドが作成されました。 ${thread}`,
      });
      thread.send(`\`${title}\` を作成しました。`);
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.channel instanceof ThreadChannel) {
    if (message.channel.parent?.name === "chat-gpt") {
      const reply = await chatHandler(message.channelId, message.content);
      await message.reply(reply || "No response from GPT-4o");
    }
  }
});

client.on("ready", async () => {
  await client.application?.commands.set([chatCommand], env.DISCORD_GUILD_ID);
});

client.login(env.DISCORD_BOT_TOKEN);
