import React from "react";
import "./Botao.css";

const isOperator = val => {
  return !isNaN(val) || val === ".";
};

export const Botao = props => (
  <div
    className={`button-wrapper ${
      isOperator(props.children) ? null : "operator"
    }`}
    onClick={() => props.handleClick(props.children)}
  >
    {props.children}
  </div>
);
