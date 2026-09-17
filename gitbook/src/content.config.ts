import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    subject: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
  }),
});

export const collections = { docs };