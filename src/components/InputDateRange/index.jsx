import React from 'react';
import Input from '../Input';

import './styles.css';
function InputDateRange() {
  return (
    <div className="input-date-range">
      <Input htmlType="date" label="Período Início" name="start_date" />
      <Input htmlType="date" label="Período Fim" name="end_date" />
    </div>
  );
}

export default InputDateRange;
