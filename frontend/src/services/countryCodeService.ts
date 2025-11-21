// src/services/countryCodeService.ts

import axios from 'axios';

// Define a type for the country code data
export interface CountryCode {
  label: string;
  value: string; // Alpha-2 country code (ISO 3166-1)
  country: string;
}

// Fetch country codes from a public API (REST Countries)
export const fetchCountryCodes = async (): Promise<CountryCode[]> => {
  try {
    // Make an HTTP GET request to the REST Countries API
    const response = await axios.get('https://restcountries.com/v3.1/all');

    // Process the response data to map it to the desired format
    const countryCodes = response.data.map((country: any): CountryCode => ({
      label: `+${country.idd.root}${country.idd.suffixes[0]}`,
      value: country.cca2, // The country alpha-2 code (ISO 3166-1)
      country: country.name.common,
    }));

    return countryCodes; // Return the country code data
  } catch (error) {
    console.error("Error fetching country codes:", error);
    return []; // Return an empty array in case of error
  }
};
