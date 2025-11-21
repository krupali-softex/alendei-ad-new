const objectiveMapping = {
  traffic: {
    objective: "OUTCOME_TRAFFIC",
    billing_event: "IMPRESSIONS",
    optimization_goal: "LINK_CLICKS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  },
  sales: {
    objective: "OUTCOME_SALES",
    billing_event: "IMPRESSIONS",
    optimization_goal: "OFFSITE_CONVERSIONS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  },
  engagement: {
    objective: "OUTCOME_ENGAGEMENT",
    billing_event: "IMPRESSIONS",
    optimization_goal: "POST_ENGAGEMENT",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    destination_type: "ON_POST",
  },
  awareness: {
    objective: "OUTCOME_AWARENESS",
    billing_event: "IMPRESSIONS",
    optimization_goal: "REACH",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  },
  leads: {
    objective: "OUTCOME_LEADS",
    billing_event: "IMPRESSIONS",
    optimization_goal: "LEAD_GENERATION",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    destination_type: "ON_AD",
  },
  app_promotion: {
    objective: "OUTCOME_APP_PROMOTION",
    billing_event: "IMPRESSIONS",
    optimization_goal: "APP_INSTALLS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  },
};

const mapObjectiveConfig = (userInputObjective) => {
  const key = userInputObjective.toLowerCase().trim();
  const mapped = objectiveMapping[key];

  if (!mapped) {
    throw new Error(`Unsupported objective: ${userInputObjective}`);
  }

  return mapped;
};

module.exports = mapObjectiveConfig;
