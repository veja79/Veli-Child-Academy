/**
 * Where the backend lives. Set by VITE_API_BASE in .env files; the production default below is used
 * if a host builds the site without reading them, so the live site never loses its backend.
 */
export const API_BASE: string =
  import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? 'https://veli-child-academy-production.up.railway.app/api' : '/api');
