import { z } from "zod";

export const articleStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "DRAFT",
  "PUBLISHED",
  "REJECTED",
]);

// What the scraper pipeline produces before it's inserted into the DB.
export const scrapedArticleSchema = z.object({
  title: z.string().min(3).max(240),
  summary: z.string().min(10).max(600),
  content: z.string().min(1),
  sourceUrl: z.string().url(),
  sourceSlug: z.string(),
  thumbnailUrl: z.string().url().optional(),
  authorName: z.string().optional(),
  categorySlug: z.string(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.coerce.date(),
  importanceScore: z.number().min(0).max(100).default(0),
});

export type ScrapedArticle = z.infer<typeof scrapedArticleSchema>;

// What the admin panel PATCHes when editing an article.
export const updateArticleSchema = z.object({
  title: z.string().min(3).max(240).optional(),
  summary: z.string().min(10).max(600).optional(),
  content: z.string().optional(),
  status: articleStatusEnum.optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  categoryId: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
});

export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

export const newsletterSignupSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});
