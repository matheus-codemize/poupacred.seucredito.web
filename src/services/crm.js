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
    const url = '/crm/convenio/listar';
    const data = await api.post(url);
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
 * Tabulação - resultado de um atendimento
 */
export async function getTabulacaos() {
  try {
    const url = '/crm/tabulacao/listar';
    const data = await api.post(url);
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
    const url = '/crm/status_solicitacao/listar';
    const data = await api.post(url);
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
 * Função para listar os status de registro Mailing
 */
export async function getStatusRegistro() {
  try {
    const url = '/crm/status_registro/listar';
    const data = await api.post(url);
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
 * Função para listar as solicitações de mailing
 * @param {object} filter
 */
export async function list(filter = null) {
  try {
    const url = '/crm/solicitacao/listar';
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
export async function requestMailing(data) {
  try {
    const url = '/crm/solicitacao/gravar';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}

/**
 * Função para atualizar telefone do cliente
 * @param {object} data
 */
export async function updatePhone(data) {
  try {
    const url = '/crm/cliente/atualizar/contato';
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
    const url = '/crm/agendamento/gravar';
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
    const url = '/crm/atendimento/gravar';
    const response = await api.post(url, data);
    return response;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }
  return null;
}
