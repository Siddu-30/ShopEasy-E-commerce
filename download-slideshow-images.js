const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const slideshowDir = path.join(__dirname, 'public', 'images', 'slideshow');
if (!fs.existsSync(slideshowDir)) {
  fs.mkdirSync(slideshowDir, { recursive: true });
}

// Image URLs for Deals slideshow
const dealsImages = [
  {
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop',
    filename: 'summer-sale.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1200&auto=format&fit=crop',
    filename: 'flash-deals.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1200&auto=format&fit=crop',
    filename: 'clearance-sale.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1200&auto=format&fit=crop',
    filename: 'limited-offers.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1200&auto=format&fit=crop',
    filename: 'special-discounts.jpg'
  }
];

// Image URLs for New Arrivals slideshow
const newArrivalsImages = [
  {
    url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop',
    filename: 'new-electronics.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
    filename: 'new-fashion.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200&auto=format&fit=crop',
    filename: 'new-home-kitchen.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop',
    filename: 'new-beauty.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop',
    filename: 'new-sports.jpg'
  }
];

// Combine all images
const allImages = [...dealsImages, ...newArrivalsImages];

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(slideshowDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      console.error(`Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  try {
    await Promise.all(allImages.map(img => downloadImage(img.url, img.filename)));
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages(); 