/**
 * Transform Directus image URLs to include size and quality parameters
 * @param imageUrl - The original Directus image URL
 * @param maxWidth - Maximum width in pixels (default: 600)
 * @param maxHeight - Maximum height in pixels (default: 400)
 * @param quality - Image quality 1-100 (default: 80)
 * @returns Transformed URL with Directus image transformation parameters
 */
export function transformDirectusImage(
  imageUrl: string,
  maxWidth: number = 600,
  maxHeight: number = 400,
  quality: number = 80
): string {
  // Check if it's a Directus assets URL
  if (imageUrl.includes('/assets/')) {
    const baseUrl = imageUrl.split('?')[0]; // Remove existing query params
    const params = new URLSearchParams({
      width: maxWidth.toString(),
      height: maxHeight.toString(),
      fit: 'cover',
      quality: quality.toString(),
    });

    return `${baseUrl}?${params.toString()}`;
  }

  return imageUrl; // Return original if not a Directus URL
}

/**
 * Process HTML content to transform all Directus image URLs
 * Only transforms images within the post content, not main post images
 * @param htmlContent - HTML content string
 * @param maxWidth - Maximum width for images
 * @param maxHeight - Maximum height for images
 * @param quality - Image quality
 * @returns HTML content with transformed image URLs
 */
export function processPostImages(
  htmlContent: string,
  maxWidth: number = 600,
  maxHeight: number = 400,
  quality: number = 80
): string {
  // Regular expression to find img src attributes
  const imgRegex = /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi;

  return htmlContent.replace(imgRegex, (match, beforeSrc, src, afterSrc) => {
    // Only transform images that are not the main post image (zdjecie_glowne)
    // This ensures the hero image stays at full resolution
    const transformedSrc = transformDirectusImage(src, maxWidth, maxHeight, quality);
    return `<img${beforeSrc}src="${transformedSrc}"${afterSrc}>`;
  });
}
