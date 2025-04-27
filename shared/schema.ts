import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertWaitlistSchema = createInsertSchema(waitlist)
  .pick({
    email: true,
    name: true,
    message: true
  })
  .extend({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    message: z.string().optional()
  });

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;
