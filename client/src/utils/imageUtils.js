/**
 * Utility functions for image processing
 */

/**
 * Compresses an image file and converts it to base64
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width for the compressed image (default: 400)
 * @param {number} maxHeight - Maximum height for the compressed image (default: 400)
 * @param {number} quality - Compression quality 0-1 (default: 0.8)
 * @returns {Promise<string>} - Promise that resolves to base64 string
 */
export const compressImageToBase64 = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Check file size (limit to 5MB before compression)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      reject(new Error('Image file too large. Please choose an image smaller than 5MB.'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression
      try {
        const base64String = canvas.toDataURL('image/jpeg', quality);
        
        // Check if compressed image is still too large (limit to 1MB in base64)
        const base64Size = base64String.length * 0.75; // Approximate size in bytes
        if (base64Size > 1024 * 1024) {
          // Try with lower quality
          if (quality > 0.3) {
            compressImageToBase64(file, maxWidth, maxHeight, quality - 0.2)
              .then(resolve)
              .catch(reject);
            return;
          } else {
            reject(new Error('Unable to compress image to acceptable size. Please try a smaller image.'));
            return;
          }
        }
        
        resolve(base64String);
      } catch (error) {
        reject(new Error('Failed to compress image: ' + error.message));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validates image file before processing
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' 
    };
  }

  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File too large. Please upload an image smaller than 5MB.' 
    };
  }

  return { isValid: true };
};

/**
 * Creates a preview URL for an image file
 * @param {File} file - The image file
 * @returns {string} - Object URL for preview
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Cleans up object URLs to prevent memory leaks
 * @param {string} url - The object URL to revoke
 */
export const cleanupImagePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
