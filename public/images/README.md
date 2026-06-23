# Divya Rana Influencer Site - Image Assets Guide

Save all image assets in this directory (`public/images/`). Replace the following files with your actual high-resolution files:

## 1. Portraits & Bio Photos
* **`hero-portrait.png`** (or `.jpg`): Divya's main vertical portrait to display on the right side of the Hero section. A transparent background PNG is highly recommended so the rose gold particle ring can float around her shape.
* **`about-lifestyle.jpg`**: A landscape or beauty shot showing her personality for the biography preview card.

## 2. Instagram Showcase Carousel (3D Carousel)
Create 6 square cropped images (at least 600x600px) representing top-performing content:
* **`post1.jpg`**
* **`post2.jpg`**
* **`post3.jpg`**
* **`post4.jpg`**
* **`post5.jpg`**
* **`post6.jpg`**

## 3. Brand Partner Logos
Create a subfolder named `brands` (`public/images/brands/`) and place the logos there (SVGs or high-res transparent PNGs):
* **`dotkey.svg`** (or `.png`): Dot & Key logo.
* **`nykaa.svg`** (or `.png`): Nykaa logo.
* **`sugar.svg`** (or `.png`): Sugar Cosmetics logo.
* **`pilgrim.svg`** (or `.png`): Pilgrim logo.

> [!NOTE]
> The codebase currently uses high-quality professional beauty photography placeholders from Unsplash, so the site works instantly. You can easily switch them to local files by updating the paths in `src/config/content.js`.
