import fs from 'fs';
import path from 'path';
import https from 'https';

// High-quality vertical skincare/beauty video IDs on Pexels
const videoIds = {
  'reel1.mp4': '3762466', // Skincare routine close-up
  'reel2.mp4': '4481309', // Applying cream / moisturizer
  'reel3.mp4': '3762463', // Applying serum dropper
  'reel4.mp4': '5063564', // Cream texture swatching
  'reel5.mp4': '3764627'  // Cleansing face / skincare routine
};

const outputDir = path.join(process.cwd(), 'public', 'videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // Standardize URL
    let absoluteUrl = url;
    if (!absoluteUrl.startsWith('http')) {
      absoluteUrl = `https://www.pexels.com${absoluteUrl}`;
    }

    console.log(`Downloading from ${absoluteUrl}...`);
    const file = fs.createWriteStream(dest);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    };

    https.get(absoluteUrl, options, (response) => {
      // Follow redirects
      const isRedirect = [301, 302, 307, 308].includes(response.statusCode);
      if (isRedirect && response.headers.location) {
        let redirectUrl = response.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `https://www.pexels.com${redirectUrl}`;
        }
        console.log(`Redirecting to: ${redirectUrl}`);
        file.close();
        try {
          fs.unlinkSync(dest); // delete empty file
        } catch (e) {}
        // Recursively follow redirect
        downloadFile(redirectUrl, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: Status ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Finished writing to ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      try {
        fs.unlinkSync(dest);
      } catch (e) {}
      reject(err);
    });
  });
}

async function run() {
  for (const [filename, id] of Object.entries(videoIds)) {
    const downloadUrl = `https://www.pexels.com/video/${id}/download`;
    try {
      const destPath = path.join(outputDir, filename);
      await downloadFile(downloadUrl, destPath);
      console.log(`Successfully saved ${filename}\n`);
    } catch (error) {
      console.error(`Error downloading ID ${id}:`, error.message);
    }
  }
}

run();
