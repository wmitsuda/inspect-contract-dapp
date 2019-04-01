import React from "react";

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
              {k}: {attrs[k].value} ({attrs[k].type})
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </article>
);

export default FunctionEvents;
