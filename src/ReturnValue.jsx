import React, { useState, useMemo } from "react";

const ReturnValue = ({ type, value }) => {
  const [formatValue, setFormatValue] = useState(true);

  const isNumeric = useMemo(
    () => type.startsWith("int") || type.startsWith("uint"),
    [type]
  );
  const isString = useMemo(() => type === "string", [type]);

  let displayValue;
  if (isNumeric) {
    const numericValue = parseInt(value);
    displayValue = formatValue
      ? numericValue.toLocaleString()
      : numericValue.toString();
  } else if (isString) {
    displayValue = `"${value}"`;
  } else {
    displayValue = value || "<undefined>";
  }

  return (
    <>
      {value && displayValue} ({type})
      {value && isNumeric && (
        <span>
          &nbsp;
          <label>
            <input
              type="checkbox"
              onChange={() => setFormatValue(!formatValue)}
              checked={formatValue}
            />
            &nbsp;Format value
          </label>
        </span>
      )}
    </>
  );
};

export default ReturnValue;
