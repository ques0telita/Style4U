const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 
const axios = require('axios');

async function validateEmail(email) {
    if (!email) {
        return { valid: false, error: 'El correo es requerido.' };
    }

    const apiKey = process.env.ABSTRACT_API_KEY;
    const url = `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // 1. Validar si el correo es temporal/desechable usando la ruta exacta de tu objeto
        if (data.email_quality && data.email_quality.is_disposable === true) {
            return { valid: false, error: 'No se permiten correos electrónicos temporales o desechables.' };
        }

        // 2. Opcional: Filtrar si el correo es totalmente inválido a nivel SMTP/Formato
        if (data.email_deliverability && data.email_deliverability.status === 'undeliverable') {
            return { valid: false, error: 'El correo ingresado no existe.' };
        }

        return { valid: true };

    } catch (error) {
        console.error('Error con la API de Abstract:', error.message);
        // Si la API falla por otra cosa, dejamos pasar para no romper el registro
        return { valid: true }; 
    }
}

module.exports = { validateEmail };