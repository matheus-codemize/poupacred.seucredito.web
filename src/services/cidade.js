import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para carregar uma lista de cidades da api pelo estado
 * @param {string|number} estado
 */
export async function listByEstado(estado) {
  try {
    if (estado) {
      const url = `/cidades/listar?estado=${estado}`;
      const data = await api.get(url);
      return data.map(item => ({ value: item.id, label: item.nome }));
    }
  } catch (err) {
    const message = _.get(err, 'reponse.data.erro', err.message);
    toast.error(message);
  }
  return [];
}


/**
 * Função para buscar cidade da api pelo ID
 * @param {string|number} id
 */
export async function find(id) {
  try {
    if (id) {
      const url = `/cidades/buscar?id=${id}`;
      const data = await api.get(url);
      return { value: data.id, label: data.nome };
    }
  } catch (err) {
    const message = _.get(err, 'reponse.data.erro', err.message);
    toast.error(message);
  }
  return null;
}