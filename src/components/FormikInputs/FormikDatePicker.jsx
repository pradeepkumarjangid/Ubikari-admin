import React from "react";
import { DatePicker } from "antd";
import { useField } from "formik";
import dayjs from "dayjs"; // import dayjs

const FormikDatePicker = ({ name, placeholder, ...props }) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (date, dateString) => {
    helpers.setValue(date); // store as string in Formik
  };

  // Convert string to dayjs object for AntD
  const value = field.value ? dayjs(field.value) : null;

  return (
    <div>
      <DatePicker
        {...props}
        placeholder={placeholder}
        value={value}
        format={'DD/MM/YYYY'}
        onChange={handleChange}
        style={{ width: "100%" }}
      />
      {meta.touched && meta.error && (
        <div style={{ color: "red", marginTop: 4 }}>{meta.error}</div>
      )}
    </div>
  );
};

export default FormikDatePicker;
