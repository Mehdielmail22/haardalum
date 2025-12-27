export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL ||
               (import.meta.env.PROD
                 ? 'https://hardalum-backend-production.up.railway.app'
                 : 'http://localhost:5000')
};
