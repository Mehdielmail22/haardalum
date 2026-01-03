export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL ||
               (import.meta.env.PROD
                 ? 'https://hardalum-backend.onrender.com'
                 : 'http://localhost:5000')
};
