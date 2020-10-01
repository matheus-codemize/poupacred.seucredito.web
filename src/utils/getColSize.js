import { store } from '../redux/store';

/**
 * Função para tratar o tamanho dos inputs no fomulário conforme tamanho de tela
 * e configuração dos tamanhos conforme o parâmetro inputsize
 *
 * @param {string} id
 * @param {object} inputsize
 */
export default function (id, inputsize) {
  const { navigator } = store.getState();

  if (navigator.window.size.x >= 1000) {
    if (
      Object.prototype.hasOwnProperty.call(inputsize, 'lg') &&
      typeof inputsize.lg === 'object'
    ) {
      return inputsize.lg[id];
    }
  }

  if (navigator.window.size.x >= 800) {
    if (
      Object.prototype.hasOwnProperty.call(inputsize, 'md') &&
      typeof inputsize.md === 'object'
    ) {
      return inputsize.md[id];
    }
  }

  return;
}
