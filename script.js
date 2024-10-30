const errorMessages = {
  valueMissing: () => "Заполните это поле",
  patternMismatch: ({ title }) => title || "Данные не соответствуют формату",
  tooShort: ({ minLength }) =>
    `Слишком короткое значение, минимальное количество символов — ${minLength}`,
  tooLong: ({ maxLength }) =>
    `Слишком длинное значение, максимальное количество символов — ${maxLength}`,
};

function onBlur(e) {
  const { target } = e;
  const isFormField = target.closest("[data-js-form]");
  const isRequired = target.required;

  if (isFormField && isRequired) {
    validateField(target);
  }
}

//функция по валидации форму
function validateField(fieldControlElement) {
  const errors = fieldControlElement.validity;
  const errorInfo = [];

  Object.entries(errorMessages).forEach(([errorType, getErrorMessage]) => {
    if (errors[errorType]) {
      errorInfo.push(getErrorMessage(fieldControlElement));
    }
  });

  manageErrors(fieldControlElement, errorInfo);

  let isValid = errorMessages.length === 0;

  fieldControlElement.ariaInvalid = !isValid;

  return isValid;
}

// генерация ошибков в form
function manageErrors(fieldControlElement, errorMessages) {
  const fieldErrorsElement = fieldControlElement.parentElement.querySelector(
    "[data-js-form-errors]"
  );

  console.log("fieldErrorsElement", fieldErrorsElement);

  fieldErrorsElement.innerHTML = errorMessages
    .map((error) => `<div class="field__error">${error}</div>`)
    .join("");
}

// Функция изменения статуса checked по radio & checkbox
function onChange(e) {
  const { target } = e;
  const isRequired = target.required;
  const isToggleType = ["radio", "checkbox"].includes(target.type);

  if (isToggleType && isRequired) {
    validateField(target);
  }
}

//функция проверки заполненных полей и возможности отправки формы
function onSubmit(e) {
  const isFormElement = e.target.matches("[data-js-form]");

  if (!isFormElement) {
    return;
  }

  const requiredControlElements = [...e.target.elements].filter(
    ({ required }) => required
  );

  let isFormValid = true;
  let firstInvalidFieldControl = null;

  requiredControlElements.forEach((element) => {
    let isFieldValid = validateField(element);

    if (!isFieldValid) {
      isFormValid = false;

      if (!firstInvalidFieldControl) {
        firstInvalidFieldControl = element;
      }
    }
  });

  if (!isFormValid) {
    e.preventDefault();
    firstInvalidFieldControl.focus();
  }
}

// Прослушка событий
document.addEventListener(
  "blur",
  function (e) {
    onBlur(e);
  },
  { capture: true }
);

document.addEventListener("change", (e) => {
  onChange(e);
});

document.addEventListener("submit", (e) => {
  onSubmit(e);
});
