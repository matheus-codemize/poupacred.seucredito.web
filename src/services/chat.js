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

export async function register(tipo, mensagem) {
  try {
    const url = '/chats/criar';
    const response = await api.post(url, { tipo, mensagem });
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

export async function sendMessage(chat, mensagem) {
  try {
    const url = '/chats/conversas/enviar';
    const response = await api.post(url, { chat, mensagem });
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}
