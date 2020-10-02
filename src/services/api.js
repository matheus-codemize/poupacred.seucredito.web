import axios from 'axios';

// redux
import { store } from '../redux/store';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: process.env.REACT_APP_API_TIMEOUT,
});

const fileToBase64 = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });
};

api.interceptors.request.use(async config => {
  const { data } = config;
  const { auth } = store.getState();

  /**
   * Conversão de arquivos para base64
   */
  if (data) {
    const allPromise = Object.keys(data).map(async key => {
      if (data[key] && data[key] instanceof File) {
        data[key] = await fileToBase64(data[key]);
      }
    });
    await Promise.all(allPromise);
  }

  /**
   * Setando o token no "header" da requisição
   */
  if (auth.token && !config.url.includes('/login')) {
    config.headers.token = auth.token;
  }

  return config;
});

api.interceptors.response.use(
  response => {
    const { data } = response;
    return data;
  },
  // function (err) {
  //   const { status } = err.response;
  //   switch (status) {
  //     case 401: // autenticação falhou
  //       break;

  //     default:
  //       return Promise.reject(err);
  //   }
  // },
);

export default api;
