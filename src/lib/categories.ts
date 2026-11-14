import type { TranslationKey } from "@/lib/i18n/dictionaries";
import type { PostCategory } from "@/lib/types";

export const POST_CATEGORIES: PostCategory[] = ["feature", "interview", "guide", "workshop", "ethics"];

const CATEGORY_KEYS: Record<PostCategory, TranslationKey> = {
  feature: "category.feature",
  interview: "category.interview",
  guide: "category.guide",
  workshop: "category.workshop",
  ethics: "category.ethics",
};

export function categoryKey(category: PostCategory): TranslationKey {
  return CATEGORY_KEYS[category];
}

export function isPostCategory(value: string | undefined | null): value is PostCategory {
  return Boolean(value) && POST_CATEGORIES.includes(value as PostCategory);
}
