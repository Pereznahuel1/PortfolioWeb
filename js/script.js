// ==========================================
// 1. INTERACTIVIDAD Y MANIPULACIÓN DEL DOM
// ==========================================

// Saludo dinámico o modificación del título de inicio al hacer clic en él
const tituloInicio = document.getElementById('nombre-dinamico');

if (tituloInicio) {
    tituloInicio.addEventListener('click', function() {
        // Estructura de control condicional y cambio de estilo/clase
        if (tituloInicio.style.color === 'rgb(52, 152, 219)') {
            tituloInicio.style.color = '#2c3e50';
        } else {
            tituloInicio.style.color = '#3498db'; // Cambia a color secundario
        }
    });
}

// ==========================================
// 2. VALIDACIÓN DE FORMULARIO Y EVENTO SUBMIT
// ==========================================

const formularioContacto = document.getElementById('contact-form');
const mensajeFeedback = document.getElementById('form-feedback');

if (formularioContacto) {
    formularioContacto.addEventListener('submit', function(evento) {
        // Previene que se recargue la página por defecto para validarlo con JS
        evento.preventDefault();

        // Captura de valores de los campos
        const nombreInput = document.getElementById('nombre').value.trim();
        const emailInput = document.getElementById('email').value.trim();
        const mensajeInput = document.getElementById('mensaje').value.trim();

        // Estructura de control: Verificar que los campos no estén vacíos
        if (nombreInput === '' || emailInput === '' || mensajeInput === '') {
            mensajeFeedback.textContent = 'Por favor, completa todos los campos obligatorios.';
            mensajeFeedback.style.color = '#e74c3c'; // Rojo error
            return;
        }

        // Validación básica de formato de email usando operadores lógicos
        if (!emailInput.includes('@') || !emailInput.includes('.')) {
            mensajeFeedback.textContent = 'Por favor, ingresa un correo electrónico válido.';
            mensajeFeedback.style.color = '#e74c3c';
            return;
        }

        // Si todo es correcto, mostramos éxito y reseteamos el formulario
        mensajeFeedback.textContent = `¡Gracias ${nombreInput}! Tu mensaje fue enviado con éxito.`;
        mensajeFeedback.style.color = '#27ae60'; // Verde éxito
        
        // Limpiar formulario
        formularioContacto.reset();
    });
}