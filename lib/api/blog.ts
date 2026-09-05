import type { BlogCategory } from "@/lib/content/posts";
import { postApi } from "@/lib/content/posts";

/**
 * Blog accessors — the same contract as the news API over a different
 * directory: `content/blog/<slug>.<locale>.mdx`.
 */

export const blogApi = postApi<BlogCategory>("blog");

export const getPosts = blogApi.getPosts;
export const getFeaturedPost = blogApi.getFeaturedPost;
export const getPost = blogApi.getPost;
export const getPostNeighbours = blogApi.getPostNeighbours;
export const getAllSlugs = blogApi.getAllSlugs;

export type { BlogCategory, Post, PostMeta } from "@/lib/content/posts";
