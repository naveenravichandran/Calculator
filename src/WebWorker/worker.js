const workercode = () => {
  const self = this;
  self.onmessage = (e) => {
    if (e.data.type === "SAVE") {
      const { data } = e.data;

      const stack = data.split("%");
      /**
       * Need to write a alternate Algorithm for module fu
       * To-Do List
       */

      let initialValue;

      stack.forEach((currentString, index) => {
        if (initialValue == undefined) {
          initialValue = new Function("return " + currentString)();
        } else {
          const operator = currentString.substring(0, 1);
          const nextValue = new Function(
            "return " + currentString.substring(1)
          )();
          initialValue = new Function(
            "return " +
              `${parseFloat(initialValue) / 100}${operator}${nextValue}`
          )();
        }
      });

      self.postMessage(initialValue);
    }
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
