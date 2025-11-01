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

const display = document.querySelector('#display');
const digitButtons = document.querySelectorAll('[data-action="digit"]');

let currentDisplay = '1234'; // Default display value for testing

display.textContent = currentDisplay; // Update the display with the current value

// Add event listeners to digit buttons
digitButtons.forEach(button => {
  button.addEventListener("click", () => {
    const digit = button.getAttribute("data-value");
    currentDisplay += digit;
    display.textContent = currentDisplay;
  });
});
