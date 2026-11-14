import type { TranslationKey } from "@/lib/i18n/dictionaries";
import type { PostCategory } from "@/lib/types";

export const POST_CATEGORIES: PostCategory[] = [
  "market-update",
  "software-tools",
  "workshop",
  "journalism-ethics",
  "storytelling",
];

const CATEGORY_KEYS: Record<PostCategory, TranslationKey> = {
  "market-update": "category.market-update",
  "software-tools": "category.software-tools",
  workshop: "category.workshop",
  "journalism-ethics": "category.journalism-ethics",
  storytelling: "category.storytelling",
};

export function categoryKey(category: PostCategory): TranslationKey {
  return CATEGORY_KEYS[category];
}

export function isPostCategory(value: string | undefined | null): value is PostCategory {
  return Boolean(value) && POST_CATEGORIES.includes(value as PostCategory);
}
