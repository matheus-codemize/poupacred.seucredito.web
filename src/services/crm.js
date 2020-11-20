import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

/**
 * Função para listar os convênios
 */
export async function getConvenios() {
  try {
    const url = '/crm/solicitacoes/convenios/listar';
    const data = await api.get(url);
    return data.map(item => ({
      ...item,
      value: item.id,
      label: item.nome,
    }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para listar as tabulações
 * Tabulação - status de um atendimento
 */
export async function getTabulacaos() {
  try {
    const url = '/crm/tabulacoes/listar';
    const data = await api.get(url);
    return data.map(item => ({
      ...item,
      value: item.id,
      label: item.nome,
    }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para listar os status da solicitação
 */
export async function getStatus() {
  try {
    const url = '/crm/solicitacoes/status/listar';
    const data = await api.get(url);
    return data.map(item => ({
      ...item,
      value: item.id,
      label: item.nome,
    }));
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para listar as solicitações
 * @param {object} filter
 */
export async function list(filter = null) {
  try {
    const url = '/crm/solicitacoes/listar';
    const data = await api.post(url, filter);
    return data;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return { dados: [], total: 0 };
}

/**
 * Função para realizar uma solicitação
 * @param {object} data
 */
export async function create(data) {
  try {
    const url = '/crm/solicitacoes/criar';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para realizar um agendamento de atendimento ao cliente
 * @param {object} data
 */
export async function schedule(data) {
  try {
    const url = '/crm/agendamentos/criar';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para realizar um atendimento ao cliente
 * @param {object} data
 */
export async function answer(data) {
  try {
    const url = '/crm/atendimentos/criar';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para listar os atendimentos de uma determinada solicitação
 * @param {string|number} solicitacao
 */
export async function getAnswers(solicitacao) {
  try {
    const url = `/crm/atendimentos/listar?solicitacao=${solicitacao}`;
    const response = await api.get(url);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return [];
}

/**
 * Função para buscar os dados de um determinado atendimento
 * @param {string|number} solicitacao
 * @param {string|number} cliente
 */
export async function getAnswer(solicitacao, cliente) {
  try {
    const url = `/crm/atendimentos/buscar?solicitacao=${solicitacao}&cliente=${cliente}`;
    const response = await api.get(url);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para classificar um telefone de cliente
 * @param {string|number} fone
 * @param {boolean} positivo
 */
export async function votePhone(fone, positivo) {
  try {
    const url = '/crm/fones/classificar';
    const response = await api.post(url, { fone, positivo });
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para classificar um telefone de cliente
 * @param {string|number} cliente
 * @param {string} numero
 */
export async function addPhone(cliente, numero) {
  try {
    const url = '/crm/fones/criar';
    const response = await api.post(url, { cliente, numero, tipo: 3 });
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}
