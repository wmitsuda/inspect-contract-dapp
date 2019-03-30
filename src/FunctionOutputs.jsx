import React, { useState } from "react";

const FunctionOutputs = ({ processing, outputs, returnValues }) => {
  return outputs.map((output, key) => (
    <FunctionOutput
      key={key}
      processing={processing}
      index={key}
      output={output}
      returnValue={returnValues && returnValues[key]}
    />
  ));
};

const FunctionOutput = ({ processing, index, output, returnValue }) => {
  const [formatValue, setFormatValue] = useState(true);

  const isNumeric =
    output.type.startsWith("int") || output.type.startsWith("uint");

  let value = "<undefined>";
  if (processing) {
    value = "<processing...>";
  } else if (returnValue) {
    if (isNumeric) {
      const numericValue = parseInt(returnValue);
      value = formatValue
        ? numericValue.toLocaleString()
        : numericValue.toString();
    } else {
      value = returnValue || "<undefined>";
    }
  }

  return (
    <div>
      Output #{index}: {output.name}
      {value} ({output.type})
      {returnValue && isNumeric && (
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
    </div>
  );
};

export default FunctionOutputs;
