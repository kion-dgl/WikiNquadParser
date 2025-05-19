import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication (keeping from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define a schema for Wikipedia conversion requests
export const wikipediaConversionSchema = z.object({
  url: z.string().url("Please enter a valid URL")
    .refine((url) => {
      const regex = /^https?:\/\/([\w-]+\.)*wikipedia\.org\/wiki\/.+$/i;
      return regex.test(url);
    }, "Please enter a valid Wikipedia URL"),
  fullContent: z.boolean().default(false)
});

export type WikipediaConversionRequest = z.infer<typeof wikipediaConversionSchema>;

// Define a schema for conversion results
export const conversionResultSchema = z.object({
  nquads: z.string(),
  stats: z.object({
    triples: z.number(),
    entities: z.number(),
    predicates: z.number(),
    fileSize: z.string()
  }),
  sourceUrl: z.string().url()
});

export type ConversionResult = z.infer<typeof conversionResultSchema>;
