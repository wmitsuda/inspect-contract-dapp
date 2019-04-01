import React from "react";
import ReturnValue from "./ReturnValue";

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

const FunctionOutput = ({ processing, index, output, returnValue }) => (
  <div>
    Output #{index}: {output.name}
    {processing ? (
      <ReturnValue type="string" value="<processing...>" />
    ) : (
      <ReturnValue type={output.type} value={returnValue} />
    )}
  </div>
);

export default FunctionOutputs;
