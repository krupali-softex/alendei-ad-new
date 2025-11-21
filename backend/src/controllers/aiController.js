const { DateTime } = require("luxon");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const questionContext = [
  "Business name should be a valid name like 'Nike', 'TechWear', 'ABC Fashion', etc.",
  "Category should be a valid business category (e.g., Clothing, Gym, Food, Travel, Electronics, Handmade Crafts, etc.).",
  "Ad objective should be Awareness, Traffic, Engagement, App Promotion, Sales or Lead.",
  "Ad duration should include a start and end date in the format dd/mm/yyyy-dd/mm/yyyy.",
  "Budget should be a number and not less than 500.",
  "Platform should be either Facebook, Instagram, or both.",
  "Target location should be a valid city or area.",
  "Age group should be in a valid format like '18-25','25-40','20-60' or '25-55'.",
  "Gender should be Male, Female, or Both."
];

const QUESTIONS = [
  "May I know your business name?",
  "What category best fits your business?",
  "What is the objective of your Ad? Awareness, Traffic, Engagement, App Promotion, Sales or Lead?",
  "When would you like the ad to run? Format: dd/mm/yyyy-dd/mm/yyyy or something like 'from today to next 5 days'.",
  "What's your ad budget?",
  "Which platforms would you like to target? Facebook, Instagram, or both?",
  "Which city or area would you like to target?",
  "What is your target age group? (e.g. 18-25, 25-45)",
  "Who is your target gender? Male, Female, or Both?"
];

const fieldKeys = [
  "company_name", "category", "ad_objective", "ad_duration", "budget",
  "platform", "location", "age_group", "gender"
];

const userSessions = {};

exports.testMetaAI = async (req, res) => {
  const userId = req.body.userId || "mock-user";
  const prompt = req.body.prompt;

  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  const session = userSessions[userId] ||= {
    step: 0,
    adData: {},
    greeted: false,
    completed: false,
    lastSuggested: null,
  };

  if (session.completed) {
    return res.json({ response: "Your ad setup is complete.", adData: session.adData });
  }

  if (!session.greeted) {
    session.greeted = true;
    return res.json({ response: `Hello! Let's set up your ad. ${QUESTIONS[0]}`, adData: {} });
  }

  const result = await validateUserInput(prompt, session.step, session.lastSuggested);

  // Handle confirmation of previous suggestion
  const confirmWords = { yes: 1, ok: 1, okay: 1, sure: 1 };
  const isConfirm = prompt.trim().toLowerCase() in confirmWords;

  if (isConfirm) {
  if (session.lastSuggested) {
    const key = fieldKeys[session.step];
    session.adData[key] = session.lastSuggested;
    session.step++;
    session.lastSuggested = null;
  } else {
    return res.json({ 
      response: "It seems like you're trying to confirm a previous suggestion, but there is no context for a suggestion here. Please provide your answer again.",
      adData: session.adData
    });
  }
  if (session.step >= QUESTIONS.length) {
    session.completed = true;
    return res.json({ response: "All done! Your ad setup is complete.", adData: session.adData });
  }
  return res.json({ response: QUESTIONS[session.step], adData: session.adData });
}
}

async function validateUserInput(userInput, stepIndex, lastSuggestedValue = null) {
  try {
    const trimmedInput = userInput.trim().toLowerCase();

    const confirms = ["yes", "yeah", "yep", "ok", "okay", "sure", "fine", "go ahead"];
    if (lastSuggestedValue && confirms.includes(trimmedInput)) {
      return {
        valid: true,
        corrected: lastSuggestedValue,
        message: `Great! I'll use "${lastSuggestedValue}".`
      };
    }

    if (stepIndex === 3) {
      const quickParsed = tryPreprocessDate(userInput);
      if (quickParsed) {
        return {
          valid: true,
          corrected: quickParsed,
          message: `Got it! I’ve converted your duration to ${quickParsed}.`
        };
      }
    }

    const systemPrompt = `You are helping a user fill an ad form.
- Validate input using context: ${questionContext[stepIndex]}
- Accept yes/okay/sure if user confirms previous suggestion: ${lastSuggestedValue}
- Extract true value if user says: 'I go with Traffic' => 'Traffic'
- If invalid, respond with helpful error & suggestion.
Always respond with JSON format.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User input: ${userInput}` }
      ],
      functions: [
        {
          name: "return_validation_result",
          parameters: {
            type: "object",
            properties: {
              valid: { type: "boolean" },
              message: { type: "string" },
              corrected: { type: "string" }
            },
            required: ["valid"]
          }
        }
      ],
      function_call: { name: "return_validation_result" },
      temperature: 0.7
    });

    const rawArgs = response.choices[0]?.message?.function_call?.arguments;
    const parsed = JSON.parse(rawArgs);

    return {
      valid: parsed.valid,
      message: parsed.message || "",
      corrected: parsed.corrected || null
    };
  } catch (err) {
    console.error("Validation error:", err);
    return { valid: false, message: "Sorry, I couldn't understand that. Can you try again?" };
  }
}

function tryPreprocessDate(input) {
  const today = DateTime.now();
  const match = input.match(/from today to next (\d+) days?/i);
  if (match) {
    const days = parseInt(match[1]);
    const end = today.plus({ days });
    return `${today.toFormat("dd/MM/yyyy")}-${end.toFormat("dd/MM/yyyy")}`;
  }

  const match2 = input.match(/from today to (\d{1,2} ?[a-zA-Z]+)/i);
  if (match2) {
    const parsed = DateTime.fromFormat(match2[1].trim(), "d MMMM");
    if (parsed.isValid && parsed >= today) {
      return `${today.toFormat("dd/MM/yyyy")}-${parsed.toFormat("dd/MM/yyyy")}`;
    }
  }

  return null;
}
