import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

const languageComp = language['component.listempty'];

function ListEmpty({ visible, text, ...rest }) {
  return visible && <h1 className={styles.text}>{text}</h1>;
}

ListEmpty.defaultProps = {
  text: languageComp.text,
};

ListEmpty.propTypes = {
  text: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default ListEmpty;
