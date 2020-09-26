class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.updateDisplay();
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.previousOperand = '';
    this.currentOperand = '0';
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
      return;
    }
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (this.currentOperandTextElement.innerText.includes('.') && number === '.') return;
    if (this.readyToReset || this.currentOperand === 0) {
      this.currentOperand = `${number}`;
      this.readyToReset = false;
      return;
    }

    if (this.currentOperand === '0' && number != '.' && this.currentOperand !== '0.') {
      this.currentOperand = `${number}`;
      return;
    } else if ((this.currentOperand == 'NaN' || this.readyToReset) && this.currentOperand !== '0.' && this.currentOperand != 0) {
      this.clear();
      this.currentOperand = `${number}`
      this.readyToReset = false;
      return;
    } else {
      this.currentOperand = `${this.currentOperand}${number}`;
    }
  }

  chooseOperation(operation) {
    debugger;
    if (this.previousOperand !== '' && this.operation != undefined && this.currentOperand == '') {
      this.operation = operation;
      this.updateDisplay();
      return;
    } else if (this.previousOperand !== '') {
      this.compute();
      this.readyToReset = false;
    }
    if (this.currentOperand == '0' && operation == '-') {
      this.currentOperand = '-'
      return;
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let calculation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch(this.operation) {
      case '+':
        calculation = prev + current;
        break
      case '-':
        calculation = prev - current;
        break
      case '*':
        calculation = prev * current;
        break
      case '÷':
        calculation = prev / current;
        break
      case '^':
        calculation = prev ** current;
        break
      default:
        return;
    }
    this.previousOperand = '';
    calculation = Math.round(calculation*100000000)/100000000;
    this.currentOperand = calculation.toString();
    this.operation = undefined;
    this.readyToReset = true;
  }

  withMinus() {
    if (this.currentOperand == '') return;
    this.currentOperand = -this.currentOperand;
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.currentOperand;
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = 
        `${this.previousOperand}${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
  updateCurrentDisplay() {
    this.currentOperandTextElement.innerText = this.currentOperand;
  }

  sqrtRoot() {
    if (this.currentOperand < 0) {
      this.currentOperand = 'Ошибочка!'
      return;
    }
    if (this.currentOperand == '') {
      this.currentOperand = NaN;
      this.readyToReset = true;
      return;
    }
    this.currentOperand = Math.sqrt(+this.currentOperand);
    this.readyToReset = true;
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const minusButton = document.querySelector('[data-withminus]');
const sqrtButton = document.querySelector('[data-sqrtroot]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach( button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateCurrentDisplay();
  })
})

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
})

operationButtons.forEach( button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
})

minusButton.addEventListener('click', () => {
  calculator.withMinus();
  calculator.updateCurrentDisplay();
})

sqrtButton.addEventListener('click', () => {
  calculator.sqrtRoot();
  calculator.updateDisplay();
})