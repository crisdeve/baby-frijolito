// Prefixes a root-relative public asset path with NEXT_PUBLIC_BASE_PATH, for
// use anywhere the framework doesn't already do it (next/image and next/link
// handle basePath automatically; plain CSS/JS asset references don't).
export function assetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${path}`;
}
