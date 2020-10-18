import React, { useState, useEffect } from "react";
import worker_script from "../WebWorker/worker";
import { calculatorJSON } from "../Data/CalculationJSON";
import "../Components/Calculator.css";
const myStorage = window.sessionStorage;

const actionType = {
  CLEAR: "input actionButton",
  BACK: "input actionButton",
  ACTION: "input actionButton",
  PERCENT: "input actionButton",
  DECIMAL: "input actionButton",
  NUMBER: "input",
  RESULT: "input Result",
};

export default function Calculator() {
  const [input, setInput] = useState("");
  const [operator, setOperator] = useState(false);
  const [worker] = useState(new Worker(worker_script));
  const [result, setResult] = useState("");

  const writeData = (String) => {
    myStorage.setItem("CalculatedValue", String + "");
    worker.postMessage({
      type: "SAVE",
      data: String,
    });
  };

  //Write Back to worker

  useEffect(() => {
    if (window.Worker) {
      worker.postMessage({
        type: "SAVE",
        data: sessionStorage.getItem("CalculatedValue"),
      });
    }
  }, [sessionStorage.getItem("CalculatedValue")]);

  //Retrieve inputs on re-load

  useEffect(() => {
    if (window.Worker) {
      worker.onmessage = (m) => {
        if (result != m.data) setResult(m.data);
      };
    }
  }, []);

  //Receiving the calculated Value from the Worker

  const handleClick = (element) => {
    const { type } = element;
    let { display } = element;
    switch (type) {
      case "RESULT":
        writeData(input);
        break;
      case "BACK":
        if (input) {
          setInput(`${input.substr(0, input.length - 1)}`);
          break;
        }
      case "CLEAR":
        setInput("");
        setOperator(false);
        writeData("");
        break;
      default:
        if (type == "PERCENT") {
          setOperator(true);
          setInput(`${input}${display}`);
          break;
        }
        if (operator && type == "NUMBER") {
          display = `*${display}`;
          setOperator(false);
        } else {
          setOperator(false);
        }
        setInput(`${input}${display}`);
        break;
    }
  };

  //Trigger Action

  const calculator = calculatorJSON.map((element, index) => {
    const currentRow = element.map((currentElement, cellIndex) => {
      return (
        <div
          key={`cell-index${cellIndex}`}
          onClick={() => handleClick(currentElement)}
          className={actionType[currentElement.type]}
        >
          {currentElement.display}
        </div>
      );
    });
    return (
      <div key={`row-index${index}`} className="row">
        {currentRow}
      </div>
    );
  });

  return (
    <>
      <div className="display">
        <div className="displayChild">
          {result ? sessionStorage.getItem("CalculatedValue") : input}
        </div>
        <div className="displayChild">{result}</div>
      </div>
      <div className="calculatorDisplay">{calculator}</div>
    </>
  );
}
