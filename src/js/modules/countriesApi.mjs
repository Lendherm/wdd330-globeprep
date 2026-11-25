const API_URL =
  'https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,currencies,languages,flags,cca3,coatOfArms,timezones,borders,car,maps';
const CACHE_KEY = 'globePrep_countries_v1';

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(countries) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(countries));
  } catch {
    // Ignore quota / private mode failures
  }
}

export async function getCountries() {
  const cached = readCache();
  if (cached) return cached;

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`REST Countries error: ${response.status}`);
  }

  const data = await response.json();
  const countries = data
    .map((country) => ({
      code: country.cca3,
      name: country.name?.common || 'Unknown',
      officialName: country.name?.official || '',
      capital: country.capital?.[0] || 'N/A',
      region: country.region || 'Unknown',
      subregion: country.subregion || '',
      population: country.population || 0,
      currencies: country.currencies || {},
      languages: country.languages || {},
      flag: country.flags?.svg || country.flags?.png || '',
      flagAlt: country.flags?.alt || `${country.name?.common || 'Country'} flag`,
      coatOfArms: country.coatOfArms?.svg || '',
      timezones: country.timezones || [],
      borders: country.borders || [],
      drivingSide: country.car?.side || '',
      maps: country.maps || {},
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  writeCache(countries);
  return countries;
}

export function getCurrencyCode(country) {
  const codes = Object.keys(country.currencies || {});
  return codes[0] || 'N/A';
}

export function formatPopulation(value) {
  return new Intl.NumberFormat('en-US').format(value);
}
