const path = require("path");
const {
  createAdCampaign,
  createAdSet,
  uploadAdImage,
  createAdCreative,
  createAd,
} = require("./adCampaignHelper");
const {
  deleteCampaign,
  deleteAdSet,
  deleteAd,
  deleteAdCreative,
  deleteLeadForm,
} = require("./deleteCampaignHelper");
const { createLeadForm } = require("./leadFormHelper");
const mapObjectiveConfig = require("./mapObjectiveConfig");
const adPayload = require("./adPayloadHelper");
const AdDetail = require("../models/addetail");
const getPageIdAndAccessToken = require("../helper/fetchPageidHelper");



const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const SYSTEM_USER_TOKEN = process.env.SYSTEM_USER_TOKEN || "";

function toISO8601(date, time) {
  const [day, month, year] = date.split("/");
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = time.includes(":") ? `${time}:00` : `${time}:00`;
  const timezoneOffset = "+0530";
  return `${formattedDate}T${formattedTime}${timezoneOffset}`;
}

const createAdFlow = async ({ metadata, imagePath, workspaceId, userId }) => {
  let campaignId = null;
  let adSetId = null;
  let adCreativeId = null;
  let adId = null;
  let imageHash = null;
  let leadFormId = null;
  let adSetPayload = null;
  //let destination_type = "ON_AD";
  const adStatus = "PAUSED";

  const { ACCESS_TOKEN, PAGE_ID } = await getPageIdAndAccessToken(userId, workspaceId);
  console.log("adflow helper: ", PAGE_ID, ACCESS_TOKEN);



  if (!metadata || !imagePath || !workspaceId || !userId) {
    return { success: false, error: "Image or metadata not provided." };
  }

  console.log("userid, workspaceId", userId, workspaceId);
  console.log("data :", metadata);
  console.log("image : ", imagePath);

  let {
    campaignName,
    ad_objective,
    lifetime_budget,
    age_min,
    age_max,
    gender,
    publisher_platform,
    geo_location,
    destinationUrl,
    start_date,
    end_date,
    starttime,
    endtime,
  } = metadata;
  console.log("Raw objective from metadata:", ad_objective);

  lifetime_budget = lifetime_budget ? parseInt(lifetime_budget, 10) * 100 : 1000000; // Default to 10,000 INR if not provided

  try {
    const { objective, billing_event, optimization_goal, bid_strategy, destination_type } = mapObjectiveConfig(ad_objective);
    console.log("Mapped objective for Meta API:", objective, campaignName);

    const enriched =  await adPayload({
      objective,
      gender,
      age_min,
      age_max,
      geo_location,
      platform: publisher_platform,
      destinationUrl,
      PAGE_ID
    });
    const start_time = toISO8601(start_date, starttime);
    const end_time = toISO8601(end_date, endtime);
    console.log("enriched", JSON.stringify(enriched, null, 2));

    if (
      !campaignName ||
      !objective ||
      !billing_event ||
      !optimization_goal ||
      !enriched?.targeting
    ) {
      return {
        success: false,
        error: "Missing required fields after enrichment.",
      };
    }

    // Step 1: Create Campaign
    campaignId = await createAdCampaign({
      campaignName,
      objective,
      accessToken: SYSTEM_USER_TOKEN,
      adAccountId: AD_ACCOUNT_ID,
      adStatus,
    });
    //console.log(campaignId,campaignName,objective,adAccountId,accessToken);
    //if (objective === "OUTCOME_LEADS") {
      adSetPayload = {
        name: `${campaignName}_AdSet`,
        lifetime_budget,
        bid_strategy,
        billing_event,
        optimization_goal,
        start_time,
        end_time,
        destination_type,
        campaign_id: campaignId,
        targeting: enriched.targeting,
        promoted_object: enriched.promoted_object,
        status: adStatus,
      };
    // } else {
    //   adSetPayload = {
    //     name: `${campaignName}_AdSet`,
    //     lifetime_budget,
    //     bid_strategy,
    //     billing_event,
    //     optimization_goal,
    //     start_time,
    //     end_time,
    //     campaign_id: campaignId,
    //     targeting: enriched.targeting,
    //     promoted_object:{ page_id: PAGE_ID },
    //     status: adStatus,
    //   };
    // }
    // Step 2: Create Ad Set

    console.log("adSetPayload", adSetPayload);
    adSetId = await createAdSet({
      accessToken: SYSTEM_USER_TOKEN,
      adAccountId: AD_ACCOUNT_ID,
      adSetData: adSetPayload,
    });

    if (objective === "OUTCOME_LEADS") {
      const formName = `${campaignName}_LeadForm`;
      leadFormId = await createLeadForm({
        pageId: PAGE_ID,
        accessToken: ACCESS_TOKEN,
        formName,
      });
    }
    console.log("formID : ", leadFormId);

    // Step 3: Upload Ad Image
    const resolvedImagePath = path.resolve(imagePath);
    imageHash = await uploadAdImage({
      imageUrl: resolvedImagePath,
      accessToken: SYSTEM_USER_TOKEN,
      adAccountId: AD_ACCOUNT_ID,
    });

    // Step 4: Create Ad Creative
    adCreativeId = await createAdCreative({
      accessToken: SYSTEM_USER_TOKEN,
      adAccountId: AD_ACCOUNT_ID,
      pageID: PAGE_ID,
      imageHash,
      message: enriched.adMessage,
      link: enriched.destinationUrl,
      campaignName,
      leadFormId,
    });

    // Step 5: Create Ad
    adId = await createAd({
      accessToken: SYSTEM_USER_TOKEN,
      adAccountId: AD_ACCOUNT_ID,
      adSetId,
      adCreativeId,
      adStatus,
      campaignName,
    });

    await AdDetail.create({
      id_users: userId,
      workspaceId,
      adCampaignId: campaignId,
      adSetId,
      adCreativeId,
      adId,
      imageHash,
      campaignName,
      leadFormId,
      status: adStatus,
    });

    return {
      success: true,
      campaignId,
      adSetId,
      adCreativeId,
      adId,
    };
  } catch (error) {
    console.error("Ad Flow Error:", error.message);

    if (adId) await deleteAd(adId, ACCESS_TOKEN);
    if (adCreativeId) await deleteAdCreative(adCreativeId, ACCESS_TOKEN);
    if (adSetId) await deleteAdSet(adSetId, ACCESS_TOKEN);
    if (campaignId) await deleteCampaign(campaignId, ACCESS_TOKEN);
    if (leadFormId) await deleteLeadForm(leadFormId, ACCESS_TOKEN);

    return {
      success: false,
      error: "Ad creation failed. Rollback completed.",
      message: error.message,
    };
  }
};

module.exports = createAdFlow;
