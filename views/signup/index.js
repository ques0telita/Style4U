import { createNotification } from "../components/notification.js";

const REGEX_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const REGEX_NAME = /^[a-zA-ZÀ-ÿ\s]{2,40}$/;
const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const form = document.getElementById("form");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const matchInput = document.getElementById("match-input");
const formBtn = document.getElementById("form-btn");
const notification = document.getElementById("notification");

// Validations
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let matchValidation = false;

const validation = (input, isValid) => {
  if (!input) return;
  if (input.value === "") {
    input.classList.remove("outline-red-500", "outline-2", "outline");
    input.classList.remove("outline-green-500", "outline-2", "outline");
    input.classList.add("focus:outline-indigo-700");
  } else if (!isValid) {
    input.classList.remove("focus:outline-indigo-700");
    input.classList.remove("outline-green-500");
    input.classList.add("outline-red-500", "outline-2", "outline");
  } else {
    input.classList.remove("outline-red-500");
    input.classList.add("outline-green-500", "outline-2", "outline");
  }

  if (formBtn) {
    formBtn.disabled = !(nameValidation && emailValidation && passwordValidation && matchValidation);
  }
};

// Events
if (nameInput) {
  nameInput.addEventListener("input", () => {
    nameValidation = REGEX_NAME.test(nameInput.value.trim());
    validation(nameInput, nameValidation);
  });
}

if (emailInput) {
  emailInput.addEventListener("input", () => {
    emailValidation = REGEX_EMAIL.test(emailInput.value.trim());
    validation(emailInput, emailValidation);
  });
}

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    passwordValidation = REGEX_PASSWORD.test(passwordInput.value);
    matchValidation = passwordInput.value === matchInput.value && matchInput.value !== "";
    validation(passwordInput, passwordValidation);
    validation(matchInput, matchValidation);
  });
}

if (matchInput) {
  matchInput.addEventListener("input", () => {
    matchValidation = matchInput.value === passwordInput.value && matchInput.value !== "";
    validation(matchInput, matchValidation);
  });
}

// EVENTO PRINCIPAL DEL FORMULARIO
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!formBtn) return;
    formBtn.disabled = true;
    const originalBtnText = formBtn.innerHTML;
    formBtn.innerHTML = "Creating account..."; 

    try {
      const newUser = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };

      const { data } = await axios.post("/api/users", newUser);

      if (data && (data.verified || (data.message && data.message.includes("successfully")))) {
        createNotification(false, "Your account has been created and verified successfully!");
        
        setTimeout(() => {
          window.location.href = "/login"; 
        }, 1500);
      } else {
        const msg = typeof data === 'string' ? data : (data.message || "Account created. Please check your email to verify.");
        createNotification(false, msg);
        
        // Reset inputs
        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        matchInput.value = "";

        nameValidation = false;
        emailValidation = false;
        passwordValidation = false;
        matchValidation = false;

        validation(nameInput, false);
        validation(emailInput, false);
        validation(passwordInput, false);
        validation(matchInput, false);

        formBtn.innerHTML = originalBtnText;
        formBtn.disabled = true;
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error.response?.data?.error || "An error occurred during registration. Please try again.";
        
      createNotification(true, errorMsg);

      formBtn.disabled = false;
      formBtn.innerHTML = originalBtnText;
    }
  });
}