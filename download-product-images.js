const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const productsDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// Image URLs for each product category
const images = [
  // Electronics
  {
    url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop',
    filename: 'smart-home-hub.jpg',
    category: 'Electronics'
  },
  {
    url: 'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=800&auto=format&fit=crop',
    filename: 'webcam.jpg',
    category: 'Electronics'
  },
  {
    url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop',
    filename: 'usb-hub.jpg',
    category: 'Electronics'
  },
  {
    url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=800&auto=format&fit=crop',
    filename: 'smart-bulb.jpg',
    category: 'Electronics'
  },
  
  // Fashion
  {
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    filename: 'denim-jacket.jpg',
    category: 'Fashion'
  },
  {
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    filename: 'wallet.jpg',
    category: 'Fashion'
  },
  {
    url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=800&auto=format&fit=crop',
    filename: 'watch-band.jpg',
    category: 'Fashion'
  },
  {
    url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=800&auto=format&fit=crop',
    filename: 'beanie.jpg',
    category: 'Fashion'
  },
  {
    url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
    filename: 'canvas-sneakers.jpg',
    category: 'Fashion'
  },
  {
    url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
    filename: 'belt.jpg',
    category: 'Fashion'
  },
  {
    url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop',
    filename: 'scarf.jpg',
    category: 'Fashion'
  },
  
  // Home & Kitchen
  {
    url: 'https://images.unsplash.com/photo-1593618998160-3b4c1b5b5b5b?q=80&w=800&auto=format&fit=crop',
    filename: 'knife-set.jpg',
    category: 'Home & Kitchen'
  },
  {
    url: 'https://images.unsplash.com/photo-1616628188859-7b11e0af7249?q=80&w=800&auto=format&fit=crop',
    filename: 'bedding.jpg',
    category: 'Home & Kitchen'
  },
  {
    url: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?q=80&w=800&auto=format&fit=crop',
    filename: 'food-processor.jpg',
    category: 'Home & Kitchen'
  },
  {
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
    filename: 'towels.jpg',
    category: 'Home & Kitchen'
  },
  {
    url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800&auto=format&fit=crop',
    filename: 'blender.jpg',
    category: 'Home & Kitchen'
  },
  {
    url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=800&auto=format&fit=crop',
    filename: 'clock.jpg',
    category: 'Home & Kitchen'
  },
  {
    url: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800&auto=format&fit=crop',
    filename: 'storage-containers.jpg',
    category: 'Home & Kitchen'
  },
  
  // Beauty & Personal Care
  {
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    filename: 'cleanser.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    filename: 'hair-dryer.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    filename: 'makeup-brushes.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop',
    filename: 'body-lotion.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    filename: 'toothbrush.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop',
    filename: 'perfume.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=800&auto=format&fit=crop',
    filename: 'face-mask.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=800&auto=format&fit=crop',
    filename: 'hair-straightener.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop',
    filename: 'nail-polish.jpg',
    category: 'Beauty & Personal Care'
  },
  {
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    filename: 'makeup-mirror.jpg',
    category: 'Beauty & Personal Care'
  },
  
  // Sports & Outdoors
  {
    url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=800&auto=format&fit=crop',
    filename: 'dumbbells.jpg',
    category: 'Sports & Outdoors'
  },
  {
    url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop',
    filename: 'tennis-racket.jpg',
    category: 'Sports & Outdoors'
  },
  {
    url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=800&auto=format&fit=crop',
    filename: 'tent.jpg',
    category: 'Sports & Outdoors'
  },
  {
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
    filename: 'basketball.jpg',
    category: 'Sports & Outdoors'
  },
  {
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
    filename: 'hiking-boots.jpg',
    category: 'Sports & Outdoors'
  },
  {
    url: 'https://images.unsplash.com/photo-1598289431514-974f32f84e1e?q=80&w=800&auto=format&fit=crop',
    filename: 'jump-rope.jpg',
    category: 'Sports & Outdoors'
  },
  {
    url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop',
    filename: 'golf-clubs.jpg',
    category: 'Sports & Outdoors'
  },
  
  // Books & Media
  {
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    filename: 'ereader.jpg',
    category: 'Books & Media'
  },
  {
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    filename: 'headphones.jpg',
    category: 'Books & Media'
  },
  {
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    filename: 'camera.jpg',
    category: 'Books & Media'
  },
  {
    url: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=800&auto=format&fit=crop',
    filename: 'gaming-console.jpg',
    category: 'Books & Media'
  },
  {
    url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop',
    filename: 'smart-tv.jpg',
    category: 'Books & Media'
  },
  {
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    filename: 'tablet.jpg',
    category: 'Books & Media'
  },
  {
    url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop',
    filename: 'projector.jpg',
    category: 'Books & Media'
  },
  {
    url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop',
    filename: 'microphone.jpg',
    category: 'Books & Media'
  }
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(productsDir, filename);
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1024) {
      console.log(`File already exists and is valid: ${filename}`);
      resolve();
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
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
      console.error(`Failed to download ${image.filename}: ${error.message}`);
    }
  }
  
  console.log('All downloads completed!');
}

// Run the download function
downloadAllImages(); 