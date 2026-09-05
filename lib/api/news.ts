import type { NewsCategory } from "@/lib/content/posts";
import { postApi } from "@/lib/content/posts";

/**
 * News accessors. The posts themselves live in `content/news/*.mdx` — writing
 * one is creating a file there; this layer only filters and orders.
 */

export const newsApi = postApi<NewsCategory>("news");

export const getPosts = newsApi.getPosts;
export const getFeaturedPost = newsApi.getFeaturedPost;
export const getPost = newsApi.getPost;
export const getPostNeighbours = newsApi.getPostNeighbours;
export const getAllSlugs = newsApi.getAllSlugs;

export type { NewsCategory, Post, PostMeta } from "@/lib/content/posts";
