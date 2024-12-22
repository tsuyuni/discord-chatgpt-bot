import { z } from "zod";

const messageRoleSchema = z.enum(["user", "assistant"]);

const messageSchema = z.object({
  thread_id: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  created_at: z.date(),
});

export type Message = z.infer<typeof messageSchema>;
