import React, { Component } from 'react';
import './App.css';
import {Botao} from './componentes/Botao';
import {Input} from './componentes/Input';
import {BotaoApagar} from './componentes/BotaoApagar';
import {Display} from './componentes/Display';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "", //variável do display superior, o qual será chamado de "display" no resto do arquivo.
      input: "0", //variável do display inferior, que também funciona como input, o qual será chamado de "input" no resto do arquivo.
      clear_cont: 0 //variaável utilizada para o botão de apagar -> 1 clique apaga apenas o display inferior e preserva a operação anterior.
    }                                                         // -> 2 cliques apagam ambos os displays.
  }

  addToInput = val => {                 //método utilizado para adicionar valores numéricos ao input.
    if (this.state.input === "0"){  //condição para substituir o valor do input, se ele conter apenas 0.
      this.setState({input: val})
    }
    else if (this.state.display.includes("=")) { //caso o display contenha "=" (final de operação) e outro número for adicionado, altera o input e apaga o display.
      this.setState({display: "", input: this.state.input + val});
    }
    else {   //para outros casos, o valor do imput passa a ser seu estado anterior + o valor numérico digitado.
      this.setState({input: this.state.input + val});
    }
  }

  addOperator = val => {     //método utilizado para tratar do pressionamento de botões de operação.
    var oper_disp = this.state.display;
    if (oper_disp === "") {
      this.setState({display: this.state.input + val, input:"0"});
    } 
    else if (((oper_disp.includes("÷")) || (oper_disp.includes("×")) || (oper_disp.includes("-")) || (oper_disp.includes("+"))) && (!(oper_disp.includes('=')))) {
      if (this.state.input === "0"){ //condição para trocar a operação ao se pressionar outro botão de operação com input 0. Gera limitação discutida no relatório.
        if (oper_disp.includes("÷")){
          var operator = "÷";
        } 
        else if (oper_disp.includes("×")) {
          var operator = "×";
        } 
        else if (oper_disp.includes("+")) {
          var operator = "+";
        }
        else if ((oper_disp.charAt(0) !== "-") && (oper_disp.includes("-"))) { //apenas para primeiro termo positivo.
          var operator = "-";
        }
        else if (oper_disp.charAt(0) === "-") { //condição necessária para operações de subtração cujo primeiro número é negativo.
          var oper_disp = "-" + oper_disp.split("-")[1];
          var operator = "nosplit";
        }
        var ant_op = oper_disp.split(operator)[0];
        this.setState({display: ant_op + val});
      } 
      else { //ao apertar outro botão de operação em vez do botão "=" após uma operação, realiza a operação parcial e prossegue com a conta.
          var parcial_operation = this.state.display + this.state.input;
          var parcial_result = this.handleOperation(parcial_operation)[0];
          this.setState({display: parcial_result + val, input: "0"});
      }
    } //caso o display mostre uma operação finalizada por "=", copia o resultado para o primeiro termo na nova operação, sem perder o valor caso input === "0".
    else if (oper_disp.includes('=')){
      var new_oper = oper_disp.split('=')[0];
      var result = this.handleOperation(new_oper)[0];
      this.setState({display: result + val, input: "0"})
    } 
    else { //apesar de, em uso normal, essa condição nunca ser ativada (display diferente de "" e sem: "+", "-", "×", "÷"), fica como garantia para casos não previstos.
      this.setState({display: this.state.input + val, input: "0"})
    }
  }

  addDot = val => { //trata da inclusão do separador decimal esolhido, ".".
    if (this.state.input === "") { //apesar de, em funcionamento normal, o input nunca ser vazio, fica como garantia para casos não previstos.
      this.setState({input: "0."})
    }
    else if (this.state.input.includes(".")){ //ao tentar adicionar "." sendo que já há "." no número, nada ocorre (número formatado com apenas um separador decimal).
      this.setState({input: this.state.input});
    } 
    else {  //em outros casos, adiciona "." ao input.
      this.setState({input: this.state.input + val});
    }
  }

  handleOperation(val) { // Realiza as operações. Os resultados são formatados para o formato em inglês, com "." como separador decimal e "," a cada 3 dígitos inteiros.
    var val1 = val.replace(/,/g,""); //remove todas as possíveis "," das strings de operação.
    var ends_in_op = false; //valor usado para o método "operIgual", (não utilizado em funcionamento normal, fica como garantia para casos não previstos.).
    var val1_lenght = val1.length;
    if (val1.includes("÷") || val1.includes("×") || val1.includes("-") || val1.includes("+")) {
      if (val.charAt(0) === "-") { //trata do caso no qual o primeiro termo da operação é negativo.
        var new_val = val1.substr(1, val1_lenght - 1);
        if (new_val.includes("÷")){
          var oper = "÷"
        } 
        else if (new_val.includes("×")) {
          var oper = "×"
        } 
        else if (new_val.includes("-")) {
          var oper = "-"
        } 
        else if (new_val.includes("+")) {
          var oper = "+"
        } 
        else {
          var oper = "nosplit";
        }
        var firstOp_str = "-" + new_val.split(oper)[0];
        if (oper === "nosplit") {
          var secondOp_str = "";
        }
        else {
          var secondOp_str = new_val.split(oper)[1];
        }
      }
      else {
        var new_val = val1;
        if (new_val.includes("÷")){
          var oper = "÷"
        } 
        else if (new_val.includes("×")) {
          var oper = "×"
        } 
        else if (new_val.includes("-")) {
          var oper = "-"
        } 
        else if (new_val.includes("+")) {
          var oper = "+"
        } 
        var firstOp_str = new_val.split(oper)[0];
        var secondOp_str = new_val.split(oper)[1];
      }
      if (secondOp_str !== "") { //não utilizado em funcionamento normal, fica como garantia para casos não previstos.
        var firstOp = Number(firstOp_str);
        var secondOp = Number(secondOp_str);
        if (new_val.includes("÷")) {
          if (secondOp !== 0){
            var result_number = firstOp / secondOp;
          } 
          else {
            return ([NaN, ends_in_op])
          }
        } 
        else if (new_val.includes("×")) {
          var result_number = firstOp * secondOp;
        } 
        else if (new_val.includes("-")) {
          var result_number = firstOp - secondOp;
        } 
        else if (new_val.includes("+")) {
          var result_number = firstOp + secondOp;
        }
      } 
      else {
        var firstOp = Number(firstOp_str);
        var result_number = firstOp;
        var ends_in_op = true;
      }
      var result_str = result_number.toLocaleString('en', {maximumFractionDigits: 14}); //formata a resposta com 14 casas decimais e na formatação da língua inglesa.
      if (result_str === "-0"){
        var result_op_str = "0";
      }
      else {
        var result_op_str = result_str;
      }
      return ([result_op_str, ends_in_op])
    } 
    else {
      return ([val1, ends_in_op])
    }
  }

  operIgual() { //trata do pressionamento do botão de igual
      if ((this.state.input === "0") && (this.state.display === "")) { //condição para economizar processamento ao pressionar "=", com input: "0" e display: "".
        this.setState({display: "0=", input: "0"})
      }
      else if (this.state.display.includes("=")){ //operação (ou número) no display é igual ao valor em  input -> pressionar igual -> mostra "input = input".
        this.setState({display: this.state.input + "="});
      } 
      else { //em casos gerais, realiza a operação e retorna o valor resultante.
        var operation_str = this.state.display + this.state.input;
        var [result_str, is_end_op] = this.handleOperation(operation_str);
        if (is_end_op) { //em funcionamento normal, isso não ocorre pois input nunca é === "", ficando como garantia para casos não previstos.).
          this.setState({display: result_str + "=", input: result_str});
        } 
        else {
          this.setState({display: operation_str + "=", input: result_str});
        }
      }
    }

  handleClear() { //Trata do botão de apagar conteúdo. Pressionar AC 1 vez -> apaga input. Pressionar AC uma segunda vez, com input === "0", também apaga display.
    if ((this.state.input === "0") && (this.state.clear_cont === 1)) {
      this.setState({input: "0", clear_cont: 0, display: ""});
    }
    else {
      this.setState({input: "0", clear_cont: 1});
    }
  }

  render(){ //monta layout da calculadora
  return (
    <div className="App">
      <div className="calc-wrapper">
        <Display input={this.state.display}/>
        <Input input={this.state.input}/>
        <div className="row">
          <BotaoApagar handleClick={() => this.handleClear()}>AC</BotaoApagar>
        </div>
        <div className="row">
          <Botao handleClick={this.addToInput}>8</Botao>
          <Botao handleClick={this.addToInput}>7</Botao>
          <Botao handleClick={this.addToInput}>9</Botao>
          <Botao handleClick={this.addOperator}>÷</Botao>
        </div>
        <div className="row">
          <Botao handleClick={this.addToInput}>4</Botao>
          <Botao handleClick={this.addToInput}>5</Botao>
          <Botao handleClick={this.addToInput}>6</Botao>
          <Botao handleClick={this.addOperator}>×</Botao>
        </div>
        <div className="row">
          <Botao handleClick={this.addToInput}>1</Botao>
          <Botao handleClick={this.addToInput}>2</Botao>
          <Botao handleClick={this.addToInput}>3</Botao>
          <Botao handleClick={this.addOperator}>-</Botao>
        </div>
        <div className="row">
          <Botao handleClick={this.addToInput}>0</Botao>
          <Botao handleClick={this.addDot}>.</Botao>
          <Botao handleClick={() => this.operIgual()}>=</Botao>
          <Botao handleClick={this.addOperator}>+</Botao>
        </div>
      </div>
    </div>
  );
  }
}

export default App;
