const add = function(a, b) {
	return a + b;
};

const subtract = function(a, b) {
	return a - b;
};


const multiply = function(a, b) {
    return a * b;
};

const divide = function(a ,b) {
	return a / b;
};

const operate = function(operator, a, b) {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      return null;
  };
};

document.addEventListener("DOMContentLoaded", () => { // wait for DOM to load
    
    // Elements
    const displayEl = document.querySelector(".display");
    const digitButtons = document.querySelectorAll("[data-action='digit']");
    const operatorButtons = document.querySelectorAll("[data-action='operator']");
    const clearButton = document.querySelector("[data-action='clear']");
    const equalsButton = document.querySelector("[data-action='equals']");
    const backspaceButton = document.querySelector("[data-action='backspace']");

    // State
    let currentDisplay = displayEl.textContent || "0"; // string representation for easy appending
    let firstOperand = null;                           // number or null
    let operator = null;                               // string like "+", "-", "*", "/"
    let waitingForSecondOperand = false;               // true after operator chosen

    // Helper: render display text (keeps HTML in sync)
    function renderDisplay() {
        displayEl.textContent = currentDisplay;
    }

    // Helper: format numbers to avoid long floating point tails
    function formatResult(number) {
        // limit to 12 decimal places then remove trailing zeros
        if (!isFinite(number)) return String(number); // "Infinity" or "NaN"
        const rounded = parseFloat(number.toFixed(12));
        return String(rounded);
    }

    // Initialize
    renderDisplay();

    // DIGITS
    digitButtons.forEach(button => {
        button.addEventListener("click", () => {
            const digit = button.getAttribute("data-value");

            // If we've just selected an operator, the next digit starts the second operand:
            if (waitingForSecondOperand) {
                // If user clicks '.' first for the second number, start "0."
                currentDisplay = (digit === ".") ? "0." : digit;
                waitingForSecondOperand = false;
                renderDisplay();
                return;
            }

            // Prevent multiple decimals in the same number
            if (digit === "." && currentDisplay.includes(".")) return;

            // If display is "0" and you press a non-dot digit, replace it
            if (currentDisplay === "0" && digit !== ".") {
                currentDisplay = digit;
            } else {
                // Optional length guard to avoid overflow
                const MAX_LEN = 18;
                if (currentDisplay.length < MAX_LEN) currentDisplay += digit;
            }

            renderDisplay();
        });
    });

    // OPERATORS
    operatorButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedOperator = button.getAttribute("data-value");

            // If there is already an operator selected and we're still waiting for the second operand,
            // allow the user to change the operator (e.g., pressing + then -)
            if (operator && waitingForSecondOperand) {
                operator = selectedOperator; // just swap operator
                return;
            }

            const inputValue = parseFloat(currentDisplay);

            // If firstOperand is null, store it
            if (firstOperand === null) {
                firstOperand = inputValue;
            } else if (operator) {
                // If there's an existing operator, perform the pending calculation first
                const result = operate(operator, firstOperand, inputValue);

                // Handle division by zero or other invalid results
                if (!isFinite(result)) {
                    // reset everything and show an error
                    currentDisplay = "ERROR";
                    firstOperand = null;
                    operator = null;
                    waitingForSecondOperand = false;
                    renderDisplay();
                    return;
                }

                // Store the result as firstOperand and display it
                firstOperand = result;
                currentDisplay = formatResult(result);
                renderDisplay();
            }

            // Now set the operator and prepare to accept the second operand
            operator = selectedOperator;
            waitingForSecondOperand = true;
        });
    });

    // EQUALS
    equalsButton.addEventListener("click", () => {
        // If there is no operator, nothing to do
        if (!operator || firstOperand === null) return;

        const secondOperand = parseFloat(currentDisplay);
        const result = operate(operator, firstOperand, secondOperand);

        if (!isFinite(result)) {
            // e.g. division by zero -> show error and reset
            currentDisplay = "ERROR";
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            renderDisplay();
            return;
        }

        // Show result, and set up state so user can continue from the result
        currentDisplay = formatResult(result);
        renderDisplay();

        // Treat result as firstOperand for possible chained operations
        firstOperand = result;
        operator = null;
        waitingForSecondOperand = true; // next digit will start a new number (replace display)
    });

    // CLEAR
    clearButton.addEventListener("click", () => {
        currentDisplay = "0";
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        renderDisplay();
    });

    // BACKSPACE
    backspaceButton.addEventListener("click", () => {
        // If waiting for second operand after operator, reset display to "0"
        if (waitingForSecondOperand) {
            waitingForSecondOperand = false;
            currentDisplay = "0";
            renderDisplay();
            return;
        }

        // Remove last character from currentDisplay string
        if (currentDisplay.length > 1) {
            currentDisplay = currentDisplay.slice(0, -1);
        } else {
            // If only one character left, reset to "0"
            currentDisplay = "0";
        }
        renderDisplay();
    });
});