import OpenAI from "openai";
import {
  ApplicationCommandDataResolvable,
  ApplicationCommandOptionType,
} from "discord.js";
import env from "../env.js";
import { Message } from "../db/message.js";
import sql from "../db/database.js";

const openai = new OpenAI({
  organization: env.OPENAI_ORG_ID,
  project: env.OPENAI_PROJECT_ID,
  apiKey: env.OPENAI_API_KEY,
});

export const chatCommand = {
  name: "chat",
  description: "Starts GPT-4o chat.",
  options: [
    {
      name: "title",
      type: ApplicationCommandOptionType.String,
      required: true,
      description: "スレッドのタイトル",
    },
  ],
} satisfies ApplicationCommandDataResolvable;

export const chatHandler = async (threadId: string, message: string) => {
  await sql`INSERT INTO messages (thread_id, role, content) VALUES (${threadId}, 'user', ${message})`;

  const messages = await sql<
    Message[]
  >`SELECT * FROM messages WHERE thread_id = ${threadId} ORDER BY created_at`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that helps Japanese students who work on developing AI product for a hackathon. Please answer the following questions in Japanese.",
      },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ],
  });

  await sql`INSERT INTO messages (thread_id, role, content) VALUES (${threadId}, 'assistant', ${stream.choices[0].message.content})`;

  return stream.choices[0].message.content;
};
