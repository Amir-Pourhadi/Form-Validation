// Get all fields in form
const fields = document.querySelectorAll(".field");

// EventListener for form submit
document.querySelector("form.needs-validation").addEventListener("submit", validateForm);

// EventListener for toggle password visibility
document.querySelector("button#toggle-pass-btn").addEventListener("click", togglePasswordVisibility);

// Check form validation on Submit
function validateForm(event) {
  // Live Validation (On type)
  fields.forEach((fieldEl) => fieldEl.firstElementChild.addEventListener("input", () => validateField(fieldEl)));

  const data = {};
  const isEachFieldValid = [...fields].map((fieldEl) => {
    // Extract data from each field and fill data object
    data[fieldEl.firstElementChild.id] = fieldEl.firstElementChild.value;

    return validateField(fieldEl);
  });

  // Show Submitted data if all fields are valid, Otherwise do nothing
  if (isEachFieldValid.every((isFieldValid) => isFieldValid === true)) {
    const formattedPhoneNumber = libphonenumber.parsePhoneNumber(data["phone-number"]).formatNational();
    alert(
      `Welcome ${data["user-name"]}!\nYou are Successfully Signed Up!\n\nWrite Down your login Info...\nYour Email: ${data.email}\nYour Phone Number: ${formattedPhoneNumber}\nYour Password: ${data.password}`
    );
  } else event.preventDefault();
}

// Validate Each field
function validateField(fieldEl) {
  const inputEl = fieldEl.firstElementChild;
  const feedbackEl = fieldEl.parentElement.lastElementChild;

  // Call each function based on it's id
  let isValidField;
  switch (inputEl.getAttribute("id")) {
    case "user-name":
      isValidField = isValidUserName(fieldEl);
      break;
    case "email":
      isValidField = isValidEmail(fieldEl);
      break;
    case "phone-number":
      isValidField = isValidPhoneNumber(fieldEl);
      break;
    case "password":
      isValidField = isValidPassword(fieldEl);
      break;
  }

  // Remove Previous Classes if exist
  if (isValidField) {
    fieldEl.classList.remove("is-invalid");
    inputEl.classList.remove("is-invalid");
    feedbackEl.classList.remove("invalid-feedback");
  } else {
    fieldEl.classList.remove("is-valid");
    inputEl.classList.remove("is-valid");
    feedbackEl.classList.remove("valid-feedback");
  }

  return isValidField;
}

// Check UserName Validation
function isValidUserName(fieldEl) {
  const userNameValue = fieldEl.firstElementChild.value;

  if (userNameValue && userNameValue.length) {
    // Using RegExp to check validation
    const userNamePattern = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    const isValid = userNamePattern.test(userNameValue);

    if (isValid) showStatus({ fieldEl, isValid, message: "This UserName is Valid!" });
    else
      showStatus({
        fieldEl,
        isValid,
        message: "Invalid UserName! Choose another one! You can't use special characters!",
      });

    return isValid;
  } else showStatus({ fieldEl, isValid: false, message: "User Name is Required!" });

  return false;
}

// Check Email Validation
function isValidEmail(fieldEl) {
  const emailValue = fieldEl.firstElementChild.value;

  if (emailValue && emailValue.length) {
    const atSymbolIndex = emailValue.indexOf("@");
    const dotSymbolIndex = emailValue.lastIndexOf(".");
    const spaceSymbolIndex = emailValue.indexOf(" ");

    const hasValidLength = emailValue.length > dotSymbolIndex + 1 && dotSymbolIndex > atSymbolIndex + 1;
    const hasValidSymbols = atSymbolIndex > 0 && dotSymbolIndex > 0 && spaceSymbolIndex === -1;

    const isValid = hasValidLength && hasValidSymbols;

    if (isValid) showStatus({ fieldEl, isValid, message: "Email is Correct!" });
    else showStatus({ fieldEl, isValid, message: "Email is not Valid! Please Enter a Valid one!" });

    return isValid;
  } else showStatus({ fieldEl, isValid: false, message: "Email is Required!" });

  return false;
}

