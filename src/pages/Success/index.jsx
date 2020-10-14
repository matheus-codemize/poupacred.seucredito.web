import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './style.module.css';

// components
import Button from '../../components/Button';

function ContainerSuccess() {
  const history = useHistory();
  const location = useLocation();

  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (location.state) {
      const keys = ['text', 'title', 'description'];
      Object.keys(location.state)
        .filter(key => keys.includes(key))
        .forEach(key => {
          eval(
            `set${key.charAt(0).toUpperCase() + key.slice(1)}(${
              typeof location.state[key] === 'string'
                ? JSON.stringify(location.state[key])
                : location.state[key]
            })`,
          );
        });
    }
  }, [location.state]);

  function handleConfirm() {
    const { path, state = {} } = location.state;
    if (path) history.replace(path, state);
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.content_title}>
          <i className="fa fa-check-circle" />
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <Button gradient onClick={handleConfirm}>
          {text}
        </Button>
      </div>
    </div>
  );
}

export default ContainerSuccess;
