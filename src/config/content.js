export const influencerData = {
  name: "Divya Rana",
  username: "rana_divu098",
  niche: "Beauty • Lifestyle • Skincare",
  followerCount: "34.1K",
  followerSub: "Followers on Instagram",
  postCount: "170",
  postSub: "Curated Posts",
  followingCount: "492",
  followingSub: "Following",
  engagementRate: "5.8%",
  engagementSub: "Average Engagement",
  bioTitle: "Being me 🧿 | Beauty • Lifestyle • Skincare",
  bioText: "Based in India, Divya Rana is a leading beauty, lifestyle, and skincare creator. With a highly engaged audience of 34K+ followers, she focuses on translating product science into elegant visual storytelling. Her platforms are designed for premium integrations, blending high-end product aesthetics with authentic audience connections.",
  instagramUrl: "https://www.instagram.com/rana_divu098/",
  email: "divyarana0098@gmail.com",
  
  images: {
    heroPortrait: "/images/hero-portrait.png",
    aboutLifestyle: "/images/about-lifestyle.png",
  },

  // Audience demographics for brand managers
  demographics: {
    femaleRatio: "78%",
    ageGroup: "18 - 34 (86%)",
    topRegions: "Mumbai, Delhi NCR, Bangalore",
    monthlyReach: "120K+"
  },

  // Collaboration Packages offered
  packages: [
    {
      id: "pkg-1",
      title: "The Reel Showcase",
      duration: "Standard Campaign",
      description: "1 Dedicated Instagram Reel showcasing product texture, application, and results. Includes 2 stories with swipe-up links.",
      deliverables: ["1x Reel (High-Res)", "2x Stories (Active 24h)", "Link in Bio (7 Days)"]
    },
    {
      id: "pkg-2",
      title: "Skincare / Beauty Routine",
      duration: "Aesthetic Post & Story",
      description: "A carousel feed post integrating the product into a daily routine, detailing ingredients, application steps, and text shots.",
      deliverables: ["1x Carousel Post (3-4 frames)", "1x Story with Link tag", "Raw footage rights"]
    },
    {
      id: "pkg-3",
      title: "Integrated PR / Product Launch",
      duration: "Premium Campaign Bundle",
      description: "Full product launch alignment: 1 Reel transition review, 1 Carousel flatlay, 3 Stories showing wear-tests or reviews, and Link in Bio.",
      deliverables: ["1x Reel", "1x Carousel", "3x Stories", "Link in Bio (14 Days)"]
    }
  ],

  // 6 cards for the 3D lookbook carousel (using local upright screenshots)
  carouselCards: [
    {
      id: 1,
      title: "Matte Lipstick Swatch",
      category: "Character Cosmetics",
      imageUrl: "/images/collab/sponsers1.png",
      link: "https://www.instagram.com/reel/DZ5K6NUh200/"
    },
    {
      id: 2,
      title: "Sunscreen Glow Grid",
      category: "Dot & Key Skincare",
      imageUrl: "/images/collab/sponsers2.png",
      link: "https://www.instagram.com/reel/DZ2eGnCBjRk/"
    },
    {
      id: 3,
      title: "SPF 50 Serum Sunscreen",
      category: "CosIQ Skincare",
      imageUrl: "/images/collab/sponsers3.png",
      link: "https://www.instagram.com/reel/DZxeLudhMX7/"
    },
    {
      id: 4,
      title: "Ceramide SPF Lip Balm",
      category: "WishCare Beauty",
      imageUrl: "/images/collab/sponsers4.png",
      link: "https://www.instagram.com/reel/DZPdAqlB5XK/"
    },
    {
      id: 5,
      title: "Skincare Curation",
      category: "Daily Essentials",
      imageUrl: "/images/about-lifestyle.png",
      link: "https://www.instagram.com/reel/DZuxB30BS1P/"
    },
    {
      id: 6,
      title: "Editorial Curation",
      category: "Aesthetic Portrait",
      imageUrl: "/images/hero-portrait.png",
      link: "https://www.instagram.com/reel/DZsTcA1BI2Q/"
    }
  ],

  // 7 Instagram Reels mapped exactly to your screenshots as thumbnails
  instagramReels: [
    {
      id: 1,
      title: "Lip Secret Routine",
      thumbnailUrl: "/images/collab/sponsers1.png", // Character Revolution Lipstick
      link: "https://www.instagram.com/reel/DZ5K6NUh200/",
      views: "245K",
      caption: "POV: You found the ultimate 2-in-1 lip secret 💄 @characterpaarisindia"
    },
    {
      id: 2,
      title: "Morning Skincare Glow",
      thumbnailUrl: "/images/collab/sponsers2.png", // Dot & Key Sunscreen
      link: "https://www.instagram.com/reel/DZ2eGnCBjRk/",
      views: "184K",
      caption: "Morning skincare essentials with my favorite hydration formulas. 💦"
    },
    {
      id: 3,
      title: "Dewy Base Tutorial",
      thumbnailUrl: "/images/collab/sponsers3.png", // CosIQ Sunscreen
      link: "https://www.instagram.com/reel/DZxeLudhMX7/",
      views: "310K",
      caption: "Step-by-step dewy face setting masterclass for dry skin. ✨"
    },
    {
      id: 4,
      title: "Skin Rejuvenation",
      thumbnailUrl: "/images/collab/sponsers4.png", // WishCare Lipbalm
      link: "https://www.instagram.com/reel/DZPdAqlB5XK/",
      views: "295K",
      caption: "Restoring the skin barrier. Science-backed formulation review. 🧪"
    },
    {
      id: 5,
      title: "Night Routine Essentials",
      thumbnailUrl: "/images/about-lifestyle.png", // Lifestyle shot
      link: "https://www.instagram.com/reel/DZuxB30BS1P/",
      views: "196K",
      caption: "Night-time skin recovery steps. Clean beauty products."
    },
    {
      id: 6,
      title: "Glass Skin Secret",
      thumbnailUrl: "/images/hero-portrait.png", // Portrait shot
      link: "https://www.instagram.com/reel/DZsTcA1BI2Q/",
      views: "288K",
      caption: "Unlocking the Korean glass skin effect in three simple steps."
    },
    {
      id: 7,
      title: "Vibrant Lips Editorial",
      thumbnailUrl: "/images/collab/sponsers1.png", // wrap Character
      link: "https://www.instagram.com/reel/DZlsY9RBzEx/",
      views: "340K",
      caption: "High-pigment matte swatches. Perfect shade matching. 💋"
    }
  ],

  // Logos requested by user to be kept in sponsored sections
  brandLogos: [
    {
      id: "brand-1",
      brand: "Dot & Key",
      logoUrl: "https://cdn.brandfetch.io/idBGopyn7I/w/250/h/83/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B"
    },
    {
      id: "brand-2",
      brand: "Nivea",
      logoUrl: "https://cdn.brandfetch.io/id3QcEBvXq/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"
    },
    {
      id: "brand-3",
      brand: "Matrix Professional",
      logoUrl: "https://cdn.brandfetch.io/id0xmiK2Ha/w/572/h/111/theme/light/logo.png?c=1dxbfHSJFAPEGdCLU4o5B"
    },
    {
      id: "brand-4",
      brand: "Swiss Beauty",
      logoUrl: "https://cdn.brandfetch.io/id767-uLp1/w/309/h/309/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B"
    }
  ],

  // 4 Case Studies mapping exactly to the 4 screenshots
  collabs: [
    {
      id: "collab-1",
      brand: "Dot & Key",
      logoUrl: "https://cdn.brandfetch.io/idBGopyn7I/w/250/h/83/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
      type: "Skincare Reel & Grid Integration",
      metric: "245K+ Views",
      description: "Sunscreen UV filters campaign displaying morning routine application and dewy skin finish.",
      bannerImage: "/images/collab/sponsers2.png" // Dot & Key grid
    },
    {
      id: "collab-2",
      brand: "Character Cosmetics Paris",
      logoUrl: "https://cdn.brandfetch.io/id767-uLp1/w/309/h/309/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
      type: "Product Curation Reel",
      metric: "340K+ Views",
      description: "Matte Lipstick campaign for Character Paris India, demonstrating rich texture swatches, shade selections, and durability wear-test.",
      bannerImage: "/images/collab/sponsers1.png" // Character Revolution Matte Lipstick
    },
    {
      id: "collab-3",
      brand: "CosIQ Skincare",
      logoUrl: "https://cdn.brandfetch.io/id3QcEBvXq/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
      type: "Science-Backed Review",
      metric: "310K+ Views",
      description: "Serum-based hybrid SPF 50 sunscreen launch campaign, focusing on texture shots, absorption rate, and zero white cast.",
      bannerImage: "/images/collab/sponsers3.png" // CosIQ sunscreen review
    },
    {
      id: "collab-4",
      brand: "WishCare",
      logoUrl: "https://cdn.brandfetch.io/id0xmiK2Ha/w/572/h/111/theme/light/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
      type: "SPF Lip Balm Campaign",
      metric: "295K+ Views",
      description: "Ceramide Lip Balm hydration review showcasing gloss, texture swatches, and sun protection efficiency.",
      bannerImage: "/images/collab/sponsers4.png" // WishCare Lip Balm
    }
  ]
};
