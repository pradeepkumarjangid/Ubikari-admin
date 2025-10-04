import { useField } from "formik";
import { useState } from "react";

const TextInput = ({ label, readOnly, ...props }) => {
  const [field, meta] = useField(props);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <div className="relative w-full">
        <input
          {...field}
          {...props}
          type="text"
          id={props.id || props.name}
          readOnly={readOnly}
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            field.onBlur(e);
          }}
          className={`peer block w-full px-3 pt-4 pb-1 text-sm border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10
            ${meta.touched && meta.error ? "border-red-500" : "border-gray-300"}
            ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          `}
        />
        <label
          htmlFor={props.id || props.name}
          className={`absolute left-3 text-gray-500 text-sm transition-all duration-200 pointer-events-none
            ${isFocused || field.value ? "-top-1 text-xs bg-white px-1" : "top-2.5"}
            ${isFocused ? "text-blue-600" : ""}
          `}
        >
          {label}
        </label>
      </div>
      {meta.touched && meta.error && (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      )}
    </>
  );
};

export default TextInput;
