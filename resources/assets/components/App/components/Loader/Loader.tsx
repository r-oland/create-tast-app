import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './Loader.module.scss';

export default function Loader() {
  return (
    <div styleName="loading-overlay">
      <FontAwesomeIcon icon={faSpinnerThird} spin size="4x" />
    </div>
  );
}
