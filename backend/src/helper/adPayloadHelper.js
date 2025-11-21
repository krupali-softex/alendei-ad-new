const resolveLocations = require("./fetchLocationsKeyHelper")

const adPayload = async  ({
  objective,
  gender,
  age_min,
  age_max,
  cityRadius,
  cityUnit,
  platform,
  geo_location,
  devicePlatform,
  destinationUrl,
  PAGE_ID
}) => {
  // Fallbacks
  const finalGender = gender || "all";
  const finalAgeMin = age_min ?? 18;
  const finalAgeMax = age_max ?? 60;
  const finalPlatform = platform || "facebook";
  const finalDevicePlatform = [ "mobile", "desktop"];
  const finalCityRadius = cityRadius || 10;
  const finalCityUnit = cityUnit || "mile";
  const facebook_positions = ["feed"];
  const targeting_automation = {
  advantage_audience: 0
};


  console.log("geo_location in adPayloadHelper", geo_location);
  const genders =
    finalGender === "male" ? [1] : finalGender === "female" ? [2] : [1, 2];

  const geo_locations = await resolveLocations({
    geo_location: geo_location,
    cityRadius: finalCityRadius,
    cityUnit: finalCityUnit,
  });
  
  console.log("Resolved geo_locations:", JSON.stringify(geo_locations, null, 2)); // ✅ Debug log

  const targeting = {
    facebook_positions,
    geo_locations,
    genders,
    age_min: finalAgeMin,
    age_max: finalAgeMax,
    publisher_platforms: [finalPlatform],
    device_platforms: finalDevicePlatform,
    targeting_automation
    };

  const adMessageMap = {
    OUTCOME_LEADS: "Fill this form to get started!",
    OUTCOME_TRAFFIC: "Visit our site to explore more!",
    OUTCOME_SALES: "Shop now and grab the deal!",
    OUTCOME_APP_PROMOTION: "Install our app for the best experience!",
    OUTCOME_ENGAGEMENT: "Let us know what you think!",
    OUTCOME_AWARENESS: "Discover who we are!",
  };

  const promotedObjects = {
    OUTCOME_LEADS: { page_id: PAGE_ID },
    OUTCOME_TRAFFIC: { page_id: process.env.PAGE_ID },
    OUTCOME_SALES: { pixel_id: process.env.PIXEL_ID },
    OUTCOME_ENGAGEMENT: { page_id: PAGE_ID },
    OUTCOME_APP_PROMOTION: {
      application_id: process.env.APP_ID,
      object_store_url: process.env.APP_STORE_URL,
    },
    OUTCOME_AWARENESS: { page_id: PAGE_ID },
  };

  const defaultLinks = {
    OUTCOME_LEADS: "https://yourapp.com/lead-thank-you",
    OUTCOME_TRAFFIC: "https://yourapp.com",
    OUTCOME_SALES: "https://yourapp.com/shop",
    OUTCOME_ENGAGEMENT: "https://yourapp.com/post",
    OUTCOME_APP_PROMOTION: process.env.APP_STORE_URL,
    OUTCOME_AWARENESS: "https://yourapp.com",
  };

  return {
    targeting,
    promoted_object: promotedObjects[objective] || { page_id: process.env.PAGE_ID },
    adMessage: adMessageMap[objective] || "Don't miss this amazing offer!",
    destinationUrl: destinationUrl || defaultLinks[objective],
  };
};

module.exports = adPayload;
