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

// ==========================================
// 3. PROYECTOS DESDE LA API (BACKEND + MYSQL)
// ==========================================

const API_URL = "http://localhost:3000/api/proyectos";

// Arma la tarjeta de info y el banner, con las mismas clases CSS de siempre
function crearTarjeta(proyecto) {
    const fragmento = document.createDocumentFragment();

    const tarjeta = document.createElement("article");
    tarjeta.className = "project-info-card";

    const titulo = document.createElement("h3");
    titulo.textContent = proyecto.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = proyecto.descripcion;

    const tech = document.createElement("p");
    tech.className = "tech";
    const negrita = document.createElement("strong");
    negrita.textContent = "Tecnologías:";
    tech.append(negrita, " " + proyecto.tecnologias);

    tarjeta.append(titulo, descripcion, tech);
    fragmento.appendChild(tarjeta);

        if (proyecto.imagen) {
        let banner;
        if (proyecto.enlace) {
            banner = document.createElement("a");
            banner.href = proyecto.enlace;
            banner.target = "_blank";
            banner.rel = "noopener noreferrer";
        } else {
            banner = document.createElement("div");
        }
        banner.className = "project-full-banner";

        const img = document.createElement("img");
        img.src = proyecto.imagen;
        img.alt = "Vista previa del proyecto " + proyecto.nombre;
        banner.appendChild(img);
        fragmento.appendChild(banner);
    }

    return fragmento;
}

// Pide los proyectos a la API y los dibuja en la página
async function cargarProyectos() {
    const contenedor = document.getElementById("lista-proyectos");
    if (!contenedor) return;

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);
        const proyectos = await respuesta.json();

        // Solo se muestran los publicados
        const publicados = proyectos.filter((p) => p.estado === "publicado");
        contenedor.innerHTML = "";

        if (publicados.length === 0) {
            contenedor.innerHTML = "<p>Todavía no hay proyectos publicados.</p>";
            return;
        }
        publicados.forEach((p) => contenedor.appendChild(crearTarjeta(p)));
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = "<p>No se pudieron cargar los proyectos.</p>";
    }
}

document.addEventListener("DOMContentLoaded", cargarProyectos);