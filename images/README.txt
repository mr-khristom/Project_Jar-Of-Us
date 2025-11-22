
STORING IMAGES FOR THE JAR
==========================

1. Place your image files in this folder (e.g., photo-001.jpg, us-beach.png).
2. Open 'storage.json' in the root folder.
3. Reference the image in your memory object like this:

   {
     "id": "day-001",
     "text": "Our trip to the beach...",
     "date": "2024-05-20",
     "imageUrl": "images/photo-001.jpg"
   }

NOTE: 
- Keep image file names simple (no spaces recommended).
- This method uses ZERO browser storage, so you won't get quota errors!
