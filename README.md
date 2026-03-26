# API REST Full CRUD con Node.js

Este es un proyecto de una API RESTful desarrollada con Node.js, Express y PostgreSQL (usando Sequelize como ORM). Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una entidad `User`, y cuenta con vistas en HTML generadas desde el servidor para interactuar fácilmente desde el navegador.

## Tecnologías Utilizadas
- **Node.js** & **Express.js** para el servidor web.
- **PostgreSQL** como base de datos relacional.
- **Sequelize** como ORM para interactuar con la base de datos.
- **Docker** & **Docker Compose** para contenedorizar la base de datos PostgreSQL y pgAdmin.

## Requisitos Previos
- Tener instalado [Node.js](https://nodejs.org/) (recomendado versión 18+).
- Tener instalado [Docker](https://www.docker.com/) y Docker Compose.

## Instrucciones para Ejecutar el Proyecto

### 1. Levantar la Base de Datos

El proyecto incluye un archivo `docker-compose.yml` que levanta la base de datos PostgreSQL (puerto 5433) y una instancia de pgAdmin (puerto 8080) para administrarla.

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
docker-compose up -d
```

### 2. Instalar Dependencias

Luego de levantar la base de datos, debes instalar las dependencias de Node.js requeridas para que el proyecto funcione:

```bash
npm install
```

### 3. Iniciar el Servidor

Una vez instaladas las dependencias y con la base de datos corriendo, inicia el servidor de desarrollo:

```bash
npm run dev
```
(O puedes usar `npm start` para iniciarlo sin `nodemon`).

Verás en la consola los siguientes mensajes indicando que todo funcionó correctamente:
```
✅ Conexión a Postgres OK
DB sincronizada ✅
Server running on port 3000
```

### 4. Probar la Aplicación

Puedes acceder a la aplicación desde cualquier navegador ingresando a:
- **http://localhost:3000/** : Página de inicio con el menú principal.

#### Rutas HTML
- `GET /users/new` : Formulario para crear un nuevo usuario.
- `GET /users/html` : Tabla que muestra la lista de todos los usuarios registrados.
- `POST /users/html` : Procesa la creación de un nuevo usuario desde el formulario.

#### Endpoints API REST (JSON)
Si prefieres interactuar usando herramientas como Postman, Insomnia o `curl`, los endpoints disponibles son:
- `GET /users` : Devuelve todos los usuarios en formato JSON.
- `GET /users/:id` : Devuelve un usuario específico según su ID.
- `POST /users` : Crea un nuevo usuario. (Requiere body con `name` y `email`).
- `DELETE /users/:id` : Elimina un usuario específico según su ID.

## Funcionalidades del Código

- **Sincronización Automática:** Si la tabla `Users` no existe en la base de datos, Sequelize la creará automáticamente al iniciar el servidor (gracias a `sequelize.sync()`).
- **Validación de Datos Básica:** Los campos `name` y `email` son requeridos, y el `email` es único en la base de datos.
- **Soporte Estático:** Se utiliza la carpeta `public` para servir archivos CSS.

