import sharp from 'sharp';

/**
 * Optimizes a Base64 image using Sharp.
 * Resizes, compresses, and converts to WebP.
 * @param {string} base64Data - The full data URL (e.g. data:image/jpeg;base64,...)
 * @param {number} width - Target width
 * @param {number} quality - WebP quality (1-100)
 * @returns {Promise<string>} - The optimized data URL
 */
export async function optimizeImage(base64Data, width = 1200, quality = 80) {
  try {
    if (!base64Data || !base64Data.startsWith('data:image')) {
      return base64Data;
    }

    // Extract the base64 part
    const [header, base64] = base64Data.split(',');
    const buffer = Buffer.from(base64, 'base64');

    // Process with Sharp
    const optimizedBuffer = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF
      .resize({
        width,
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality })
      .toBuffer();

    const optimizedBase64 = optimizedBuffer.toString('base64');
    return `data:image/webp;base64,${optimizedBase64}`;
  } catch (err) {
    console.error('Image optimization failed:', err);
    return base64Data; // Return original if optimization fails
  }
}
