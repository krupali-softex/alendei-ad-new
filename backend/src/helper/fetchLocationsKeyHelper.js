const axios = require("axios");

const resolveLocations = async ({
  geo_location = "",
  cityRadius = 10,
  cityUnit = "mile",
  accessToken = process.env.SYSTEM_USER_TOKEN,
}) => {
  let locationList = [];
  if (typeof geo_location === "string") {
    locationList = geo_location.split(",").map((l) => l.trim());
  } else if (Array.isArray(geo_location)) {
    locationList = geo_location;
  }

  let foundCity = null;
  let foundRegion = null;
  let foundCountry = null;

  for (const name of locationList) {
    try {
      const res = await axios.get(`https://graph.facebook.com/v23.0/search`, {
        params: {
          type: "adgeolocation",
          location_types: ["country", "region", "city"],
          q: name,
          access_token: accessToken,
        },
      });

      const matches = res.data.data;
      if (!matches.length) continue;

      const match = matches[0]; 
      if (match.type === "city" && !foundCity) {
        foundCity = {
          cities: [
            {
              key: match.key,
              radius: cityRadius,
              distance_unit: cityUnit,
            },
          ],
        };
      } else if (match.type === "region" && !foundRegion) {
        foundRegion = {
          regions: [{ key: match.key }],
        };
      } else if (match.type === "country" && !foundCountry) {
        foundCountry = {
          countries: [match.key],
        };
      }
    } catch (err) {
      console.error(
        "Error resolving location:",
        name,
        err.response?.data || err.message
      );
    }
  }

  
  if (foundCity) return foundCity;
  if (foundRegion) return foundRegion;
  if (foundCountry) return foundCountry;

  return {}; 
}
// var SYSTEM_USER_TOKEN = process.env.SYSTEM_USER_TOKEN || ""
// console.log(SYSTEM_USER_TOKEN);
// const resolveLocations = async (req, res) => {
//   try {
//     const { name } = req.query;
//     const SYSTEM_USER_TOKEN = process.env.SYSTEM_USER_TOKEN; // load fresh every time

//     console.log("ENV TOKEN inside function:", SYSTEM_USER_TOKEN ? "✅ Found" : "❌ Missing");

//     if (!SYSTEM_USER_TOKEN) {
//       return res.status(400).json({ success: false, message: "SYSTEM_USER_TOKEN is missing in ENV" });
//     }

//     if (!name) {
//       return res.status(400).json({ success: false, message: "Location name is required" });
//     }

//     const url = `https://graph.facebook.com/v23.0/search`;
//     const response = await axios.get(url, {
//       params: {
//         type: "adgeolocation",
//         location_types: ["city", "region"],
//         q: name,
//         access_token: SYSTEM_USER_TOKEN,
//       },
//     });

//     const locations = response.data.data;

//     if (!locations.length) {
//       return res.status(404).json({ success: false, message: "No location found" });
//     }

//     return res.status(200).json({
//       success: true,
//       resolved: locations[0],
//     });
//   } catch (error) {
//     console.error("Error fetching location:", error.response?.data || error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Error resolving location",
//       error: error.response?.data || error.message,
//     });
//   }
// };
module.exports = resolveLocations;
