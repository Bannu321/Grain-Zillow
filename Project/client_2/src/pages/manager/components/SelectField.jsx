import React from "react";

export default function SelectField({
  value,
  onChange,
  options,
  placeholder,
  selectStyle = {},
  containerStyle = {},
}) {
  const defaultSelectStyle = {
    flexGrow: 1,
    padding: 12,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
    marginBottom: 8,
    width: "100%",
  };

  return (
    <div style={containerStyle}>
      <select
        style={{ ...defaultSelectStyle, ...selectStyle }}
        value={value}
        onChange={onChange}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
