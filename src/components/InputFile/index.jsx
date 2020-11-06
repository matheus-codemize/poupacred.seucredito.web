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
  display,
  required,
  disabled,
  multiple,
  helpType,
  onChange,
  useCamera,
  placeholder,
  value: valueProps,

  col, // to width
  ...rest
}) {
  const [value, setValue] = useState(multiple ? [] : null);

  useEffect(() => {
    if (typeof onChange === 'function' && (multiple ? value.length : value)) {
      onChange({ target: { id, value } });
    }
  }, [value]);

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
            .filter(key => !isNaN(parseInt(key)))
            .map(async key => ({
              isFile: true,
              name: files[key].name,
              data: await fileToBase64(files[key]),
            })),
        )
      : {
          isFile: true,
          name: files[0].name,
          data: await fileToBase64(files[0]),
        };

    setValue(valueSelected);
  }

  function selectFile() {
    $(`#${id}`).click();
  }

  function openCamera() {}

  const renderValueSelected = useMemo(() => {
    const valueSelected = value || valueProps;

    if (valueSelected) {
      return multiple
        ? `${valueSelected.length} arquivo(s) selecionado(s)`
        : valueSelected.name;
    }

    return placeholder;
  }, [value, multiple, placeholder, valueProps]);

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
};

export default InputFile;
