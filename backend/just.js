require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to generate AI images based on business type
async function generateAIImage(prompt) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data.data[0].url;
  } catch (error) {
    console.error("AI Image Generation Error:", error);
    return null;
  }
}

// Function to download the AI-generated image
async function downloadImage(url, filepath) {
  const response = await axios({ url, responseType: "stream" });
  return new Promise((resolve, reject) => {
    response.data.pipe(fs.createWriteStream(filepath))
      .on("finish", () => resolve(filepath))
      .on("error", reject);
  });
}

// Function to overlay text on image
async function addTextToImage(imagePath, businessName, website, address) {
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(imagePath);

  ctx.drawImage(image, 0, 0, 1024, 1024);
  ctx.fillStyle = "white"; // Text color
  ctx.font = "bold 40px Arial";
  ctx.fillText(businessName, 50, 950);
  ctx.font = "30px Arial";
  ctx.fillText(website, 50, 1000);
  ctx.fillText(address, 50, 1050);

  const outputPath = imagePath.replace(".png", "_branded.png");
  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));
  return outputPath;
}

// Function to generate dynamic prompts
function generatePrompts(businessName, category, city) {
  return [
    `A stylish ${category} showroom in ${city}, luxurious and elegant branding for ${businessName}.`,
    `A high-end advertisement banner for ${businessName}, a premium ${category} store in ${city}.`,
    `A well-lit, modern ${category} boutique with a sophisticated look, promoting ${businessName}.`,
    `A creative digital poster featuring ${businessName}, a trending ${category} showroom in ${city}.`,
    `A premium ${category} collection displayed in a luxurious store setting, branding for ${businessName}.`,
    `An elegant and classy advertisement for ${businessName}, showcasing top-quality ${category} fashion.`,
    `A professional storefront image for ${businessName}, highlighting ${category} collections in ${city}.`,
    `A minimalist, modern branding image for ${businessName}, an exclusive ${category} showroom.`,
    `A luxurious advertisement featuring the latest trends in ${category}, with branding for ${businessName}.`,
    `A beautifully designed banner showcasing ${businessName} and its premium ${category} products.`
  ];
}

// API Endpoint to Generate 10 Images for a Business
app.post("/generate-images", async (req, res) => {
  const { businessName, category, website, address, city } = req.body;
  if (!businessName || !category || !website || !address || !city) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const prompts = generatePrompts(businessName, category, city);
  let imagePaths = [];

  for (let i = 0; i < prompts.length; i++) {
    const aiImageUrl = await generateAIImage(prompts[i]);
    if (aiImageUrl) {
      const imagePath = `image_${i + 1}.png`;
      await downloadImage(aiImageUrl, imagePath);
      const brandedImagePath = await addTextToImage(imagePath, businessName, website, address);
      imagePaths.push(brandedImagePath);
    }
  }

  res.json({ message: "Images generated successfully", images: imagePaths });
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const express = require("express");

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to generate dynamic prompts
function generatePrompts(businessName, category, city) {
  return [
    `A stylish ${category} showroom in ${city}, luxurious and elegant branding for ${businessName}.`,
    `A high-end advertisement banner for ${businessName}, a premium ${category} store in ${city}.`,
    `A well-lit, modern ${category} boutique with a sophisticated look, promoting ${businessName}.`,
    `A creative digital poster featuring ${businessName}, a trending ${category} showroom in ${city}.`,
    `A premium ${category} collection displayed in a luxurious store setting, branding for ${businessName}.`,
    `An elegant and classy advertisement for ${businessName}, showcasing top-quality ${category} fashion.`,
    `A professional storefront image for ${businessName}, highlighting ${category} collections in ${city}.`,
    `A minimalist, modern branding image for ${businessName}, an exclusive ${category} showroom.`,
    `A luxurious advertisement featuring the latest trends in ${category}, with branding for ${businessName}.`,
    `A beautifully designed banner showcasing ${businessName} and its premium ${category} products.`
  ];
}

// Function to generate an AI image
async function generateAIImage(prompt) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data.data[0].url;
  } catch (error) {
    console.error("AI Image Generation Error:", error);
    return null;
  }
}

// Function to download the AI-generated image
async function downloadImage(url, filepath) {
  const response = await axios({ url, responseType: "stream" });
  return new Promise((resolve, reject) => {
    response.data.pipe(fs.createWriteStream(filepath))
      .on("finish", () => resolve(filepath))
      .on("error", reject);
  });
}

// Function to overlay text on the image
async function addTextToImage(imagePath, businessName, website, address) {
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(imagePath);

  ctx.drawImage(image, 0, 0, 1024, 1024);
  ctx.fillStyle = "white"; 
  ctx.font = "bold 40px Arial";
  ctx.fillText(businessName, 50, 950);
  ctx.font = "30px Arial";
  ctx.fillText(website, 50, 1000);
  ctx.fillText(address, 50, 1050);

  const outputPath = imagePath.replace(".png", "_branded.png");
  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));
  return outputPath;
}

// API Endpoint to Generate 10 Images in Parallel
app.post("/generate-images", async (req, res) => {
  const { businessName, category, website, address, city } = req.body;
  if (!businessName || !category || !website || !address || !city) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const prompts = generatePrompts(businessName, category, city);

  try {
    // Step 1: Generate all images in parallel
    const imageUrls = await Promise.all(prompts.map(prompt => generateAIImage(prompt)));

    // Step 2: Download all images in parallel
    const imagePaths = await Promise.all(
      imageUrls.map((url, i) => {
        if (url) {
          return downloadImage(url, `image_${i + 1}.png`);
        }
        return null;
      })
    );

    // Step 3: Add branding text in parallel
    const brandedImagePaths = await Promise.all(
      imagePaths.map((path) => {
        if (path) {
          return addTextToImage(path, businessName, website, address);
        }
        return null;
      })
    );

    res.json({ message: "Images generated successfully", images: brandedImagePaths });
  } catch (error) {
    console.error("Error generating images:", error);
    res.status(500).json({ message: "Failed to generate images" });
  }
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
