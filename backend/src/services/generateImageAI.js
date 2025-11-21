const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generatePrompts(businessName, category, city) {
  try {
    const prompt = `Generate exactly two highly creative and visually appealing image prompts for a business advertisement. 
      The business name is "${businessName}", it falls under the "${category}" category, and is located in "${city}". 
      The prompts should be engaging, unique, and perfect for an ad campaign. 
      Ensure there are exactly 2 prompts, numbered 1 to 2.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 250,
    });

    // Extract prompts while ensuring exactly 2
    const prompts = response.choices[0].message.content
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim()) // Remove numbering
      .filter((line) => line.length > 2); // Remove empty or very short prompts

    while (prompts.length < 2) {
      prompts.push(prompts[prompts.length - 1] || "A high-quality ad image."); // Duplicate last if needed
    }

    return prompts.slice(0, 2); // Always return exactly 4 prompts
  } catch (error) {
    console.error("Error generating prompts:", error);
    return null;
  }
}

async function generateAIImage(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return response.data[0].url; // Returns the generated image URL
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

const generateImages = async (req, res) => {
  try {
    // Extract user inputs
    const { businessName, category, city } = req.body;

    if (!businessName || !category || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate prompts
    let prompts = await generatePrompts(businessName, category, city);

    if (!prompts || prompts.length === 0) {
      return res.status(500).json({ message: "Failed to generate prompts" });
    }

    // Generate images in parallel
    let imageUrls = await Promise.all(prompts.map(generateAIImage));

    // Filter out failed images
    imageUrls = imageUrls.filter((url) => url !== null);

    // Retry failed image generations
    while (imageUrls.length < 2) {
      console.log("Retrying for missing images...");
      const missingPrompts = prompts.slice(imageUrls.length, 2); // Get prompts for missing images
      const retryImages = await Promise.all(
        missingPrompts.map(generateAIImage)
      );
      imageUrls.push(...retryImages.filter((url) => url !== null)); // Add successful ones
    }

    res.json({
      message: "Images generated successfully",
      images: imageUrls.slice(0, 2), // Ensure exactly 4 images
    });
  } catch (error) {
    console.error("Error generating images:", error);
    res.status(500).json({ message: "Failed to generate images" });
  }
};

module.exports = { generateImages };

