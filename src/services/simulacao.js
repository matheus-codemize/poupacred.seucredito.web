import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para listar os status da simulação
 */
export async function getStatus() {
  try {
    const url = '/simulacoes/status/listar';
    const data = await api.get(url);
    return data.map(item => ({ ...item, value: item.id, label: item.nome }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para listar os produtos da simulação
 */
export async function getProdutos() {
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

/**
 * Função para listar as simulações
 * @param {object} filter
 */
export async function list(filter = null) {
  try {
    const url = '/simulacoes/listar';
    const response = await api.post(url, filter);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return { dados: [], total: 0 };
}

/**
 * Função para listar as simulações
 * @param {string} cpf
 */
export async function getClientByCpf(cpf, showError = true) {
  try {
    const url = `/simulacoes/clientes/buscar?cpf=${cpf}`;
    const data = await api.get(url);
    return data;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    if (showError) toast.error(message);
  }
  return null;
}

/**
 * Função para trazer campos dinâmicos da simulação
 * @param {object} data
 */
export async function getFields(data) {
  try {
    const url = '/simulacoes/produtos/campos';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para trazer campos dinâmicos da re-simulação
 * @param {object} data
 */
export async function getReFields(data) {
  try {
    const url = '/re-simulacoes/produtos/campos';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para simular
 * Retorno de propostas
 * @param {object} data
 */
export async function simulate(data) {
  try {
    const url = '/simulacoes/simular';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para buscar simulação
 * @param {string|number} id
 */
export async function find(id) {
  try {
    const url = `/simulacoes/buscar?simulacao=${id}`;
    const response = await api.get(url);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}
