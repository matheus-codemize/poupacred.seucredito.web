import React from 'react';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// assets
import Term from '../../assets/documents/politica_privacidade.pdf';
import Polity from '../../assets/documents/politica_privacidade.pdf';

function TermPolity({ ...rest }) {
  return (
    <div
      {...rest}
      className={styles.container}
      dangerouslySetInnerHTML={{
        __html: language['agree.term.polity']
          .replace(
            '[term]',
            `<a href=${Term} target='_blank'>${language['term']}</a>`,
          )
          .replace(
            '[polity]',
            `<a href=${Polity} target='_blank'>${language['polity']}</a>`,
          ),
      }}
    />
  );
}

export default TermPolity;
