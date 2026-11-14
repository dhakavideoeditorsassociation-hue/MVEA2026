/**
 * Shared slug helper.
 *
 * Seed records use slugs derived from the English name, and the committee page
 * needs the same value to look up a member's uploaded portrait, so both sides
 * use this function.
 */
export function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
