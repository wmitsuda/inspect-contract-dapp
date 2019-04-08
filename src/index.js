import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";

const erc20Contract = {
  address: "0xD7758b318edd7aD12A2A0142C56c335be1607A79"
};

const demoContract = {
  address: "0xbae733b606788f169199D24c69bdC95a2dd9a500"
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
