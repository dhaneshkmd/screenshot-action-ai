/**
 * Compresses and resizes high-resolution mobile camera photos
 * to fit safely within Vercel's 4.5MB serverless payload limit (~500KB-1MB),
 * while preserving high fidelity for Gemini Multimodal OCR.
 */
export async function optimizeImageForUpload(
  source: File | string,
  maxDimension = 1600,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    // If it's an SVG data URI, don't rasterize or downscale
    if (typeof source === 'string' && source.startsWith('data:image/svg+xml')) {
      resolve(source);
      return;
    }

    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // Downscale if either dimension exceeds maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to original
        if (typeof source === 'string') resolve(source);
        return;
      }

      // Draw with smooth interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to compressed JPEG data URL
      const compressedDataUri = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUri);
    };

    img.onerror = () => {
      if (typeof source === 'string') {
        resolve(source);
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(source);
    }
  });
}
