// redux
import { store } from '../redux/store';

// import all languages
import ptBR from '../resources/language/pt-BR.json';

// errors
import ptBR_error from '../resources/language/pt-BR_error.json';

const languages = {
  'pt-BR': ptBR,
  'pt-BR_error': ptBR_error,
};

const language = store.getState().language;

export const errors = languages[language.locale + '_error'];

export default languages[language.locale];
