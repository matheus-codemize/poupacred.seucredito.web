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
 * Função para criar uma proposta
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

/**
 * Função para criar uma proposta
 */
export async function find(id) {
  try {
    const url = `/propostas/buscar?proposta=${id}`;
    const response = await api.get(url);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para listar propostas
 */
export async function list(filter = null) {
  try {
    const url = '/propostas/listar';
    const response = await api.post(url, filter);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para listar os status da proposta
 */
export async function getStatus() {
  try {
    const url = '/propostas/status/listar';
    const data = await api.get(url);
    return data.map(item => ({ ...item, value: item.id, label: item.nome }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}