// Check Phone Number Validation
function isValidPhoneNumber(fieldEl) {
  const phoneNumberValue = fieldEl.firstElementChild.value;

  // Using Google Library to check validation
  if (phoneNumberValue && phoneNumberValue.length) {
    const isValid = libphonenumber.isValidPhoneNumber(phoneNumberValue, "IR");

    if (isValid) showStatus({ fieldEl, isValid, message: "Phone Number is Correct!" });
    else showStatus({ fieldEl, isValid, message: "Invalid Phone Number! Please Enter a Valid Iran Phone Number!" });

    return isValid;
  } else showStatus({ fieldEl, isValid: false, message: "Phone Number is Required!" });

  return false;
}

// Check Password Validation
function isValidPassword(fieldEl) {
  const passwordValue = fieldEl.firstElementChild.value;

  if (passwordValue && passwordValue.length) {
    const hasEightChars = passwordValue.length >= 8;
    const hasNumber = /\d/.test(passwordValue);
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasSpecialChar = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);

    const isValid = hasEightChars && hasNumber && hasUpperCase && hasSpecialChar;

    const messageDetails = `
      <div class="row">
        <div class="col-6 ${hasEightChars ? "valid" : "invalid"}">
          ${hasEightChars ? '<i class="bi bi-check-circle"></i>' : '<i class="bi bi-x-circle"></i>'}
          Minimum 8 Characters
        </div>
        <div class="col-6 ${hasNumber ? "valid" : "invalid"}">
          ${hasNumber ? '<i class="bi bi-check-circle"></i>' : '<i class="bi bi-x-circle"></i>'}
          A Number
        </div>
      </div>

      <div class="row">
        <div class="col-6 ${hasUpperCase ? "valid" : "invalid"}">
          ${hasUpperCase ? '<i class="bi bi-check-circle"></i>' : '<i class="bi bi-x-circle"></i>'}
          A Capital letter
        </div>
        <div class="col-6 ${hasSpecialChar ? "valid" : "invalid"}">
          ${hasSpecialChar ? '<i class="bi bi-check-circle"></i>' : '<i class="bi bi-x-circle"></i>'}
          A Special Character
        </div>
      </div>
    `;

    const validMessage = "Congrats! Your password is strong enough!" + messageDetails;
    const invalidMessage = "Password is too easy! Password must contain the following:" + messageDetails;

    if (isValid) {
      showStatus({ fieldEl, isValid, message: validMessage });
    } else showStatus({ fieldEl, isValid, message: invalidMessage });

    return isValid;
  } else showStatus({ fieldEl, isValid: false, message: "Password is Required!" });

  return false;
}

// Show Messages to User
function showStatus(status) {
  const { fieldEl, isValid, message } = status;
  const inputEl = fieldEl.firstElementChild;
  const feedbackEl = fieldEl.parentElement.lastElementChild;

  fieldEl.classList.add(isValid ? "is-valid" : "is-invalid");
  inputEl.classList.add(isValid ? "is-valid" : "is-invalid");

  feedbackEl.classList.add(isValid ? "valid-feedback" : "invalid-feedback");
  feedbackEl.innerHTML = `${
    isValid ? '<i class="bi bi-check-circle"></i>' : '<i class="bi bi-x-circle"></i>'
  } ${message}`;
}

// Show/Hide Password
function togglePasswordVisibility() {
  const passwordInput = document.querySelector("input#password");
  const toggleIcon = document.querySelector("button#toggle-pass-btn i");

  const inputType = passwordInput.getAttribute("type");

  if (inputType === "password") {
    passwordInput.setAttribute("type", "text");
    toggleIcon.classList.remove("bi-eye-slash-fill");
    toggleIcon.classList.add("bi-eye-fill");
  } else {
    passwordInput.setAttribute("type", "password");
    toggleIcon.classList.remove("bi-eye-fill");
    toggleIcon.classList.add("bi-eye-slash-fill");
  }
}
