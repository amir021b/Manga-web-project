/**
 * Talk to the manga backend.
 * Later this will call the real endpoints (manga list, manga details, chapters
 * and chapter pages) and return the parsed data.
 *
 * @param {string} endpoint The API endpoint that should be requested.
 * @returns {Promise<*>} The parsed response (for now an empty placeholder).
 */
export async function fetchManga(endpoint) {
  // Placeholder: the real request will be sent here later.
  return { endpoint, data: null }
}
