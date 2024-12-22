import { config } from "dotenv";
import { z } from "zod";

config();

const schema = z.object({
  // Discord
  DISCORD_BOT_TOKEN: z.string().nonempty(),
  DISCORD_GUILD_ID: z.string().nonempty(),

  // OpenAI
  OPENAI_ORG_ID: z.string().nonempty(),
  OPENAI_PROJECT_ID: z.string().nonempty(),
  OPENAI_API_KEY: z.string().nonempty(),

  // PostgreSQL
  DATABASE_URL: z.string().nonempty(),
});

const env = schema.parse(process.env);

export default env;
