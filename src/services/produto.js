import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para listar os produtos
 */
export async function list() {
  try {
    const url = '/produtos/listar';
    const data = await api.get(url);
    return data.map(item => ({ value: item.id, label: item.nome }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para buscar um produto pelo ID
 * @param {string|number} id
 */
export async function getById(id) {
  try {
    if (id) {
      const url = `/produtos/buscar?id=${id}`;
      const data = await api.get(url);
      return { value: data.id, label: data.nome };
    }
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}
