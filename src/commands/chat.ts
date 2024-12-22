import OpenAI from "openai";
import {
  ApplicationCommandDataResolvable,
  ApplicationCommandOptionType,
} from "discord.js";
import env from "@env";

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

export const chatHandler = async (message: string) => {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that helps Japanese students who work on developing AI product for a hackathon. Please answer the following questions in Japanese.",
      },
      { role: "user", content: message },
    ],
  });

  return stream.choices[0].message.content;
};
