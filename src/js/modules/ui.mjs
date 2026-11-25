import { formatPopulation, getCurrencyCode } from './countriesApi.mjs';

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function setStatus(message) {
  const status = document.querySelector('#status');
  if (status) status.textContent = message;
}

export function renderCards(countries) {
  const container = document.querySelector('#cards');
  if (!container) return;

  if (!countries.length) {
    container.innerHTML = '';
    setStatus('No countries match your search/filter.');
    return;
  }

  setStatus(`Showing ${countries.length} countries`);
  container.innerHTML = countries
    .map(
      (country) => `
      <article class="card" data-code="${country.code}">
        <img src="${country.flag}" alt="${country.flagAlt}" loading="lazy" />
        <div class="card-body">
          <h2>${country.name}</h2>
          <p>Capital: ${country.capital}</p>
          <p>Region: ${country.region}</p>
          <p>Population: ${formatPopulation(country.population)}</p>
          <p>Currency: ${getCurrencyCode(country)}</p>
        </div>
      </article>
    `,
    )
    .join('');
}

export function filterCountries(countries, { query = '', region = 'all' }) {
  const q = query.trim().toLowerCase();

  return countries.filter((country) => {
    const regionOk = region === 'all' || country.region === region;
    if (!regionOk) return false;
    if (!q) return true;

    return (
      country.name.toLowerCase().includes(q) ||
      country.officialName.toLowerCase().includes(q) ||
      country.capital.toLowerCase().includes(q)
    );
  });
}
