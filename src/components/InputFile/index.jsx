import React, { useEffect, useMemo, useState } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import styles from './style.module.css';

// utils
import language from '../../utils/language';

// components
import Help from '../Help';
import Label from '../Label';

function InputFile({
  id,
  help,
  label,
  value,
  display,
  required,
  disabled,
  multiple,
  helpType,
  onChange,
  useCamera,
  placeholder,

  col, // to width
  ...rest
}) {
  async function handleChange(event) {
    const { files } = event.target;

    if (!files.length) return;

    /** convert file to base 64 */
    const fileToBase64 = file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
    };

    let valueSelected = multiple
      ? await Promise.all(
          Object.keys(files)
            .filter(i => !isNaN(parseInt(i)))
            .map(async i => ({
              ...files[i],
              isFile: true,
              name: files[i].name,
              type: files[i].type,
              data: await fileToBase64(files[i]),
            })),
        )
      : {
          isFile: true,
          name: files[0].name,
          type: files[0].type,
          data: await fileToBase64(files[0]),
        };

    if (typeof onChange === 'function') {
      onChange({ target: { id, value: valueSelected } });
    }
  }

  function selectFile() {
    $(`#${id}`).click();
  }

  function openCamera() {}

  const renderValueSelected = useMemo(() => {
    if (value && typeof value === 'object') {
      return multiple
        ? `${value.length} arquivo(s) selecionado(s)`
        : value.name;
    }

    return placeholder;
  }, [value, multiple, placeholder]);

  const renderLabel = useMemo(() => {
    return (
      label && (
        <Label
          htmlFor={id}
          text={label}
          display={display}
          required={required}
        />
      )
    );
  }, [id, label, display, required]);

  const renderHelp = useMemo(() => {
    return help && <Help text={help} type={helpType} />;
  }, [help, helpType]);

  const renderIconBtn = useMemo(() => {
    if (useCamera && !navigator.userAgent.toLowerCase().includes('mobile'))
      return 'fas fa-camera';
    return 'fas fa-file-upload';
  }, [useCamera, navigator.userAgent]);

  return (
    <div
      data-display={display}
      className={styles.container}
      data-label={label ? 'on' : 'off'}
      data-col={typeof col === 'function' ? col(id) : col}
    >
      <input
        {...rest}
        id={id}
        value=""
        type="file"
        multiple={multiple}
        onChange={handleChange}
      />
      {renderLabel}
      <div className={styles.content}>
        <label htmlFor={id}>{renderValueSelected}</label>
        <button
          type="button"
          onClick={
            !useCamera || navigator.userAgent.toLowerCase().includes('mobile')
              ? selectFile
              : openCamera
          }
        >
          <i className={renderIconBtn} />
        </button>
      </div>
      {renderHelp}
    </div>
  );
}

InputFile.defaultProps = {
  col: 16,
  help: '',
  label: '',
  multiple: false,
  useCamera: false,
  display: 'vertical',
  placeholder: language['component.inputfile.placeholder'],
};

InputFile.propTypes = {
  help: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  useCamera: PropTypes.bool,
  helpType: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  display: PropTypes.oneOf(['vertical', 'horizontal']),
  col: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
};

export default InputFile;
