import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para buscar um banco pelo ID
 * @param {string|number} id
 */
export async function getById(id) {
  try {
    if (id) {
      const url = `/bancos/buscar?id=${id}`;
      const data = await api.get(url);
      return { ...data, value: data.id, label: data.nome };
    }
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para listar os bancos
 */
export async function list() {
  try {
    const url = '/bancos/listar';
    const data = await api.get(url);
    return data.map(item => ({ ...item, value: item.id, label: item.nome }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}
