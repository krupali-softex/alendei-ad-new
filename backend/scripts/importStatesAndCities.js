const axios = require('axios');
const { connectDB } = require('../src/config/db'); // your DB config
const State = require('../src/models/state');
const City = require('../src/models/city');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchStates() {
  const res = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
    country: 'India'
  }, { timeout: 10000 });
  return res.data.data.states; // array of { name, state_code }
}

async function fetchCities(stateName, retries = 3, delay = 2000) {
  const url = 'https://countriesnow.space/api/v0.1/countries/state/cities';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await axios.post(url, {
        country: 'India',
        state: stateName
      }, { timeout: 10000 });

      return res.data.data; // array of city names
    } catch (err) {
      console.error(`⚠️ Error fetching cities for ${stateName} (attempt ${attempt}): ${err.message}`);

      if (attempt < retries) {
        await sleep(delay * attempt); // exponential backoff
      } else {
        throw err; // rethrow after all retries fail
      }
    }
  }
}

async function insertStatesAndCities() {
  try {
    await connectDB(); // establish DB connection

    const states = await fetchStates();

    for (const { name: stateName } of states) {
      const [state] = await State.findOrCreate({ where: { name: stateName } });

      try {
        const cities = await fetchCities(stateName);

        for (const cityName of cities) {
          await City.findOrCreate({
            where: { name: cityName, state_id: state.id },
          });
        }

        console.log(`✅ ${stateName} and its cities inserted.`);
      } catch (cityErr) {
        console.error(`❌ Failed to insert cities for ${stateName}: ${cityErr.message}`);
      }
    }
  } catch (err) {
    console.error('❌ Fatal error:', err);
  }
}

insertStatesAndCities();
