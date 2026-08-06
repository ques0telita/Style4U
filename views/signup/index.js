import { createNotification } from "../components/notification.js";

const REGEX_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
const REGEX_USERNAME = /^[a-zA-Z0-9_]{3,16}$/;
const REGEX_PHONE = /^(\+?\d{1,3})?(\d{7,12})$/;
const REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const form = document.getElementById("form");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const matchInput = document.getElementById("match-input");
const formBtn = document.getElementById("form-btn");
const notification = document.getElementById("notification");
const information = document.querySelectorAll("#information");

// validations
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let matchValidation = false;

information.forEach((info) => {
  info.classList.add("hidden");
});

const validation = (input, regexValidation, informationElement) => {
  if (input.value === "") {
    input.classList.remove("outline-red-500", "outline-2", "outline");
    input.classList.remove("outline-green-500", "outline-2", "outline");
    if (informationElement) informationElement.classList.add("hidden");
    input.classList.add("focus:outline-indigo-700");
  } else if (!regexValidation) {
    input.classList.remove("focus:outline-indigo-700");
    if (informationElement) informationElement.classList.remove("hidden");
    input.classList.add("outline-red-500", "outline-2", "outline");
  } else {
    input.classList.remove("outline-red-500", "outline-2", "outline");
    if (informationElement) informationElement.classList.add("hidden");
    input.classList.add("outline-green-500", "outline-2", "outline");
  }

  formBtn.disabled =
    nameValidation && emailValidation && passwordValidation && matchValidation
      ? false
      : true;
};

// events
nameInput.addEventListener("input", (e) => {
  nameValidation = REGEX_USERNAME.test(nameInput.value);
  validation(nameInput, nameValidation, information[0]);
});

emailInput.addEventListener("input", (e) => {
  emailValidation = REGEX_EMAIL.test(emailInput.value);
  validation(emailInput, emailValidation, information[1]);
});

passwordInput.addEventListener("input", (e) => {
  passwordValidation = REGEX_PASSWORD.test(passwordInput.value);
  matchValidation = e.target.value === matchInput.value;
  validation(passwordInput, passwordValidation, information[2]);
  validation(matchInput, matchValidation, information[3]);
});

matchInput.addEventListener("input", (e) => {
  matchValidation = e.target.value === passwordInput.value;
  validation(matchInput, matchValidation, information[3]);
});

// EVENTO PRINCIPAL DEL FORMULARIO
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Desactivar el botón inmediatamente para evitar doble clic
  formBtn.disabled = true;
  const originalBtnText = formBtn.innerHTML;
  formBtn.innerHTML = "Procesando..."; 

  console.log("Enviando formulario...");
  
  try {
    const newUser = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };

    // Envía los datos al backend en Node.js
    const { data } = await axios.post("/api/users", newUser);
    console.log("Respuesta del servidor:", data);

    // --- EVALUAMOS LA REDIRECCIÓN DE FORMA CORRECTA ---
    // Como data ahora contiene el objeto { message: "..." }, revisamos data.message
    if (data && data.message === "Usuario creado y verificado exitosamente") {
      
      createNotification(false, "¡Cuenta verificada automáticamente!");
      
      // Esperamos un momento breve para que el usuario logre leer la notificación antes de irse
      setTimeout(() => {
        window.location.href = "../login/index.html"; 
      }, 1500);

    } else {
      // Flujo tradicional si requiere validación manual por Nodemailer
      createNotification(false, data);
      setTimeout(() => {
        notification.classList.add("hidden");
      }, 5000);

      // Resetear valores de los inputs solo si no redirige de inmediato
      nameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      matchInput.value = "";

      // Resetear las variables de control
      nameValidation = false;
      emailValidation = false;
      passwordValidation = false;
      matchValidation = false;

      // Limpiar estilos visuales de Tailwind volviendo al estado inicial vacío
      validation(nameInput, false);
      validation(emailInput, false);
      validation(passwordInput, false);
      validation(matchInput, false);
    }
    
  } catch (error) {
    // Si el backend lanza un error (400), se captura aquí:
    console.error("Error capturado:", error);
    const errorMsg = error.response && error.response.data && error.response.data.error 
      ? error.response.data.error 
      : "Hubo un error interno.";
      
    createNotification(true, errorMsg);
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 5000);

    // Reactivar el botón para que pueda corregir sus datos
    formBtn.disabled = false;
    formBtn.innerHTML = originalBtnText;
  }
});