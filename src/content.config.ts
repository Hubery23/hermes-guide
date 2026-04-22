import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				day: z.number().optional(),
				duration: z.string().optional(),
				milestone: z.boolean().default(false),
				sources: z
					.array(
						z.object({
							title: z.string(),
							url: z.string().url(),
						}),
					)
					.default([]),
			}),
		}),
	}),
};
