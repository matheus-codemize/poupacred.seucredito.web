import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para listar as notificações (somente as NOVAS)
 */
export async function list() {
  try {
    const url = '/notificacoes/listar/novas';
    const data = await api.get(url);
    return data;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }

  return [];
}

/**
 * Função para marcar uma notificação como lida
 */
export async function setRead(notificacao_id) {
  try {
    const url = '/notificacoes/ler';
    await api.post(url, { notificacao_id });
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
}
