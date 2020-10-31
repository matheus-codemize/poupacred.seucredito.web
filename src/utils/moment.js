import moment from 'moment';

/**
 *
 * @param {string|object} value
 * @param {string} format
 */
export default function (value, format) {
  const date = moment(value, format);
  return date;
}
