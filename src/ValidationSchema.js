import * as Yup from "yup";

const createValidationSchema = (inputs, web3) => {
  const bytesSchema = size => {
    return Yup.string()
      .required("Value is required")
      .test("isHex", "Enter a valid hex string", value =>
        web3.utils.isHexStrict(value)
      )
      .test(
        "isHexSize",
        `Byte array must be of size ${size}`,
        value => value && value.length === size * 2 + 2
      );
  };

  const typesSchema = {
    string: Yup.string().required("Value is required"),
    bool: Yup.boolean().required("Must select a value"),
    uint: Yup.string()
      .required("Value is required")
      .matches(/^\s*[\d]+\s*$/, "Not an unsigned numeric value"),
    int: Yup.string()
      .required("Value is required")
      .matches(/^\s*[-+]?[\d]+\s*$/, "Not a signed numeric value"),
    address: Yup.string()
      .required("Value is required")
      .test("isEthAddress", "Enter a valid ETH address", value =>
        web3.utils.isAddress(value)
      )
  };

  const normalizeType = input => {
    const { name, type } = input;
    let typeSchema;

    if (type === "string" || type === "bool" || type === "address") {
      typeSchema = typesSchema[type];
    } else if (type.startsWith("uint")) {
      typeSchema = typesSchema["uint"];
    } else if (type.startsWith("int")) {
      typeSchema = typesSchema["int"];
    } else if (type.startsWith("bytes")) {
      const size = parseInt(input.type.substr(5));
      typeSchema = bytesSchema(size);
    }

    return {
      name,
      typeSchema
    };
  };

  const shape = inputs
    .map(normalizeType)
    .reduce(
      (o, input) => Object.assign(o, { [input.name]: input.typeSchema }),
      {}
    );
  return Yup.object().shape(shape);
};

export { createValidationSchema };
