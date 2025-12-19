export function generateBlurPlaceholder(width: number = 16, height: number = 12): string {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/4}" fill="#e5e7eb"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}