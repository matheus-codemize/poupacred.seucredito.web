import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: process.env.REACT_APP_API_TIMEOUT,
});

api.interceptors.request.use(config => {
  // const authentication = Store.getState().authentication || {}
  // const { type, token } = authentication
  // if (type && token && !config.url.includes('/auth-api')) {
  //   config.headers.Authorization = `${type} ${token}`
  // }
  return config;
});

api.interceptors.response.use(
  response => {
    const { data } = response;
    return data;
  },
  function (err) {
    const { status } = err.response;
    switch (status) {
      case 401: // autenticação falhou
        break;

      default:
        return Promise.reject(err);
    }
  },
);

export default api;
