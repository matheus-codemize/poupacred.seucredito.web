import React, { useState } from 'react';

// components
import Input from '../Input';
import Button from '../Button';

// utils
import language from '../../utils/language';

function Margin({ ...rest }) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(prevLoading => !prevLoading);
  }

  return (
    <>
      <Input {...rest} type="money" />
      <Button
        loading={loading}
        onClick={handleClick}
        style={{
          width: '100%',
          padding: '0.8rem',
          fontSize: '1.7rem',
          marginBottom: '1rem',
          backgroundColor: '#f3f3f3',
          color: 'rgb(var(--color-black))',
        }}
      >
        {language['component.margin'].btn_not}
      </Button>
    </>
  );
}

export default Margin;
