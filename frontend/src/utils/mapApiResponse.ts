import { generateAiResponse } from "../types/index"; // Import your API response type
import { AdFormState } from "../types/index"; 

export const mapApiResponseToFormState = (data: generateAiResponse): Partial<AdFormState> => {
  return {
    companyName: data.adData.company_name,
    campaignMessage: data.adData.category,
    category: data.adData.category,
    campaignType: data.adData.ad_objective, 
    selectPlatform: data.adData.platform,
    targetArea: data.adData.target_location,
    budget: Number(data.adData.budget), // Ensure it's a number
    ageRange: data.adData.age_group ?  data.adData.age_group.split("-").map(Number) as [number, number] : [18, 60], // Convert "18-60" to [18, 60]
    gender: data.adData.gender ? data.adData.gender.includes("Male") && data.adData.gender.includes("Female") ? "All" : (data.adData.gender === "Male" ? "Men" : "Women"): 'All',
    adDuration: data.adData.ad_duration, // Assuming ad_duration is a string
    setupCompleted:data.setupCompleted
  };
};
