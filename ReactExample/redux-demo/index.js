import React from "react";
import ReactDOM from "react-dom";
// import App from "./App";
import reportWebVitals from "../reportWebVitals";
import ReduxTest from './reduxTest' 

ReactDOM.render(
  // <React.StrictMode>
  // <div>
  //   <p>
  //     <b><App/></b><a>9</a>
  //   </p>
  //   <span>222</span>
  // </div>,
  <ReduxTest/>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
