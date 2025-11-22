
/**
 * Converts Imgur gallery/page links to direct image links.
 * Example: https://imgur.com/ID -> https://i.imgur.com/ID.jpg
 */
export const getDirectImgurUrl = (url: string): string => {
  if (!url) return '';
  let processed = url.trim();
  
  // Check if it is an imgur link and DOES NOT have a file extension
  if (processed.includes('imgur.com') && !/\.(jpeg|jpg|gif|png|webp)$/i.test(processed)) {
     
     // Remove any query parameters
     processed = processed.split('?')[0];
     
     // Handle trailing slashes
     if (processed.endsWith('/')) {
       processed = processed.slice(0, -1);
     }

     const parts = processed.split('/');
     const id = parts[parts.length - 1];

     // Ensure we captured an ID and not something else
     if (id && id !== 'gallery' && id !== 'a') {
         return `https://i.imgur.com/${id}.jpg`;
     }
  }
  
  return processed;
};
