import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para listar os campos dinâmicos para concluir uma simulação (fazer a simulação virar proposta)
 */
export async function getFields(data) {
  try {
    const url = '/propostas/produtos/campos';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para listar os convênios
 */
export async function create(data) {
  try {
    const url = '/propostas/criar';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}
