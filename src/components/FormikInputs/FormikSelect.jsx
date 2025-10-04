import React from "react";
import { Select } from "antd";
import { useField } from "formik";

const { Option } = Select;

const FormikSelect = ({ name, options, placeholder, ...props }) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (value) => {
    helpers.setValue(value);
  };

  return (
    <div>
      <Select
        {...props}
        placeholder={placeholder}
        value={field.value}
        onChange={handleChange}
        style={{ width: "100%", height: 38, borderRadius: 4 }} // similar to bootstrap input
        size="middle"
      >
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
      {meta.touched && meta.error ? (
        <div style={{ color: "red", marginTop: 4 }}>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormikSelect;
