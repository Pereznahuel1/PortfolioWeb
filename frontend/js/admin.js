const API_URL = "http://localhost:3000/api/proyectos";

const form = document.getElementById("form-proyecto");
const tabla = document.getElementById("tabla-proyectos");
const mensaje = document.getElementById("mensaje");
const tituloForm = document.getElementById("titulo-form");
const btnCancelar = document.getElementById("btn-cancelar");

let proyectos = [];

function mostrarMensaje(texto, esError) {
    mensaje.textContent = texto;
    mensaje.style.color = esError ? "#e74c3c" : "#27ae60";
}

// CONSULTAR: pide la lista y la dibuja en la tabla
async function cargarLista() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);
        proyectos = await respuesta.json();
        dibujarTabla();
    } catch (error) {
        console.error(error);
        mostrarMensaje("No se pudo conectar con el servidor.", true);
    }
}

function dibujarTabla() {
    tabla.innerHTML = "";
    proyectos.forEach((p) => {
        const fila = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = p.id;
        const tdNombre = document.createElement("td");
        tdNombre.textContent = p.nombre;
        const tdEstado = document.createElement("td");
        tdEstado.textContent = p.estado;

        const tdAcciones = document.createElement("td");
        const contenedor = document.createElement("div");
        contenedor.className = "acciones";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => editar(p));

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "peligro";
        btnEliminar.addEventListener("click", () => eliminar(p));

        contenedor.append(btnEditar, btnEliminar);
        tdAcciones.appendChild(contenedor);
        fila.append(tdId, tdNombre, tdEstado, tdAcciones);
        tabla.appendChild(fila);
    });
}

// Carga los datos del proyecto en el formulario para modificarlos
function editar(p) {
    document.getElementById("id").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("descripcion").value = p.descripcion;
    document.getElementById("tecnologias").value = p.tecnologias;
    document.getElementById("imagen").value = p.imagen || "";
    document.getElementById("estado").value = p.estado;
    tituloForm.textContent = "Editando proyecto #" + p.id;
    btnCancelar.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function limpiarFormulario() {
    form.reset();
    document.getElementById("id").value = "";
    tituloForm.textContent = "Nuevo proyecto";
    btnCancelar.hidden = true;
}

btnCancelar.addEventListener("click", limpiarFormulario);

// CREAR (POST) o MODIFICAR (PUT), según haya o no un id
form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const id = document.getElementById("id").value;
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        tecnologias: document.getElementById("tecnologias").value.trim(),
        imagen: document.getElementById("imagen").value.trim(),
        estado: document.getElementById("estado").value,
    };

    const url = id ? API_URL + "/" + id : API_URL;
    const metodo = id ? "PUT" : "POST";

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            mostrarMensaje(resultado.error || "Error al guardar", true);
            return;
        }
        mostrarMensaje(id ? "Proyecto modificado." : "Proyecto creado.", false);
        limpiarFormulario();
        cargarLista();
    } catch (error) {
        console.error(error);
        mostrarMensaje("No se pudo conectar con el servidor.", true);
    }
});

// ELIMINAR (DELETE)
async function eliminar(p) {
    if (!confirm('¿Eliminar el proyecto "' + p.nombre + '"?')) return;
    try {
        const respuesta = await fetch(API_URL + "/" + p.id, { method: "DELETE" });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            mostrarMensaje(resultado.error || "Error al eliminar", true);
            return;
        }
        mostrarMensaje("Proyecto eliminado.", false);
        cargarLista();
    } catch (error) {
        console.error(error);
        mostrarMensaje("No se pudo conectar con el servidor.", true);
    }
}

document.addEventListener("DOMContentLoaded", cargarLista);