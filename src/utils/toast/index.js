import { toast as toastify } from 'react-toastify';

const toast = message => {
  toast(message);
};

toast.info = (message, options = {}) => toastify.info(message, options);
toast.error = (message, options = {}) => toastify.error(message, options);
toast.warning = (message, options = {}) => toastify.warning(message, options);
toast.success = (message, options = {}) => toastify.success(message, options);

export default toast;
