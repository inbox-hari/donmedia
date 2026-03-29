function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to read image file.'));
    };

    image.src = objectUrl;
  });
}

export async function optimizeImageUpload(file, options = {}) {
  if (!file || !file.type.startsWith('image/')) {
    return file;
  }

  const {
    maxWidth = 900,
    maxHeight = 1200,
    quality = 0.78,
    type = 'image/jpeg',
  } = options;

  const image = await loadImage(file);
  const widthRatio = maxWidth / image.width;
  const heightRatio = maxHeight / image.height;
  const ratio = Math.min(1, widthRatio, heightRatio);

  const targetWidth = Math.max(1, Math.round(image.width * ratio));
  const targetHeight = Math.max(1, Math.round(image.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    return file;
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, targetWidth, targetHeight);
  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, '');
  const extension = type === 'image/webp' ? 'webp' : 'jpg';

  return new File([blob], `${baseName}.${extension}`, {
    type,
    lastModified: Date.now(),
  });
}
