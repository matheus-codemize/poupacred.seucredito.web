import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// services
import * as simulacaoApi from '../../services/simulacao';

// redux
import actionsContainer from '../../redux/actions/container';

// components
import Input from '../Input';
import Button from '../Button';

// utils
import toast from '../../utils/toast';
import language from '../../utils/language';

const languageComp = language['component.margin'];

function Margin({ ...rest }) {
  // resource hook
  const history = useHistory();
  const dispatch = useDispatch();

  // redux state
  const auth = useSelector(state => state.auth);
  const simulation = useSelector(state => state.simulation);
  const { register } = simulation;

  async function handleClick() {
    if (!auth.uid) {
      toast.info(languageComp.login)
      return history.push('/login')
    }

    dispatch(actionsContainer.loading());
    const response = await simulacaoApi.margin(register);
    if (response) {
      toast.info(languageComp.margin);
      return history.replace('/simulacao');
    }

    dispatch(actionsContainer.close());
  }

  return (
    <>
      <Input {...rest} type="money" />
      <Button
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
        {languageComp.not}
      </Button>
    </>
  );
}

export default Margin;
