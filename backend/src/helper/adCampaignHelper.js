// helpers/adHelpers.js
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

const createAdCampaign = async ({
  adAccountId,
  accessToken,
  campaignName,
  objective,
  adStatus,
}) => {
  const url = `https://graph.facebook.com/v23.0/${adAccountId}/campaigns`;
  const payload = {
    name: campaignName,
    objective,
    status: adStatus,
    special_ad_categories: [],
  };
  console.log("Calling Meta API for Campaign with:", payload);

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Create Campaign Response:", response.data);
    return response.data.id;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(
        "Meta API Error (Create Campaign):",
        JSON.stringify(error.response.data, null, 2)
      );
      throw new Error(`Meta API Error: ${error.response.data.error.message}`);
    } else {
      console.error("Unknown Axios Error:", error.message);
      throw new Error(`Unknown Error: ${error.message}`);
    }
  }
};

const createAdSet = async ({ adAccountId, accessToken, adSetData }) => {
  const url = `https://graph.facebook.com/v23.0/${adAccountId}/adsets`;

  try {
    const response = await axios.post(url, adSetData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Create Adset Response:", response.data);
    return response.data.id;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(
        "Meta API Error:",
        JSON.stringify(error.response.data, null, 2)
      );
      throw new Error(`Meta API Error: ${error.response.data.error.message}`);
    } else {
      console.error("Unknown Error:", error.message);
      throw new Error(`Unknown Error: ${error.message}`);
    }
  }
};

const uploadAdImage = async ({ adAccountId, accessToken, imageUrl }) => {
  const url = `https://graph.facebook.com/v23.0/${adAccountId}/adimages`;

  try {
    //console.log("Uploading image from file path:", imageUrl);

    const form = new FormData();
    form.append("filename", fs.createReadStream(imageUrl));

    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const images = response.data?.images;
    const imageHash = Object.values(images)[0]?.hash;

    if (!imageHash) throw new Error("Image uploaded but no hash returned.");
    return imageHash;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(
        "Meta API Error (upload):",
        JSON.stringify(error.response.data, null, 2)
      );
      throw new Error(`Meta API Error: ${error.response.data.error.message}`);
    } else {
      console.error("Unexpected Error:", error.message);
      throw new Error(`Unexpected Error: ${error.message}`);
    }
  }
};

const createAdCreative = async ({
  adAccountId,
  accessToken,
  pageID,
  imageHash,
  link,
  message,
  campaignName,
  leadFormId,
}) => {
  const url = `https://graph.facebook.com/v23.0/${adAccountId}/adcreatives`;

  // Validate required values
  if (
    !adAccountId ||
    !accessToken ||
    !pageID ||
    !imageHash ||
    !link ||
    !message ||
    !campaignName
  ) {
    throw new Error("Missing required fields for ad creative creation.");
  }

  let payload;

  if (leadFormId) {
    payload = {
      name: `${campaignName}_AdCreative`,
      object_story_spec: {
        page_id: pageID,
        link_data: {
          call_to_action: {
            type: "SIGN_UP", 
            value: {
              lead_gen_form_id: leadFormId,
            },
          },
          description: "Get more details by submitting this form.",
          image_hash: imageHash,
          link,
          message,
        },
      },
    };
  } else {
    payload = {
      name: `${campaignName}_AdCreative`,
      object_story_spec: {
        page_id: pageID,
        link_data: {
          image_hash: imageHash,
          link,
          message,
          call_to_action: {
            type: "LEARN_MORE",
            value: {
              link,
            },
          },
        },
      },
    };
  }

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const adCreativeId = response.data?.id;

    if (!adCreativeId) {
      throw new Error("Ad Creative created but no ID returned.");
    }
    console.log(
      "Sending payload to Meta Ad Creative API:",
      JSON.stringify(payload, null, 2)
    );

    console.log(" Ad Creative created:", adCreativeId);
    return adCreativeId;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(
        " Meta API Error (Ad Creative):",
        JSON.stringify(error.response.data, null, 2)
      );
      throw new Error(`Meta API Error: ${error.response.data.error.message}`);
    } else {
      console.error(" Unexpected Error:", error.message);
      throw new Error(`Unexpected Error: ${error.message}`);
    }
  }
};

const createAd = async ({
  accessToken,
  adAccountId,
  adSetId,
  adCreativeId,
  adStatus,
  campaignName,
}) => {
  const url = `https://graph.facebook.com/v23.0/${adAccountId}/ads`;

  const payload = {
    name: `${campaignName}_Ad`,
    adset_id: adSetId,
    creative: { creative_id: adCreativeId },
    status: adStatus,
  };

  console.log("📤 Ad creation payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const adId = response.data?.id;

    if (!adId) {
      throw new Error("Ad created but no ID returned.");
    }
    console.log("Ad ID: ", adId);
    return adId;
  } catch (error) {
    if (error.response?.data) {
      console.error(
        "🔥 Meta API Error (Ad Creation):",
        JSON.stringify(error.response.data, null, 2)
      );
      throw new Error(`Meta API Error: ${error.response.data.error.message}`);
    } else {
      console.error("❌ Unexpected Error:", error.message);
      throw new Error(`Unexpected Error: ${error.message}`);
    }
  }
};

module.exports = {
  createAdCampaign,
  createAdSet,
  uploadAdImage,
  createAdCreative,
  createAd,
};
