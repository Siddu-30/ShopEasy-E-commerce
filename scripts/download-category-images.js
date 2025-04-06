const https = require('https');
const fs = require('fs');
const path = require('path');

const categories = [
  {
    name: 'electronics',
    url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80'
  },
  {
    name: 'fashion',
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'
  },
  {
    name: 'home-kitchen',
    url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80'
  },
  {
    name: 'beauty',
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'
  },
  {
    name: 'sports',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
  },
  {
    name: 'books',
    url: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&q=80'
  }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filename);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
      } else {
        reject(`Failed to download ${url}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const downloadAllImages = async () => {
  const imagesDir = path.join(__dirname, '../public/images/categories');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const category of categories) {
    const filename = path.join(imagesDir, `${category.name}.jpg`);
    try {
      await downloadImage(category.url, filename);
    } catch (error) {
      console.error(`Error downloading ${category.name}:`, error);
    }
  }
};

downloadAllImages().then(() => {
  console.log('All images downloaded successfully!');
}).catch((error) => {
  console.error('Error downloading images:', error);
}); 