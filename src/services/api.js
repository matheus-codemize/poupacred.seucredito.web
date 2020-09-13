import axios from 'axios';

const api = axios.create({
  baseURL: 'https://seu-credito-homolog-a74mkfx2aa-uc.a.run.app',
});

export default api;
