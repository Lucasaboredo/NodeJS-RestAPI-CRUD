// 1) imports
const express = require("express");
const sequelize = require("./db");
const User = require("./models/User");
const path = require("path");

// 2) app
const app = express();
const PORT = process.env.PORT || 3000;

// 3) middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // servir CSS

// 4) DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a Postgres OK");
    await sequelize.sync(); // no borra datos
    console.log("DB sincronizada ✅");
  } catch (err) {
    console.error("❌ Error inicializando DB:", err);
    process.exit(1);
  }
})();

// ----------------------
// Home
// ----------------------
app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Inicio - API Usuarios</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="container">
        <h1>🚀 API de Usuarios</h1>
        <p>Bienvenido! Aquí podés probar la API y la base de datos.</p>
        
        <div class="menu">
          <a class="btn" href="/users/new">➕ Crear usuario (formulario)</a>
          <a class="btn" href="/users/html">👥 Ver lista de usuarios (HTML)</a>
          <a class="btn" href="/users">📄 Ver lista de usuarios (JSON)</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// ----------------------
// Rutas HTML
// ----------------------

// Formulario
app.get("/users/new", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Crear Usuario</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="container">
        <h1>Crear usuario</h1>
        <form method="POST" action="/users/html">
          <label>Nombre:</label>
          <input type="text" name="name" required />
          <label>Email:</label>
          <input type="email" name="email" required />
          <button type="submit">Crear</button>
        </form>
        <p><a href="/">⬅ Volver al inicio</a></p>
      </div>
    </body>
    </html>
  `);
});

// Guardar usuario desde formulario
app.post("/users/html", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.create({ name, email });
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Usuario creado</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <div class="container">
          <h1>✅ Usuario registrado</h1>
          <p class="success">El usuario <b>${user.name}</b> (${user.email}) fue creado exitosamente.</p>
          <a class="btn" href="/users/new">⬅ Crear otro</a>
          <a class="btn" href="/users/html">👀 Ver todos</a>
          <a class="btn" href="/">🏠 Inicio</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Error en POST /users/html:", error);
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head><link rel="stylesheet" href="/style.css"></head>
      <body>
        <div class="container">
          <h1>❌ Error</h1>
          <p class="error">${error.message}</p>
          <a href="/users/new">Intentar de nuevo</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Lista de usuarios en HTML
app.get("/users/html", async (_req, res) => {
  try {
    const users = await User.findAll();
    let rows = "";
    users.forEach(u => {
      rows += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td></tr>`;
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Lista de usuarios</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <div class="container">
          <h1>Usuarios registrados</h1>
          <table class="user-table">
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Email</th></tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <a class="btn" href="/users/new">➕ Crear usuario</a>
          <a class="btn" href="/">🏠 Inicio</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Error en GET /users/html:", error);
    res.status(500).send("<p>❌ Error al cargar usuarios</p>");
  }
});

// ----------------------
// Rutas JSON (API REST)
// ----------------------
app.get("/users", async (_req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Faltan datos" });
  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

// ----------------------
// levantar server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
