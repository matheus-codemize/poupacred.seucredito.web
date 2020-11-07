import _ from 'lodash';

// services
import api from './api';

// utils
import toast from '../utils/toast';

export async function init() {
  try {
    const url = '/dashboard/home';
    const data = await api.get(url);
    return data;
  } catch (err) {
    const message = _.get(err, 'response.data.erro', err.message);
    toast.error(message);
  }

  return null;
}
