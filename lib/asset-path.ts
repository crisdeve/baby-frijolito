// Prefixes a root-relative public asset path with NEXT_PUBLIC_BASE_PATH.
// Needed for every `public/` reference, including next/image `src`: with
// `images.unoptimized` (static export) it does NOT add basePath itself.
// next/link does handle basePath, so hrefs to pages don't need this.
export function assetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${path}`;
}
