import { getUserLocation, getCountryByCoords } from './geolocation.js';

const newsContainer = document.getElementById('news-container');
const newsLocation = document.getElementById('news-location');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const updateBtn = document.getElementById('update-location');
const toggleThemeBtn = document.getElementById('toggle-theme');

let newsData = {};

// =============================
// ЗАГРУЗКА JSON
// =============================
async function fetchNewsJSON() {
  try {
    const res = await fetch('data/news.json');
    if (!res.ok) throw new Error("Ошибка загрузки JSON");
    newsData = await res.json();
  } catch (err) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Ошибка: не удалось загрузить новости.';
    console.error(err);
  }
}

// =============================
// ОТРИСОВКА НОВОСТЕЙ
// =============================
function renderNews(cards) {
  newsContainer.innerHTML = '';

  cards.forEach(news => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <img src="${news.image}" alt="${news.title}">
      <h3>${news.title}</h3>
      <p>${news.description}</p>
      <a href="${news.link}" target="_blank">Читать полностью</a>
    `;
    newsContainer.appendChild(card);
  });
}

// =============================
// ЗАГРУЗКА НОВОСТЕЙ ПО РЕГИОНУ
// =============================
async function loadNews() {
  loading.style.display = 'block';
  errorDiv.style.display = 'none';
  newsContainer.innerHTML = '';

  await fetchNewsJSON();

  let country = 'DEFAULT';

  try {
    const coords = await getUserLocation(); // { lat, lon }
    const detectedCountry = getCountryByCoords(coords.lat, coords.lon);

    console.log("Определённая страна:", detectedCountry);

    if (detectedCountry && newsData[detectedCountry]) {
      country = detectedCountry;
    }
  } catch (err) {
    console.warn("Геолокация недоступна:", err);
  }

  newsLocation.textContent =
    country === 'DEFAULT'
      ? 'Мировые новости'
      : `Новости для региона: ${country}`;

  renderNews(newsData[country] || newsData['DEFAULT']);
  loading.style.display = 'none';
}

// =============================
// КНОПКА ОБНОВЛЕНИЯ
// =============================
updateBtn.addEventListener('click', loadNews);

// =============================
// ТЁМНАЯ ТЕМА
// =============================
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Первая загрузка
loadNews();
