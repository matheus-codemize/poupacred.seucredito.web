import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para listar os produtos da simulação
 */
export async function listProduto() {
  try {
    const url = '/simulacoes/produtos/listar';
    const data = await api.get(url);
    return data.map(item => ({ ...item, value: item.id, label: item.nome }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}
