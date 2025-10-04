import { useField, useFormikContext } from "formik";
import { useState } from "react";

const NumberInput = ({ label, maxLength, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext(); // direct access
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;
    // Sirf digits allow karo
    value = value.replace(/[^0-9]/g, "");
    // maxLength apply karo
    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    setFieldValue(field.name, value); // direct use
  };

  return (
    <>
      <div className="form-floating w-100">
        <input
          {...field}
          {...props}
          value={field.value || ""}
          type="text"
          inputMode="numeric"
          className={`form-control py-1 ${
            meta.touched && meta.error ? "is-invalid" : ""
          }`}
          style={{ height: "40px" }}
          id={props.id || props.name}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            field.onBlur(e);
          }}
          onChange={handleChange}
        />
        <label
          htmlFor={props.id || props.name}
          className="position-absolute bg-white px-1 py-0 transition"
          style={{
            left: "12px",
            top: isFocused || field.value ? "-8px" : "50%",
            transform:
              isFocused || field.value ? "translateY(0)" : "translateY(-50%)",
            fontSize: isFocused || field.value ? "12px" : "14px",
            color: isFocused ? "#0d6efd" : "#6c757d",
            pointerEvents: "none",
            transition: "all 0.2s ease-in-out",
            height: "20px",
          }}
        >
          {label}
        </label>
      </div>
      {meta.touched && meta.error ? (
        <div style={{ color: "red", marginTop: "5px", fontSize: "12px" }}>
          {meta.error}
        </div>
      ) : null}
    </>
  );
};

export default NumberInput;
