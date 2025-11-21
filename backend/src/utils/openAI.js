const OpenAI = require("openai");
const { DateTime } = require("luxon"); // For date handling

const questionContext = [
  "Business name should be a valid name like 'Nike', 'TechWear', 'ABC Fashion', etc.",
  "Category should be a valid business category (e.g., Clothing, Gym, Food, Travel, Electronics, Handmade Crafts, etc.).",
  "Ad objective should be Awareness, Traffic, Engagement, App Promotion, Sales or Lead.",
  "Ad duration should include a start and end date in the format dd/mm/yyyy-dd/mm/yyyy.",
  "Budget should be a number and not less then 500",
  "Platform should be either Facebook, Instagram, or both.",
  "Target location should be a valid city or area.",
  "Age group should be in a valid format like '18-25','25-40',20-60 or 25-55.",
  "Gender should be Male, Female, or Both.",
];

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to get AI-generated response for greetings
const getAIResponse = async (message, userName = "there") => {
  const formattedName = userName?.trim()
    ? userName.trim().charAt(0).toUpperCase() +
      userName.trim().slice(1).toLowerCase()
    : "there";

  const trimmedMessage = message?.trim();
  if (!trimmedMessage) {
    return `Hi ${formattedName}, I didn’t catch that. Could you please type your message again?`;
  }

  const systemPrompt = `
You're a cheerful, witty, and conversational AI assistant. Your job is to onboard users into creating a personalized advertisement — but in a fun, relaxed, and human tone.

Instructions:
- If the user sends an informal message like "kya chal raha hai", "hello", "yo", or a joke, respond like a human would: casually, warmly, and with humor if appropriate.
- Then shift the tone to say: "I’m here to help you build your ad. Let’s begin with a few questions to get things rolling."
- Do NOT sound robotic. Avoid repeating the same template. Each message should feel unique and personalized.
- You can even respond with emojis or mild Hinglish if the tone fits.

Always guide the user back to the ad creation journey — but with style.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `User's name is ${formattedName}. Message: "${trimmedMessage}"`,
        },
      ],
      temperature: 0.85,
      max_tokens: 200,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return `Hi ${formattedName}, I’m excited to help you set up your ad. Let’s begin with a few quick questions.`;
  }
};






// Function to validate response from user using AI

const validObjectives = ["Awareness", "Traffic", "Engagement", "App Promotion", "Sales", "Lead"]

const validateUserInput = async (userInput, stepIndex, lastSuggested) => {
  try {
    if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
      return {
        valid: false,
        message: "Oops! That looks empty. Can you type something?",
      };
    }

    if (stepIndex < 0 || stepIndex >= questionContext.length) {
      return {
        valid: false,
        message: "Invalid step index provided for validation.",
      };
    }

    // Check if it's a natural date range
    if (stepIndex === 3) {
      const quickParsed = tryPreprocessDate(userInput);
      if (quickParsed) {
        return {
          valid: true,
          corrected: quickParsed,
          message: `Got it! I've converted your duration to ${quickParsed}.`,
        };
      }
    }

    const context = questionContext[stepIndex];

    //  if (lastSuggested && /^\s*(yes|yeah|go ahead|correct)\s*$/i.test(userInput)) {
    //   return { valid: true, corrected: lastSuggested, message: "Thanks! Going ahead with your confirmation." };
    // }


    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system", 
          content: `
You are a friendly, intelligent assistant helping users fill out an ad setup form step-by-step via conversation. Your goal is to:
1. Understand the user's input, even if it's informal, contains typos, or is embedded in a sentence.
2. Validate or correct the input.
3. Return a clean, valid value in strict JSON format to help complete the form.
4. Keep the flow smooth by accepting affirmations like "yes", "okay", etc., without re-asking.

---

🔎 GENERAL RULES FOR INPUT UNDERSTANDING:

- If a user gives a full sentence (e.g., "I want to run Traffic ads"), extract only the relevant core value (e.g., "Traffic") and discard the sentence.
- If the input contains spelling errors or typos, correct them automatically, assume the corrected version as accepted, and proceed.
- If the input is an affirmation ("yes", "go ahead", "okay", "sounds good"), and you previously suggested a correction, accept that previous suggestion as the final input.
- If the input is invalid or unrelated, respond with a clear, human-friendly correction suggestion.

---

🌆 SPECIAL RULES FOR CITY NAMES:

- If the user enters a city name with typos (e.g., "nwe york", "mumabi", "bangaluru"), correct it intelligently to the most likely real-world city name.
- Accept variants like “Delhi, India”, “Mumbai - MH”, or “Gurgaon NCR” and extract the clean city name (e.g., “Delhi”, “Mumbai”, “Gurgaon”).
- Never invent cities. If no match can be inferred, ask the user to clarify.
- Example corrections:
    • "nwe york" → "New York"
    • "delhii" → "Delhi"
    • "chenai" → "Chennai"

---

🎯 RULES FOR AD OBJECTIVE STEP:

Only accept one of these standard objectives:
**"Awareness", "Traffic", "Engagement", "App Promotion", "Sales", or "Lead"**

- If the user says "let's go with traffic", extract "Traffic"
- If the user says "gain leads", suggest "Lead"
- If the input contains multiple options, select the first valid one and confirm it
- If the user affirms after a suggestion ("yes", "okay"), accept that previous suggestion
- If the user asks for help deciding, explain each option briefly and ask for a final choice
- If the input is close but not exact (e.g., "awareness campaign", "traffic ads"), suggest the nearest correct term

---

🏢 RULES FOR BUSINESS CATEGORY INFERENCE:

If the user describes what they sell, intelligently infer the correct category. Use commonly known business categories:

Examples:
• "I sell mobile phones and laptops" → "Electronics"
• "Rice and pulses" → "Grocery"
• "Handmade candles and cards" → "Handmade Crafts"
• "Yoga and fitness training" → "Health & Wellness"
• "Clothing for kids" → "Clothing"
• "Cake and sweets" → "Food"

If the user gives a long list (e.g., "all items", "everything"), respond with a specific suggestion and ask for confirmation.

---

🏷 RULES FOR BUSINESS NAME:

- If the user says something like "My shop is called X", extract only the name "X"
- Accept casual responses like "It’s called ShopGuru" → "ShopGuru"

---

📅 RULES FOR DATE FORMATS:

- For any date ranges, convert natural language into a standard format: "dd/mm/yyyy - dd/mm/yyyy"
- Example: "from 5 June to 10 June" → "05/06/2025 - 10/06/2025"

---

✅ OUTPUT FORMAT (STRICT!):

Your output must **always** be in JSON format and must follow one of the following forms:

**1. Valid input:**
json
{ "valid": true }

`,
        },
        {
          role: "user",
          content: `Step ${
            stepIndex + 1
          } input: "${userInput}"\nContext: ${context}`,
        },
      ],
      functions: [
        {
          name: "return_validation_result",
          parameters: {
            type: "object",
            properties: {
              valid: { type: "boolean" },
              message: { type: "string" },
              corrected: { type: "string" },
              suggested: { type: "string" }
            },
            required: ["valid"],
          },
        },
      ],
      function_call: { name: "return_validation_result" },
      temperature: 0.7,
    });

    const rawArgs = response.choices[0]?.message?.function_call?.arguments;
    if (!rawArgs) throw new Error("No arguments returned from function_call.");

    // Store suggested for future affirmation check
    // if (rawArgs.suggested) lastSuggested = rawArgs.suggested;
    // else lastSuggested = null;


    const parsed = JSON.parse(rawArgs);
    const suggested = parsed.suggested || parsed.corrected || null;

    // Final cleanup for objective values
    if (stepIndex === 2) {
      const exact = validObjectives.find(obj => obj.toLowerCase() === parsed.corrected?.toLowerCase());
      if (exact) {
        return {
          valid: true,
          corrected: exact,
          message: `Great! Your ad objective is set to ${exact}.`,
        };
      }

      // Try fuzzy match inside longer sentence
      const found = validObjectives.find(obj =>
        parsed.corrected?.toLowerCase().includes(obj.toLowerCase())
      );

      if (found) {
        return {
          valid: true,
          corrected: found,
          message: `Got it! Ad objective set to ${found}.`,
        };
      }
    }

    return {
      valid: parsed.valid,
      message: parsed.message || "",
      suggested: suggested || null,
      corrected: parsed.corrected || null,
    };
  } catch (error) {
    console.error("Validation AI Error:", error);
    return {
      valid: false,
      message:
        "Sorry! Something went wrong while checking your input. Try again?",
    };
  }
};


