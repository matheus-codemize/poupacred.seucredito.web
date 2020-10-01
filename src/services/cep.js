import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

export default async function (cep) {
  try {
    if (cep && cep.length === 9) {
      const url = `/ceps/buscar?cep=${cep}`;
      const data = await api.get(url);
      return data;
    }
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }

  return null;
}
