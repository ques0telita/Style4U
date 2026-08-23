const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const form = document.querySelector('#form');
const errorText = document.querySelector('#error-text');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    if (errorText) {
      errorText.textContent = '';
    }

    const email = emailInput?.value?.trim();
    const password = passwordInput?.value;

    if (!email || !password) {
      if (errorText) errorText.textContent = 'Please enter both email and password.';
      return;
    }

    try {
      const response = await axios.post('/api/login', { email, password }, {
        withCredentials: true
      });

      const user = response.data?.user;
      if (user?.role === 'admin' || response.data?.role === 'admin') {
        localStorage.setItem('isAdmin', 'true');
      } else {
        localStorage.removeItem('isAdmin');
      }

      window.location.href = '/';

    } catch (error) {
      console.error('Login error:', error);
      if (errorText) {
        if (error.response?.data?.error) {
          errorText.textContent = error.response.data.error;
        } else {
          errorText.textContent = 'Invalid email or password. Please try again.';
        }
      }
    }
  });
}