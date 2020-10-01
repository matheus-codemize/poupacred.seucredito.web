import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para buscar cidade da api conforme ID
 * @param {string|number} id
 */
export async function find(id) {
  try {
    if (id) {
      const url = `/cidades/buscar?id=${id}`;
      const data = await api.get(url, {
        headers: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTYwMDA5NjU2MCwiZXhwIjoxNjMxNjMyNTYwfQ.hMZipf4NstzJ3JYOgoMRTYHKLIHAS92X9CA0QXErrfg',
        },
      });
      return { value: data.id, label: data.nome };
    }
  } catch (err) {
    const message = _.get(err, 'reponse.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para carregar uma lista de cidades da api conforme estado
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
