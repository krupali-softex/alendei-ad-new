const axios = require("axios");

const createLeadForm = async ({ pageId, accessToken, formName }) => {
  try {
    const url = `https://graph.facebook.com/v23.0/${pageId}/leadgen_forms`;

    const payload = {
      name: formName,
      locale: "en_US",
      questions: [
        {"type":"FULL_NAME", "key": "question1"},
        {"type":"EMAIL", "key": "question2"},
        {"type":"PHONE", "key": "question3"},
      ],
      privacy_policy: {
        url: "https://ads.alendei.com/privacy", 
      },
      follow_up_action_url: "https://ads.alendei.com/thank-you",
      access_token: accessToken,
    };

    const response = await axios.post(url, payload);
    return response.data.id;
  } catch (error) {
    console.error("Error creating lead form:", error.response?.data || error.message);
    throw new Error("Lead form creation failed");
  }
};

module.exports = { createLeadForm };
