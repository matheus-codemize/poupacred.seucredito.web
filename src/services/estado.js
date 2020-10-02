import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para buscar um estado da api conforme ID
 * @param {string|number} id
 */
export async function find(id) {
  try {
    if (id) {
      const url = `/estados/buscar?id=${id}`;
      const data = await api.get(url);
      return { value: data.id, label: data.nome };
    }
  } catch (err) {
    const message = _.get(err, 'reponse.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para carregar uma lista de estados da api
 */
export async function list() {
  try {
    const url = '/estados/listar';
    const data = await api.get(url);
    return data.map(item => ({
      ...item,
      value: item.id,
      label: `${item.nome} - ${item.uf}`,
    }));
  } catch (err) {
    const message = _.get(err, 'reponse.data.erro', err.message);
    toast.error(message);
  }
  return [];
}
