const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const categoriesDir = path.join(__dirname, 'public', 'images', 'categories');
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

// Image URLs for each category
const images = [
  {
    url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop',
    filename: 'electronics.jpg',
    category: 'Electronics'
  },
  {
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
    filename: 'fashion.jpg',
    category: 'Fashion'
  },
  {
    url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200&auto=format&fit=crop',
    filename: 'home-kitchen.jpg',
    category: 'Home & Kitchen'
  },
  {
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop',
    filename: 'beauty.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop',
    filename: 'sports.jpg',
    category: 'Sports & Outdoors'
  },
  {
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',
    filename: 'books.jpg',
    category: 'Books & Media'
  }
];

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(categoriesDir, filename);
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
  console.log('Starting downloads...');
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Failed to download ${image.filename}`);
    }
  }
  console.log('All downloads completed!');
}

downloadAllImages(); 