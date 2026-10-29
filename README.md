# Portfolio Web - Nahuel Perez

Portfolio personal con una sección de proyectos gestionada desde una base de datos. El frontend consulta a un servidor Node.js + Express, que se conecta a MySQL para guardar, leer, modificar y eliminar proyectos (CRUD).

## Tecnologías

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express, TypeScript
- **Base de datos:** MySQL (driver `mysql2`)

## Estructura del proyecto

```
PortfolioWeb/
├── frontend/
│   ├── index.html        # Portfolio público
│   ├── admin.html        # Formulario CRUD de proyectos
│   ├── css/
│   ├── js/
│   │   ├── script.js     # Lógica del portfolio + carga de proyectos desde la API
│   │   └── admin.js      # Lógica del CRUD
│   └── imagenes/
├── backend/
│   ├── src/
│   │   ├── index.ts      # Servidor Express
│   │   ├── db.ts         # Conexión a MySQL y creación de la tabla
│   │   ├── rutas.ts      # Endpoints del CRUD
│   │   └── tipos.ts      # Interfaz Proyecto y tipos de TypeScript
│   ├── .env.example      # Plantilla de variables de entorno
│   ├── package.json
│   └── tsconfig.json
├── README.md
└── .gitignore
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- MySQL Server y MySQL Workbench instalados y funcionando
- Visual Studio Code con la extensión Live Server (para abrir el frontend)

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Pereznahuel1/PortfolioWeb.git
cd PortfolioWeb
```

### 2. Instalar las dependencias del backend

```bash
cd backend
npm install
```

### 3. Crear la base de datos

Desde MySQL Workbench (o la consola de MySQL), ejecutar:

```sql
CREATE DATABASE portfolio;
```

La tabla `proyectos` **se crea automáticamente** cuando el servidor arranca por primera vez.

### 4. Configurar las variables de entorno

Dentro de `backend/`, copiar el archivo `.env.example` con el nombre `.env`:

```bash
copy .env.example .env      # Windows
cp .env.example .env        # Mac / Linux
```

Abrir `.env` y completar con los datos de tu MySQL:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=portfolio
```

> El archivo `.env` contiene credenciales y **no se sube al repositorio**.

## Ejecución

### Backend

Desde la carpeta `backend/`:

```bash
npm run dev
```

Se debe ver en la consola:

```
Base de datos lista, tabla proyectos verificada
Servidor escuchando en http://localhost:3000
```

### Frontend

Con el backend corriendo, abrir `frontend/index.html` con **Live Server** (clic derecho → *Open with Live Server*).

- **Portfolio público:** `frontend/index.html` (muestra solo los proyectos con estado `publicado`)
- **Administración:** `frontend/admin.html` (crear, editar y eliminar proyectos)

## API REST

Base: `http://localhost:3000/api/proyectos`

| Operación  | Método | Ruta                  | Respuestas                  |
|------------|--------|-----------------------|-----------------------------|
| Consultar  | GET    | `/api/proyectos`      | 200                         |
| Crear      | POST   | `/api/proyectos`      | 201, 400                    |
| Modificar  | PUT    | `/api/proyectos/:id`  | 200, 400, 404               |
| Eliminar   | DELETE | `/api/proyectos/:id`  | 200, 400, 404               |

Ejemplo de cuerpo JSON para crear o modificar:

```json
{
  "nombre": "Mi proyecto",
  "descripcion": "Descripción del proyecto",
  "tecnologias": "HTML, CSS, JavaScript",
  "imagen": "imagenes/proyecto.jpg",
  "estado": "publicado"
}
```

## Decisiones técnicas

### Base de datos: MySQL (relacional)

Se eligió una base **relacional** porque los proyectos tienen una estructura fija y uniforme (los mismos campos en todos los registros), que se representa de forma natural en una tabla. Además, MySQL permite validar datos desde la propia base (por ejemplo, el campo `estado` es un `ENUM` que solo acepta `publicado` o `borrador`) y trabaja con credenciales de conexión, que se gestionan de forma segura con variables de entorno.

Una base **no relacional** (como MongoDB) guarda documentos flexibles sin esquema fijo. Resulta más conveniente cuando cada registro puede tener campos distintos o cuando la estructura cambia con frecuencia, algo que no ocurre en este proyecto.

### TypeScript

El backend está escrito en TypeScript. En `backend/src/tipos.ts` se define:

- `EstadoProyecto`: tipo unión (`"publicado" | "borrador"`).
- `Proyecto`: interfaz con las propiedades y tipos de un proyecto.
- `NuevoProyecto`: el mismo tipo sin `id`, usado al crear.

**Ventajas del tipado estático:** detecta errores antes de ejecutar (por ejemplo, un estado mal escrito o una propiedad inexistente), mejora el autocompletado del editor y hace el código más claro y mantenible.

**Diferencia con JavaScript:** JavaScript tiene tipado dinámico y los errores de tipo aparecen recién al ejecutar. TypeScript es un superconjunto de JavaScript que agrega tipos y se compila a JavaScript.

### Recorrido de la información

1. El navegador ejecuta `fetch()` hacia la API.
2. Express recibe la solicitud en la ruta correspondiente y valida los datos.
3. El servidor consulta o modifica la tabla `proyectos` en MySQL.
4. MySQL devuelve el resultado y Express lo envía como JSON.
5. El frontend recibe el JSON y construye las tarjetas en el HTML.

## Seguridad

- Las consultas SQL usan parámetros (`?`), lo que previene inyección SQL.
- Los textos se insertan en el DOM con `textContent`, evitando inyección de código HTML.
- `.env` y `node_modules` están excluidos mediante `.gitignore`.

## Autor

Nahuel Perez