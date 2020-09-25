// redux
import { store } from '../redux/store';

// import all languages
import ptBR from '../resources/language/pt-BR.json';

const languages = {
  'pt-BR': ptBR,
};
const language = store.getState().language;

export default languages[language.locale];
