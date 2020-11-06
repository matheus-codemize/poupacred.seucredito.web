import axios from 'axios';

// redux
import { store } from '../redux/store';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: process.env.REACT_APP_API_TIMEOUT,
});

api.interceptors.request.use(async config => {
  const { data } = config;
  const { auth } = store.getState();

  /**
   * Selecionando arquivos
   * file = { isFile: true, name: 'string', data: 'base64' }
   */
  if (data) {
    const allPromise = Object.keys(data).map(async key => {
      if (data[key] && typeof data[key] === 'object' && data[key].isFile) {
        data[key] = data[key].data;
      }
    });
    await Promise.all(allPromise);
  }

  /**
   * Convertendo as propriedades da paginação
   */
  if (data && Object.prototype.hasOwnProperty.call(data, 'pagination')) {
    const { pagination } = data;
    if (typeof pagination === 'object' && pagination.current) {
      data.pagina = pagination.current;
      delete data.pagination;
    }
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
