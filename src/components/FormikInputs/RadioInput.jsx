import { useField } from "formik";

const RadioInput = ({ label, name, options }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="mb-3">
      <label className="form-label d-block">{label}</label>
      <div className="d-flex gap-3">
        {options.map((option) => (
          <label key={option.value} className="form-check-label">
            <input
              type="radio"
              {...field}
              value={option.value}
              checked={field.value === option.value}
              className={`form-check-input ${
                meta.touched && meta.error ? "is-invalid" : ""
              }`}
              style={{ marginRight: "5px" }}
            />
            {option.label}
          </label>
        ))}
      </div>
      {meta.touched && meta.error ? (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export default RadioInput;
