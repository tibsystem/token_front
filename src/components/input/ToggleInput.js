import React from 'react';

const ToggleInput = ({ onLabel, offLabel, onIcon, offIcon, checked, onChange }) => {
  const handleClick = () => {
    if (onChange) {
      onChange({ value: !checked });
    }
  };

  return (
    <button
      type="button"
      className={`toggle-input${checked ? ' checked' : ''} toggle-button`}
      onClick={handleClick}
      aria-pressed={checked}
    >
      <span className="toggle-icon">
        <i className={checked ? onIcon : offIcon} />
      </span>
      <span className="toggle-label">
        {checked ? onLabel : offLabel}
      </span>
    </button>
  );
};


export default ToggleInput;