const tryPreprocessDate = (input) => {
  const today = DateTime.now();
  const match = input.match(/from today to next (\d+) days?/i);
  if (match) {
    const days = parseInt(match[1], 10);
    const start = today.startOf("day");
    const end = start.plus({ days });
    return `${start.toFormat("dd/MM/yyyy")}-${end.toFormat("dd/MM/yyyy")}`;
  }
  // Also handle "from today to <date>"
  const match2 = input.match(/from today to (\d{1,2} ?[a-zA-Z]+)/i);
  if (match2) {
    const targetDate = DateTime.fromFormat(match2[1].trim(), "d MMMM");
    if (targetDate.isValid) {
      const start = today.startOf("day");
      const end = targetDate.set({ year: today.year });
      if (end < start) return null; // don't allow past dates
      return `${start.toFormat("dd/MM/yyyy")}-${end.toFormat("dd/MM/yyyy")}`;
    }
  }

  return null;
};

/*
const suggestCorrection = async (userInput, stepIndex) => {
  try {
    const questionHints = [
      "Extract and suggest only the brand name. Ignore extra details. Example: If the user says, 'My company is Tech Solutions', return 'Tech Solutions'.",
      "Suggest a valid business category such as Clothing, Gym, Food, Travel, Electronics, Handmade Crafts, etc. If the category seems new but reasonable, accept it.",
      "Suggest a valid ad objective: Awareness, Traffic, Engagement, or Lead.",
      "Suggest a proper ad duration in format dd/mm/yyyy-dd/mm/yyyy.",
      "Ensure budget is in numerical format. Example: '10000' or '10k'.",
      "Ensure platform is 'Facebook', 'Instagram', or 'Both'.",
      "Suggest a valid target location (city or area).",
      "Ensure age group is in a valid format like '18-25' or '25-40'.",
      "Ensure gender is Male, Female, or Both.",
    ];

    if (stepIndex >= questionHints.length) {
      return { suggestion: "Invalid question step index." };
    }

    const suggestionPrompt = `User entered: "${userInput}" for question: "${questionHints[stepIndex]}". 
      If the input is correct, return {"suggestion": "Your response '${userInput}' is fine."}. 
      If incorrect, extract the relevant part and return {"suggestion": "A better option would be 'XYZ'."}. 
      If unclear, return {"suggestion": "Please provide a more specific response like 'Nike' for a business name."}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that helps users provide correct inputs for an ad setup by suggesting better answers.",
        },
        { role: "user", content: suggestionPrompt },
      ],
      max_tokens: 100,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Suggestion AI Error:", error);
    return {
      suggestion:
        "I couldn't generate a suggestion. Please try again with a valid response.",
    };
  }
};
*/
module.exports = { getAIResponse, validateUserInput };

