import React from "react";
import ReturnValue from "./ReturnValue";

const FunctionEvents = ({ events }) => (
  <section>
    <header>
      <h5>Events:</h5>
    </header>
    {events.map(({ logIndex, ...rest }, key) => (
      <FunctionEvent key={logIndex} {...rest} />
    ))}
  </section>
);

const FunctionEvent = ({ event, attrs }) => (
  <article>
    <header>{event}</header>
    <table cols={1}>
      <tbody>
        {Object.keys(attrs).map(k => (
          <tr key={k}>
            <td>
              {k}: <ReturnValue type={attrs[k].type} value={attrs[k].value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </article>
);

export default FunctionEvents;
