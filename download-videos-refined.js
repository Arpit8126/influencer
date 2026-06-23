import fs from 'fs';
import path from 'path';
import https from 'https';

const videoUrls = {
  'reel1.mp4': 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-woman-applying-cream-on-her-face-41584-large.mp4',
  'reel2.mp4': 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-cosmetic-cream-on-her-face-41583-large.mp4',
  'reel3.mp4': 'https://assets.mixkit.co/videos/preview/mixkit-skin-care-routine-of-a-woman-41585-large.mp4',
  'reel4.mp4': 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-skin-care-product-41587-large.mp4',
  'reel5.mp4': 'https://assets.mixkit.co/videos/preview/mixkit-woman-massaging-her-face-with-a-roller-41589-large.mp4'
};

const outputDir = path.join(process.cwd(), 'public', 'videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    const file = fs.createWriteStream(dest);
    
    // Set headers to mimic a browser request exactly
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://mixkit.co/',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    };

    https.get(options, (response) => {
      // Handle redirects if any
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Redirecting to ${response.headers.location}...`);
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: Status ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Finished downloading ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const [filename, url] of Object.entries(videoUrls)) {
    try {
      const destPath = path.join(outputDir, filename);
      await downloadFile(url, destPath);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error.message);
    }
  }
}

run();
