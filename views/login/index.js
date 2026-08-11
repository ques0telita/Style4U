const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const form = document.querySelector('#form');
const errorText = document.querySelector('#error-text');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  // Limpiamos errores anteriores si la etiqueta existe
  if (errorText) {
    errorText.innerHTML = '';
  }

  try {
    // datos que le enviaremos al servidor
    const user = {
      email: emailInput.value,
      password: passwordInput.value
    };

    // 👈 AQUÍ: Agregamos { withCredentials: true } para aceptar las cookies de la respuesta
    await axios.post('/api/login', user, {
      withCredentials: true
    });

    // Si la respuesta es exitosa (200), redirigimos al Home
    window.location.pathname = '/';

  } catch (error) {
    console.log(error);

    // Si el servidor nos mandó un error con status 400 o 500, lo mostramos
    if (errorText) {
      if (error.response && error.response.data && error.response.data.error) {
        errorText.innerHTML = error.response.data.error;
      } else {
        errorText.innerHTML = 'An unexpected error occurred. Please try again.';
      }
    }
  }
});