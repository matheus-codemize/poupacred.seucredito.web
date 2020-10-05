import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para listar os convênios
 */
export async function list() {
  try {
    const url = '/convenios/listar';
    const data = await api.get(url);
    return data.map(item => ({ ...item, value: item.id, label: item.nome }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para buscar um convênio pelo ID
 * @param {string|number} id
 */
export async function getById(id) {
  try {
    if (id) {
      const url = `/convenios/buscar?id=${id}`;
      const data = await api.get(url);
      return { ...data, value: data.id, label: data.nome };
    }
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}
