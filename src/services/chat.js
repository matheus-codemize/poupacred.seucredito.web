import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

export async function getTypes() {
  try {
    const url = '/chats/listar/tipos';
    const data = await api.get(url);
    return data.map(item => ({ ...item, value: item.id, label: item.nome }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

export async function list() {
  try {
    const url = '/chats/listar';
    const data = await api.get(url);
    return data;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

export async function getConversation(chat, pagina) {
  try {
    const url = '/chats/conversas/listar';
    const response = await api.post(url, { chat, pagina });
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return { dados: [], total: 0 };
}
