
import React, { useState } from "react";
import { useField } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap import

const PasswordInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="mb-3 w-100 position-relative">
      {/* Floating label container */}
      <div className="form-floating w-100">
        <input
          {...field}
          {...props}
          type={showPassword ? "text" : "password"}
          className={`form-control py-1 ${
            meta.touched && meta.error ? "is-invalid" : ""
          }`}
          style={{height:'40px'}}
          id={props.id || props.name}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            field.onBlur(e);
          }}
        />
        <label
          htmlFor={props.id || props.name}
          className={`position-absolute bg-white px-1 py-0 transition`}
          style={{
            left: "12px",
            top: isFocused || field.value ? "-8px" : "50%",
            transform:
              isFocused || field.value ? "translateY(0)" : "translateY(-50%)",
            fontSize: isFocused || field.value ? "12px" : "14px",
            color: isFocused ? "#0d6efd" : "#6c757d",
            pointerEvents: "none",
            transition: "all 0.2s ease-in-out",
            height:'20px'
          }}
        >
          {label}
        </label>
      </div>

      {/* Eye icon button */}
      <div
        // type="button"
        className="btn btn-link  position-absolute top-0 end-0 text-decoration-none"
        style={{position:'absolute',marginRight: "10px"}}
        onClick={() => setShowPassword(!showPassword)}
        // style={{ marginRight: "10px" }}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </div>
      

      {/* Error message */}
      {meta.touched && meta.error && (
        <div className="invalid-feedback d-block">{meta.error}</div>
      )}
    </div>
  );
};

export default PasswordInput;
