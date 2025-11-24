export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Геолокация не поддерживается.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      err => {
        reject("Геолокация недоступна.");
      }
    );
  });
}

// Определение страны по координатам без API
export function getCountryByCoords(lat, lon) {

  // Казахстан
  if (lat >= 40 && lat <= 56 && lon >= 46 && lon <= 88) {
    return "KZ";
  }

  // Россия (крупная область, приближённо)
  if (lat >= 41 && lat <= 82 && lon >= 19 && lon <= 180) {
    return "RU";
  }

  // Европа
  if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 40) {
    return "EU";
  }

  // fallback
  return "DEFAULT";
}
