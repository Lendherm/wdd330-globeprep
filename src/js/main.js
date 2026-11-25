import { getCountries } from './modules/countriesApi.mjs';
import { debounce, filterCountries, renderCards, setStatus } from './modules/ui.mjs';

let allCountries = [];
let activeRegion = 'all';
let activeQuery = '';

function refresh() {
  const filtered = filterCountries(allCountries, {
    query: activeQuery,
    region: activeRegion,
  });
  renderCards(filtered);
}

async function init() {
  const search = document.querySelector('#search');
  const pills = document.querySelectorAll('.pill');

  search?.addEventListener(
    'input',
    debounce((event) => {
      activeQuery = event.target.value;
      refresh();
    }, 300),
  );

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeRegion = pill.dataset.region || 'all';
      refresh();
    });
  });

  try {
    setStatus('Loading countries…');
    allCountries = await getCountries();
    refresh();
  } catch (error) {
    console.error(error);
    setStatus('Could not load countries. Check your connection and try again.');
  }
}

init();
