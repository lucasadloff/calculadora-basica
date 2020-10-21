import React from "react";
import "./BotaoApagar.css";

export const BotaoApagar = props => (
  <div className="botao-apagar" onClick={() => props.handleClick(props.children)}>
    {props.children}
  </div>
);
